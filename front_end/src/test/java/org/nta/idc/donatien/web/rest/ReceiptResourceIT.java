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
import org.nta.idc.donatien.domain.Receipt;
import org.nta.idc.donatien.repository.EntityManager;
import org.nta.idc.donatien.repository.ReceiptRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.reactive.server.WebTestClient;

/**
 * Integration tests for the {@link ReceiptResource} REST controller.
 */
@IntegrationTest
@AutoConfigureWebTestClient(timeout = IntegrationTest.DEFAULT_ENTITY_TIMEOUT)
@WithMockUser
class ReceiptResourceIT {

    private static final Long DEFAULT_INVOICE_ID = 1L;
    private static final Long UPDATED_INVOICE_ID = 2L;

    private static final Double DEFAULT_TOTAL_COST = 1D;
    private static final Double UPDATED_TOTAL_COST = 2D;

    private static final Double DEFAULT_TOTAL_PAID = 1D;
    private static final Double UPDATED_TOTAL_PAID = 2D;

    private static final Double DEFAULT_BALANCE = 1D;
    private static final Double UPDATED_BALANCE = 2D;

    private static final ZonedDateTime DEFAULT_PAYMENT_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_PAYMENT_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_RECEIVED_BY_NAMES = "AAAAAAAAAA";
    private static final String UPDATED_RECEIVED_BY_NAMES = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/receipts";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ReceiptRepository receiptRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private WebTestClient webTestClient;

