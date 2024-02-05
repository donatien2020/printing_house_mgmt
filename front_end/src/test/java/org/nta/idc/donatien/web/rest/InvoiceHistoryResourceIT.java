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
import org.nta.idc.donatien.domain.InvoiceHistory;
import org.nta.idc.donatien.domain.enumeration.InvoiceActions;
import org.nta.idc.donatien.repository.EntityManager;
import org.nta.idc.donatien.repository.InvoiceHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.reactive.server.WebTestClient;

/**
 * Integration tests for the {@link InvoiceHistoryResource} REST controller.
 */
@IntegrationTest
@AutoConfigureWebTestClient(timeout = IntegrationTest.DEFAULT_ENTITY_TIMEOUT)
@WithMockUser
class InvoiceHistoryResourceIT {

    private static final Long DEFAULT_INVOICE_ID = 1L;
    private static final Long UPDATED_INVOICE_ID = 2L;

    private static final InvoiceActions DEFAULT_ACTION = InvoiceActions.CREATION;
    private static final InvoiceActions UPDATED_ACTION = InvoiceActions.MODIFICATION;

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_DONE_ON = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DONE_ON = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String ENTITY_API_URL = "/api/invoice-histories";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private InvoiceHistoryRepository invoiceHistoryRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private WebTestClient webTestClient;

