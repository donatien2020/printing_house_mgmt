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
import org.nta.idc.donatien.domain.PayRollItem;
import org.nta.idc.donatien.domain.enumeration.SalaryCollectionStatuses;
import org.nta.idc.donatien.repository.EntityManager;
import org.nta.idc.donatien.repository.PayRollItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.reactive.server.WebTestClient;

/**
 * Integration tests for the {@link PayRollItemResource} REST controller.
 */
@IntegrationTest
@AutoConfigureWebTestClient(timeout = IntegrationTest.DEFAULT_ENTITY_TIMEOUT)
@WithMockUser
class PayRollItemResourceIT {

    private static final Long DEFAULT_DIVISION_ID = 1L;
    private static final Long UPDATED_DIVISION_ID = 2L;

    private static final Long DEFAULT_EMP_ID = 1L;
    private static final Long UPDATED_EMP_ID = 2L;

    private static final String DEFAULT_EMP_NUMBER = "AAAAAAAAAA";
    private static final String UPDATED_EMP_NUMBER = "BBBBBBBBBB";

    private static final Double DEFAULT_NET_AMOUNT = 1D;
    private static final Double UPDATED_NET_AMOUNT = 2D;

    private static final Double DEFAULT_GROSS_AMOUNT = 1D;
    private static final Double UPDATED_GROSS_AMOUNT = 2D;

    private static final SalaryCollectionStatuses DEFAULT_COLLECTION_STATUS = SalaryCollectionStatuses.COMPUTED;
    private static final SalaryCollectionStatuses UPDATED_COLLECTION_STATUS = SalaryCollectionStatuses.COLLECTED;

    private static final ZonedDateTime DEFAULT_COLLECTION_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_COLLECTION_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_COMPUTATION_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_COMPUTATION_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String ENTITY_API_URL = "/api/pay-roll-items";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PayRollItemRepository payRollItemRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private WebTestClient webTestClient;

