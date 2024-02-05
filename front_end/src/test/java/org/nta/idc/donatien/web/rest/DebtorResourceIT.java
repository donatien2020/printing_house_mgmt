package org.nta.idc.donatien.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.is;
import static org.nta.idc.donatien.web.rest.TestUtil.sameInstant;

import java.time.Duration;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.nta.idc.donatien.IntegrationTest;
import org.nta.idc.donatien.domain.Debtor;
import org.nta.idc.donatien.domain.enumeration.DebtInvoicingStatuses;
import org.nta.idc.donatien.domain.enumeration.DebtStatuses;
import org.nta.idc.donatien.repository.DebtorRepository;
import org.nta.idc.donatien.repository.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.reactive.server.WebTestClient;

/**
 * Integration tests for the {@link DebtorResource} REST controller.
 */
@IntegrationTest
@AutoConfigureWebTestClient(timeout = IntegrationTest.DEFAULT_ENTITY_TIMEOUT)
@WithMockUser
class DebtorResourceIT {

    private static final String DEFAULT_SERVICE_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_SERVICE_DESCRIPTION = "BBBBBBBBBB";

    private static final String DEFAULT_PRODUCT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_PRODUCT_DESCRIPTION = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_DEBT_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DEBT_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final DebtStatuses DEFAULT_DEBT_STATUS = DebtStatuses.REQUESTED;
    private static final DebtStatuses UPDATED_DEBT_STATUS = DebtStatuses.RECEIVED;

    private static final DebtInvoicingStatuses DEFAULT_INVOICING_STATUS = DebtInvoicingStatuses.INVOICED;
    private static final DebtInvoicingStatuses UPDATED_INVOICING_STATUS = DebtInvoicingStatuses.PENDING;

    private static final Double DEFAULT_TOTAL_AMOUNT = 1D;
    private static final Double UPDATED_TOTAL_AMOUNT = 2D;

    private static final Double DEFAULT_PAID_AMOUNT = 1D;
    private static final Double UPDATED_PAID_AMOUNT = 2D;

    private static final String ENTITY_API_URL = "/api/debtors";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private DebtorRepository debtorRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private WebTestClient webTestClient;

