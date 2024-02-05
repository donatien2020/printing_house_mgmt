package org.nta.idc.donatien.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.is;

import java.time.Duration;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.nta.idc.donatien.IntegrationTest;
import org.nta.idc.donatien.domain.Company;
import org.nta.idc.donatien.domain.enumeration.Status;
import org.nta.idc.donatien.repository.CompanyRepository;
import org.nta.idc.donatien.repository.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.reactive.server.WebTestClient;

/**
 * Integration tests for the {@link CompanyResource} REST controller.
 */
@IntegrationTest
@AutoConfigureWebTestClient(timeout = IntegrationTest.DEFAULT_ENTITY_TIMEOUT)
@WithMockUser
class CompanyResourceIT {

    private static final String DEFAULT_COMPANY_NAMES = "AAAAAAAAAA";
    private static final String UPDATED_COMPANY_NAMES = "BBBBBBBBBB";

    private static final String DEFAULT_TIN_NUMBER = "AAAAAAAAAA";
    private static final String UPDATED_TIN_NUMBER = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final Status DEFAULT_STATUS = Status.ACTIVE;
    private static final Status UPDATED_STATUS = Status.INACTIVE;

    private static final String ENTITY_API_URL = "/api/companies";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private WebTestClient webTestClient;

    private Company company;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Company createEntity(EntityManager em) {
        Company company = new Company()
            .companyNames(DEFAULT_COMPANY_NAMES)
            .tinNumber(DEFAULT_TIN_NUMBER)
            .description(DEFAULT_DESCRIPTION)
            .status(DEFAULT_STATUS);
        return company;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Company createUpdatedEntity(EntityManager em) {
        Company company = new Company()
            .companyNames(UPDATED_COMPANY_NAMES)
            .tinNumber(UPDATED_TIN_NUMBER)
            .description(UPDATED_DESCRIPTION)
            .status(UPDATED_STATUS);
        return company;
    }

    public static void deleteEntities(EntityManager em) {
        try {
            em.deleteAll(Company.class).block();
        } catch (Exception e) {
            // It can fail, if other entities are still referring this - it will be removed later.
        }
    }

    @AfterEach
    public void cleanup() {
        deleteEntities(em);
    }

    @BeforeEach
    public void initTest() {
        deleteEntities(em);
        company = createEntity(em);
    }

    @Test
    void createCompany() throws Exception {
        int databaseSizeBeforeCreate = companyRepository.findAll().collectList().block().size();
        // Create the Company
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(company))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the Company in the database
        List<Company> companyList = companyRepository.findAll().collectList().block();
        assertThat(companyList).hasSize(databaseSizeBeforeCreate + 1);
        Company testCompany = companyList.get(companyList.size() - 1);
        assertThat(testCompany.getCompanyNames()).isEqualTo(DEFAULT_COMPANY_NAMES);
        assertThat(testCompany.getTinNumber()).isEqualTo(DEFAULT_TIN_NUMBER);
        assertThat(testCompany.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testCompany.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    void createCompanyWithExistingId() throws Exception {
        // Create the Company with an existing ID
        company.setId(1L);

        int databaseSizeBeforeCreate = companyRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(company))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Company in the database
        List<Company> companyList = companyRepository.findAll().collectList().block();
        assertThat(companyList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void checkCompanyNamesIsRequired() throws Exception {
        int databaseSizeBeforeTest = companyRepository.findAll().collectList().block().size();
        // set the field null
        company.setCompanyNames(null);

        // Create the Company, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(company))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Company> companyList = companyRepository.findAll().collectList().block();
        assertThat(companyList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkTinNumberIsRequired() throws Exception {
        int databaseSizeBeforeTest = companyRepository.findAll().collectList().block().size();
        // set the field null
        company.setTinNumber(null);

        // Create the Company, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(company))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Company> companyList = companyRepository.findAll().collectList().block();
        assertThat(companyList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void getAllCompaniesAsStream() {
        // Initialize the database
        companyRepository.save(company).block();

        List<Company> companyList = webTestClient
            .get()
            .uri(ENTITY_API_URL)
            .accept(MediaType.APPLICATION_NDJSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentTypeCompatibleWith(MediaType.APPLICATION_NDJSON)
            .returnResult(Company.class)
            .getResponseBody()
            .filter(company::equals)
            .collectList()
            .block(Duration.ofSeconds(5));

        assertThat(companyList).isNotNull();
        assertThat(companyList).hasSize(1);
        Company testCompany = companyList.get(0);
        assertThat(testCompany.getCompanyNames()).isEqualTo(DEFAULT_COMPANY_NAMES);
        assertThat(testCompany.getTinNumber()).isEqualTo(DEFAULT_TIN_NUMBER);
        assertThat(testCompany.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testCompany.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    void getAllCompanies() {
        // Initialize the database
        companyRepository.save(company).block();

        // Get all the companyList
        webTestClient
            .get()
            .uri(ENTITY_API_URL + "?sort=id,desc")
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.[*].id")
            .value(hasItem(company.getId().intValue()))
            .jsonPath("$.[*].companyNames")
            .value(hasItem(DEFAULT_COMPANY_NAMES))
            .jsonPath("$.[*].tinNumber")
            .value(hasItem(DEFAULT_TIN_NUMBER))
            .jsonPath("$.[*].description")
            .value(hasItem(DEFAULT_DESCRIPTION))
            .jsonPath("$.[*].status")
            .value(hasItem(DEFAULT_STATUS.toString()));
    }

    @Test
    void getCompany() {
        // Initialize the database
        companyRepository.save(company).block();

        // Get the company
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, company.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(company.getId().intValue()))
            .jsonPath("$.companyNames")
            .value(is(DEFAULT_COMPANY_NAMES))
            .jsonPath("$.tinNumber")
            .value(is(DEFAULT_TIN_NUMBER))
            .jsonPath("$.description")
            .value(is(DEFAULT_DESCRIPTION))
            .jsonPath("$.status")
            .value(is(DEFAULT_STATUS.toString()));
    }

    @Test
    void getNonExistingCompany() {
        // Get the company
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putExistingCompany() throws Exception {
        // Initialize the database
        companyRepository.save(company).block();

        int databaseSizeBeforeUpdate = companyRepository.findAll().collectList().block().size();

        // Update the company
        Company updatedCompany = companyRepository.findById(company.getId()).block();
        updatedCompany
            .companyNames(UPDATED_COMPANY_NAMES)
            .tinNumber(UPDATED_TIN_NUMBER)
            .description(UPDATED_DESCRIPTION)
            .status(UPDATED_STATUS);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, updatedCompany.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(updatedCompany))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Company in the database
        List<Company> companyList = companyRepository.findAll().collectList().block();
        assertThat(companyList).hasSize(databaseSizeBeforeUpdate);
        Company testCompany = companyList.get(companyList.size() - 1);
        assertThat(testCompany.getCompanyNames()).isEqualTo(UPDATED_COMPANY_NAMES);
        assertThat(testCompany.getTinNumber()).isEqualTo(UPDATED_TIN_NUMBER);
        assertThat(testCompany.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testCompany.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    void putNonExistingCompany() throws Exception {
        int databaseSizeBeforeUpdate = companyRepository.findAll().collectList().block().size();
        company.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, company.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(company))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Company in the database
        List<Company> companyList = companyRepository.findAll().collectList().block();
        assertThat(companyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchCompany() throws Exception {
        int databaseSizeBeforeUpdate = companyRepository.findAll().collectList().block().size();
        company.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(company))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Company in the database
        List<Company> companyList = companyRepository.findAll().collectList().block();
        assertThat(companyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamCompany() throws Exception {
        int databaseSizeBeforeUpdate = companyRepository.findAll().collectList().block().size();
        company.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(company))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Company in the database
        List<Company> companyList = companyRepository.findAll().collectList().block();
        assertThat(companyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateCompanyWithPatch() throws Exception {
        // Initialize the database
        companyRepository.save(company).block();

        int databaseSizeBeforeUpdate = companyRepository.findAll().collectList().block().size();

        // Update the company using partial update
        Company partialUpdatedCompany = new Company();
        partialUpdatedCompany.setId(company.getId());

        partialUpdatedCompany.tinNumber(UPDATED_TIN_NUMBER).description(UPDATED_DESCRIPTION);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedCompany.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedCompany))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Company in the database
        List<Company> companyList = companyRepository.findAll().collectList().block();
        assertThat(companyList).hasSize(databaseSizeBeforeUpdate);
        Company testCompany = companyList.get(companyList.size() - 1);
        assertThat(testCompany.getCompanyNames()).isEqualTo(DEFAULT_COMPANY_NAMES);
        assertThat(testCompany.getTinNumber()).isEqualTo(UPDATED_TIN_NUMBER);
        assertThat(testCompany.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testCompany.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    void fullUpdateCompanyWithPatch() throws Exception {
        // Initialize the database
        companyRepository.save(company).block();

        int databaseSizeBeforeUpdate = companyRepository.findAll().collectList().block().size();

        // Update the company using partial update
        Company partialUpdatedCompany = new Company();
        partialUpdatedCompany.setId(company.getId());

        partialUpdatedCompany
            .companyNames(UPDATED_COMPANY_NAMES)
            .tinNumber(UPDATED_TIN_NUMBER)
            .description(UPDATED_DESCRIPTION)
            .status(UPDATED_STATUS);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedCompany.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedCompany))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Company in the database
        List<Company> companyList = companyRepository.findAll().collectList().block();
        assertThat(companyList).hasSize(databaseSizeBeforeUpdate);
        Company testCompany = companyList.get(companyList.size() - 1);
        assertThat(testCompany.getCompanyNames()).isEqualTo(UPDATED_COMPANY_NAMES);
        assertThat(testCompany.getTinNumber()).isEqualTo(UPDATED_TIN_NUMBER);
        assertThat(testCompany.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testCompany.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    void patchNonExistingCompany() throws Exception {
        int databaseSizeBeforeUpdate = companyRepository.findAll().collectList().block().size();
        company.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, company.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(company))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Company in the database
        List<Company> companyList = companyRepository.findAll().collectList().block();
        assertThat(companyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchCompany() throws Exception {
        int databaseSizeBeforeUpdate = companyRepository.findAll().collectList().block().size();
        company.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(company))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Company in the database
        List<Company> companyList = companyRepository.findAll().collectList().block();
        assertThat(companyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamCompany() throws Exception {
        int databaseSizeBeforeUpdate = companyRepository.findAll().collectList().block().size();
        company.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(company))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Company in the database
        List<Company> companyList = companyRepository.findAll().collectList().block();
        assertThat(companyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteCompany() {
        // Initialize the database
        companyRepository.save(company).block();

        int databaseSizeBeforeDelete = companyRepository.findAll().collectList().block().size();

        // Delete the company
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, company.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<Company> companyList = companyRepository.findAll().collectList().block();
        assertThat(companyList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
