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
import org.nta.idc.donatien.domain.Invoice;
import org.nta.idc.donatien.domain.enumeration.InvoicePaymentModes;
import org.nta.idc.donatien.domain.enumeration.InvoiceTypes;
import org.nta.idc.donatien.domain.enumeration.InvoicingStatuses;
import org.nta.idc.donatien.domain.enumeration.PaymentTypes;
import org.nta.idc.donatien.repository.EntityManager;
import org.nta.idc.donatien.repository.InvoiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.reactive.server.WebTestClient;

/**
 * Integration tests for the {@link InvoiceResource} REST controller.
 */
@IntegrationTest
@AutoConfigureWebTestClient(timeout = IntegrationTest.DEFAULT_ENTITY_TIMEOUT)
@WithMockUser
class InvoiceResourceIT {

    private static final String DEFAULT_INVOICE_NUMBER = "AAAAAAAAAA";
    private static final String UPDATED_INVOICE_NUMBER = "BBBBBBBBBB";

    private static final Long DEFAULT_TOTAL_JOB_CARDS = 1L;
    private static final Long UPDATED_TOTAL_JOB_CARDS = 2L;

    private static final Double DEFAULT_TOTAL_COST = 1D;
    private static final Double UPDATED_TOTAL_COST = 2D;

    private static final InvoicePaymentModes DEFAULT_PAYMENT_MODE = InvoicePaymentModes.MOBILE_MONEY;
    private static final InvoicePaymentModes UPDATED_PAYMENT_MODE = InvoicePaymentModes.BANK_TRANSFER;

    private static final PaymentTypes DEFAULT_PAYMENT_TYPE = PaymentTypes.INSTANT;
    private static final PaymentTypes UPDATED_PAYMENT_TYPE = PaymentTypes.CREDIT;

    private static final InvoiceTypes DEFAULT_INVOICE_TYPE = InvoiceTypes.PURCHASE;
    private static final InvoiceTypes UPDATED_INVOICE_TYPE = InvoiceTypes.SALES;

    private static final InvoicingStatuses DEFAULT_STATUS = InvoicingStatuses.INITIAL;
    private static final InvoicingStatuses UPDATED_STATUS = InvoicingStatuses.CANCELED;

    private static final Long DEFAULT_RECEPTION_ORDER_ID = 1L;
    private static final Long UPDATED_RECEPTION_ORDER_ID = 2L;

    private static final ZonedDateTime DEFAULT_INVOICED_ON = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_INVOICED_ON = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_DUE_ON = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DUE_ON = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final Long DEFAULT_FROM_ORGANIZATION_ID = 1L;
    private static final Long UPDATED_FROM_ORGANIZATION_ID = 2L;

    private static final String ENTITY_API_URL = "/api/invoices";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private WebTestClient webTestClient;

