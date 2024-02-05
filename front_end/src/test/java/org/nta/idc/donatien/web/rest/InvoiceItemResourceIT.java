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
import org.nta.idc.donatien.domain.InvoiceItem;
import org.nta.idc.donatien.domain.enumeration.InvoiceItemTypes;
import org.nta.idc.donatien.domain.enumeration.Status;
import org.nta.idc.donatien.repository.EntityManager;
import org.nta.idc.donatien.repository.InvoiceItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.reactive.server.WebTestClient;

/**
 * Integration tests for the {@link InvoiceItemResource} REST controller.
 */
@IntegrationTest
@AutoConfigureWebTestClient(timeout = IntegrationTest.DEFAULT_ENTITY_TIMEOUT)
@WithMockUser
class InvoiceItemResourceIT {

    private static final Long DEFAULT_ITEM_ID = 1L;
    private static final Long UPDATED_ITEM_ID = 2L;

    private static final Long DEFAULT_INVOICE_ID = 1L;
    private static final Long UPDATED_INVOICE_ID = 2L;

    private static final InvoiceItemTypes DEFAULT_ITEM_TYPE = InvoiceItemTypes.JOB_CARD;
    private static final InvoiceItemTypes UPDATED_ITEM_TYPE = InvoiceItemTypes.PRODUCT;

    private static final Double DEFAULT_UNIT_PRICE = 1D;
    private static final Double UPDATED_UNIT_PRICE = 2D;

    private static final Long DEFAULT_QUANTITY = 1L;
    private static final Long UPDATED_QUANTITY = 2L;

    private static final Double DEFAULT_TOTAL_COST = 1D;
    private static final Double UPDATED_TOTAL_COST = 2D;

    private static final Status DEFAULT_STATUS = Status.ACTIVE;
    private static final Status UPDATED_STATUS = Status.INACTIVE;

    private static final String ENTITY_API_URL = "/api/invoice-items";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private InvoiceItemRepository invoiceItemRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private WebTestClient webTestClient;

