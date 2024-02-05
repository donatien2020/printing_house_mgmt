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
import org.nta.idc.donatien.domain.JobCardItem;
import org.nta.idc.donatien.domain.enumeration.JobCardItemStatuses;
import org.nta.idc.donatien.repository.EntityManager;
import org.nta.idc.donatien.repository.JobCardItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.reactive.server.WebTestClient;

/**
 * Integration tests for the {@link JobCardItemResource} REST controller.
 */
@IntegrationTest
@AutoConfigureWebTestClient(timeout = IntegrationTest.DEFAULT_ENTITY_TIMEOUT)
@WithMockUser
class JobCardItemResourceIT {

    private static final Long DEFAULT_QUANTITY = 1L;
    private static final Long UPDATED_QUANTITY = 2L;

    private static final Double DEFAULT_UNIT_PRICE = 1D;
    private static final Double UPDATED_UNIT_PRICE = 2D;

    private static final JobCardItemStatuses DEFAULT_STATUS = JobCardItemStatuses.USED;
    private static final JobCardItemStatuses UPDATED_STATUS = JobCardItemStatuses.DELETED;

    private static final String ENTITY_API_URL = "/api/job-card-items";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private JobCardItemRepository jobCardItemRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private WebTestClient webTestClient;

    private JobCardItem jobCardItem;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static JobCardItem createEntity(EntityManager em) {
        JobCardItem jobCardItem = new JobCardItem().quantity(DEFAULT_QUANTITY).unitPrice(DEFAULT_UNIT_PRICE).status(DEFAULT_STATUS);
        return jobCardItem;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static JobCardItem createUpdatedEntity(EntityManager em) {
        JobCardItem jobCardItem = new JobCardItem().quantity(UPDATED_QUANTITY).unitPrice(UPDATED_UNIT_PRICE).status(UPDATED_STATUS);
        return jobCardItem;
    }

    public static void deleteEntities(EntityManager em) {
        try {
            em.deleteAll(JobCardItem.class).block();
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
        jobCardItem = createEntity(em);
    }

    @Test
    void createJobCardItem() throws Exception {
        int databaseSizeBeforeCreate = jobCardItemRepository.findAll().collectList().block().size();
        // Create the JobCardItem
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(jobCardItem))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the JobCardItem in the database
        List<JobCardItem> jobCardItemList = jobCardItemRepository.findAll().collectList().block();
        assertThat(jobCardItemList).hasSize(databaseSizeBeforeCreate + 1);
        JobCardItem testJobCardItem = jobCardItemList.get(jobCardItemList.size() - 1);
        assertThat(testJobCardItem.getQuantity()).isEqualTo(DEFAULT_QUANTITY);
        assertThat(testJobCardItem.getUnitPrice()).isEqualTo(DEFAULT_UNIT_PRICE);
        assertThat(testJobCardItem.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    void createJobCardItemWithExistingId() throws Exception {
        // Create the JobCardItem with an existing ID
        jobCardItem.setId(1L);

        int databaseSizeBeforeCreate = jobCardItemRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(jobCardItem))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the JobCardItem in the database
        List<JobCardItem> jobCardItemList = jobCardItemRepository.findAll().collectList().block();
        assertThat(jobCardItemList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void checkQuantityIsRequired() throws Exception {
        int databaseSizeBeforeTest = jobCardItemRepository.findAll().collectList().block().size();
        // set the field null
        jobCardItem.setQuantity(null);

        // Create the JobCardItem, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(jobCardItem))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<JobCardItem> jobCardItemList = jobCardItemRepository.findAll().collectList().block();
        assertThat(jobCardItemList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkUnitPriceIsRequired() throws Exception {
        int databaseSizeBeforeTest = jobCardItemRepository.findAll().collectList().block().size();
        // set the field null
        jobCardItem.setUnitPrice(null);

        // Create the JobCardItem, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(jobCardItem))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<JobCardItem> jobCardItemList = jobCardItemRepository.findAll().collectList().block();
        assertThat(jobCardItemList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkStatusIsRequired() throws Exception {
        int databaseSizeBeforeTest = jobCardItemRepository.findAll().collectList().block().size();
        // set the field null
        jobCardItem.setStatus(null);

        // Create the JobCardItem, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(jobCardItem))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<JobCardItem> jobCardItemList = jobCardItemRepository.findAll().collectList().block();
        assertThat(jobCardItemList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void getAllJobCardItemsAsStream() {
        // Initialize the database
        jobCardItemRepository.save(jobCardItem).block();

        List<JobCardItem> jobCardItemList = webTestClient
            .get()
            .uri(ENTITY_API_URL)
            .accept(MediaType.APPLICATION_NDJSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentTypeCompatibleWith(MediaType.APPLICATION_NDJSON)
            .returnResult(JobCardItem.class)
            .getResponseBody()
            .filter(jobCardItem::equals)
            .collectList()
            .block(Duration.ofSeconds(5));

        assertThat(jobCardItemList).isNotNull();
        assertThat(jobCardItemList).hasSize(1);
        JobCardItem testJobCardItem = jobCardItemList.get(0);
        assertThat(testJobCardItem.getQuantity()).isEqualTo(DEFAULT_QUANTITY);
        assertThat(testJobCardItem.getUnitPrice()).isEqualTo(DEFAULT_UNIT_PRICE);
        assertThat(testJobCardItem.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    void getAllJobCardItems() {
        // Initialize the database
        jobCardItemRepository.save(jobCardItem).block();

        // Get all the jobCardItemList
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
            .value(hasItem(jobCardItem.getId().intValue()))
            .jsonPath("$.[*].quantity")
            .value(hasItem(DEFAULT_QUANTITY.intValue()))
            .jsonPath("$.[*].unitPrice")
            .value(hasItem(DEFAULT_UNIT_PRICE.doubleValue()))
            .jsonPath("$.[*].status")
            .value(hasItem(DEFAULT_STATUS.toString()));
    }

    @Test
    void getJobCardItem() {
        // Initialize the database
        jobCardItemRepository.save(jobCardItem).block();

        // Get the jobCardItem
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, jobCardItem.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(jobCardItem.getId().intValue()))
            .jsonPath("$.quantity")
            .value(is(DEFAULT_QUANTITY.intValue()))
            .jsonPath("$.unitPrice")
            .value(is(DEFAULT_UNIT_PRICE.doubleValue()))
            .jsonPath("$.status")
            .value(is(DEFAULT_STATUS.toString()));
    }

    @Test
    void getNonExistingJobCardItem() {
        // Get the jobCardItem
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putExistingJobCardItem() throws Exception {
        // Initialize the database
        jobCardItemRepository.save(jobCardItem).block();

        int databaseSizeBeforeUpdate = jobCardItemRepository.findAll().collectList().block().size();

        // Update the jobCardItem
        JobCardItem updatedJobCardItem = jobCardItemRepository.findById(jobCardItem.getId()).block();
        updatedJobCardItem.quantity(UPDATED_QUANTITY).unitPrice(UPDATED_UNIT_PRICE).status(UPDATED_STATUS);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, updatedJobCardItem.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(updatedJobCardItem))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the JobCardItem in the database
        List<JobCardItem> jobCardItemList = jobCardItemRepository.findAll().collectList().block();
        assertThat(jobCardItemList).hasSize(databaseSizeBeforeUpdate);
        JobCardItem testJobCardItem = jobCardItemList.get(jobCardItemList.size() - 1);
        assertThat(testJobCardItem.getQuantity()).isEqualTo(UPDATED_QUANTITY);
        assertThat(testJobCardItem.getUnitPrice()).isEqualTo(UPDATED_UNIT_PRICE);
        assertThat(testJobCardItem.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    void putNonExistingJobCardItem() throws Exception {
        int databaseSizeBeforeUpdate = jobCardItemRepository.findAll().collectList().block().size();
        jobCardItem.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, jobCardItem.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(jobCardItem))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the JobCardItem in the database
        List<JobCardItem> jobCardItemList = jobCardItemRepository.findAll().collectList().block();
        assertThat(jobCardItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchJobCardItem() throws Exception {
        int databaseSizeBeforeUpdate = jobCardItemRepository.findAll().collectList().block().size();
        jobCardItem.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(jobCardItem))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the JobCardItem in the database
        List<JobCardItem> jobCardItemList = jobCardItemRepository.findAll().collectList().block();
        assertThat(jobCardItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamJobCardItem() throws Exception {
        int databaseSizeBeforeUpdate = jobCardItemRepository.findAll().collectList().block().size();
        jobCardItem.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(jobCardItem))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the JobCardItem in the database
        List<JobCardItem> jobCardItemList = jobCardItemRepository.findAll().collectList().block();
        assertThat(jobCardItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateJobCardItemWithPatch() throws Exception {
        // Initialize the database
        jobCardItemRepository.save(jobCardItem).block();

        int databaseSizeBeforeUpdate = jobCardItemRepository.findAll().collectList().block().size();

        // Update the jobCardItem using partial update
        JobCardItem partialUpdatedJobCardItem = new JobCardItem();
        partialUpdatedJobCardItem.setId(jobCardItem.getId());

        partialUpdatedJobCardItem.status(UPDATED_STATUS);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedJobCardItem.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedJobCardItem))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the JobCardItem in the database
        List<JobCardItem> jobCardItemList = jobCardItemRepository.findAll().collectList().block();
        assertThat(jobCardItemList).hasSize(databaseSizeBeforeUpdate);
        JobCardItem testJobCardItem = jobCardItemList.get(jobCardItemList.size() - 1);
        assertThat(testJobCardItem.getQuantity()).isEqualTo(DEFAULT_QUANTITY);
        assertThat(testJobCardItem.getUnitPrice()).isEqualTo(DEFAULT_UNIT_PRICE);
        assertThat(testJobCardItem.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    void fullUpdateJobCardItemWithPatch() throws Exception {
        // Initialize the database
        jobCardItemRepository.save(jobCardItem).block();

        int databaseSizeBeforeUpdate = jobCardItemRepository.findAll().collectList().block().size();

        // Update the jobCardItem using partial update
        JobCardItem partialUpdatedJobCardItem = new JobCardItem();
        partialUpdatedJobCardItem.setId(jobCardItem.getId());

        partialUpdatedJobCardItem.quantity(UPDATED_QUANTITY).unitPrice(UPDATED_UNIT_PRICE).status(UPDATED_STATUS);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedJobCardItem.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedJobCardItem))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the JobCardItem in the database
        List<JobCardItem> jobCardItemList = jobCardItemRepository.findAll().collectList().block();
        assertThat(jobCardItemList).hasSize(databaseSizeBeforeUpdate);
        JobCardItem testJobCardItem = jobCardItemList.get(jobCardItemList.size() - 1);
        assertThat(testJobCardItem.getQuantity()).isEqualTo(UPDATED_QUANTITY);
        assertThat(testJobCardItem.getUnitPrice()).isEqualTo(UPDATED_UNIT_PRICE);
        assertThat(testJobCardItem.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    void patchNonExistingJobCardItem() throws Exception {
        int databaseSizeBeforeUpdate = jobCardItemRepository.findAll().collectList().block().size();
        jobCardItem.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, jobCardItem.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(jobCardItem))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the JobCardItem in the database
        List<JobCardItem> jobCardItemList = jobCardItemRepository.findAll().collectList().block();
        assertThat(jobCardItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchJobCardItem() throws Exception {
        int databaseSizeBeforeUpdate = jobCardItemRepository.findAll().collectList().block().size();
        jobCardItem.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(jobCardItem))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the JobCardItem in the database
        List<JobCardItem> jobCardItemList = jobCardItemRepository.findAll().collectList().block();
        assertThat(jobCardItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamJobCardItem() throws Exception {
        int databaseSizeBeforeUpdate = jobCardItemRepository.findAll().collectList().block().size();
        jobCardItem.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(jobCardItem))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the JobCardItem in the database
        List<JobCardItem> jobCardItemList = jobCardItemRepository.findAll().collectList().block();
        assertThat(jobCardItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteJobCardItem() {
        // Initialize the database
        jobCardItemRepository.save(jobCardItem).block();

        int databaseSizeBeforeDelete = jobCardItemRepository.findAll().collectList().block().size();

        // Delete the jobCardItem
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, jobCardItem.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<JobCardItem> jobCardItemList = jobCardItemRepository.findAll().collectList().block();
        assertThat(jobCardItemList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
