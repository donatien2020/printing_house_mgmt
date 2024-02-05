package org.nta.idc.donatien.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.is;

import java.time.Duration;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.nta.idc.donatien.IntegrationTest;
import org.nta.idc.donatien.domain.PayRoll;
import org.nta.idc.donatien.domain.enumeration.PaymentStatuses;
import org.nta.idc.donatien.repository.EntityManager;
import org.nta.idc.donatien.repository.PayRollRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.reactive.server.WebTestClient;

/**
 * Integration tests for the {@link PayRollResource} REST controller.
 */
@IntegrationTest
@AutoConfigureWebTestClient(timeout = IntegrationTest.DEFAULT_ENTITY_TIMEOUT)
@WithMockUser
class PayRollResourceIT {

    private static final Long DEFAULT_ORGANIZATION_ID = 1L;
    private static final Long UPDATED_ORGANIZATION_ID = 2L;

    private static final LocalDate DEFAULT_PAY_FROM = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_PAY_FROM = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_PAY_TO = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_PAY_TO = LocalDate.now(ZoneId.systemDefault());

    private static final PaymentStatuses DEFAULT_STATUS = PaymentStatuses.INITIAL;
    private static final PaymentStatuses UPDATED_STATUS = PaymentStatuses.APPROVED;

    private static final Double DEFAULT_TOTAL_GROSS_AMOUNT = 1D;
    private static final Double UPDATED_TOTAL_GROSS_AMOUNT = 2D;

    private static final Double DEFAULT_TOTAL_NET_AMOUNT = 1D;
    private static final Double UPDATED_TOTAL_NET_AMOUNT = 2D;

    private static final String ENTITY_API_URL = "/api/pay-rolls";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PayRollRepository payRollRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private WebTestClient webTestClient;