    private InvoiceItem invoiceItem;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static InvoiceItem createEntity(EntityManager em) {
        InvoiceItem invoiceItem = new InvoiceItem()
            .itemId(DEFAULT_ITEM_ID)
            .invoiceId(DEFAULT_INVOICE_ID)
            .itemType(DEFAULT_ITEM_TYPE)
            .unitPrice(DEFAULT_UNIT_PRICE)
            .quantity(DEFAULT_QUANTITY)
            .totalCost(DEFAULT_TOTAL_COST)
            .status(DEFAULT_STATUS);
        return invoiceItem;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static InvoiceItem createUpdatedEntity(EntityManager em) {
        InvoiceItem invoiceItem = new InvoiceItem()
            .itemId(UPDATED_ITEM_ID)
            .invoiceId(UPDATED_INVOICE_ID)
            .itemType(UPDATED_ITEM_TYPE)
            .unitPrice(UPDATED_UNIT_PRICE)
            .quantity(UPDATED_QUANTITY)
            .totalCost(UPDATED_TOTAL_COST)
            .status(UPDATED_STATUS);
        return invoiceItem;
    }

    public static void deleteEntities(EntityManager em) {
        try {
            em.deleteAll(InvoiceItem.class).block();
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
        invoiceItem = createEntity(em);
    }

    @Test
    void createInvoiceItem() throws Exception {
        int databaseSizeBeforeCreate = invoiceItemRepository.findAll().collectList().block().size();
        // Create the InvoiceItem
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(invoiceItem))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the InvoiceItem in the database
        List<InvoiceItem> invoiceItemList = invoiceItemRepository.findAll().collectList().block();
        assertThat(invoiceItemList).hasSize(databaseSizeBeforeCreate + 1);
        InvoiceItem testInvoiceItem = invoiceItemList.get(invoiceItemList.size() - 1);
        assertThat(testInvoiceItem.getItemId()).isEqualTo(DEFAULT_ITEM_ID);
        assertThat(testInvoiceItem.getInvoiceId()).isEqualTo(DEFAULT_INVOICE_ID);
        assertThat(testInvoiceItem.getItemType()).isEqualTo(DEFAULT_ITEM_TYPE);
        assertThat(testInvoiceItem.getUnitPrice()).isEqualTo(DEFAULT_UNIT_PRICE);
        assertThat(testInvoiceItem.getQuantity()).isEqualTo(DEFAULT_QUANTITY);
        assertThat(testInvoiceItem.getTotalCost()).isEqualTo(DEFAULT_TOTAL_COST);
        assertThat(testInvoiceItem.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    void createInvoiceItemWithExistingId() throws Exception {
        // Create the InvoiceItem with an existing ID
        invoiceItem.setId(1L);

        int databaseSizeBeforeCreate = invoiceItemRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(invoiceItem))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the InvoiceItem in the database
        List<InvoiceItem> invoiceItemList = invoiceItemRepository.findAll().collectList().block();
        assertThat(invoiceItemList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void checkItemIdIsRequired() throws Exception {
        int databaseSizeBeforeTest = invoiceItemRepository.findAll().collectList().block().size();
        // set the field null
        invoiceItem.setItemId(null);

        // Create the InvoiceItem, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(invoiceItem))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<InvoiceItem> invoiceItemList = invoiceItemRepository.findAll().collectList().block();
        assertThat(invoiceItemList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkInvoiceIdIsRequired() throws Exception {
        int databaseSizeBeforeTest = invoiceItemRepository.findAll().collectList().block().size();
        // set the field null
        invoiceItem.setInvoiceId(null);

        // Create the InvoiceItem, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(invoiceItem))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<InvoiceItem> invoiceItemList = invoiceItemRepository.findAll().collectList().block();
        assertThat(invoiceItemList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkItemTypeIsRequired() throws Exception {
        int databaseSizeBeforeTest = invoiceItemRepository.findAll().collectList().block().size();
        // set the field null
        invoiceItem.setItemType(null);

        // Create the InvoiceItem, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(invoiceItem))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<InvoiceItem> invoiceItemList = invoiceItemRepository.findAll().collectList().block();
        assertThat(invoiceItemList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkUnitPriceIsRequired() throws Exception {
        int databaseSizeBeforeTest = invoiceItemRepository.findAll().collectList().block().size();
        // set the field null
        invoiceItem.setUnitPrice(null);

        // Create the InvoiceItem, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(invoiceItem))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<InvoiceItem> invoiceItemList = invoiceItemRepository.findAll().collectList().block();
        assertThat(invoiceItemList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkQuantityIsRequired() throws Exception {
        int databaseSizeBeforeTest = invoiceItemRepository.findAll().collectList().block().size();
        // set the field null
        invoiceItem.setQuantity(null);

        // Create the InvoiceItem, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(invoiceItem))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<InvoiceItem> invoiceItemList = invoiceItemRepository.findAll().collectList().block();
        assertThat(invoiceItemList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkTotalCostIsRequired() throws Exception {
        int databaseSizeBeforeTest = invoiceItemRepository.findAll().collectList().block().size();
        // set the field null
        invoiceItem.setTotalCost(null);

        // Create the InvoiceItem, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(invoiceItem))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<InvoiceItem> invoiceItemList = invoiceItemRepository.findAll().collectList().block();
        assertThat(invoiceItemList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkStatusIsRequired() throws Exception {
        int databaseSizeBeforeTest = invoiceItemRepository.findAll().collectList().block().size();
        // set the field null
        invoiceItem.setStatus(null);

        // Create the InvoiceItem, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(invoiceItem))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<InvoiceItem> invoiceItemList = invoiceItemRepository.findAll().collectList().block();
        assertThat(invoiceItemList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void getAllInvoiceItemsAsStream() {
        // Initialize the database
        invoiceItemRepository.save(invoiceItem).block();

        List<InvoiceItem> invoiceItemList = webTestClient
            .get()
            .uri(ENTITY_API_URL)
            .accept(MediaType.APPLICATION_NDJSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentTypeCompatibleWith(MediaType.APPLICATION_NDJSON)
            .returnResult(InvoiceItem.class)
            .getResponseBody()
            .filter(invoiceItem::equals)
            .collectList()
            .block(Duration.ofSeconds(5));

        assertThat(invoiceItemList).isNotNull();
        assertThat(invoiceItemList).hasSize(1);
        InvoiceItem testInvoiceItem = invoiceItemList.get(0);
        assertThat(testInvoiceItem.getItemId()).isEqualTo(DEFAULT_ITEM_ID);
        assertThat(testInvoiceItem.getInvoiceId()).isEqualTo(DEFAULT_INVOICE_ID);
        assertThat(testInvoiceItem.getItemType()).isEqualTo(DEFAULT_ITEM_TYPE);
        assertThat(testInvoiceItem.getUnitPrice()).isEqualTo(DEFAULT_UNIT_PRICE);
        assertThat(testInvoiceItem.getQuantity()).isEqualTo(DEFAULT_QUANTITY);
        assertThat(testInvoiceItem.getTotalCost()).isEqualTo(DEFAULT_TOTAL_COST);
        assertThat(testInvoiceItem.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    void getAllInvoiceItems() {
        // Initialize the database
        invoiceItemRepository.save(invoiceItem).block();

        // Get all the invoiceItemList
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
            .value(hasItem(invoiceItem.getId().intValue()))
            .jsonPath("$.[*].itemId")
            .value(hasItem(DEFAULT_ITEM_ID.intValue()))
            .jsonPath("$.[*].invoiceId")
            .value(hasItem(DEFAULT_INVOICE_ID.intValue()))
            .jsonPath("$.[*].itemType")
            .value(hasItem(DEFAULT_ITEM_TYPE.toString()))
            .jsonPath("$.[*].unitPrice")
            .value(hasItem(DEFAULT_UNIT_PRICE.doubleValue()))
            .jsonPath("$.[*].quantity")
            .value(hasItem(DEFAULT_QUANTITY.intValue()))
            .jsonPath("$.[*].totalCost")
            .value(hasItem(DEFAULT_TOTAL_COST.doubleValue()))
            .jsonPath("$.[*].status")
            .value(hasItem(DEFAULT_STATUS.toString()));
    }

    @Test
    void getInvoiceItem() {
        // Initialize the database
        invoiceItemRepository.save(invoiceItem).block();

        // Get the invoiceItem
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, invoiceItem.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(invoiceItem.getId().intValue()))
            .jsonPath("$.itemId")
            .value(is(DEFAULT_ITEM_ID.intValue()))
            .jsonPath("$.invoiceId")
            .value(is(DEFAULT_INVOICE_ID.intValue()))
            .jsonPath("$.itemType")
            .value(is(DEFAULT_ITEM_TYPE.toString()))
            .jsonPath("$.unitPrice")
            .value(is(DEFAULT_UNIT_PRICE.doubleValue()))
            .jsonPath("$.quantity")
            .value(is(DEFAULT_QUANTITY.intValue()))
            .jsonPath("$.totalCost")
            .value(is(DEFAULT_TOTAL_COST.doubleValue()))
            .jsonPath("$.status")
            .value(is(DEFAULT_STATUS.toString()));
    }

    @Test
    void getNonExistingInvoiceItem() {
        // Get the invoiceItem
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putExistingInvoiceItem() throws Exception {
        // Initialize the database
        invoiceItemRepository.save(invoiceItem).block();

        int databaseSizeBeforeUpdate = invoiceItemRepository.findAll().collectList().block().size();

        // Update the invoiceItem
        InvoiceItem updatedInvoiceItem = invoiceItemRepository.findById(invoiceItem.getId()).block();
        updatedInvoiceItem
            .itemId(UPDATED_ITEM_ID)
            .invoiceId(UPDATED_INVOICE_ID)
            .itemType(UPDATED_ITEM_TYPE)
            .unitPrice(UPDATED_UNIT_PRICE)
            .quantity(UPDATED_QUANTITY)
            .totalCost(UPDATED_TOTAL_COST)
            .status(UPDATED_STATUS);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, updatedInvoiceItem.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(updatedInvoiceItem))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the InvoiceItem in the database
        List<InvoiceItem> invoiceItemList = invoiceItemRepository.findAll().collectList().block();
        assertThat(invoiceItemList).hasSize(databaseSizeBeforeUpdate);
        InvoiceItem testInvoiceItem = invoiceItemList.get(invoiceItemList.size() - 1);
        assertThat(testInvoiceItem.getItemId()).isEqualTo(UPDATED_ITEM_ID);
        assertThat(testInvoiceItem.getInvoiceId()).isEqualTo(UPDATED_INVOICE_ID);
        assertThat(testInvoiceItem.getItemType()).isEqualTo(UPDATED_ITEM_TYPE);
        assertThat(testInvoiceItem.getUnitPrice()).isEqualTo(UPDATED_UNIT_PRICE);
        assertThat(testInvoiceItem.getQuantity()).isEqualTo(UPDATED_QUANTITY);
        assertThat(testInvoiceItem.getTotalCost()).isEqualTo(UPDATED_TOTAL_COST);
        assertThat(testInvoiceItem.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    void putNonExistingInvoiceItem() throws Exception {
        int databaseSizeBeforeUpdate = invoiceItemRepository.findAll().collectList().block().size();
        invoiceItem.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, invoiceItem.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(invoiceItem))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the InvoiceItem in the database
        List<InvoiceItem> invoiceItemList = invoiceItemRepository.findAll().collectList().block();
        assertThat(invoiceItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchInvoiceItem() throws Exception {
        int databaseSizeBeforeUpdate = invoiceItemRepository.findAll().collectList().block().size();
        invoiceItem.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(invoiceItem))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the InvoiceItem in the database
        List<InvoiceItem> invoiceItemList = invoiceItemRepository.findAll().collectList().block();
        assertThat(invoiceItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamInvoiceItem() throws Exception {
        int databaseSizeBeforeUpdate = invoiceItemRepository.findAll().collectList().block().size();
        invoiceItem.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(invoiceItem))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the InvoiceItem in the database
        List<InvoiceItem> invoiceItemList = invoiceItemRepository.findAll().collectList().block();
        assertThat(invoiceItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateInvoiceItemWithPatch() throws Exception {
        // Initialize the database
        invoiceItemRepository.save(invoiceItem).block();

        int databaseSizeBeforeUpdate = invoiceItemRepository.findAll().collectList().block().size();

        // Update the invoiceItem using partial update
        InvoiceItem partialUpdatedInvoiceItem = new InvoiceItem();
        partialUpdatedInvoiceItem.setId(invoiceItem.getId());

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedInvoiceItem.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedInvoiceItem))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the InvoiceItem in the database
        List<InvoiceItem> invoiceItemList = invoiceItemRepository.findAll().collectList().block();
        assertThat(invoiceItemList).hasSize(databaseSizeBeforeUpdate);
        InvoiceItem testInvoiceItem = invoiceItemList.get(invoiceItemList.size() - 1);
        assertThat(testInvoiceItem.getItemId()).isEqualTo(DEFAULT_ITEM_ID);
        assertThat(testInvoiceItem.getInvoiceId()).isEqualTo(DEFAULT_INVOICE_ID);
        assertThat(testInvoiceItem.getItemType()).isEqualTo(DEFAULT_ITEM_TYPE);
        assertThat(testInvoiceItem.getUnitPrice()).isEqualTo(DEFAULT_UNIT_PRICE);
        assertThat(testInvoiceItem.getQuantity()).isEqualTo(DEFAULT_QUANTITY);
        assertThat(testInvoiceItem.getTotalCost()).isEqualTo(DEFAULT_TOTAL_COST);
        assertThat(testInvoiceItem.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    void fullUpdateInvoiceItemWithPatch() throws Exception {
        // Initialize the database
        invoiceItemRepository.save(invoiceItem).block();

        int databaseSizeBeforeUpdate = invoiceItemRepository.findAll().collectList().block().size();

        // Update the invoiceItem using partial update
        InvoiceItem partialUpdatedInvoiceItem = new InvoiceItem();
        partialUpdatedInvoiceItem.setId(invoiceItem.getId());

        partialUpdatedInvoiceItem
            .itemId(UPDATED_ITEM_ID)
            .invoiceId(UPDATED_INVOICE_ID)
            .itemType(UPDATED_ITEM_TYPE)
            .unitPrice(UPDATED_UNIT_PRICE)
            .quantity(UPDATED_QUANTITY)
            .totalCost(UPDATED_TOTAL_COST)
            .status(UPDATED_STATUS);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedInvoiceItem.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedInvoiceItem))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the InvoiceItem in the database
        List<InvoiceItem> invoiceItemList = invoiceItemRepository.findAll().collectList().block();
        assertThat(invoiceItemList).hasSize(databaseSizeBeforeUpdate);
        InvoiceItem testInvoiceItem = invoiceItemList.get(invoiceItemList.size() - 1);
        assertThat(testInvoiceItem.getItemId()).isEqualTo(UPDATED_ITEM_ID);
        assertThat(testInvoiceItem.getInvoiceId()).isEqualTo(UPDATED_INVOICE_ID);
        assertThat(testInvoiceItem.getItemType()).isEqualTo(UPDATED_ITEM_TYPE);
        assertThat(testInvoiceItem.getUnitPrice()).isEqualTo(UPDATED_UNIT_PRICE);
        assertThat(testInvoiceItem.getQuantity()).isEqualTo(UPDATED_QUANTITY);
        assertThat(testInvoiceItem.getTotalCost()).isEqualTo(UPDATED_TOTAL_COST);
        assertThat(testInvoiceItem.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    void patchNonExistingInvoiceItem() throws Exception {
        int databaseSizeBeforeUpdate = invoiceItemRepository.findAll().collectList().block().size();
        invoiceItem.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, invoiceItem.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(invoiceItem))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the InvoiceItem in the database
        List<InvoiceItem> invoiceItemList = invoiceItemRepository.findAll().collectList().block();
        assertThat(invoiceItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchInvoiceItem() throws Exception {
        int databaseSizeBeforeUpdate = invoiceItemRepository.findAll().collectList().block().size();
        invoiceItem.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(invoiceItem))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the InvoiceItem in the database
        List<InvoiceItem> invoiceItemList = invoiceItemRepository.findAll().collectList().block();
        assertThat(invoiceItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamInvoiceItem() throws Exception {
        int databaseSizeBeforeUpdate = invoiceItemRepository.findAll().collectList().block().size();
        invoiceItem.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(invoiceItem))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the InvoiceItem in the database
        List<InvoiceItem> invoiceItemList = invoiceItemRepository.findAll().collectList().block();
        assertThat(invoiceItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteInvoiceItem() {
        // Initialize the database
        invoiceItemRepository.save(invoiceItem).block();

        int databaseSizeBeforeDelete = invoiceItemRepository.findAll().collectList().block().size();

        // Delete the invoiceItem
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, invoiceItem.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<InvoiceItem> invoiceItemList = invoiceItemRepository.findAll().collectList().block();
        assertThat(invoiceItemList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
