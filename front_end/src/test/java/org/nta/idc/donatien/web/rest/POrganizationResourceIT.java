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
import org.nta.idc.donatien.domain.POrganization;
import org.nta.idc.donatien.domain.enumeration.CompanyTypes;
import org.nta.idc.donatien.domain.enumeration.Status;
import org.nta.idc.donatien.repository.EntityManager;
import org.nta.idc.donatien.repository.POrganizationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.reactive.server.WebTestClient;

/**
 * Integration tests for the {@link POrganizationResource} REST controller.
 */
@IntegrationTest
@AutoConfigureWebTestClient(timeout = IntegrationTest.DEFAULT_ENTITY_TIMEOUT)
@WithMockUser
class POrganizationResourceIT {

    private static final String DEFAULT_OFFICE_ADDRESS = "AAAAAAAAAA";
    private static final String UPDATED_OFFICE_ADDRESS = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final Long DEFAULT_PROFILE_ID = 1L;
    private static final Long UPDATED_PROFILE_ID = 2L;

    private static final CompanyTypes DEFAULT_COMPANY_TYPE = CompanyTypes.PROVIDER;
    private static final CompanyTypes UPDATED_COMPANY_TYPE = CompanyTypes.RESELLER;

    private static final Status DEFAULT_STATUS = Status.ACTIVE;
    private static final Status UPDATED_STATUS = Status.INACTIVE;

    private static final String ENTITY_API_URL = "/api/p-organizations";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private POrganizationRepository pOrganizationRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private WebTestClient webTestClient;