    private Debtor debtor;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Debtor createEntity(EntityManager em) {
        Debtor debtor = new Debtor()
            .serviceDescription(DEFAULT_SERVICE_DESCRIPTION)
            .productDescription(DEFAULT_PRODUCT_DESCRIPTION)
            .debtDate(DEFAULT_DEBT_DATE)
            .debtStatus(DEFAULT_DEBT_STATUS)
            .invoicingStatus(DEFAULT_INVOICING_STATUS)
            .totalAmount(DEFAULT_TOTAL_AMOUNT)
            .paidAmount(DEFAULT_PAID_AMOUNT);
        return debtor;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Debtor createUpdatedEntity(EntityManager em) {
        Debtor debtor = new Debtor()
            .serviceDescription(UPDATED_SERVICE_DESCRIPTION)
            .productDescription(UPDATED_PRODUCT_DESCRIPTION)
            .debtDate(UPDATED_DEBT_DATE)
            .debtStatus(UPDATED_DEBT_STATUS)
            .invoicingStatus(UPDATED_INVOICING_STATUS)
            .totalAmount(UPDATED_TOTAL_AMOUNT)
            .paidAmount(UPDATED_PAID_AMOUNT);
        return debtor;
    }

    public static void deleteEntities(EntityManager em) {
        try {
            em.deleteAll(Debtor.class).block();
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
        debtor = createEntity(em);
    }

    @Test
    void createDebtor() throws Exception {
        int databaseSizeBeforeCreate = debtorRepository.findAll().collectList().block().size();
        // Create the Debtor
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(debtor))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the Debtor in the database
        List<Debtor> debtorList = debtorRepository.findAll().collectList().block();
        assertThat(debtorList).hasSize(databaseSizeBeforeCreate + 1);
        Debtor testDebtor = debtorList.get(debtorList.size() - 1);
        assertThat(testDebtor.getServiceDescription()).isEqualTo(DEFAULT_SERVICE_DESCRIPTION);
        assertThat(testDebtor.getProductDescription()).isEqualTo(DEFAULT_PRODUCT_DESCRIPTION);
        assertThat(testDebtor.getDebtDate()).isEqualTo(DEFAULT_DEBT_DATE);
        assertThat(testDebtor.getDebtStatus()).isEqualTo(DEFAULT_DEBT_STATUS);
        assertThat(testDebtor.getInvoicingStatus()).isEqualTo(DEFAULT_INVOICING_STATUS);
        assertThat(testDebtor.getTotalAmount()).isEqualTo(DEFAULT_TOTAL_AMOUNT);
        assertThat(testDebtor.getPaidAmount()).isEqualTo(DEFAULT_PAID_AMOUNT);
    }

    @Test
    void createDebtorWithExistingId() throws Exception {
        // Create the Debtor with an existing ID
        debtor.setId(1L);

        int databaseSizeBeforeCreate = debtorRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(debtor))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Debtor in the database
        List<Debtor> debtorList = debtorRepository.findAll().collectList().block();
        assertThat(debtorList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void checkDebtStatusIsRequired() throws Exception {
        int databaseSizeBeforeTest = debtorRepository.findAll().collectList().block().size();
        // set the field null
        debtor.setDebtStatus(null);

        // Create the Debtor, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(debtor))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Debtor> debtorList = debtorRepository.findAll().collectList().block();
        assertThat(debtorList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkInvoicingStatusIsRequired() throws Exception {
        int databaseSizeBeforeTest = debtorRepository.findAll().collectList().block().size();
        // set the field null
        debtor.setInvoicingStatus(null);

        // Create the Debtor, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(debtor))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Debtor> debtorList = debtorRepository.findAll().collectList().block();
        assertThat(debtorList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void getAllDebtorsAsStream() {
        // Initialize the database
        debtorRepository.save(debtor).block();

        List<Debtor> debtorList = webTestClient
            .get()
            .uri(ENTITY_API_URL)
            .accept(MediaType.APPLICATION_NDJSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentTypeCompatibleWith(MediaType.APPLICATION_NDJSON)
            .returnResult(Debtor.class)
            .getResponseBody()
            .filter(debtor::equals)
            .collectList()
            .block(Duration.ofSeconds(5));

        assertThat(debtorList).isNotNull();
        assertThat(debtorList).hasSize(1);
        Debtor testDebtor = debtorList.get(0);
        assertThat(testDebtor.getServiceDescription()).isEqualTo(DEFAULT_SERVICE_DESCRIPTION);
        assertThat(testDebtor.getProductDescription()).isEqualTo(DEFAULT_PRODUCT_DESCRIPTION);
        assertThat(testDebtor.getDebtDate()).isEqualTo(DEFAULT_DEBT_DATE);
        assertThat(testDebtor.getDebtStatus()).isEqualTo(DEFAULT_DEBT_STATUS);
        assertThat(testDebtor.getInvoicingStatus()).isEqualTo(DEFAULT_INVOICING_STATUS);
        assertThat(testDebtor.getTotalAmount()).isEqualTo(DEFAULT_TOTAL_AMOUNT);
        assertThat(testDebtor.getPaidAmount()).isEqualTo(DEFAULT_PAID_AMOUNT);
    }

    @Test
    void getAllDebtors() {
        // Initialize the database
        debtorRepository.save(debtor).block();

        // Get all the debtorList
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
            .value(hasItem(debtor.getId().intValue()))
            .jsonPath("$.[*].serviceDescription")
            .value(hasItem(DEFAULT_SERVICE_DESCRIPTION))
            .jsonPath("$.[*].productDescription")
            .value(hasItem(DEFAULT_PRODUCT_DESCRIPTION))
            .jsonPath("$.[*].debtDate")
            .value(hasItem(sameInstant(DEFAULT_DEBT_DATE)))
            .jsonPath("$.[*].debtStatus")
            .value(hasItem(DEFAULT_DEBT_STATUS.toString()))
            .jsonPath("$.[*].invoicingStatus")
            .value(hasItem(DEFAULT_INVOICING_STATUS.toString()))
            .jsonPath("$.[*].totalAmount")
            .value(hasItem(DEFAULT_TOTAL_AMOUNT.doubleValue()))
            .jsonPath("$.[*].paidAmount")
            .value(hasItem(DEFAULT_PAID_AMOUNT.doubleValue()));
    }

    @Test
    void getDebtor() {
        // Initialize the database
        debtorRepository.save(debtor).block();

        // Get the debtor
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, debtor.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(debtor.getId().intValue()))
            .jsonPath("$.serviceDescription")
            .value(is(DEFAULT_SERVICE_DESCRIPTION))
            .jsonPath("$.productDescription")
            .value(is(DEFAULT_PRODUCT_DESCRIPTION))
            .jsonPath("$.debtDate")
            .value(is(sameInstant(DEFAULT_DEBT_DATE)))
            .jsonPath("$.debtStatus")
            .value(is(DEFAULT_DEBT_STATUS.toString()))
            .jsonPath("$.invoicingStatus")
            .value(is(DEFAULT_INVOICING_STATUS.toString()))
            .jsonPath("$.totalAmount")
            .value(is(DEFAULT_TOTAL_AMOUNT.doubleValue()))
            .jsonPath("$.paidAmount")
            .value(is(DEFAULT_PAID_AMOUNT.doubleValue()));
    }

    @Test
    void getNonExistingDebtor() {
        // Get the debtor
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putExistingDebtor() throws Exception {
        // Initialize the database
        debtorRepository.save(debtor).block();

        int databaseSizeBeforeUpdate = debtorRepository.findAll().collectList().block().size();

        // Update the debtor
        Debtor updatedDebtor = debtorRepository.findById(debtor.getId()).block();
        updatedDebtor
            .serviceDescription(UPDATED_SERVICE_DESCRIPTION)
            .productDescription(UPDATED_PRODUCT_DESCRIPTION)
            .debtDate(UPDATED_DEBT_DATE)
            .debtStatus(UPDATED_DEBT_STATUS)
            .invoicingStatus(UPDATED_INVOICING_STATUS)
            .totalAmount(UPDATED_TOTAL_AMOUNT)
            .paidAmount(UPDATED_PAID_AMOUNT);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, updatedDebtor.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(updatedDebtor))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Debtor in the database
        List<Debtor> debtorList = debtorRepository.findAll().collectList().block();
        assertThat(debtorList).hasSize(databaseSizeBeforeUpdate);
        Debtor testDebtor = debtorList.get(debtorList.size() - 1);
        assertThat(testDebtor.getServiceDescription()).isEqualTo(UPDATED_SERVICE_DESCRIPTION);
        assertThat(testDebtor.getProductDescription()).isEqualTo(UPDATED_PRODUCT_DESCRIPTION);
        assertThat(testDebtor.getDebtDate()).isEqualTo(UPDATED_DEBT_DATE);
        assertThat(testDebtor.getDebtStatus()).isEqualTo(UPDATED_DEBT_STATUS);
        assertThat(testDebtor.getInvoicingStatus()).isEqualTo(UPDATED_INVOICING_STATUS);
        assertThat(testDebtor.getTotalAmount()).isEqualTo(UPDATED_TOTAL_AMOUNT);
        assertThat(testDebtor.getPaidAmount()).isEqualTo(UPDATED_PAID_AMOUNT);
    }

    @Test
    void putNonExistingDebtor() throws Exception {
        int databaseSizeBeforeUpdate = debtorRepository.findAll().collectList().block().size();
        debtor.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, debtor.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(debtor))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Debtor in the database
        List<Debtor> debtorList = debtorRepository.findAll().collectList().block();
        assertThat(debtorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchDebtor() throws Exception {
        int databaseSizeBeforeUpdate = debtorRepository.findAll().collectList().block().size();
        debtor.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(debtor))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Debtor in the database
        List<Debtor> debtorList = debtorRepository.findAll().collectList().block();
        assertThat(debtorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamDebtor() throws Exception {
        int databaseSizeBeforeUpdate = debtorRepository.findAll().collectList().block().size();
        debtor.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(debtor))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Debtor in the database
        List<Debtor> debtorList = debtorRepository.findAll().collectList().block();
        assertThat(debtorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateDebtorWithPatch() throws Exception {
        // Initialize the database
        debtorRepository.save(debtor).block();

        int databaseSizeBeforeUpdate = debtorRepository.findAll().collectList().block().size();

        // Update the debtor using partial update
        Debtor partialUpdatedDebtor = new Debtor();
        partialUpdatedDebtor.setId(debtor.getId());

        partialUpdatedDebtor
            .serviceDescription(UPDATED_SERVICE_DESCRIPTION)
            .productDescription(UPDATED_PRODUCT_DESCRIPTION)
            .debtDate(UPDATED_DEBT_DATE)
            .invoicingStatus(UPDATED_INVOICING_STATUS);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedDebtor.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedDebtor))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Debtor in the database
        List<Debtor> debtorList = debtorRepository.findAll().collectList().block();
        assertThat(debtorList).hasSize(databaseSizeBeforeUpdate);
        Debtor testDebtor = debtorList.get(debtorList.size() - 1);
        assertThat(testDebtor.getServiceDescription()).isEqualTo(UPDATED_SERVICE_DESCRIPTION);
        assertThat(testDebtor.getProductDescription()).isEqualTo(UPDATED_PRODUCT_DESCRIPTION);
        assertThat(testDebtor.getDebtDate()).isEqualTo(UPDATED_DEBT_DATE);
        assertThat(testDebtor.getDebtStatus()).isEqualTo(DEFAULT_DEBT_STATUS);
        assertThat(testDebtor.getInvoicingStatus()).isEqualTo(UPDATED_INVOICING_STATUS);
        assertThat(testDebtor.getTotalAmount()).isEqualTo(DEFAULT_TOTAL_AMOUNT);
        assertThat(testDebtor.getPaidAmount()).isEqualTo(DEFAULT_PAID_AMOUNT);
    }

    @Test
    void fullUpdateDebtorWithPatch() throws Exception {
        // Initialize the database
        debtorRepository.save(debtor).block();

        int databaseSizeBeforeUpdate = debtorRepository.findAll().collectList().block().size();

        // Update the debtor using partial update
        Debtor partialUpdatedDebtor = new Debtor();
        partialUpdatedDebtor.setId(debtor.getId());

        partialUpdatedDebtor
            .serviceDescription(UPDATED_SERVICE_DESCRIPTION)
            .productDescription(UPDATED_PRODUCT_DESCRIPTION)
            .debtDate(UPDATED_DEBT_DATE)
            .debtStatus(UPDATED_DEBT_STATUS)
            .invoicingStatus(UPDATED_INVOICING_STATUS)
            .totalAmount(UPDATED_TOTAL_AMOUNT)
            .paidAmount(UPDATED_PAID_AMOUNT);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedDebtor.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedDebtor))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Debtor in the database
        List<Debtor> debtorList = debtorRepository.findAll().collectList().block();
        assertThat(debtorList).hasSize(databaseSizeBeforeUpdate);
        Debtor testDebtor = debtorList.get(debtorList.size() - 1);
        assertThat(testDebtor.getServiceDescription()).isEqualTo(UPDATED_SERVICE_DESCRIPTION);
        assertThat(testDebtor.getProductDescription()).isEqualTo(UPDATED_PRODUCT_DESCRIPTION);
        assertThat(testDebtor.getDebtDate()).isEqualTo(UPDATED_DEBT_DATE);
        assertThat(testDebtor.getDebtStatus()).isEqualTo(UPDATED_DEBT_STATUS);
        assertThat(testDebtor.getInvoicingStatus()).isEqualTo(UPDATED_INVOICING_STATUS);
        assertThat(testDebtor.getTotalAmount()).isEqualTo(UPDATED_TOTAL_AMOUNT);
        assertThat(testDebtor.getPaidAmount()).isEqualTo(UPDATED_PAID_AMOUNT);
    }

    @Test
    void patchNonExistingDebtor() throws Exception {
        int databaseSizeBeforeUpdate = debtorRepository.findAll().collectList().block().size();
        debtor.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, debtor.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(debtor))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Debtor in the database
        List<Debtor> debtorList = debtorRepository.findAll().collectList().block();
        assertThat(debtorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchDebtor() throws Exception {
        int databaseSizeBeforeUpdate = debtorRepository.findAll().collectList().block().size();
        debtor.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(debtor))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Debtor in the database
        List<Debtor> debtorList = debtorRepository.findAll().collectList().block();
        assertThat(debtorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamDebtor() throws Exception {
        int databaseSizeBeforeUpdate = debtorRepository.findAll().collectList().block().size();
        debtor.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(debtor))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Debtor in the database
        List<Debtor> debtorList = debtorRepository.findAll().collectList().block();
        assertThat(debtorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteDebtor() {
        // Initialize the database
        debtorRepository.save(debtor).block();

        int databaseSizeBeforeDelete = debtorRepository.findAll().collectList().block().size();

        // Delete the debtor
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, debtor.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<Debtor> debtorList = debtorRepository.findAll().collectList().block();
        assertThat(debtorList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