    private InvoiceHistory invoiceHistory;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static InvoiceHistory createEntity(EntityManager em) {
        InvoiceHistory invoiceHistory = new InvoiceHistory()
            .invoiceId(DEFAULT_INVOICE_ID)
            .action(DEFAULT_ACTION)
            .description(DEFAULT_DESCRIPTION)
            .doneOn(DEFAULT_DONE_ON);
        return invoiceHistory;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static InvoiceHistory createUpdatedEntity(EntityManager em) {
        InvoiceHistory invoiceHistory = new InvoiceHistory()
            .invoiceId(UPDATED_INVOICE_ID)
            .action(UPDATED_ACTION)
            .description(UPDATED_DESCRIPTION)
            .doneOn(UPDATED_DONE_ON);
        return invoiceHistory;
    }

    public static void deleteEntities(EntityManager em) {
        try {
            em.deleteAll(InvoiceHistory.class).block();
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
        invoiceHistory = createEntity(em);
    }

    @Test
    void createInvoiceHistory() throws Exception {
        int databaseSizeBeforeCreate = invoiceHistoryRepository.findAll().collectList().block().size();
        // Create the InvoiceHistory
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(invoiceHistory))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the InvoiceHistory in the database
        List<InvoiceHistory> invoiceHistoryList = invoiceHistoryRepository.findAll().collectList().block();
        assertThat(invoiceHistoryList).hasSize(databaseSizeBeforeCreate + 1);
        InvoiceHistory testInvoiceHistory = invoiceHistoryList.get(invoiceHistoryList.size() - 1);
        assertThat(testInvoiceHistory.getInvoiceId()).isEqualTo(DEFAULT_INVOICE_ID);
        assertThat(testInvoiceHistory.getAction()).isEqualTo(DEFAULT_ACTION);
        assertThat(testInvoiceHistory.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testInvoiceHistory.getDoneOn()).isEqualTo(DEFAULT_DONE_ON);
    }

    @Test
    void createInvoiceHistoryWithExistingId() throws Exception {
        // Create the InvoiceHistory with an existing ID
        invoiceHistory.setId(1L);

        int databaseSizeBeforeCreate = invoiceHistoryRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(invoiceHistory))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the InvoiceHistory in the database
        List<InvoiceHistory> invoiceHistoryList = invoiceHistoryRepository.findAll().collectList().block();
        assertThat(invoiceHistoryList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void checkInvoiceIdIsRequired() throws Exception {
        int databaseSizeBeforeTest = invoiceHistoryRepository.findAll().collectList().block().size();
        // set the field null
        invoiceHistory.setInvoiceId(null);

        // Create the InvoiceHistory, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(invoiceHistory))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<InvoiceHistory> invoiceHistoryList = invoiceHistoryRepository.findAll().collectList().block();
        assertThat(invoiceHistoryList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkActionIsRequired() throws Exception {
        int databaseSizeBeforeTest = invoiceHistoryRepository.findAll().collectList().block().size();
        // set the field null
        invoiceHistory.setAction(null);

        // Create the InvoiceHistory, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(invoiceHistory))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<InvoiceHistory> invoiceHistoryList = invoiceHistoryRepository.findAll().collectList().block();
        assertThat(invoiceHistoryList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkDescriptionIsRequired() throws Exception {
        int databaseSizeBeforeTest = invoiceHistoryRepository.findAll().collectList().block().size();
        // set the field null
        invoiceHistory.setDescription(null);

        // Create the InvoiceHistory, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(invoiceHistory))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<InvoiceHistory> invoiceHistoryList = invoiceHistoryRepository.findAll().collectList().block();
        assertThat(invoiceHistoryList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkDoneOnIsRequired() throws Exception {
        int databaseSizeBeforeTest = invoiceHistoryRepository.findAll().collectList().block().size();
        // set the field null
        invoiceHistory.setDoneOn(null);

        // Create the InvoiceHistory, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(invoiceHistory))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<InvoiceHistory> invoiceHistoryList = invoiceHistoryRepository.findAll().collectList().block();
        assertThat(invoiceHistoryList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void getAllInvoiceHistoriesAsStream() {
        // Initialize the database
        invoiceHistoryRepository.save(invoiceHistory).block();

        List<InvoiceHistory> invoiceHistoryList = webTestClient
            .get()
            .uri(ENTITY_API_URL)
            .accept(MediaType.APPLICATION_NDJSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentTypeCompatibleWith(MediaType.APPLICATION_NDJSON)
            .returnResult(InvoiceHistory.class)
            .getResponseBody()
            .filter(invoiceHistory::equals)
            .collectList()
            .block(Duration.ofSeconds(5));

        assertThat(invoiceHistoryList).isNotNull();
        assertThat(invoiceHistoryList).hasSize(1);
        InvoiceHistory testInvoiceHistory = invoiceHistoryList.get(0);
        assertThat(testInvoiceHistory.getInvoiceId()).isEqualTo(DEFAULT_INVOICE_ID);
        assertThat(testInvoiceHistory.getAction()).isEqualTo(DEFAULT_ACTION);
        assertThat(testInvoiceHistory.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testInvoiceHistory.getDoneOn()).isEqualTo(DEFAULT_DONE_ON);
    }

    @Test
    void getAllInvoiceHistories() {
        // Initialize the database
        invoiceHistoryRepository.save(invoiceHistory).block();

        // Get all the invoiceHistoryList
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
            .value(hasItem(invoiceHistory.getId().intValue()))
            .jsonPath("$.[*].invoiceId")
            .value(hasItem(DEFAULT_INVOICE_ID.intValue()))
            .jsonPath("$.[*].action")
            .value(hasItem(DEFAULT_ACTION.toString()))
            .jsonPath("$.[*].description")
            .value(hasItem(DEFAULT_DESCRIPTION))
            .jsonPath("$.[*].doneOn")
            .value(hasItem(sameInstant(DEFAULT_DONE_ON)));
    }

    @Test
    void getInvoiceHistory() {
        // Initialize the database
        invoiceHistoryRepository.save(invoiceHistory).block();

        // Get the invoiceHistory
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, invoiceHistory.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(invoiceHistory.getId().intValue()))
            .jsonPath("$.invoiceId")
            .value(is(DEFAULT_INVOICE_ID.intValue()))
            .jsonPath("$.action")
            .value(is(DEFAULT_ACTION.toString()))
            .jsonPath("$.description")
            .value(is(DEFAULT_DESCRIPTION))
            .jsonPath("$.doneOn")
            .value(is(sameInstant(DEFAULT_DONE_ON)));
    }

    @Test
    void getNonExistingInvoiceHistory() {
        // Get the invoiceHistory
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putExistingInvoiceHistory() throws Exception {
        // Initialize the database
        invoiceHistoryRepository.save(invoiceHistory).block();

        int databaseSizeBeforeUpdate = invoiceHistoryRepository.findAll().collectList().block().size();

        // Update the invoiceHistory
        InvoiceHistory updatedInvoiceHistory = invoiceHistoryRepository.findById(invoiceHistory.getId()).block();
        updatedInvoiceHistory.invoiceId(UPDATED_INVOICE_ID).action(UPDATED_ACTION).description(UPDATED_DESCRIPTION).doneOn(UPDATED_DONE_ON);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, updatedInvoiceHistory.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(updatedInvoiceHistory))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the InvoiceHistory in the database
        List<InvoiceHistory> invoiceHistoryList = invoiceHistoryRepository.findAll().collectList().block();
        assertThat(invoiceHistoryList).hasSize(databaseSizeBeforeUpdate);
        InvoiceHistory testInvoiceHistory = invoiceHistoryList.get(invoiceHistoryList.size() - 1);
        assertThat(testInvoiceHistory.getInvoiceId()).isEqualTo(UPDATED_INVOICE_ID);
        assertThat(testInvoiceHistory.getAction()).isEqualTo(UPDATED_ACTION);
        assertThat(testInvoiceHistory.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testInvoiceHistory.getDoneOn()).isEqualTo(UPDATED_DONE_ON);
    }

    @Test
    void putNonExistingInvoiceHistory() throws Exception {
        int databaseSizeBeforeUpdate = invoiceHistoryRepository.findAll().collectList().block().size();
        invoiceHistory.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, invoiceHistory.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(invoiceHistory))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the InvoiceHistory in the database
        List<InvoiceHistory> invoiceHistoryList = invoiceHistoryRepository.findAll().collectList().block();
        assertThat(invoiceHistoryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchInvoiceHistory() throws Exception {
        int databaseSizeBeforeUpdate = invoiceHistoryRepository.findAll().collectList().block().size();
        invoiceHistory.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(invoiceHistory))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the InvoiceHistory in the database
        List<InvoiceHistory> invoiceHistoryList = invoiceHistoryRepository.findAll().collectList().block();
        assertThat(invoiceHistoryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamInvoiceHistory() throws Exception {
        int databaseSizeBeforeUpdate = invoiceHistoryRepository.findAll().collectList().block().size();
        invoiceHistory.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(invoiceHistory))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the InvoiceHistory in the database
        List<InvoiceHistory> invoiceHistoryList = invoiceHistoryRepository.findAll().collectList().block();
        assertThat(invoiceHistoryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateInvoiceHistoryWithPatch() throws Exception {
        // Initialize the database
        invoiceHistoryRepository.save(invoiceHistory).block();

        int databaseSizeBeforeUpdate = invoiceHistoryRepository.findAll().collectList().block().size();

        // Update the invoiceHistory using partial update
        InvoiceHistory partialUpdatedInvoiceHistory = new InvoiceHistory();
        partialUpdatedInvoiceHistory.setId(invoiceHistory.getId());

        partialUpdatedInvoiceHistory.description(UPDATED_DESCRIPTION);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedInvoiceHistory.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedInvoiceHistory))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the InvoiceHistory in the database
        List<InvoiceHistory> invoiceHistoryList = invoiceHistoryRepository.findAll().collectList().block();
        assertThat(invoiceHistoryList).hasSize(databaseSizeBeforeUpdate);
        InvoiceHistory testInvoiceHistory = invoiceHistoryList.get(invoiceHistoryList.size() - 1);
        assertThat(testInvoiceHistory.getInvoiceId()).isEqualTo(DEFAULT_INVOICE_ID);
        assertThat(testInvoiceHistory.getAction()).isEqualTo(DEFAULT_ACTION);
        assertThat(testInvoiceHistory.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testInvoiceHistory.getDoneOn()).isEqualTo(DEFAULT_DONE_ON);
    }

    @Test
    void fullUpdateInvoiceHistoryWithPatch() throws Exception {
        // Initialize the database
        invoiceHistoryRepository.save(invoiceHistory).block();

        int databaseSizeBeforeUpdate = invoiceHistoryRepository.findAll().collectList().block().size();

        // Update the invoiceHistory using partial update
        InvoiceHistory partialUpdatedInvoiceHistory = new InvoiceHistory();
        partialUpdatedInvoiceHistory.setId(invoiceHistory.getId());

        partialUpdatedInvoiceHistory
            .invoiceId(UPDATED_INVOICE_ID)
            .action(UPDATED_ACTION)
            .description(UPDATED_DESCRIPTION)
            .doneOn(UPDATED_DONE_ON);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedInvoiceHistory.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedInvoiceHistory))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the InvoiceHistory in the database
        List<InvoiceHistory> invoiceHistoryList = invoiceHistoryRepository.findAll().collectList().block();
        assertThat(invoiceHistoryList).hasSize(databaseSizeBeforeUpdate);
        InvoiceHistory testInvoiceHistory = invoiceHistoryList.get(invoiceHistoryList.size() - 1);
        assertThat(testInvoiceHistory.getInvoiceId()).isEqualTo(UPDATED_INVOICE_ID);
        assertThat(testInvoiceHistory.getAction()).isEqualTo(UPDATED_ACTION);
        assertThat(testInvoiceHistory.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testInvoiceHistory.getDoneOn()).isEqualTo(UPDATED_DONE_ON);
    }

    @Test
    void patchNonExistingInvoiceHistory() throws Exception {
        int databaseSizeBeforeUpdate = invoiceHistoryRepository.findAll().collectList().block().size();
        invoiceHistory.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, invoiceHistory.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(invoiceHistory))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the InvoiceHistory in the database
        List<InvoiceHistory> invoiceHistoryList = invoiceHistoryRepository.findAll().collectList().block();
        assertThat(invoiceHistoryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchInvoiceHistory() throws Exception {
        int databaseSizeBeforeUpdate = invoiceHistoryRepository.findAll().collectList().block().size();
        invoiceHistory.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(invoiceHistory))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the InvoiceHistory in the database
        List<InvoiceHistory> invoiceHistoryList = invoiceHistoryRepository.findAll().collectList().block();
        assertThat(invoiceHistoryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamInvoiceHistory() throws Exception {
        int databaseSizeBeforeUpdate = invoiceHistoryRepository.findAll().collectList().block().size();
        invoiceHistory.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(invoiceHistory))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the InvoiceHistory in the database
        List<InvoiceHistory> invoiceHistoryList = invoiceHistoryRepository.findAll().collectList().block();
        assertThat(invoiceHistoryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteInvoiceHistory() {
        // Initialize the database
        invoiceHistoryRepository.save(invoiceHistory).block();

        int databaseSizeBeforeDelete = invoiceHistoryRepository.findAll().collectList().block().size();

        // Delete the invoiceHistory
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, invoiceHistory.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<InvoiceHistory> invoiceHistoryList = invoiceHistoryRepository.findAll().collectList().block();
        assertThat(invoiceHistoryList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