    private POrganization pOrganization;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static POrganization createEntity(EntityManager em) {
        POrganization pOrganization = new POrganization()
            .officeAddress(DEFAULT_OFFICE_ADDRESS)
            .description(DEFAULT_DESCRIPTION)
            .profileID(DEFAULT_PROFILE_ID)
            .companyType(DEFAULT_COMPANY_TYPE)
            .status(DEFAULT_STATUS);
        return pOrganization;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static POrganization createUpdatedEntity(EntityManager em) {
        POrganization pOrganization = new POrganization()
            .officeAddress(UPDATED_OFFICE_ADDRESS)
            .description(UPDATED_DESCRIPTION)
            .profileID(UPDATED_PROFILE_ID)
            .companyType(UPDATED_COMPANY_TYPE)
            .status(UPDATED_STATUS);
        return pOrganization;
    }

    public static void deleteEntities(EntityManager em) {
        try {
            em.deleteAll(POrganization.class).block();
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
        pOrganization = createEntity(em);
    }

    @Test
    void createPOrganization() throws Exception {
        int databaseSizeBeforeCreate = pOrganizationRepository.findAll().collectList().block().size();
        // Create the POrganization
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(pOrganization))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the POrganization in the database
        List<POrganization> pOrganizationList = pOrganizationRepository.findAll().collectList().block();
        assertThat(pOrganizationList).hasSize(databaseSizeBeforeCreate + 1);
        POrganization testPOrganization = pOrganizationList.get(pOrganizationList.size() - 1);
        assertThat(testPOrganization.getOfficeAddress()).isEqualTo(DEFAULT_OFFICE_ADDRESS);
        assertThat(testPOrganization.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testPOrganization.getProfileID()).isEqualTo(DEFAULT_PROFILE_ID);
        assertThat(testPOrganization.getCompanyType()).isEqualTo(DEFAULT_COMPANY_TYPE);
        assertThat(testPOrganization.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    void createPOrganizationWithExistingId() throws Exception {
        // Create the POrganization with an existing ID
        pOrganization.setId(1L);

        int databaseSizeBeforeCreate = pOrganizationRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(pOrganization))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the POrganization in the database
        List<POrganization> pOrganizationList = pOrganizationRepository.findAll().collectList().block();
        assertThat(pOrganizationList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void checkOfficeAddressIsRequired() throws Exception {
        int databaseSizeBeforeTest = pOrganizationRepository.findAll().collectList().block().size();
        // set the field null
        pOrganization.setOfficeAddress(null);

        // Create the POrganization, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(pOrganization))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<POrganization> pOrganizationList = pOrganizationRepository.findAll().collectList().block();
        assertThat(pOrganizationList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkDescriptionIsRequired() throws Exception {
        int databaseSizeBeforeTest = pOrganizationRepository.findAll().collectList().block().size();
        // set the field null
        pOrganization.setDescription(null);

        // Create the POrganization, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(pOrganization))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<POrganization> pOrganizationList = pOrganizationRepository.findAll().collectList().block();
        assertThat(pOrganizationList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkCompanyTypeIsRequired() throws Exception {
        int databaseSizeBeforeTest = pOrganizationRepository.findAll().collectList().block().size();
        // set the field null
        pOrganization.setCompanyType(null);

        // Create the POrganization, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(pOrganization))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<POrganization> pOrganizationList = pOrganizationRepository.findAll().collectList().block();
        assertThat(pOrganizationList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkStatusIsRequired() throws Exception {
        int databaseSizeBeforeTest = pOrganizationRepository.findAll().collectList().block().size();
        // set the field null
        pOrganization.setStatus(null);

        // Create the POrganization, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(pOrganization))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<POrganization> pOrganizationList = pOrganizationRepository.findAll().collectList().block();
        assertThat(pOrganizationList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void getAllPOrganizations() {
        // Initialize the database
        pOrganizationRepository.save(pOrganization).block();

        // Get all the pOrganizationList
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
            .value(hasItem(pOrganization.getId().intValue()))
            .jsonPath("$.[*].officeAddress")
            .value(hasItem(DEFAULT_OFFICE_ADDRESS))
            .jsonPath("$.[*].description")
            .value(hasItem(DEFAULT_DESCRIPTION))
            .jsonPath("$.[*].profileID")
            .value(hasItem(DEFAULT_PROFILE_ID.intValue()))
            .jsonPath("$.[*].companyType")
            .value(hasItem(DEFAULT_COMPANY_TYPE.toString()))
            .jsonPath("$.[*].status")
            .value(hasItem(DEFAULT_STATUS.toString()));
    }

    @Test
    void getPOrganization() {
        // Initialize the database
        pOrganizationRepository.save(pOrganization).block();

        // Get the pOrganization
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, pOrganization.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(pOrganization.getId().intValue()))
            .jsonPath("$.officeAddress")
            .value(is(DEFAULT_OFFICE_ADDRESS))
            .jsonPath("$.description")
            .value(is(DEFAULT_DESCRIPTION))
            .jsonPath("$.profileID")
            .value(is(DEFAULT_PROFILE_ID.intValue()))
            .jsonPath("$.companyType")
            .value(is(DEFAULT_COMPANY_TYPE.toString()))
            .jsonPath("$.status")
            .value(is(DEFAULT_STATUS.toString()));
    }

    @Test
    void getNonExistingPOrganization() {
        // Get the pOrganization
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putExistingPOrganization() throws Exception {
        // Initialize the database
        pOrganizationRepository.save(pOrganization).block();

        int databaseSizeBeforeUpdate = pOrganizationRepository.findAll().collectList().block().size();

        // Update the pOrganization
        POrganization updatedPOrganization = pOrganizationRepository.findById(pOrganization.getId()).block();
        updatedPOrganization
            .officeAddress(UPDATED_OFFICE_ADDRESS)
            .description(UPDATED_DESCRIPTION)
            .profileID(UPDATED_PROFILE_ID)
            .companyType(UPDATED_COMPANY_TYPE)
            .status(UPDATED_STATUS);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, updatedPOrganization.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(updatedPOrganization))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the POrganization in the database
        List<POrganization> pOrganizationList = pOrganizationRepository.findAll().collectList().block();
        assertThat(pOrganizationList).hasSize(databaseSizeBeforeUpdate);
        POrganization testPOrganization = pOrganizationList.get(pOrganizationList.size() - 1);
        assertThat(testPOrganization.getOfficeAddress()).isEqualTo(UPDATED_OFFICE_ADDRESS);
        assertThat(testPOrganization.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testPOrganization.getProfileID()).isEqualTo(UPDATED_PROFILE_ID);
        assertThat(testPOrganization.getCompanyType()).isEqualTo(UPDATED_COMPANY_TYPE);
        assertThat(testPOrganization.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    void putNonExistingPOrganization() throws Exception {
        int databaseSizeBeforeUpdate = pOrganizationRepository.findAll().collectList().block().size();
        pOrganization.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, pOrganization.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(pOrganization))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the POrganization in the database
        List<POrganization> pOrganizationList = pOrganizationRepository.findAll().collectList().block();
        assertThat(pOrganizationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchPOrganization() throws Exception {
        int databaseSizeBeforeUpdate = pOrganizationRepository.findAll().collectList().block().size();
        pOrganization.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(pOrganization))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the POrganization in the database
        List<POrganization> pOrganizationList = pOrganizationRepository.findAll().collectList().block();
        assertThat(pOrganizationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamPOrganization() throws Exception {
        int databaseSizeBeforeUpdate = pOrganizationRepository.findAll().collectList().block().size();
        pOrganization.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(pOrganization))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the POrganization in the database
        List<POrganization> pOrganizationList = pOrganizationRepository.findAll().collectList().block();
        assertThat(pOrganizationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdatePOrganizationWithPatch() throws Exception {
        // Initialize the database
        pOrganizationRepository.save(pOrganization).block();

        int databaseSizeBeforeUpdate = pOrganizationRepository.findAll().collectList().block().size();

        // Update the pOrganization using partial update
        POrganization partialUpdatedPOrganization = new POrganization();
        partialUpdatedPOrganization.setId(pOrganization.getId());

        partialUpdatedPOrganization
            .description(UPDATED_DESCRIPTION)
            .profileID(UPDATED_PROFILE_ID)
            .companyType(UPDATED_COMPANY_TYPE)
            .status(UPDATED_STATUS);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedPOrganization.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedPOrganization))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the POrganization in the database
        List<POrganization> pOrganizationList = pOrganizationRepository.findAll().collectList().block();
        assertThat(pOrganizationList).hasSize(databaseSizeBeforeUpdate);
        POrganization testPOrganization = pOrganizationList.get(pOrganizationList.size() - 1);
        assertThat(testPOrganization.getOfficeAddress()).isEqualTo(DEFAULT_OFFICE_ADDRESS);
        assertThat(testPOrganization.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testPOrganization.getProfileID()).isEqualTo(UPDATED_PROFILE_ID);
        assertThat(testPOrganization.getCompanyType()).isEqualTo(UPDATED_COMPANY_TYPE);
        assertThat(testPOrganization.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    void fullUpdatePOrganizationWithPatch() throws Exception {
        // Initialize the database
        pOrganizationRepository.save(pOrganization).block();

        int databaseSizeBeforeUpdate = pOrganizationRepository.findAll().collectList().block().size();

        // Update the pOrganization using partial update
        POrganization partialUpdatedPOrganization = new POrganization();
        partialUpdatedPOrganization.setId(pOrganization.getId());

        partialUpdatedPOrganization
            .officeAddress(UPDATED_OFFICE_ADDRESS)
            .description(UPDATED_DESCRIPTION)
            .profileID(UPDATED_PROFILE_ID)
            .companyType(UPDATED_COMPANY_TYPE)
            .status(UPDATED_STATUS);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedPOrganization.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedPOrganization))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the POrganization in the database
        List<POrganization> pOrganizationList = pOrganizationRepository.findAll().collectList().block();
        assertThat(pOrganizationList).hasSize(databaseSizeBeforeUpdate);
        POrganization testPOrganization = pOrganizationList.get(pOrganizationList.size() - 1);
        assertThat(testPOrganization.getOfficeAddress()).isEqualTo(UPDATED_OFFICE_ADDRESS);
        assertThat(testPOrganization.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testPOrganization.getProfileID()).isEqualTo(UPDATED_PROFILE_ID);
        assertThat(testPOrganization.getCompanyType()).isEqualTo(UPDATED_COMPANY_TYPE);
        assertThat(testPOrganization.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    void patchNonExistingPOrganization() throws Exception {
        int databaseSizeBeforeUpdate = pOrganizationRepository.findAll().collectList().block().size();
        pOrganization.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, pOrganization.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(pOrganization))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the POrganization in the database
        List<POrganization> pOrganizationList = pOrganizationRepository.findAll().collectList().block();
        assertThat(pOrganizationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchPOrganization() throws Exception {
        int databaseSizeBeforeUpdate = pOrganizationRepository.findAll().collectList().block().size();
        pOrganization.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(pOrganization))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the POrganization in the database
        List<POrganization> pOrganizationList = pOrganizationRepository.findAll().collectList().block();
        assertThat(pOrganizationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamPOrganization() throws Exception {
        int databaseSizeBeforeUpdate = pOrganizationRepository.findAll().collectList().block().size();
        pOrganization.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(pOrganization))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the POrganization in the database
        List<POrganization> pOrganizationList = pOrganizationRepository.findAll().collectList().block();
        assertThat(pOrganizationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deletePOrganization() {
        // Initialize the database
        pOrganizationRepository.save(pOrganization).block();

        int databaseSizeBeforeDelete = pOrganizationRepository.findAll().collectList().block().size();

        // Delete the pOrganization
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, pOrganization.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<POrganization> pOrganizationList = pOrganizationRepository.findAll().collectList().block();
        assertThat(pOrganizationList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