    private PayRoll payRoll;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PayRoll createEntity(EntityManager em) {
        PayRoll payRoll = new PayRoll()
            .organizationId(DEFAULT_ORGANIZATION_ID)
            .payFrom(DEFAULT_PAY_FROM)
            .payTo(DEFAULT_PAY_TO)
            .status(DEFAULT_STATUS)
            .totalGrossAmount(DEFAULT_TOTAL_GROSS_AMOUNT)
            .totalNetAmount(DEFAULT_TOTAL_NET_AMOUNT);
        return payRoll;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PayRoll createUpdatedEntity(EntityManager em) {
        PayRoll payRoll = new PayRoll()
            .organizationId(UPDATED_ORGANIZATION_ID)
            .payFrom(UPDATED_PAY_FROM)
            .payTo(UPDATED_PAY_TO)
            .status(UPDATED_STATUS)
            .totalGrossAmount(UPDATED_TOTAL_GROSS_AMOUNT)
            .totalNetAmount(UPDATED_TOTAL_NET_AMOUNT);
        return payRoll;
    }

    public static void deleteEntities(EntityManager em) {
        try {
            em.deleteAll(PayRoll.class).block();
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
        payRoll = createEntity(em);
    }

    @Test
    void createPayRoll() throws Exception {
        int databaseSizeBeforeCreate = payRollRepository.findAll().collectList().block().size();
        // Create the PayRoll
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(payRoll))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the PayRoll in the database
        List<PayRoll> payRollList = payRollRepository.findAll().collectList().block();
        assertThat(payRollList).hasSize(databaseSizeBeforeCreate + 1);
        PayRoll testPayRoll = payRollList.get(payRollList.size() - 1);
        assertThat(testPayRoll.getOrganizationId()).isEqualTo(DEFAULT_ORGANIZATION_ID);
        assertThat(testPayRoll.getPayFrom()).isEqualTo(DEFAULT_PAY_FROM);
        assertThat(testPayRoll.getPayTo()).isEqualTo(DEFAULT_PAY_TO);
        assertThat(testPayRoll.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testPayRoll.getTotalGrossAmount()).isEqualTo(DEFAULT_TOTAL_GROSS_AMOUNT);
        assertThat(testPayRoll.getTotalNetAmount()).isEqualTo(DEFAULT_TOTAL_NET_AMOUNT);
    }

    @Test
    void createPayRollWithExistingId() throws Exception {
        // Create the PayRoll with an existing ID
        payRoll.setId(1L);

        int databaseSizeBeforeCreate = payRollRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(payRoll))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the PayRoll in the database
        List<PayRoll> payRollList = payRollRepository.findAll().collectList().block();
        assertThat(payRollList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void checkOrganizationIdIsRequired() throws Exception {
        int databaseSizeBeforeTest = payRollRepository.findAll().collectList().block().size();
        // set the field null
        payRoll.setOrganizationId(null);

        // Create the PayRoll, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(payRoll))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<PayRoll> payRollList = payRollRepository.findAll().collectList().block();
        assertThat(payRollList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkPayFromIsRequired() throws Exception {
        int databaseSizeBeforeTest = payRollRepository.findAll().collectList().block().size();
        // set the field null
        payRoll.setPayFrom(null);

        // Create the PayRoll, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(payRoll))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<PayRoll> payRollList = payRollRepository.findAll().collectList().block();
        assertThat(payRollList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkPayToIsRequired() throws Exception {
        int databaseSizeBeforeTest = payRollRepository.findAll().collectList().block().size();
        // set the field null
        payRoll.setPayTo(null);

        // Create the PayRoll, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(payRoll))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<PayRoll> payRollList = payRollRepository.findAll().collectList().block();
        assertThat(payRollList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkStatusIsRequired() throws Exception {
        int databaseSizeBeforeTest = payRollRepository.findAll().collectList().block().size();
        // set the field null
        payRoll.setStatus(null);

        // Create the PayRoll, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(payRoll))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<PayRoll> payRollList = payRollRepository.findAll().collectList().block();
        assertThat(payRollList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkTotalGrossAmountIsRequired() throws Exception {
        int databaseSizeBeforeTest = payRollRepository.findAll().collectList().block().size();
        // set the field null
        payRoll.setTotalGrossAmount(null);

        // Create the PayRoll, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(payRoll))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<PayRoll> payRollList = payRollRepository.findAll().collectList().block();
        assertThat(payRollList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkTotalNetAmountIsRequired() throws Exception {
        int databaseSizeBeforeTest = payRollRepository.findAll().collectList().block().size();
        // set the field null
        payRoll.setTotalNetAmount(null);

        // Create the PayRoll, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(payRoll))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<PayRoll> payRollList = payRollRepository.findAll().collectList().block();
        assertThat(payRollList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void getAllPayRollsAsStream() {
        // Initialize the database
        payRollRepository.save(payRoll).block();

        List<PayRoll> payRollList = webTestClient
            .get()
            .uri(ENTITY_API_URL)
            .accept(MediaType.APPLICATION_NDJSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentTypeCompatibleWith(MediaType.APPLICATION_NDJSON)
            .returnResult(PayRoll.class)
            .getResponseBody()
            .filter(payRoll::equals)
            .collectList()
            .block(Duration.ofSeconds(5));

        assertThat(payRollList).isNotNull();
        assertThat(payRollList).hasSize(1);
        PayRoll testPayRoll = payRollList.get(0);
        assertThat(testPayRoll.getOrganizationId()).isEqualTo(DEFAULT_ORGANIZATION_ID);
        assertThat(testPayRoll.getPayFrom()).isEqualTo(DEFAULT_PAY_FROM);
        assertThat(testPayRoll.getPayTo()).isEqualTo(DEFAULT_PAY_TO);
        assertThat(testPayRoll.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testPayRoll.getTotalGrossAmount()).isEqualTo(DEFAULT_TOTAL_GROSS_AMOUNT);
        assertThat(testPayRoll.getTotalNetAmount()).isEqualTo(DEFAULT_TOTAL_NET_AMOUNT);
    }

    @Test
    void getAllPayRolls() {
        // Initialize the database
        payRollRepository.save(payRoll).block();

        // Get all the payRollList
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
            .value(hasItem(payRoll.getId().intValue()))
            .jsonPath("$.[*].organizationId")
            .value(hasItem(DEFAULT_ORGANIZATION_ID.intValue()))
            .jsonPath("$.[*].payFrom")
            .value(hasItem(DEFAULT_PAY_FROM.toString()))
            .jsonPath("$.[*].payTo")
            .value(hasItem(DEFAULT_PAY_TO.toString()))
            .jsonPath("$.[*].status")
            .value(hasItem(DEFAULT_STATUS.toString()))
            .jsonPath("$.[*].totalGrossAmount")
            .value(hasItem(DEFAULT_TOTAL_GROSS_AMOUNT.doubleValue()))
            .jsonPath("$.[*].totalNetAmount")
            .value(hasItem(DEFAULT_TOTAL_NET_AMOUNT.doubleValue()));
    }

    @Test
    void getPayRoll() {
        // Initialize the database
        payRollRepository.save(payRoll).block();

        // Get the payRoll
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, payRoll.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(payRoll.getId().intValue()))
            .jsonPath("$.organizationId")
            .value(is(DEFAULT_ORGANIZATION_ID.intValue()))
            .jsonPath("$.payFrom")
            .value(is(DEFAULT_PAY_FROM.toString()))
            .jsonPath("$.payTo")
            .value(is(DEFAULT_PAY_TO.toString()))
            .jsonPath("$.status")
            .value(is(DEFAULT_STATUS.toString()))
            .jsonPath("$.totalGrossAmount")
            .value(is(DEFAULT_TOTAL_GROSS_AMOUNT.doubleValue()))
            .jsonPath("$.totalNetAmount")
            .value(is(DEFAULT_TOTAL_NET_AMOUNT.doubleValue()));
    }

    @Test
    void getNonExistingPayRoll() {
        // Get the payRoll
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putExistingPayRoll() throws Exception {
        // Initialize the database
        payRollRepository.save(payRoll).block();

        int databaseSizeBeforeUpdate = payRollRepository.findAll().collectList().block().size();

        // Update the payRoll
        PayRoll updatedPayRoll = payRollRepository.findById(payRoll.getId()).block();
        updatedPayRoll
            .organizationId(UPDATED_ORGANIZATION_ID)
            .payFrom(UPDATED_PAY_FROM)
            .payTo(UPDATED_PAY_TO)
            .status(UPDATED_STATUS)
            .totalGrossAmount(UPDATED_TOTAL_GROSS_AMOUNT)
            .totalNetAmount(UPDATED_TOTAL_NET_AMOUNT);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, updatedPayRoll.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(updatedPayRoll))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the PayRoll in the database
        List<PayRoll> payRollList = payRollRepository.findAll().collectList().block();
        assertThat(payRollList).hasSize(databaseSizeBeforeUpdate);
        PayRoll testPayRoll = payRollList.get(payRollList.size() - 1);
        assertThat(testPayRoll.getOrganizationId()).isEqualTo(UPDATED_ORGANIZATION_ID);
        assertThat(testPayRoll.getPayFrom()).isEqualTo(UPDATED_PAY_FROM);
        assertThat(testPayRoll.getPayTo()).isEqualTo(UPDATED_PAY_TO);
        assertThat(testPayRoll.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testPayRoll.getTotalGrossAmount()).isEqualTo(UPDATED_TOTAL_GROSS_AMOUNT);
        assertThat(testPayRoll.getTotalNetAmount()).isEqualTo(UPDATED_TOTAL_NET_AMOUNT);
    }

    @Test
    void putNonExistingPayRoll() throws Exception {
        int databaseSizeBeforeUpdate = payRollRepository.findAll().collectList().block().size();
        payRoll.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, payRoll.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(payRoll))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the PayRoll in the database
        List<PayRoll> payRollList = payRollRepository.findAll().collectList().block();
        assertThat(payRollList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchPayRoll() throws Exception {
        int databaseSizeBeforeUpdate = payRollRepository.findAll().collectList().block().size();
        payRoll.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(payRoll))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the PayRoll in the database
        List<PayRoll> payRollList = payRollRepository.findAll().collectList().block();
        assertThat(payRollList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamPayRoll() throws Exception {
        int databaseSizeBeforeUpdate = payRollRepository.findAll().collectList().block().size();
        payRoll.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(payRoll))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the PayRoll in the database
        List<PayRoll> payRollList = payRollRepository.findAll().collectList().block();
        assertThat(payRollList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdatePayRollWithPatch() throws Exception {
        // Initialize the database
        payRollRepository.save(payRoll).block();

        int databaseSizeBeforeUpdate = payRollRepository.findAll().collectList().block().size();

        // Update the payRoll using partial update
        PayRoll partialUpdatedPayRoll = new PayRoll();
        partialUpdatedPayRoll.setId(payRoll.getId());

        partialUpdatedPayRoll.payFrom(UPDATED_PAY_FROM).payTo(UPDATED_PAY_TO).totalGrossAmount(UPDATED_TOTAL_GROSS_AMOUNT);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedPayRoll.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedPayRoll))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the PayRoll in the database
        List<PayRoll> payRollList = payRollRepository.findAll().collectList().block();
        assertThat(payRollList).hasSize(databaseSizeBeforeUpdate);
        PayRoll testPayRoll = payRollList.get(payRollList.size() - 1);
        assertThat(testPayRoll.getOrganizationId()).isEqualTo(DEFAULT_ORGANIZATION_ID);
        assertThat(testPayRoll.getPayFrom()).isEqualTo(UPDATED_PAY_FROM);
        assertThat(testPayRoll.getPayTo()).isEqualTo(UPDATED_PAY_TO);
        assertThat(testPayRoll.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testPayRoll.getTotalGrossAmount()).isEqualTo(UPDATED_TOTAL_GROSS_AMOUNT);
        assertThat(testPayRoll.getTotalNetAmount()).isEqualTo(DEFAULT_TOTAL_NET_AMOUNT);
    }

    @Test
    void fullUpdatePayRollWithPatch() throws Exception {
        // Initialize the database
        payRollRepository.save(payRoll).block();

        int databaseSizeBeforeUpdate = payRollRepository.findAll().collectList().block().size();

        // Update the payRoll using partial update
        PayRoll partialUpdatedPayRoll = new PayRoll();
        partialUpdatedPayRoll.setId(payRoll.getId());

        partialUpdatedPayRoll
            .organizationId(UPDATED_ORGANIZATION_ID)
            .payFrom(UPDATED_PAY_FROM)
            .payTo(UPDATED_PAY_TO)
            .status(UPDATED_STATUS)
            .totalGrossAmount(UPDATED_TOTAL_GROSS_AMOUNT)
            .totalNetAmount(UPDATED_TOTAL_NET_AMOUNT);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedPayRoll.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedPayRoll))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the PayRoll in the database
        List<PayRoll> payRollList = payRollRepository.findAll().collectList().block();
        assertThat(payRollList).hasSize(databaseSizeBeforeUpdate);
        PayRoll testPayRoll = payRollList.get(payRollList.size() - 1);
        assertThat(testPayRoll.getOrganizationId()).isEqualTo(UPDATED_ORGANIZATION_ID);
        assertThat(testPayRoll.getPayFrom()).isEqualTo(UPDATED_PAY_FROM);
        assertThat(testPayRoll.getPayTo()).isEqualTo(UPDATED_PAY_TO);
        assertThat(testPayRoll.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testPayRoll.getTotalGrossAmount()).isEqualTo(UPDATED_TOTAL_GROSS_AMOUNT);
        assertThat(testPayRoll.getTotalNetAmount()).isEqualTo(UPDATED_TOTAL_NET_AMOUNT);
    }

    @Test
    void patchNonExistingPayRoll() throws Exception {
        int databaseSizeBeforeUpdate = payRollRepository.findAll().collectList().block().size();
        payRoll.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, payRoll.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(payRoll))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the PayRoll in the database
        List<PayRoll> payRollList = payRollRepository.findAll().collectList().block();
        assertThat(payRollList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchPayRoll() throws Exception {
        int databaseSizeBeforeUpdate = payRollRepository.findAll().collectList().block().size();
        payRoll.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(payRoll))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the PayRoll in the database
        List<PayRoll> payRollList = payRollRepository.findAll().collectList().block();
        assertThat(payRollList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamPayRoll() throws Exception {
        int databaseSizeBeforeUpdate = payRollRepository.findAll().collectList().block().size();
        payRoll.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(payRoll))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the PayRoll in the database
        List<PayRoll> payRollList = payRollRepository.findAll().collectList().block();
        assertThat(payRollList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deletePayRoll() {
        // Initialize the database
        payRollRepository.save(payRoll).block();

        int databaseSizeBeforeDelete = payRollRepository.findAll().collectList().block().size();

        // Delete the payRoll
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, payRoll.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<PayRoll> payRollList = payRollRepository.findAll().collectList().block();
        assertThat(payRollList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
