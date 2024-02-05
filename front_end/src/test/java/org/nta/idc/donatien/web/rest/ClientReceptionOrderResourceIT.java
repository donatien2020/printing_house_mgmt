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
import org.nta.idc.donatien.domain.ClientReceptionOrder;
import org.nta.idc.donatien.domain.enumeration.ClientReceptionModes;
import org.nta.idc.donatien.domain.enumeration.InvoicingStatuses;
import org.nta.idc.donatien.domain.enumeration.OrderStatuses;
import org.nta.idc.donatien.repository.ClientReceptionOrderRepository;
import org.nta.idc.donatien.repository.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.reactive.server.WebTestClient;

/**
 * Integration tests for the {@link ClientReceptionOrderResource} REST controller.
 */
@IntegrationTest
@AutoConfigureWebTestClient(timeout = IntegrationTest.DEFAULT_ENTITY_TIMEOUT)
@WithMockUser
class ClientReceptionOrderResourceIT {

    private static final String DEFAULT_ORDER_NUMBER = "AAAAAAAAAA";
    private static final String UPDATED_ORDER_NUMBER = "BBBBBBBBBB";

    private static final Long DEFAULT_DIVISION_ID = 1L;
    private static final Long UPDATED_DIVISION_ID = 2L;

    private static final ZonedDateTime DEFAULT_RECEIVED_ON = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_RECEIVED_ON = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ClientReceptionModes DEFAULT_RECEPTION_MODE = ClientReceptionModes.QUOTATION;
    private static final ClientReceptionModes UPDATED_RECEPTION_MODE = ClientReceptionModes.ORDER_FORM;

    private static final String DEFAULT_JOB_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_JOB_DESCRIPTION = "BBBBBBBBBB";

    private static final Double DEFAULT_TOTAL_COST = 1D;
    private static final Double UPDATED_TOTAL_COST = 2D;

    private static final Long DEFAULT_TOTAL_JOB_CARDS = 1L;
    private static final Long UPDATED_TOTAL_JOB_CARDS = 2L;

    private static final ZonedDateTime DEFAULT_DELIVERY_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DELIVERY_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final Long DEFAULT_ASSIGNED_TO_DIVISION_NAMES = 1L;
    private static final Long UPDATED_ASSIGNED_TO_DIVISION_NAMES = 2L;

    private static final Long DEFAULT_ASSIGNED_TO_EMPLOYEE_NAMES = 1L;
    private static final Long UPDATED_ASSIGNED_TO_EMPLOYEE_NAMES = 2L;

    private static final OrderStatuses DEFAULT_ORDERING_STATUS = OrderStatuses.ASSIGNED;
    private static final OrderStatuses UPDATED_ORDERING_STATUS = OrderStatuses.STARTED;

    private static final InvoicingStatuses DEFAULT_INVOICING_STATUS = InvoicingStatuses.INITIAL;
    private static final InvoicingStatuses UPDATED_INVOICING_STATUS = InvoicingStatuses.CANCELED;

    private static final String ENTITY_API_URL = "/api/client-reception-orders";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ClientReceptionOrderRepository clientReceptionOrderRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private WebTestClient webTestClient;