    private Invoice invoice;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Invoice createEntity(EntityManager em) {
        Invoice invoice = new Invoice()
            .invoiceNumber(DEFAULT_INVOICE_NUMBER)
            .totalJobCards(DEFAULT_TOTAL_JOB_CARDS)
            .totalCost(DEFAULT_TOTAL_COST)
            .paymentMode(DEFAULT_PAYMENT_MODE)
            .paymentType(DEFAULT_PAYMENT_TYPE)
            .invoiceType(DEFAULT_INVOICE_TYPE)
            .status(DEFAULT_STATUS)
            .receptionOrderId(DEFAULT_RECEPTION_ORDER_ID)
            .invoicedOn(DEFAULT_INVOICED_ON)
            .dueOn(DEFAULT_DUE_ON)
            .fromOrganizationId(DEFAULT_FROM_ORGANIZATION_ID);
        return invoice;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Invoice createUpdatedEntity(EntityManager em) {
        Invoice invoice = new Invoice()
            .invoiceNumber(UPDATED_INVOICE_NUMBER)
            .totalJobCards(UPDATED_TOTAL_JOB_CARDS)
            .totalCost(UPDATED_TOTAL_COST)
            .paymentMode(UPDATED_PAYMENT_MODE)
            .paymentType(UPDATED_PAYMENT_TYPE)
            .invoiceType(UPDATED_INVOICE_TYPE)
            .status(UPDATED_STATUS)
            .receptionOrderId(UPDATED_RECEPTION_ORDER_ID)
            .invoicedOn(UPDATED_INVOICED_ON)
            .dueOn(UPDATED_DUE_ON)
            .fromOrganizationId(UPDATED_FROM_ORGANIZATION_ID);
        return invoice;
    }

    public static void deleteEntities(EntityManager em) {
        try {
            em.deleteAll(Invoice.class).block();
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
        invoice = createEntity(em);
    }

    @Test
    void createInvoice() throws Exception {
        int databaseSizeBeforeCreate = invoiceRepository.findAll().collectList().block().size();
        // Create the Invoice
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(invoice))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the Invoice in the database
        List<Invoice> invoiceList = invoiceRepository.findAll().collectList().block();
        assertThat(invoiceList).hasSize(databaseSizeBeforeCreate + 1);
        Invoice testInvoice = invoiceList.get(invoiceList.size() - 1);
        assertThat(testInvoice.getInvoiceNumber()).isEqualTo(DEFAULT_INVOICE_NUMBER);
        assertThat(testInvoice.getTotalJobCards()).isEqualTo(DEFAULT_TOTAL_JOB_CARDS);
        assertThat(testInvoice.getTotalCost()).isEqualTo(DEFAULT_TOTAL_COST);
        assertThat(testInvoice.getPaymentMode()).isEqualTo(DEFAULT_PAYMENT_MODE);
        assertThat(testInvoice.getPaymentType()).isEqualTo(DEFAULT_PAYMENT_TYPE);
        assertThat(testInvoice.getInvoiceType()).isEqualTo(DEFAULT_INVOICE_TYPE);
        assertThat(testInvoice.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testInvoice.getReceptionOrderId()).isEqualTo(DEFAULT_RECEPTION_ORDER_ID);
        assertThat(testInvoice.getInvoicedOn()).isEqualTo(DEFAULT_INVOICED_ON);
        assertThat(testInvoice.getDueOn()).isEqualTo(DEFAULT_DUE_ON);
        assertThat(testInvoice.getFromOrganizationId()).isEqualTo(DEFAULT_FROM_ORGANIZATION_ID);
    }

    @Test
    void createInvoiceWithExistingId() throws Exception {
        // Create the Invoice with an existing ID
        invoice.setId(1L);

        int databaseSizeBeforeCreate = invoiceRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(invoice))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Invoice in the database
        List<Invoice> invoiceList = invoiceRepository.findAll().collectList().block();
        assertThat(invoiceList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void checkInvoiceNumberIsRequired() throws Exception {
        int databaseSizeBeforeTest = invoiceRepository.findAll().collectList().block().size();
        // set the field null
        invoice.setInvoiceNumber(null);

        // Create the Invoice, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(invoice))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Invoice> invoiceList = invoiceRepository.findAll().collectList().block();
        assertThat(invoiceList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkTotalCostIsRequired() throws Exception {
        int databaseSizeBeforeTest = invoiceRepository.findAll().collectList().block().size();
        // set the field null
        invoice.setTotalCost(null);

        // Create the Invoice, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(invoice))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Invoice> invoiceList = invoiceRepository.findAll().collectList().block();
        assertThat(invoiceList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkPaymentModeIsRequired() throws Exception {
        int databaseSizeBeforeTest = invoiceRepository.findAll().collectList().block().size();
        // set the field null
        invoice.setPaymentMode(null);

        // Create the Invoice, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(invoice))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Invoice> invoiceList = invoiceRepository.findAll().collectList().block();
        assertThat(invoiceList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkPaymentTypeIsRequired() throws Exception {
        int databaseSizeBeforeTest = invoiceRepository.findAll().collectList().block().size();
        // set the field null
        invoice.setPaymentType(null);

        // Create the Invoice, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(invoice))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Invoice> invoiceList = invoiceRepository.findAll().collectList().block();
        assertThat(invoiceList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkInvoiceTypeIsRequired() throws Exception {
        int databaseSizeBeforeTest = invoiceRepository.findAll().collectList().block().size();
        // set the field null
        invoice.setInvoiceType(null);

        // Create the Invoice, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(invoice))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Invoice> invoiceList = invoiceRepository.findAll().collectList().block();
        assertThat(invoiceList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkStatusIsRequired() throws Exception {
        int databaseSizeBeforeTest = invoiceRepository.findAll().collectList().block().size();
        // set the field null
        invoice.setStatus(null);

        // Create the Invoice, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(invoice))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Invoice> invoiceList = invoiceRepository.findAll().collectList().block();
        assertThat(invoiceList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkReceptionOrderIdIsRequired() throws Exception {
        int databaseSizeBeforeTest = invoiceRepository.findAll().collectList().block().size();
        // set the field null
        invoice.setReceptionOrderId(null);

        // Create the Invoice, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(invoice))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Invoice> invoiceList = invoiceRepository.findAll().collectList().block();
        assertThat(invoiceList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkFromOrganizationIdIsRequired() throws Exception {
        int databaseSizeBeforeTest = invoiceRepository.findAll().collectList().block().size();
        // set the field null
        invoice.setFromOrganizationId(null);

        // Create the Invoice, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(invoice))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Invoice> invoiceList = invoiceRepository.findAll().collectList().block();
        assertThat(invoiceList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void getAllInvoicesAsStream() {
        // Initialize the database
        invoiceRepository.save(invoice).block();

        List<Invoice> invoiceList = webTestClient
            .get()
            .uri(ENTITY_API_URL)
            .accept(MediaType.APPLICATION_NDJSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentTypeCompatibleWith(MediaType.APPLICATION_NDJSON)
            .returnResult(Invoice.class)
            .getResponseBody()
            .filter(invoice::equals)
            .collectList()
            .block(Duration.ofSeconds(5));

        assertThat(invoiceList).isNotNull();
        assertThat(invoiceList).hasSize(1);
        Invoice testInvoice = invoiceList.get(0);
        assertThat(testInvoice.getInvoiceNumber()).isEqualTo(DEFAULT_INVOICE_NUMBER);
        assertThat(testInvoice.getTotalJobCards()).isEqualTo(DEFAULT_TOTAL_JOB_CARDS);
        assertThat(testInvoice.getTotalCost()).isEqualTo(DEFAULT_TOTAL_COST);
        assertThat(testInvoice.getPaymentMode()).isEqualTo(DEFAULT_PAYMENT_MODE);
        assertThat(testInvoice.getPaymentType()).isEqualTo(DEFAULT_PAYMENT_TYPE);
        assertThat(testInvoice.getInvoiceType()).isEqualTo(DEFAULT_INVOICE_TYPE);
        assertThat(testInvoice.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testInvoice.getReceptionOrderId()).isEqualTo(DEFAULT_RECEPTION_ORDER_ID);
        assertThat(testInvoice.getInvoicedOn()).isEqualTo(DEFAULT_INVOICED_ON);
        assertThat(testInvoice.getDueOn()).isEqualTo(DEFAULT_DUE_ON);
        assertThat(testInvoice.getFromOrganizationId()).isEqualTo(DEFAULT_FROM_ORGANIZATION_ID);
    }

    @Test
    void getAllInvoices() {
        // Initialize the database
        invoiceRepository.save(invoice).block();

        // Get all the invoiceList
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
            .value(hasItem(invoice.getId().intValue()))
            .jsonPath("$.[*].invoiceNumber")
            .value(hasItem(DEFAULT_INVOICE_NUMBER))
            .jsonPath("$.[*].totalJobCards")
            .value(hasItem(DEFAULT_TOTAL_JOB_CARDS.intValue()))
            .jsonPath("$.[*].totalCost")
            .value(hasItem(DEFAULT_TOTAL_COST.doubleValue()))
            .jsonPath("$.[*].paymentMode")
            .value(hasItem(DEFAULT_PAYMENT_MODE.toString()))
            .jsonPath("$.[*].paymentType")
            .value(hasItem(DEFAULT_PAYMENT_TYPE.toString()))
            .jsonPath("$.[*].invoiceType")
            .value(hasItem(DEFAULT_INVOICE_TYPE.toString()))
            .jsonPath("$.[*].status")
            .value(hasItem(DEFAULT_STATUS.toString()))
            .jsonPath("$.[*].receptionOrderId")
            .value(hasItem(DEFAULT_RECEPTION_ORDER_ID.intValue()))
            .jsonPath("$.[*].invoicedOn")
            .value(hasItem(sameInstant(DEFAULT_INVOICED_ON)))
            .jsonPath("$.[*].dueOn")
            .value(hasItem(sameInstant(DEFAULT_DUE_ON)))
            .jsonPath("$.[*].fromOrganizationId")
            .value(hasItem(DEFAULT_FROM_ORGANIZATION_ID.intValue()));
    }

    @Test
    void getInvoice() {
        // Initialize the database
        invoiceRepository.save(invoice).block();

        // Get the invoice
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, invoice.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(invoice.getId().intValue()))
            .jsonPath("$.invoiceNumber")
            .value(is(DEFAULT_INVOICE_NUMBER))
            .jsonPath("$.totalJobCards")
            .value(is(DEFAULT_TOTAL_JOB_CARDS.intValue()))
            .jsonPath("$.totalCost")
            .value(is(DEFAULT_TOTAL_COST.doubleValue()))
            .jsonPath("$.paymentMode")
            .value(is(DEFAULT_PAYMENT_MODE.toString()))
            .jsonPath("$.paymentType")
            .value(is(DEFAULT_PAYMENT_TYPE.toString()))
            .jsonPath("$.invoiceType")
            .value(is(DEFAULT_INVOICE_TYPE.toString()))
            .jsonPath("$.status")
            .value(is(DEFAULT_STATUS.toString()))
            .jsonPath("$.receptionOrderId")
            .value(is(DEFAULT_RECEPTION_ORDER_ID.intValue()))
            .jsonPath("$.invoicedOn")
            .value(is(sameInstant(DEFAULT_INVOICED_ON)))
            .jsonPath("$.dueOn")
            .value(is(sameInstant(DEFAULT_DUE_ON)))
            .jsonPath("$.fromOrganizationId")
            .value(is(DEFAULT_FROM_ORGANIZATION_ID.intValue()));
    }

    @Test
    void getNonExistingInvoice() {
        // Get the invoice
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putExistingInvoice() throws Exception {
        // Initialize the database
        invoiceRepository.save(invoice).block();

        int databaseSizeBeforeUpdate = invoiceRepository.findAll().collectList().block().size();

        // Update the invoice
        Invoice updatedInvoice = invoiceRepository.findById(invoice.getId()).block();
        updatedInvoice
            .invoiceNumber(UPDATED_INVOICE_NUMBER)
            .totalJobCards(UPDATED_TOTAL_JOB_CARDS)
            .totalCost(UPDATED_TOTAL_COST)
            .paymentMode(UPDATED_PAYMENT_MODE)
            .paymentType(UPDATED_PAYMENT_TYPE)
            .invoiceType(UPDATED_INVOICE_TYPE)
            .status(UPDATED_STATUS)
            .receptionOrderId(UPDATED_RECEPTION_ORDER_ID)
            .invoicedOn(UPDATED_INVOICED_ON)
            .dueOn(UPDATED_DUE_ON)
            .fromOrganizationId(UPDATED_FROM_ORGANIZATION_ID);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, updatedInvoice.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(updatedInvoice))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Invoice in the database
        List<Invoice> invoiceList = invoiceRepository.findAll().collectList().block();
        assertThat(invoiceList).hasSize(databaseSizeBeforeUpdate);
        Invoice testInvoice = invoiceList.get(invoiceList.size() - 1);
        assertThat(testInvoice.getInvoiceNumber()).isEqualTo(UPDATED_INVOICE_NUMBER);
        assertThat(testInvoice.getTotalJobCards()).isEqualTo(UPDATED_TOTAL_JOB_CARDS);
        assertThat(testInvoice.getTotalCost()).isEqualTo(UPDATED_TOTAL_COST);
        assertThat(testInvoice.getPaymentMode()).isEqualTo(UPDATED_PAYMENT_MODE);
        assertThat(testInvoice.getPaymentType()).isEqualTo(UPDATED_PAYMENT_TYPE);
        assertThat(testInvoice.getInvoiceType()).isEqualTo(UPDATED_INVOICE_TYPE);
        assertThat(testInvoice.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testInvoice.getReceptionOrderId()).isEqualTo(UPDATED_RECEPTION_ORDER_ID);
        assertThat(testInvoice.getInvoicedOn()).isEqualTo(UPDATED_INVOICED_ON);
        assertThat(testInvoice.getDueOn()).isEqualTo(UPDATED_DUE_ON);
        assertThat(testInvoice.getFromOrganizationId()).isEqualTo(UPDATED_FROM_ORGANIZATION_ID);
    }

    @Test
    void putNonExistingInvoice() throws Exception {
        int databaseSizeBeforeUpdate = invoiceRepository.findAll().collectList().block().size();
        invoice.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, invoice.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(invoice))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Invoice in the database
        List<Invoice> invoiceList = invoiceRepository.findAll().collectList().block();
        assertThat(invoiceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchInvoice() throws Exception {
        int databaseSizeBeforeUpdate = invoiceRepository.findAll().collectList().block().size();
        invoice.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(invoice))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Invoice in the database
        List<Invoice> invoiceList = invoiceRepository.findAll().collectList().block();
        assertThat(invoiceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamInvoice() throws Exception {
        int databaseSizeBeforeUpdate = invoiceRepository.findAll().collectList().block().size();
        invoice.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(invoice))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Invoice in the database
        List<Invoice> invoiceList = invoiceRepository.findAll().collectList().block();
        assertThat(invoiceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateInvoiceWithPatch() throws Exception {
        // Initialize the database
        invoiceRepository.save(invoice).block();

        int databaseSizeBeforeUpdate = invoiceRepository.findAll().collectList().block().size();

        // Update the invoice using partial update
        Invoice partialUpdatedInvoice = new Invoice();
        partialUpdatedInvoice.setId(invoice.getId());

        partialUpdatedInvoice
            .totalCost(UPDATED_TOTAL_COST)
            .paymentMode(UPDATED_PAYMENT_MODE)
            .paymentType(UPDATED_PAYMENT_TYPE)
            .invoicedOn(UPDATED_INVOICED_ON)
            .dueOn(UPDATED_DUE_ON)
            .fromOrganizationId(UPDATED_FROM_ORGANIZATION_ID);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedInvoice.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedInvoice))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Invoice in the database
        List<Invoice> invoiceList = invoiceRepository.findAll().collectList().block();
        assertThat(invoiceList).hasSize(databaseSizeBeforeUpdate);
        Invoice testInvoice = invoiceList.get(invoiceList.size() - 1);
        assertThat(testInvoice.getInvoiceNumber()).isEqualTo(DEFAULT_INVOICE_NUMBER);
        assertThat(testInvoice.getTotalJobCards()).isEqualTo(DEFAULT_TOTAL_JOB_CARDS);
        assertThat(testInvoice.getTotalCost()).isEqualTo(UPDATED_TOTAL_COST);
        assertThat(testInvoice.getPaymentMode()).isEqualTo(UPDATED_PAYMENT_MODE);
        assertThat(testInvoice.getPaymentType()).isEqualTo(UPDATED_PAYMENT_TYPE);
        assertThat(testInvoice.getInvoiceType()).isEqualTo(DEFAULT_INVOICE_TYPE);
        assertThat(testInvoice.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testInvoice.getReceptionOrderId()).isEqualTo(DEFAULT_RECEPTION_ORDER_ID);
        assertThat(testInvoice.getInvoicedOn()).isEqualTo(UPDATED_INVOICED_ON);
        assertThat(testInvoice.getDueOn()).isEqualTo(UPDATED_DUE_ON);
        assertThat(testInvoice.getFromOrganizationId()).isEqualTo(UPDATED_FROM_ORGANIZATION_ID);
    }

    @Test
    void fullUpdateInvoiceWithPatch() throws Exception {
        // Initialize the database
        invoiceRepository.save(invoice).block();

        int databaseSizeBeforeUpdate = invoiceRepository.findAll().collectList().block().size();

        // Update the invoice using partial update
        Invoice partialUpdatedInvoice = new Invoice();
        partialUpdatedInvoice.setId(invoice.getId());

        partialUpdatedInvoice
            .invoiceNumber(UPDATED_INVOICE_NUMBER)
            .totalJobCards(UPDATED_TOTAL_JOB_CARDS)
            .totalCost(UPDATED_TOTAL_COST)
            .paymentMode(UPDATED_PAYMENT_MODE)
            .paymentType(UPDATED_PAYMENT_TYPE)
            .invoiceType(UPDATED_INVOICE_TYPE)
            .status(UPDATED_STATUS)
            .receptionOrderId(UPDATED_RECEPTION_ORDER_ID)
            .invoicedOn(UPDATED_INVOICED_ON)
            .dueOn(UPDATED_DUE_ON)
            .fromOrganizationId(UPDATED_FROM_ORGANIZATION_ID);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedInvoice.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedInvoice))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Invoice in the database
        List<Invoice> invoiceList = invoiceRepository.findAll().collectList().block();
        assertThat(invoiceList).hasSize(databaseSizeBeforeUpdate);
        Invoice testInvoice = invoiceList.get(invoiceList.size() - 1);
        assertThat(testInvoice.getInvoiceNumber()).isEqualTo(UPDATED_INVOICE_NUMBER);
        assertThat(testInvoice.getTotalJobCards()).isEqualTo(UPDATED_TOTAL_JOB_CARDS);
        assertThat(testInvoice.getTotalCost()).isEqualTo(UPDATED_TOTAL_COST);
        assertThat(testInvoice.getPaymentMode()).isEqualTo(UPDATED_PAYMENT_MODE);
        assertThat(testInvoice.getPaymentType()).isEqualTo(UPDATED_PAYMENT_TYPE);
        assertThat(testInvoice.getInvoiceType()).isEqualTo(UPDATED_INVOICE_TYPE);
        assertThat(testInvoice.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testInvoice.getReceptionOrderId()).isEqualTo(UPDATED_RECEPTION_ORDER_ID);
        assertThat(testInvoice.getInvoicedOn()).isEqualTo(UPDATED_INVOICED_ON);
        assertThat(testInvoice.getDueOn()).isEqualTo(UPDATED_DUE_ON);
        assertThat(testInvoice.getFromOrganizationId()).isEqualTo(UPDATED_FROM_ORGANIZATION_ID);
    }

    @Test
    void patchNonExistingInvoice() throws Exception {
        int databaseSizeBeforeUpdate = invoiceRepository.findAll().collectList().block().size();
        invoice.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, invoice.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(invoice))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Invoice in the database
        List<Invoice> invoiceList = invoiceRepository.findAll().collectList().block();
        assertThat(invoiceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchInvoice() throws Exception {
        int databaseSizeBeforeUpdate = invoiceRepository.findAll().collectList().block().size();
        invoice.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(invoice))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Invoice in the database
        List<Invoice> invoiceList = invoiceRepository.findAll().collectList().block();
        assertThat(invoiceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamInvoice() throws Exception {
        int databaseSizeBeforeUpdate = invoiceRepository.findAll().collectList().block().size();
        invoice.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(invoice))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Invoice in the database
        List<Invoice> invoiceList = invoiceRepository.findAll().collectList().block();
        assertThat(invoiceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteInvoice() {
        // Initialize the database
        invoiceRepository.save(invoice).block();

        int databaseSizeBeforeDelete = invoiceRepository.findAll().collectList().block().size();

        // Delete the invoice
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, invoice.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<Invoice> invoiceList = invoiceRepository.findAll().collectList().block();
        assertThat(invoiceList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