    private Receipt receipt;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Receipt createEntity(EntityManager em) {
        Receipt receipt = new Receipt()
            .invoiceId(DEFAULT_INVOICE_ID)
            .totalCost(DEFAULT_TOTAL_COST)
            .totalPaid(DEFAULT_TOTAL_PAID)
            .balance(DEFAULT_BALANCE)
            .paymentDate(DEFAULT_PAYMENT_DATE)
            .receivedByNames(DEFAULT_RECEIVED_BY_NAMES);
        return receipt;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Receipt createUpdatedEntity(EntityManager em) {
        Receipt receipt = new Receipt()
            .invoiceId(UPDATED_INVOICE_ID)
            .totalCost(UPDATED_TOTAL_COST)
            .totalPaid(UPDATED_TOTAL_PAID)
            .balance(UPDATED_BALANCE)
            .paymentDate(UPDATED_PAYMENT_DATE)
            .receivedByNames(UPDATED_RECEIVED_BY_NAMES);
        return receipt;
    }

    public static void deleteEntities(EntityManager em) {
        try {
            em.deleteAll(Receipt.class).block();
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
        receipt = createEntity(em);
    }

    @Test
    void createReceipt() throws Exception {
        int databaseSizeBeforeCreate = receiptRepository.findAll().collectList().block().size();
        // Create the Receipt
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(receipt))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the Receipt in the database
        List<Receipt> receiptList = receiptRepository.findAll().collectList().block();
        assertThat(receiptList).hasSize(databaseSizeBeforeCreate + 1);
        Receipt testReceipt = receiptList.get(receiptList.size() - 1);
        assertThat(testReceipt.getInvoiceId()).isEqualTo(DEFAULT_INVOICE_ID);
        assertThat(testReceipt.getTotalCost()).isEqualTo(DEFAULT_TOTAL_COST);
        assertThat(testReceipt.getTotalPaid()).isEqualTo(DEFAULT_TOTAL_PAID);
        assertThat(testReceipt.getBalance()).isEqualTo(DEFAULT_BALANCE);
        assertThat(testReceipt.getPaymentDate()).isEqualTo(DEFAULT_PAYMENT_DATE);
        assertThat(testReceipt.getReceivedByNames()).isEqualTo(DEFAULT_RECEIVED_BY_NAMES);
    }

    @Test
    void createReceiptWithExistingId() throws Exception {
        // Create the Receipt with an existing ID
        receipt.setId(1L);

        int databaseSizeBeforeCreate = receiptRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(receipt))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Receipt in the database
        List<Receipt> receiptList = receiptRepository.findAll().collectList().block();
        assertThat(receiptList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void checkInvoiceIdIsRequired() throws Exception {
        int databaseSizeBeforeTest = receiptRepository.findAll().collectList().block().size();
        // set the field null
        receipt.setInvoiceId(null);

        // Create the Receipt, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(receipt))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Receipt> receiptList = receiptRepository.findAll().collectList().block();
        assertThat(receiptList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkTotalCostIsRequired() throws Exception {
        int databaseSizeBeforeTest = receiptRepository.findAll().collectList().block().size();
        // set the field null
        receipt.setTotalCost(null);

        // Create the Receipt, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(receipt))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Receipt> receiptList = receiptRepository.findAll().collectList().block();
        assertThat(receiptList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkTotalPaidIsRequired() throws Exception {
        int databaseSizeBeforeTest = receiptRepository.findAll().collectList().block().size();
        // set the field null
        receipt.setTotalPaid(null);

        // Create the Receipt, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(receipt))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Receipt> receiptList = receiptRepository.findAll().collectList().block();
        assertThat(receiptList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkBalanceIsRequired() throws Exception {
        int databaseSizeBeforeTest = receiptRepository.findAll().collectList().block().size();
        // set the field null
        receipt.setBalance(null);

        // Create the Receipt, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(receipt))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Receipt> receiptList = receiptRepository.findAll().collectList().block();
        assertThat(receiptList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkPaymentDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = receiptRepository.findAll().collectList().block().size();
        // set the field null
        receipt.setPaymentDate(null);

        // Create the Receipt, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(receipt))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Receipt> receiptList = receiptRepository.findAll().collectList().block();
        assertThat(receiptList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkReceivedByNamesIsRequired() throws Exception {
        int databaseSizeBeforeTest = receiptRepository.findAll().collectList().block().size();
        // set the field null
        receipt.setReceivedByNames(null);

        // Create the Receipt, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(receipt))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Receipt> receiptList = receiptRepository.findAll().collectList().block();
        assertThat(receiptList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void getAllReceiptsAsStream() {
        // Initialize the database
        receiptRepository.save(receipt).block();

        List<Receipt> receiptList = webTestClient
            .get()
            .uri(ENTITY_API_URL)
            .accept(MediaType.APPLICATION_NDJSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentTypeCompatibleWith(MediaType.APPLICATION_NDJSON)
            .returnResult(Receipt.class)
            .getResponseBody()
            .filter(receipt::equals)
            .collectList()
            .block(Duration.ofSeconds(5));

        assertThat(receiptList).isNotNull();
        assertThat(receiptList).hasSize(1);
        Receipt testReceipt = receiptList.get(0);
        assertThat(testReceipt.getInvoiceId()).isEqualTo(DEFAULT_INVOICE_ID);
        assertThat(testReceipt.getTotalCost()).isEqualTo(DEFAULT_TOTAL_COST);
        assertThat(testReceipt.getTotalPaid()).isEqualTo(DEFAULT_TOTAL_PAID);
        assertThat(testReceipt.getBalance()).isEqualTo(DEFAULT_BALANCE);
        assertThat(testReceipt.getPaymentDate()).isEqualTo(DEFAULT_PAYMENT_DATE);
        assertThat(testReceipt.getReceivedByNames()).isEqualTo(DEFAULT_RECEIVED_BY_NAMES);
    }

    @Test
    void getAllReceipts() {
        // Initialize the database
        receiptRepository.save(receipt).block();

        // Get all the receiptList
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
            .value(hasItem(receipt.getId().intValue()))
            .jsonPath("$.[*].invoiceId")
            .value(hasItem(DEFAULT_INVOICE_ID.intValue()))
            .jsonPath("$.[*].totalCost")
            .value(hasItem(DEFAULT_TOTAL_COST.doubleValue()))
            .jsonPath("$.[*].totalPaid")
            .value(hasItem(DEFAULT_TOTAL_PAID.doubleValue()))
            .jsonPath("$.[*].balance")
            .value(hasItem(DEFAULT_BALANCE.doubleValue()))
            .jsonPath("$.[*].paymentDate")
            .value(hasItem(sameInstant(DEFAULT_PAYMENT_DATE)))
            .jsonPath("$.[*].receivedByNames")
            .value(hasItem(DEFAULT_RECEIVED_BY_NAMES));
    }

    @Test
    void getReceipt() {
        // Initialize the database
        receiptRepository.save(receipt).block();

        // Get the receipt
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, receipt.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(receipt.getId().intValue()))
            .jsonPath("$.invoiceId")
            .value(is(DEFAULT_INVOICE_ID.intValue()))
            .jsonPath("$.totalCost")
            .value(is(DEFAULT_TOTAL_COST.doubleValue()))
            .jsonPath("$.totalPaid")
            .value(is(DEFAULT_TOTAL_PAID.doubleValue()))
            .jsonPath("$.balance")
            .value(is(DEFAULT_BALANCE.doubleValue()))
            .jsonPath("$.paymentDate")
            .value(is(sameInstant(DEFAULT_PAYMENT_DATE)))
            .jsonPath("$.receivedByNames")
            .value(is(DEFAULT_RECEIVED_BY_NAMES));
    }

    @Test
    void getNonExistingReceipt() {
        // Get the receipt
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putExistingReceipt() throws Exception {
        // Initialize the database
        receiptRepository.save(receipt).block();

        int databaseSizeBeforeUpdate = receiptRepository.findAll().collectList().block().size();

        // Update the receipt
        Receipt updatedReceipt = receiptRepository.findById(receipt.getId()).block();
        updatedReceipt
            .invoiceId(UPDATED_INVOICE_ID)
            .totalCost(UPDATED_TOTAL_COST)
            .totalPaid(UPDATED_TOTAL_PAID)
            .balance(UPDATED_BALANCE)
            .paymentDate(UPDATED_PAYMENT_DATE)
            .receivedByNames(UPDATED_RECEIVED_BY_NAMES);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, updatedReceipt.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(updatedReceipt))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Receipt in the database
        List<Receipt> receiptList = receiptRepository.findAll().collectList().block();
        assertThat(receiptList).hasSize(databaseSizeBeforeUpdate);
        Receipt testReceipt = receiptList.get(receiptList.size() - 1);
        assertThat(testReceipt.getInvoiceId()).isEqualTo(UPDATED_INVOICE_ID);
        assertThat(testReceipt.getTotalCost()).isEqualTo(UPDATED_TOTAL_COST);
        assertThat(testReceipt.getTotalPaid()).isEqualTo(UPDATED_TOTAL_PAID);
        assertThat(testReceipt.getBalance()).isEqualTo(UPDATED_BALANCE);
        assertThat(testReceipt.getPaymentDate()).isEqualTo(UPDATED_PAYMENT_DATE);
        assertThat(testReceipt.getReceivedByNames()).isEqualTo(UPDATED_RECEIVED_BY_NAMES);
    }

    @Test
    void putNonExistingReceipt() throws Exception {
        int databaseSizeBeforeUpdate = receiptRepository.findAll().collectList().block().size();
        receipt.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, receipt.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(receipt))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Receipt in the database
        List<Receipt> receiptList = receiptRepository.findAll().collectList().block();
        assertThat(receiptList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchReceipt() throws Exception {
        int databaseSizeBeforeUpdate = receiptRepository.findAll().collectList().block().size();
        receipt.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(receipt))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Receipt in the database
        List<Receipt> receiptList = receiptRepository.findAll().collectList().block();
        assertThat(receiptList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamReceipt() throws Exception {
        int databaseSizeBeforeUpdate = receiptRepository.findAll().collectList().block().size();
        receipt.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(receipt))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Receipt in the database
        List<Receipt> receiptList = receiptRepository.findAll().collectList().block();
        assertThat(receiptList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateReceiptWithPatch() throws Exception {
        // Initialize the database
        receiptRepository.save(receipt).block();

        int databaseSizeBeforeUpdate = receiptRepository.findAll().collectList().block().size();

        // Update the receipt using partial update
        Receipt partialUpdatedReceipt = new Receipt();
        partialUpdatedReceipt.setId(receipt.getId());

        partialUpdatedReceipt
            .invoiceId(UPDATED_INVOICE_ID)
            .totalPaid(UPDATED_TOTAL_PAID)
            .balance(UPDATED_BALANCE)
            .paymentDate(UPDATED_PAYMENT_DATE)
            .receivedByNames(UPDATED_RECEIVED_BY_NAMES);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedReceipt.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedReceipt))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Receipt in the database
        List<Receipt> receiptList = receiptRepository.findAll().collectList().block();
        assertThat(receiptList).hasSize(databaseSizeBeforeUpdate);
        Receipt testReceipt = receiptList.get(receiptList.size() - 1);
        assertThat(testReceipt.getInvoiceId()).isEqualTo(UPDATED_INVOICE_ID);
        assertThat(testReceipt.getTotalCost()).isEqualTo(DEFAULT_TOTAL_COST);
        assertThat(testReceipt.getTotalPaid()).isEqualTo(UPDATED_TOTAL_PAID);
        assertThat(testReceipt.getBalance()).isEqualTo(UPDATED_BALANCE);
        assertThat(testReceipt.getPaymentDate()).isEqualTo(UPDATED_PAYMENT_DATE);
        assertThat(testReceipt.getReceivedByNames()).isEqualTo(UPDATED_RECEIVED_BY_NAMES);
    }

    @Test
    void fullUpdateReceiptWithPatch() throws Exception {
        // Initialize the database
        receiptRepository.save(receipt).block();

        int databaseSizeBeforeUpdate = receiptRepository.findAll().collectList().block().size();

        // Update the receipt using partial update
        Receipt partialUpdatedReceipt = new Receipt();
        partialUpdatedReceipt.setId(receipt.getId());

        partialUpdatedReceipt
            .invoiceId(UPDATED_INVOICE_ID)
            .totalCost(UPDATED_TOTAL_COST)
            .totalPaid(UPDATED_TOTAL_PAID)
            .balance(UPDATED_BALANCE)
            .paymentDate(UPDATED_PAYMENT_DATE)
            .receivedByNames(UPDATED_RECEIVED_BY_NAMES);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedReceipt.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedReceipt))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Receipt in the database
        List<Receipt> receiptList = receiptRepository.findAll().collectList().block();
        assertThat(receiptList).hasSize(databaseSizeBeforeUpdate);
        Receipt testReceipt = receiptList.get(receiptList.size() - 1);
        assertThat(testReceipt.getInvoiceId()).isEqualTo(UPDATED_INVOICE_ID);
        assertThat(testReceipt.getTotalCost()).isEqualTo(UPDATED_TOTAL_COST);
        assertThat(testReceipt.getTotalPaid()).isEqualTo(UPDATED_TOTAL_PAID);
        assertThat(testReceipt.getBalance()).isEqualTo(UPDATED_BALANCE);
        assertThat(testReceipt.getPaymentDate()).isEqualTo(UPDATED_PAYMENT_DATE);
        assertThat(testReceipt.getReceivedByNames()).isEqualTo(UPDATED_RECEIVED_BY_NAMES);
    }

    @Test
    void patchNonExistingReceipt() throws Exception {
        int databaseSizeBeforeUpdate = receiptRepository.findAll().collectList().block().size();
        receipt.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, receipt.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(receipt))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Receipt in the database
        List<Receipt> receiptList = receiptRepository.findAll().collectList().block();
        assertThat(receiptList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchReceipt() throws Exception {
        int databaseSizeBeforeUpdate = receiptRepository.findAll().collectList().block().size();
        receipt.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(receipt))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Receipt in the database
        List<Receipt> receiptList = receiptRepository.findAll().collectList().block();
        assertThat(receiptList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamReceipt() throws Exception {
        int databaseSizeBeforeUpdate = receiptRepository.findAll().collectList().block().size();
        receipt.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(receipt))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Receipt in the database
        List<Receipt> receiptList = receiptRepository.findAll().collectList().block();
        assertThat(receiptList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteReceipt() {
        // Initialize the database
        receiptRepository.save(receipt).block();

        int databaseSizeBeforeDelete = receiptRepository.findAll().collectList().block().size();

        // Delete the receipt
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, receipt.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<Receipt> receiptList = receiptRepository.findAll().collectList().block();
        assertThat(receiptList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