    private ClientReceptionOrder clientReceptionOrder;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ClientReceptionOrder createEntity(EntityManager em) {
        ClientReceptionOrder clientReceptionOrder = new ClientReceptionOrder()
            .orderNumber(DEFAULT_ORDER_NUMBER)
            .divisionId(DEFAULT_DIVISION_ID)
            .receivedOn(DEFAULT_RECEIVED_ON)
            .receptionMode(DEFAULT_RECEPTION_MODE)
            .jobDescription(DEFAULT_JOB_DESCRIPTION)
            .totalCost(DEFAULT_TOTAL_COST)
            .totalJobCards(DEFAULT_TOTAL_JOB_CARDS)
            .deliveryDate(DEFAULT_DELIVERY_DATE)
            .assignedToDivisionNames(DEFAULT_ASSIGNED_TO_DIVISION_NAMES)
            .assignedToEmployeeNames(DEFAULT_ASSIGNED_TO_EMPLOYEE_NAMES)
            .orderingStatus(DEFAULT_ORDERING_STATUS)
            .invoicingStatus(DEFAULT_INVOICING_STATUS);
        return clientReceptionOrder;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ClientReceptionOrder createUpdatedEntity(EntityManager em) {
        ClientReceptionOrder clientReceptionOrder = new ClientReceptionOrder()
            .orderNumber(UPDATED_ORDER_NUMBER)
            .divisionId(UPDATED_DIVISION_ID)
            .receivedOn(UPDATED_RECEIVED_ON)
            .receptionMode(UPDATED_RECEPTION_MODE)
            .jobDescription(UPDATED_JOB_DESCRIPTION)
            .totalCost(UPDATED_TOTAL_COST)
            .totalJobCards(UPDATED_TOTAL_JOB_CARDS)
            .deliveryDate(UPDATED_DELIVERY_DATE)
            .assignedToDivisionNames(UPDATED_ASSIGNED_TO_DIVISION_NAMES)
            .assignedToEmployeeNames(UPDATED_ASSIGNED_TO_EMPLOYEE_NAMES)
            .orderingStatus(UPDATED_ORDERING_STATUS)
            .invoicingStatus(UPDATED_INVOICING_STATUS);
        return clientReceptionOrder;
    }

    public static void deleteEntities(EntityManager em) {
        try {
            em.deleteAll(ClientReceptionOrder.class).block();
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
        clientReceptionOrder = createEntity(em);
    }

    @Test
    void createClientReceptionOrder() throws Exception {
        int databaseSizeBeforeCreate = clientReceptionOrderRepository.findAll().collectList().block().size();
        // Create the ClientReceptionOrder
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(clientReceptionOrder))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the ClientReceptionOrder in the database
        List<ClientReceptionOrder> clientReceptionOrderList = clientReceptionOrderRepository.findAll().collectList().block();
        assertThat(clientReceptionOrderList).hasSize(databaseSizeBeforeCreate + 1);
        ClientReceptionOrder testClientReceptionOrder = clientReceptionOrderList.get(clientReceptionOrderList.size() - 1);
        assertThat(testClientReceptionOrder.getOrderNumber()).isEqualTo(DEFAULT_ORDER_NUMBER);
        assertThat(testClientReceptionOrder.getDivisionId()).isEqualTo(DEFAULT_DIVISION_ID);
        assertThat(testClientReceptionOrder.getReceivedOn()).isEqualTo(DEFAULT_RECEIVED_ON);
        assertThat(testClientReceptionOrder.getReceptionMode()).isEqualTo(DEFAULT_RECEPTION_MODE);
        assertThat(testClientReceptionOrder.getJobDescription()).isEqualTo(DEFAULT_JOB_DESCRIPTION);
        assertThat(testClientReceptionOrder.getTotalCost()).isEqualTo(DEFAULT_TOTAL_COST);
        assertThat(testClientReceptionOrder.getTotalJobCards()).isEqualTo(DEFAULT_TOTAL_JOB_CARDS);
        assertThat(testClientReceptionOrder.getDeliveryDate()).isEqualTo(DEFAULT_DELIVERY_DATE);
        assertThat(testClientReceptionOrder.getAssignedToDivisionNames()).isEqualTo(DEFAULT_ASSIGNED_TO_DIVISION_NAMES);
        assertThat(testClientReceptionOrder.getAssignedToEmployeeNames()).isEqualTo(DEFAULT_ASSIGNED_TO_EMPLOYEE_NAMES);
        assertThat(testClientReceptionOrder.getOrderingStatus()).isEqualTo(DEFAULT_ORDERING_STATUS);
        assertThat(testClientReceptionOrder.getInvoicingStatus()).isEqualTo(DEFAULT_INVOICING_STATUS);
    }

    @Test
    void createClientReceptionOrderWithExistingId() throws Exception {
        // Create the ClientReceptionOrder with an existing ID
        clientReceptionOrder.setId(1L);

        int databaseSizeBeforeCreate = clientReceptionOrderRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(clientReceptionOrder))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the ClientReceptionOrder in the database
        List<ClientReceptionOrder> clientReceptionOrderList = clientReceptionOrderRepository.findAll().collectList().block();
        assertThat(clientReceptionOrderList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void checkOrderNumberIsRequired() throws Exception {
        int databaseSizeBeforeTest = clientReceptionOrderRepository.findAll().collectList().block().size();
        // set the field null
        clientReceptionOrder.setOrderNumber(null);

        // Create the ClientReceptionOrder, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(clientReceptionOrder))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<ClientReceptionOrder> clientReceptionOrderList = clientReceptionOrderRepository.findAll().collectList().block();
        assertThat(clientReceptionOrderList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkDivisionIdIsRequired() throws Exception {
        int databaseSizeBeforeTest = clientReceptionOrderRepository.findAll().collectList().block().size();
        // set the field null
        clientReceptionOrder.setDivisionId(null);

        // Create the ClientReceptionOrder, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(clientReceptionOrder))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<ClientReceptionOrder> clientReceptionOrderList = clientReceptionOrderRepository.findAll().collectList().block();
        assertThat(clientReceptionOrderList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkReceptionModeIsRequired() throws Exception {
        int databaseSizeBeforeTest = clientReceptionOrderRepository.findAll().collectList().block().size();
        // set the field null
        clientReceptionOrder.setReceptionMode(null);

        // Create the ClientReceptionOrder, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(clientReceptionOrder))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<ClientReceptionOrder> clientReceptionOrderList = clientReceptionOrderRepository.findAll().collectList().block();
        assertThat(clientReceptionOrderList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkAssignedToDivisionNamesIsRequired() throws Exception {
        int databaseSizeBeforeTest = clientReceptionOrderRepository.findAll().collectList().block().size();
        // set the field null
        clientReceptionOrder.setAssignedToDivisionNames(null);

        // Create the ClientReceptionOrder, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(clientReceptionOrder))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<ClientReceptionOrder> clientReceptionOrderList = clientReceptionOrderRepository.findAll().collectList().block();
        assertThat(clientReceptionOrderList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkAssignedToEmployeeNamesIsRequired() throws Exception {
        int databaseSizeBeforeTest = clientReceptionOrderRepository.findAll().collectList().block().size();
        // set the field null
        clientReceptionOrder.setAssignedToEmployeeNames(null);

        // Create the ClientReceptionOrder, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(clientReceptionOrder))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<ClientReceptionOrder> clientReceptionOrderList = clientReceptionOrderRepository.findAll().collectList().block();
        assertThat(clientReceptionOrderList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkOrderingStatusIsRequired() throws Exception {
        int databaseSizeBeforeTest = clientReceptionOrderRepository.findAll().collectList().block().size();
        // set the field null
        clientReceptionOrder.setOrderingStatus(null);

        // Create the ClientReceptionOrder, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(clientReceptionOrder))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<ClientReceptionOrder> clientReceptionOrderList = clientReceptionOrderRepository.findAll().collectList().block();
        assertThat(clientReceptionOrderList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkInvoicingStatusIsRequired() throws Exception {
        int databaseSizeBeforeTest = clientReceptionOrderRepository.findAll().collectList().block().size();
        // set the field null
        clientReceptionOrder.setInvoicingStatus(null);

        // Create the ClientReceptionOrder, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(clientReceptionOrder))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<ClientReceptionOrder> clientReceptionOrderList = clientReceptionOrderRepository.findAll().collectList().block();
        assertThat(clientReceptionOrderList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void getAllClientReceptionOrdersAsStream() {
        // Initialize the database
        clientReceptionOrderRepository.save(clientReceptionOrder).block();

        List<ClientReceptionOrder> clientReceptionOrderList = webTestClient
            .get()
            .uri(ENTITY_API_URL)
            .accept(MediaType.APPLICATION_NDJSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentTypeCompatibleWith(MediaType.APPLICATION_NDJSON)
            .returnResult(ClientReceptionOrder.class)
            .getResponseBody()
            .filter(clientReceptionOrder::equals)
            .collectList()
            .block(Duration.ofSeconds(5));

        assertThat(clientReceptionOrderList).isNotNull();
        assertThat(clientReceptionOrderList).hasSize(1);
        ClientReceptionOrder testClientReceptionOrder = clientReceptionOrderList.get(0);
        assertThat(testClientReceptionOrder.getOrderNumber()).isEqualTo(DEFAULT_ORDER_NUMBER);
        assertThat(testClientReceptionOrder.getDivisionId()).isEqualTo(DEFAULT_DIVISION_ID);
        assertThat(testClientReceptionOrder.getReceivedOn()).isEqualTo(DEFAULT_RECEIVED_ON);
        assertThat(testClientReceptionOrder.getReceptionMode()).isEqualTo(DEFAULT_RECEPTION_MODE);
        assertThat(testClientReceptionOrder.getJobDescription()).isEqualTo(DEFAULT_JOB_DESCRIPTION);
        assertThat(testClientReceptionOrder.getTotalCost()).isEqualTo(DEFAULT_TOTAL_COST);
        assertThat(testClientReceptionOrder.getTotalJobCards()).isEqualTo(DEFAULT_TOTAL_JOB_CARDS);
        assertThat(testClientReceptionOrder.getDeliveryDate()).isEqualTo(DEFAULT_DELIVERY_DATE);
        assertThat(testClientReceptionOrder.getAssignedToDivisionNames()).isEqualTo(DEFAULT_ASSIGNED_TO_DIVISION_NAMES);
        assertThat(testClientReceptionOrder.getAssignedToEmployeeNames()).isEqualTo(DEFAULT_ASSIGNED_TO_EMPLOYEE_NAMES);
        assertThat(testClientReceptionOrder.getOrderingStatus()).isEqualTo(DEFAULT_ORDERING_STATUS);
        assertThat(testClientReceptionOrder.getInvoicingStatus()).isEqualTo(DEFAULT_INVOICING_STATUS);
    }

    @Test
    void getAllClientReceptionOrders() {
        // Initialize the database
        clientReceptionOrderRepository.save(clientReceptionOrder).block();

        // Get all the clientReceptionOrderList
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
            .value(hasItem(clientReceptionOrder.getId().intValue()))
            .jsonPath("$.[*].orderNumber")
            .value(hasItem(DEFAULT_ORDER_NUMBER))
            .jsonPath("$.[*].divisionId")
            .value(hasItem(DEFAULT_DIVISION_ID.intValue()))
            .jsonPath("$.[*].receivedOn")
            .value(hasItem(sameInstant(DEFAULT_RECEIVED_ON)))
            .jsonPath("$.[*].receptionMode")
            .value(hasItem(DEFAULT_RECEPTION_MODE.toString()))
            .jsonPath("$.[*].jobDescription")
            .value(hasItem(DEFAULT_JOB_DESCRIPTION))
            .jsonPath("$.[*].totalCost")
            .value(hasItem(DEFAULT_TOTAL_COST.doubleValue()))
            .jsonPath("$.[*].totalJobCards")
            .value(hasItem(DEFAULT_TOTAL_JOB_CARDS.intValue()))
            .jsonPath("$.[*].deliveryDate")
            .value(hasItem(sameInstant(DEFAULT_DELIVERY_DATE)))
            .jsonPath("$.[*].assignedToDivisionNames")
            .value(hasItem(DEFAULT_ASSIGNED_TO_DIVISION_NAMES.intValue()))
            .jsonPath("$.[*].assignedToEmployeeNames")
            .value(hasItem(DEFAULT_ASSIGNED_TO_EMPLOYEE_NAMES.intValue()))
            .jsonPath("$.[*].orderingStatus")
            .value(hasItem(DEFAULT_ORDERING_STATUS.toString()))
            .jsonPath("$.[*].invoicingStatus")
            .value(hasItem(DEFAULT_INVOICING_STATUS.toString()));
    }

    @Test
    void getClientReceptionOrder() {
        // Initialize the database
        clientReceptionOrderRepository.save(clientReceptionOrder).block();

        // Get the clientReceptionOrder
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, clientReceptionOrder.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(clientReceptionOrder.getId().intValue()))
            .jsonPath("$.orderNumber")
            .value(is(DEFAULT_ORDER_NUMBER))
            .jsonPath("$.divisionId")
            .value(is(DEFAULT_DIVISION_ID.intValue()))
            .jsonPath("$.receivedOn")
            .value(is(sameInstant(DEFAULT_RECEIVED_ON)))
            .jsonPath("$.receptionMode")
            .value(is(DEFAULT_RECEPTION_MODE.toString()))
            .jsonPath("$.jobDescription")
            .value(is(DEFAULT_JOB_DESCRIPTION))
            .jsonPath("$.totalCost")
            .value(is(DEFAULT_TOTAL_COST.doubleValue()))
            .jsonPath("$.totalJobCards")
            .value(is(DEFAULT_TOTAL_JOB_CARDS.intValue()))
            .jsonPath("$.deliveryDate")
            .value(is(sameInstant(DEFAULT_DELIVERY_DATE)))
            .jsonPath("$.assignedToDivisionNames")
            .value(is(DEFAULT_ASSIGNED_TO_DIVISION_NAMES.intValue()))
            .jsonPath("$.assignedToEmployeeNames")
            .value(is(DEFAULT_ASSIGNED_TO_EMPLOYEE_NAMES.intValue()))
            .jsonPath("$.orderingStatus")
            .value(is(DEFAULT_ORDERING_STATUS.toString()))
            .jsonPath("$.invoicingStatus")
            .value(is(DEFAULT_INVOICING_STATUS.toString()));
    }

    @Test
    void getNonExistingClientReceptionOrder() {
        // Get the clientReceptionOrder
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putExistingClientReceptionOrder() throws Exception {
        // Initialize the database
        clientReceptionOrderRepository.save(clientReceptionOrder).block();

        int databaseSizeBeforeUpdate = clientReceptionOrderRepository.findAll().collectList().block().size();

        // Update the clientReceptionOrder
        ClientReceptionOrder updatedClientReceptionOrder = clientReceptionOrderRepository.findById(clientReceptionOrder.getId()).block();
        updatedClientReceptionOrder
            .orderNumber(UPDATED_ORDER_NUMBER)
            .divisionId(UPDATED_DIVISION_ID)
            .receivedOn(UPDATED_RECEIVED_ON)
            .receptionMode(UPDATED_RECEPTION_MODE)
            .jobDescription(UPDATED_JOB_DESCRIPTION)
            .totalCost(UPDATED_TOTAL_COST)
            .totalJobCards(UPDATED_TOTAL_JOB_CARDS)
            .deliveryDate(UPDATED_DELIVERY_DATE)
            .assignedToDivisionNames(UPDATED_ASSIGNED_TO_DIVISION_NAMES)
            .assignedToEmployeeNames(UPDATED_ASSIGNED_TO_EMPLOYEE_NAMES)
            .orderingStatus(UPDATED_ORDERING_STATUS)
            .invoicingStatus(UPDATED_INVOICING_STATUS);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, updatedClientReceptionOrder.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(updatedClientReceptionOrder))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the ClientReceptionOrder in the database
        List<ClientReceptionOrder> clientReceptionOrderList = clientReceptionOrderRepository.findAll().collectList().block();
        assertThat(clientReceptionOrderList).hasSize(databaseSizeBeforeUpdate);
        ClientReceptionOrder testClientReceptionOrder = clientReceptionOrderList.get(clientReceptionOrderList.size() - 1);
        assertThat(testClientReceptionOrder.getOrderNumber()).isEqualTo(UPDATED_ORDER_NUMBER);
        assertThat(testClientReceptionOrder.getDivisionId()).isEqualTo(UPDATED_DIVISION_ID);
        assertThat(testClientReceptionOrder.getReceivedOn()).isEqualTo(UPDATED_RECEIVED_ON);
        assertThat(testClientReceptionOrder.getReceptionMode()).isEqualTo(UPDATED_RECEPTION_MODE);
        assertThat(testClientReceptionOrder.getJobDescription()).isEqualTo(UPDATED_JOB_DESCRIPTION);
        assertThat(testClientReceptionOrder.getTotalCost()).isEqualTo(UPDATED_TOTAL_COST);
        assertThat(testClientReceptionOrder.getTotalJobCards()).isEqualTo(UPDATED_TOTAL_JOB_CARDS);
        assertThat(testClientReceptionOrder.getDeliveryDate()).isEqualTo(UPDATED_DELIVERY_DATE);
        assertThat(testClientReceptionOrder.getAssignedToDivisionNames()).isEqualTo(UPDATED_ASSIGNED_TO_DIVISION_NAMES);
        assertThat(testClientReceptionOrder.getAssignedToEmployeeNames()).isEqualTo(UPDATED_ASSIGNED_TO_EMPLOYEE_NAMES);
        assertThat(testClientReceptionOrder.getOrderingStatus()).isEqualTo(UPDATED_ORDERING_STATUS);
        assertThat(testClientReceptionOrder.getInvoicingStatus()).isEqualTo(UPDATED_INVOICING_STATUS);
    }

    @Test
    void putNonExistingClientReceptionOrder() throws Exception {
        int databaseSizeBeforeUpdate = clientReceptionOrderRepository.findAll().collectList().block().size();
        clientReceptionOrder.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, clientReceptionOrder.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(clientReceptionOrder))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the ClientReceptionOrder in the database
        List<ClientReceptionOrder> clientReceptionOrderList = clientReceptionOrderRepository.findAll().collectList().block();
        assertThat(clientReceptionOrderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchClientReceptionOrder() throws Exception {
        int databaseSizeBeforeUpdate = clientReceptionOrderRepository.findAll().collectList().block().size();
        clientReceptionOrder.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(clientReceptionOrder))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the ClientReceptionOrder in the database
        List<ClientReceptionOrder> clientReceptionOrderList = clientReceptionOrderRepository.findAll().collectList().block();
        assertThat(clientReceptionOrderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamClientReceptionOrder() throws Exception {
        int databaseSizeBeforeUpdate = clientReceptionOrderRepository.findAll().collectList().block().size();
        clientReceptionOrder.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(clientReceptionOrder))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the ClientReceptionOrder in the database
        List<ClientReceptionOrder> clientReceptionOrderList = clientReceptionOrderRepository.findAll().collectList().block();
        assertThat(clientReceptionOrderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateClientReceptionOrderWithPatch() throws Exception {
        // Initialize the database
        clientReceptionOrderRepository.save(clientReceptionOrder).block();

        int databaseSizeBeforeUpdate = clientReceptionOrderRepository.findAll().collectList().block().size();

        // Update the clientReceptionOrder using partial update
        ClientReceptionOrder partialUpdatedClientReceptionOrder = new ClientReceptionOrder();
        partialUpdatedClientReceptionOrder.setId(clientReceptionOrder.getId());

        partialUpdatedClientReceptionOrder
            .receivedOn(UPDATED_RECEIVED_ON)
            .receptionMode(UPDATED_RECEPTION_MODE)
            .deliveryDate(UPDATED_DELIVERY_DATE)
            .orderingStatus(UPDATED_ORDERING_STATUS);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedClientReceptionOrder.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedClientReceptionOrder))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the ClientReceptionOrder in the database
        List<ClientReceptionOrder> clientReceptionOrderList = clientReceptionOrderRepository.findAll().collectList().block();
        assertThat(clientReceptionOrderList).hasSize(databaseSizeBeforeUpdate);
        ClientReceptionOrder testClientReceptionOrder = clientReceptionOrderList.get(clientReceptionOrderList.size() - 1);
        assertThat(testClientReceptionOrder.getOrderNumber()).isEqualTo(DEFAULT_ORDER_NUMBER);
        assertThat(testClientReceptionOrder.getDivisionId()).isEqualTo(DEFAULT_DIVISION_ID);
        assertThat(testClientReceptionOrder.getReceivedOn()).isEqualTo(UPDATED_RECEIVED_ON);
        assertThat(testClientReceptionOrder.getReceptionMode()).isEqualTo(UPDATED_RECEPTION_MODE);
        assertThat(testClientReceptionOrder.getJobDescription()).isEqualTo(DEFAULT_JOB_DESCRIPTION);
        assertThat(testClientReceptionOrder.getTotalCost()).isEqualTo(DEFAULT_TOTAL_COST);
        assertThat(testClientReceptionOrder.getTotalJobCards()).isEqualTo(DEFAULT_TOTAL_JOB_CARDS);
        assertThat(testClientReceptionOrder.getDeliveryDate()).isEqualTo(UPDATED_DELIVERY_DATE);
        assertThat(testClientReceptionOrder.getAssignedToDivisionNames()).isEqualTo(DEFAULT_ASSIGNED_TO_DIVISION_NAMES);
        assertThat(testClientReceptionOrder.getAssignedToEmployeeNames()).isEqualTo(DEFAULT_ASSIGNED_TO_EMPLOYEE_NAMES);
        assertThat(testClientReceptionOrder.getOrderingStatus()).isEqualTo(UPDATED_ORDERING_STATUS);
        assertThat(testClientReceptionOrder.getInvoicingStatus()).isEqualTo(DEFAULT_INVOICING_STATUS);
    }

    @Test
    void fullUpdateClientReceptionOrderWithPatch() throws Exception {
        // Initialize the database
        clientReceptionOrderRepository.save(clientReceptionOrder).block();

        int databaseSizeBeforeUpdate = clientReceptionOrderRepository.findAll().collectList().block().size();

        // Update the clientReceptionOrder using partial update
        ClientReceptionOrder partialUpdatedClientReceptionOrder = new ClientReceptionOrder();
        partialUpdatedClientReceptionOrder.setId(clientReceptionOrder.getId());

        partialUpdatedClientReceptionOrder
            .orderNumber(UPDATED_ORDER_NUMBER)
            .divisionId(UPDATED_DIVISION_ID)
            .receivedOn(UPDATED_RECEIVED_ON)
            .receptionMode(UPDATED_RECEPTION_MODE)
            .jobDescription(UPDATED_JOB_DESCRIPTION)
            .totalCost(UPDATED_TOTAL_COST)
            .totalJobCards(UPDATED_TOTAL_JOB_CARDS)
            .deliveryDate(UPDATED_DELIVERY_DATE)
            .assignedToDivisionNames(UPDATED_ASSIGNED_TO_DIVISION_NAMES)
            .assignedToEmployeeNames(UPDATED_ASSIGNED_TO_EMPLOYEE_NAMES)
            .orderingStatus(UPDATED_ORDERING_STATUS)
            .invoicingStatus(UPDATED_INVOICING_STATUS);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedClientReceptionOrder.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedClientReceptionOrder))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the ClientReceptionOrder in the database
        List<ClientReceptionOrder> clientReceptionOrderList = clientReceptionOrderRepository.findAll().collectList().block();
        assertThat(clientReceptionOrderList).hasSize(databaseSizeBeforeUpdate);
        ClientReceptionOrder testClientReceptionOrder = clientReceptionOrderList.get(clientReceptionOrderList.size() - 1);
        assertThat(testClientReceptionOrder.getOrderNumber()).isEqualTo(UPDATED_ORDER_NUMBER);
        assertThat(testClientReceptionOrder.getDivisionId()).isEqualTo(UPDATED_DIVISION_ID);
        assertThat(testClientReceptionOrder.getReceivedOn()).isEqualTo(UPDATED_RECEIVED_ON);
        assertThat(testClientReceptionOrder.getReceptionMode()).isEqualTo(UPDATED_RECEPTION_MODE);
        assertThat(testClientReceptionOrder.getJobDescription()).isEqualTo(UPDATED_JOB_DESCRIPTION);
        assertThat(testClientReceptionOrder.getTotalCost()).isEqualTo(UPDATED_TOTAL_COST);
        assertThat(testClientReceptionOrder.getTotalJobCards()).isEqualTo(UPDATED_TOTAL_JOB_CARDS);
        assertThat(testClientReceptionOrder.getDeliveryDate()).isEqualTo(UPDATED_DELIVERY_DATE);
        assertThat(testClientReceptionOrder.getAssignedToDivisionNames()).isEqualTo(UPDATED_ASSIGNED_TO_DIVISION_NAMES);
        assertThat(testClientReceptionOrder.getAssignedToEmployeeNames()).isEqualTo(UPDATED_ASSIGNED_TO_EMPLOYEE_NAMES);
        assertThat(testClientReceptionOrder.getOrderingStatus()).isEqualTo(UPDATED_ORDERING_STATUS);
        assertThat(testClientReceptionOrder.getInvoicingStatus()).isEqualTo(UPDATED_INVOICING_STATUS);
    }

    @Test
    void patchNonExistingClientReceptionOrder() throws Exception {
        int databaseSizeBeforeUpdate = clientReceptionOrderRepository.findAll().collectList().block().size();
        clientReceptionOrder.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, clientReceptionOrder.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(clientReceptionOrder))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the ClientReceptionOrder in the database
        List<ClientReceptionOrder> clientReceptionOrderList = clientReceptionOrderRepository.findAll().collectList().block();
        assertThat(clientReceptionOrderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchClientReceptionOrder() throws Exception {
        int databaseSizeBeforeUpdate = clientReceptionOrderRepository.findAll().collectList().block().size();
        clientReceptionOrder.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(clientReceptionOrder))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the ClientReceptionOrder in the database
        List<ClientReceptionOrder> clientReceptionOrderList = clientReceptionOrderRepository.findAll().collectList().block();
        assertThat(clientReceptionOrderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamClientReceptionOrder() throws Exception {
        int databaseSizeBeforeUpdate = clientReceptionOrderRepository.findAll().collectList().block().size();
        clientReceptionOrder.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(clientReceptionOrder))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the ClientReceptionOrder in the database
        List<ClientReceptionOrder> clientReceptionOrderList = clientReceptionOrderRepository.findAll().collectList().block();
        assertThat(clientReceptionOrderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteClientReceptionOrder() {
        // Initialize the database
        clientReceptionOrderRepository.save(clientReceptionOrder).block();

        int databaseSizeBeforeDelete = clientReceptionOrderRepository.findAll().collectList().block().size();

        // Delete the clientReceptionOrder
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, clientReceptionOrder.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<ClientReceptionOrder> clientReceptionOrderList = clientReceptionOrderRepository.findAll().collectList().block();
        assertThat(clientReceptionOrderList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