    private PayRollItem payRollItem;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PayRollItem createEntity(EntityManager em) {
        PayRollItem payRollItem = new PayRollItem()
            .divisionId(DEFAULT_DIVISION_ID)
            .empId(DEFAULT_EMP_ID)
            .empNumber(DEFAULT_EMP_NUMBER)
            .netAmount(DEFAULT_NET_AMOUNT)
            .grossAmount(DEFAULT_GROSS_AMOUNT)
            .collectionStatus(DEFAULT_COLLECTION_STATUS)
            .collectionDate(DEFAULT_COLLECTION_DATE)
            .computationDate(DEFAULT_COMPUTATION_DATE);
        return payRollItem;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PayRollItem createUpdatedEntity(EntityManager em) {
        PayRollItem payRollItem = new PayRollItem()
            .divisionId(UPDATED_DIVISION_ID)
            .empId(UPDATED_EMP_ID)
            .empNumber(UPDATED_EMP_NUMBER)
            .netAmount(UPDATED_NET_AMOUNT)
            .grossAmount(UPDATED_GROSS_AMOUNT)
            .collectionStatus(UPDATED_COLLECTION_STATUS)
            .collectionDate(UPDATED_COLLECTION_DATE)
            .computationDate(UPDATED_COMPUTATION_DATE);
        return payRollItem;
    }

    public static void deleteEntities(EntityManager em) {
        try {
            em.deleteAll(PayRollItem.class).block();
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
        payRollItem = createEntity(em);
    }

    @Test
    void createPayRollItem() throws Exception {
        int databaseSizeBeforeCreate = payRollItemRepository.findAll().collectList().block().size();
        // Create the PayRollItem
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(payRollItem))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the PayRollItem in the database
        List<PayRollItem> payRollItemList = payRollItemRepository.findAll().collectList().block();
        assertThat(payRollItemList).hasSize(databaseSizeBeforeCreate + 1);
        PayRollItem testPayRollItem = payRollItemList.get(payRollItemList.size() - 1);
        assertThat(testPayRollItem.getDivisionId()).isEqualTo(DEFAULT_DIVISION_ID);
        assertThat(testPayRollItem.getEmpId()).isEqualTo(DEFAULT_EMP_ID);
        assertThat(testPayRollItem.getEmpNumber()).isEqualTo(DEFAULT_EMP_NUMBER);
        assertThat(testPayRollItem.getNetAmount()).isEqualTo(DEFAULT_NET_AMOUNT);
        assertThat(testPayRollItem.getGrossAmount()).isEqualTo(DEFAULT_GROSS_AMOUNT);
        assertThat(testPayRollItem.getCollectionStatus()).isEqualTo(DEFAULT_COLLECTION_STATUS);
        assertThat(testPayRollItem.getCollectionDate()).isEqualTo(DEFAULT_COLLECTION_DATE);
        assertThat(testPayRollItem.getComputationDate()).isEqualTo(DEFAULT_COMPUTATION_DATE);
    }

    @Test
    void createPayRollItemWithExistingId() throws Exception {
        // Create the PayRollItem with an existing ID
        payRollItem.setId(1L);

        int databaseSizeBeforeCreate = payRollItemRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(payRollItem))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the PayRollItem in the database
        List<PayRollItem> payRollItemList = payRollItemRepository.findAll().collectList().block();
        assertThat(payRollItemList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void checkDivisionIdIsRequired() throws Exception {
        int databaseSizeBeforeTest = payRollItemRepository.findAll().collectList().block().size();
        // set the field null
        payRollItem.setDivisionId(null);

        // Create the PayRollItem, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(payRollItem))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<PayRollItem> payRollItemList = payRollItemRepository.findAll().collectList().block();
        assertThat(payRollItemList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkEmpIdIsRequired() throws Exception {
        int databaseSizeBeforeTest = payRollItemRepository.findAll().collectList().block().size();
        // set the field null
        payRollItem.setEmpId(null);

        // Create the PayRollItem, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(payRollItem))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<PayRollItem> payRollItemList = payRollItemRepository.findAll().collectList().block();
        assertThat(payRollItemList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkEmpNumberIsRequired() throws Exception {
        int databaseSizeBeforeTest = payRollItemRepository.findAll().collectList().block().size();
        // set the field null
        payRollItem.setEmpNumber(null);

        // Create the PayRollItem, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(payRollItem))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<PayRollItem> payRollItemList = payRollItemRepository.findAll().collectList().block();
        assertThat(payRollItemList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkNetAmountIsRequired() throws Exception {
        int databaseSizeBeforeTest = payRollItemRepository.findAll().collectList().block().size();
        // set the field null
        payRollItem.setNetAmount(null);

        // Create the PayRollItem, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(payRollItem))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<PayRollItem> payRollItemList = payRollItemRepository.findAll().collectList().block();
        assertThat(payRollItemList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkGrossAmountIsRequired() throws Exception {
        int databaseSizeBeforeTest = payRollItemRepository.findAll().collectList().block().size();
        // set the field null
        payRollItem.setGrossAmount(null);

        // Create the PayRollItem, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(payRollItem))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<PayRollItem> payRollItemList = payRollItemRepository.findAll().collectList().block();
        assertThat(payRollItemList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkCollectionStatusIsRequired() throws Exception {
        int databaseSizeBeforeTest = payRollItemRepository.findAll().collectList().block().size();
        // set the field null
        payRollItem.setCollectionStatus(null);

        // Create the PayRollItem, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(payRollItem))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<PayRollItem> payRollItemList = payRollItemRepository.findAll().collectList().block();
        assertThat(payRollItemList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkCollectionDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = payRollItemRepository.findAll().collectList().block().size();
        // set the field null
        payRollItem.setCollectionDate(null);

        // Create the PayRollItem, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(payRollItem))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<PayRollItem> payRollItemList = payRollItemRepository.findAll().collectList().block();
        assertThat(payRollItemList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkComputationDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = payRollItemRepository.findAll().collectList().block().size();
        // set the field null
        payRollItem.setComputationDate(null);

        // Create the PayRollItem, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(payRollItem))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<PayRollItem> payRollItemList = payRollItemRepository.findAll().collectList().block();
        assertThat(payRollItemList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void getAllPayRollItemsAsStream() {
        // Initialize the database
        payRollItemRepository.save(payRollItem).block();

        List<PayRollItem> payRollItemList = webTestClient
            .get()
            .uri(ENTITY_API_URL)
            .accept(MediaType.APPLICATION_NDJSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentTypeCompatibleWith(MediaType.APPLICATION_NDJSON)
            .returnResult(PayRollItem.class)
            .getResponseBody()
            .filter(payRollItem::equals)
            .collectList()
            .block(Duration.ofSeconds(5));

        assertThat(payRollItemList).isNotNull();
        assertThat(payRollItemList).hasSize(1);
        PayRollItem testPayRollItem = payRollItemList.get(0);
        assertThat(testPayRollItem.getDivisionId()).isEqualTo(DEFAULT_DIVISION_ID);
        assertThat(testPayRollItem.getEmpId()).isEqualTo(DEFAULT_EMP_ID);
        assertThat(testPayRollItem.getEmpNumber()).isEqualTo(DEFAULT_EMP_NUMBER);
        assertThat(testPayRollItem.getNetAmount()).isEqualTo(DEFAULT_NET_AMOUNT);
        assertThat(testPayRollItem.getGrossAmount()).isEqualTo(DEFAULT_GROSS_AMOUNT);
        assertThat(testPayRollItem.getCollectionStatus()).isEqualTo(DEFAULT_COLLECTION_STATUS);
        assertThat(testPayRollItem.getCollectionDate()).isEqualTo(DEFAULT_COLLECTION_DATE);
        assertThat(testPayRollItem.getComputationDate()).isEqualTo(DEFAULT_COMPUTATION_DATE);
    }

    @Test
    void getAllPayRollItems() {
        // Initialize the database
        payRollItemRepository.save(payRollItem).block();

        // Get all the payRollItemList
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
            .value(hasItem(payRollItem.getId().intValue()))
            .jsonPath("$.[*].divisionId")
            .value(hasItem(DEFAULT_DIVISION_ID.intValue()))
            .jsonPath("$.[*].empId")
            .value(hasItem(DEFAULT_EMP_ID.intValue()))
            .jsonPath("$.[*].empNumber")
            .value(hasItem(DEFAULT_EMP_NUMBER))
            .jsonPath("$.[*].netAmount")
            .value(hasItem(DEFAULT_NET_AMOUNT.doubleValue()))
            .jsonPath("$.[*].grossAmount")
            .value(hasItem(DEFAULT_GROSS_AMOUNT.doubleValue()))
            .jsonPath("$.[*].collectionStatus")
            .value(hasItem(DEFAULT_COLLECTION_STATUS.toString()))
            .jsonPath("$.[*].collectionDate")
            .value(hasItem(sameInstant(DEFAULT_COLLECTION_DATE)))
            .jsonPath("$.[*].computationDate")
            .value(hasItem(sameInstant(DEFAULT_COMPUTATION_DATE)));
    }

    @Test
    void getPayRollItem() {
        // Initialize the database
        payRollItemRepository.save(payRollItem).block();

        // Get the payRollItem
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, payRollItem.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(payRollItem.getId().intValue()))
            .jsonPath("$.divisionId")
            .value(is(DEFAULT_DIVISION_ID.intValue()))
            .jsonPath("$.empId")
            .value(is(DEFAULT_EMP_ID.intValue()))
            .jsonPath("$.empNumber")
            .value(is(DEFAULT_EMP_NUMBER))
            .jsonPath("$.netAmount")
            .value(is(DEFAULT_NET_AMOUNT.doubleValue()))
            .jsonPath("$.grossAmount")
            .value(is(DEFAULT_GROSS_AMOUNT.doubleValue()))
            .jsonPath("$.collectionStatus")
            .value(is(DEFAULT_COLLECTION_STATUS.toString()))
            .jsonPath("$.collectionDate")
            .value(is(sameInstant(DEFAULT_COLLECTION_DATE)))
            .jsonPath("$.computationDate")
            .value(is(sameInstant(DEFAULT_COMPUTATION_DATE)));
    }

    @Test
    void getNonExistingPayRollItem() {
        // Get the payRollItem
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putExistingPayRollItem() throws Exception {
        // Initialize the database
        payRollItemRepository.save(payRollItem).block();

        int databaseSizeBeforeUpdate = payRollItemRepository.findAll().collectList().block().size();

        // Update the payRollItem
        PayRollItem updatedPayRollItem = payRollItemRepository.findById(payRollItem.getId()).block();
        updatedPayRollItem
            .divisionId(UPDATED_DIVISION_ID)
            .empId(UPDATED_EMP_ID)
            .empNumber(UPDATED_EMP_NUMBER)
            .netAmount(UPDATED_NET_AMOUNT)
            .grossAmount(UPDATED_GROSS_AMOUNT)
            .collectionStatus(UPDATED_COLLECTION_STATUS)
            .collectionDate(UPDATED_COLLECTION_DATE)
            .computationDate(UPDATED_COMPUTATION_DATE);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, updatedPayRollItem.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(updatedPayRollItem))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the PayRollItem in the database
        List<PayRollItem> payRollItemList = payRollItemRepository.findAll().collectList().block();
        assertThat(payRollItemList).hasSize(databaseSizeBeforeUpdate);
        PayRollItem testPayRollItem = payRollItemList.get(payRollItemList.size() - 1);
        assertThat(testPayRollItem.getDivisionId()).isEqualTo(UPDATED_DIVISION_ID);
        assertThat(testPayRollItem.getEmpId()).isEqualTo(UPDATED_EMP_ID);
        assertThat(testPayRollItem.getEmpNumber()).isEqualTo(UPDATED_EMP_NUMBER);
        assertThat(testPayRollItem.getNetAmount()).isEqualTo(UPDATED_NET_AMOUNT);
        assertThat(testPayRollItem.getGrossAmount()).isEqualTo(UPDATED_GROSS_AMOUNT);
        assertThat(testPayRollItem.getCollectionStatus()).isEqualTo(UPDATED_COLLECTION_STATUS);
        assertThat(testPayRollItem.getCollectionDate()).isEqualTo(UPDATED_COLLECTION_DATE);
        assertThat(testPayRollItem.getComputationDate()).isEqualTo(UPDATED_COMPUTATION_DATE);
    }

    @Test
    void putNonExistingPayRollItem() throws Exception {
        int databaseSizeBeforeUpdate = payRollItemRepository.findAll().collectList().block().size();
        payRollItem.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, payRollItem.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(payRollItem))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the PayRollItem in the database
        List<PayRollItem> payRollItemList = payRollItemRepository.findAll().collectList().block();
        assertThat(payRollItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchPayRollItem() throws Exception {
        int databaseSizeBeforeUpdate = payRollItemRepository.findAll().collectList().block().size();
        payRollItem.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(payRollItem))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the PayRollItem in the database
        List<PayRollItem> payRollItemList = payRollItemRepository.findAll().collectList().block();
        assertThat(payRollItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamPayRollItem() throws Exception {
        int databaseSizeBeforeUpdate = payRollItemRepository.findAll().collectList().block().size();
        payRollItem.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(payRollItem))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the PayRollItem in the database
        List<PayRollItem> payRollItemList = payRollItemRepository.findAll().collectList().block();
        assertThat(payRollItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdatePayRollItemWithPatch() throws Exception {
        // Initialize the database
        payRollItemRepository.save(payRollItem).block();

        int databaseSizeBeforeUpdate = payRollItemRepository.findAll().collectList().block().size();

        // Update the payRollItem using partial update
        PayRollItem partialUpdatedPayRollItem = new PayRollItem();
        partialUpdatedPayRollItem.setId(payRollItem.getId());

        partialUpdatedPayRollItem.empId(UPDATED_EMP_ID).empNumber(UPDATED_EMP_NUMBER).netAmount(UPDATED_NET_AMOUNT);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedPayRollItem.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedPayRollItem))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the PayRollItem in the database
        List<PayRollItem> payRollItemList = payRollItemRepository.findAll().collectList().block();
        assertThat(payRollItemList).hasSize(databaseSizeBeforeUpdate);
        PayRollItem testPayRollItem = payRollItemList.get(payRollItemList.size() - 1);
        assertThat(testPayRollItem.getDivisionId()).isEqualTo(DEFAULT_DIVISION_ID);
        assertThat(testPayRollItem.getEmpId()).isEqualTo(UPDATED_EMP_ID);
        assertThat(testPayRollItem.getEmpNumber()).isEqualTo(UPDATED_EMP_NUMBER);
        assertThat(testPayRollItem.getNetAmount()).isEqualTo(UPDATED_NET_AMOUNT);
        assertThat(testPayRollItem.getGrossAmount()).isEqualTo(DEFAULT_GROSS_AMOUNT);
        assertThat(testPayRollItem.getCollectionStatus()).isEqualTo(DEFAULT_COLLECTION_STATUS);
        assertThat(testPayRollItem.getCollectionDate()).isEqualTo(DEFAULT_COLLECTION_DATE);
        assertThat(testPayRollItem.getComputationDate()).isEqualTo(DEFAULT_COMPUTATION_DATE);
    }

    @Test
    void fullUpdatePayRollItemWithPatch() throws Exception {
        // Initialize the database
        payRollItemRepository.save(payRollItem).block();

        int databaseSizeBeforeUpdate = payRollItemRepository.findAll().collectList().block().size();

        // Update the payRollItem using partial update
        PayRollItem partialUpdatedPayRollItem = new PayRollItem();
        partialUpdatedPayRollItem.setId(payRollItem.getId());

        partialUpdatedPayRollItem
            .divisionId(UPDATED_DIVISION_ID)
            .empId(UPDATED_EMP_ID)
            .empNumber(UPDATED_EMP_NUMBER)
            .netAmount(UPDATED_NET_AMOUNT)
            .grossAmount(UPDATED_GROSS_AMOUNT)
            .collectionStatus(UPDATED_COLLECTION_STATUS)
            .collectionDate(UPDATED_COLLECTION_DATE)
            .computationDate(UPDATED_COMPUTATION_DATE);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedPayRollItem.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedPayRollItem))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the PayRollItem in the database
        List<PayRollItem> payRollItemList = payRollItemRepository.findAll().collectList().block();
        assertThat(payRollItemList).hasSize(databaseSizeBeforeUpdate);
        PayRollItem testPayRollItem = payRollItemList.get(payRollItemList.size() - 1);
        assertThat(testPayRollItem.getDivisionId()).isEqualTo(UPDATED_DIVISION_ID);
        assertThat(testPayRollItem.getEmpId()).isEqualTo(UPDATED_EMP_ID);
        assertThat(testPayRollItem.getEmpNumber()).isEqualTo(UPDATED_EMP_NUMBER);
        assertThat(testPayRollItem.getNetAmount()).isEqualTo(UPDATED_NET_AMOUNT);
        assertThat(testPayRollItem.getGrossAmount()).isEqualTo(UPDATED_GROSS_AMOUNT);
        assertThat(testPayRollItem.getCollectionStatus()).isEqualTo(UPDATED_COLLECTION_STATUS);
        assertThat(testPayRollItem.getCollectionDate()).isEqualTo(UPDATED_COLLECTION_DATE);
        assertThat(testPayRollItem.getComputationDate()).isEqualTo(UPDATED_COMPUTATION_DATE);
    }

    @Test
    void patchNonExistingPayRollItem() throws Exception {
        int databaseSizeBeforeUpdate = payRollItemRepository.findAll().collectList().block().size();
        payRollItem.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, payRollItem.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(payRollItem))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the PayRollItem in the database
        List<PayRollItem> payRollItemList = payRollItemRepository.findAll().collectList().block();
        assertThat(payRollItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchPayRollItem() throws Exception {
        int databaseSizeBeforeUpdate = payRollItemRepository.findAll().collectList().block().size();
        payRollItem.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(payRollItem))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the PayRollItem in the database
        List<PayRollItem> payRollItemList = payRollItemRepository.findAll().collectList().block();
        assertThat(payRollItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamPayRollItem() throws Exception {
        int databaseSizeBeforeUpdate = payRollItemRepository.findAll().collectList().block().size();
        payRollItem.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(payRollItem))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the PayRollItem in the database
        List<PayRollItem> payRollItemList = payRollItemRepository.findAll().collectList().block();
        assertThat(payRollItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deletePayRollItem() {
        // Initialize the database
        payRollItemRepository.save(payRollItem).block();

        int databaseSizeBeforeDelete = payRollItemRepository.findAll().collectList().block().size();

        // Delete the payRollItem
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, payRollItem.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<PayRollItem> payRollItemList = payRollItemRepository.findAll().collectList().block();
        assertThat(payRollItemList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
