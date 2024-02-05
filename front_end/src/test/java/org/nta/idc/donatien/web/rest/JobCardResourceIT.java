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
import org.nta.idc.donatien.domain.JobCard;
import org.nta.idc.donatien.domain.enumeration.JobCardStatuses;
import org.nta.idc.donatien.domain.enumeration.PerformanceMeasures;
import org.nta.idc.donatien.repository.EntityManager;
import org.nta.idc.donatien.repository.JobCardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.reactive.server.WebTestClient;

/**
 * Integration tests for the {@link JobCardResource} REST controller.
 */
@IntegrationTest
@AutoConfigureWebTestClient(timeout = IntegrationTest.DEFAULT_ENTITY_TIMEOUT)
@WithMockUser
class JobCardResourceIT {

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final Long DEFAULT_QUANTITY = 1L;
    private static final Long UPDATED_QUANTITY = 2L;

    private static final Double DEFAULT_UNIT_PRICE = 1D;
    private static final Double UPDATED_UNIT_PRICE = 2D;

    private static final ZonedDateTime DEFAULT_STARTED_ON = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_STARTED_ON = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_COMPLETED_ON = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_COMPLETED_ON = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final Long DEFAULT_DIVISION_ID = 1L;
    private static final Long UPDATED_DIVISION_ID = 2L;

    private static final Long DEFAULT_DIVISION_NAME = 1L;
    private static final Long UPDATED_DIVISION_NAME = 2L;

    private static final PerformanceMeasures DEFAULT_PERFORMANCE = PerformanceMeasures.FIRST_ASSIGNMENT;
    private static final PerformanceMeasures UPDATED_PERFORMANCE = PerformanceMeasures.SECOND_ASSIGNMENT;

    private static final JobCardStatuses DEFAULT_STATUS = JobCardStatuses.ASSIGNED;
    private static final JobCardStatuses UPDATED_STATUS = JobCardStatuses.STARTED;

    private static final String ENTITY_API_URL = "/api/job-cards";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private JobCardRepository jobCardRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private WebTestClient webTestClient;

    private JobCard jobCard;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static JobCard createEntity(EntityManager em) {
        JobCard jobCard = new JobCard()
            .description(DEFAULT_DESCRIPTION)
            .quantity(DEFAULT_QUANTITY)
            .unitPrice(DEFAULT_UNIT_PRICE)
            .startedOn(DEFAULT_STARTED_ON)
            .completedOn(DEFAULT_COMPLETED_ON)
            .divisionId(DEFAULT_DIVISION_ID)
            .divisionName(DEFAULT_DIVISION_NAME)
            .performance(DEFAULT_PERFORMANCE)
            .status(DEFAULT_STATUS);
        return jobCard;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static JobCard createUpdatedEntity(EntityManager em) {
        JobCard jobCard = new JobCard()
            .description(UPDATED_DESCRIPTION)
            .quantity(UPDATED_QUANTITY)
            .unitPrice(UPDATED_UNIT_PRICE)
            .startedOn(UPDATED_STARTED_ON)
            .completedOn(UPDATED_COMPLETED_ON)
            .divisionId(UPDATED_DIVISION_ID)
            .divisionName(UPDATED_DIVISION_NAME)
            .performance(UPDATED_PERFORMANCE)
            .status(UPDATED_STATUS);
        return jobCard;
    }

    public static void deleteEntities(EntityManager em) {
        try {
            em.deleteAll(JobCard.class).block();
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
        jobCard = createEntity(em);
    }

    @Test
    void createJobCard() throws Exception {
        int databaseSizeBeforeCreate = jobCardRepository.findAll().collectList().block().size();
        // Create the JobCard
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(jobCard))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the JobCard in the database
        List<JobCard> jobCardList = jobCardRepository.findAll().collectList().block();
        assertThat(jobCardList).hasSize(databaseSizeBeforeCreate + 1);
        JobCard testJobCard = jobCardList.get(jobCardList.size() - 1);
        assertThat(testJobCard.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testJobCard.getQuantity()).isEqualTo(DEFAULT_QUANTITY);
        assertThat(testJobCard.getUnitPrice()).isEqualTo(DEFAULT_UNIT_PRICE);
        assertThat(testJobCard.getStartedOn()).isEqualTo(DEFAULT_STARTED_ON);
        assertThat(testJobCard.getCompletedOn()).isEqualTo(DEFAULT_COMPLETED_ON);
        assertThat(testJobCard.getDivisionId()).isEqualTo(DEFAULT_DIVISION_ID);
        assertThat(testJobCard.getDivisionName()).isEqualTo(DEFAULT_DIVISION_NAME);
        assertThat(testJobCard.getPerformance()).isEqualTo(DEFAULT_PERFORMANCE);
        assertThat(testJobCard.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    void createJobCardWithExistingId() throws Exception {
        // Create the JobCard with an existing ID
        jobCard.setId(1L);

        int databaseSizeBeforeCreate = jobCardRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(jobCard))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the JobCard in the database
        List<JobCard> jobCardList = jobCardRepository.findAll().collectList().block();
        assertThat(jobCardList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void checkQuantityIsRequired() throws Exception {
        int databaseSizeBeforeTest = jobCardRepository.findAll().collectList().block().size();
        // set the field null
        jobCard.setQuantity(null);

        // Create the JobCard, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(jobCard))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<JobCard> jobCardList = jobCardRepository.findAll().collectList().block();
        assertThat(jobCardList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkUnitPriceIsRequired() throws Exception {
        int databaseSizeBeforeTest = jobCardRepository.findAll().collectList().block().size();
        // set the field null
        jobCard.setUnitPrice(null);

        // Create the JobCard, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(jobCard))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<JobCard> jobCardList = jobCardRepository.findAll().collectList().block();
        assertThat(jobCardList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkDivisionIdIsRequired() throws Exception {
        int databaseSizeBeforeTest = jobCardRepository.findAll().collectList().block().size();
        // set the field null
        jobCard.setDivisionId(null);

        // Create the JobCard, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(jobCard))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<JobCard> jobCardList = jobCardRepository.findAll().collectList().block();
        assertThat(jobCardList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkDivisionNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = jobCardRepository.findAll().collectList().block().size();
        // set the field null
        jobCard.setDivisionName(null);

        // Create the JobCard, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(jobCard))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<JobCard> jobCardList = jobCardRepository.findAll().collectList().block();
        assertThat(jobCardList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkPerformanceIsRequired() throws Exception {
        int databaseSizeBeforeTest = jobCardRepository.findAll().collectList().block().size();
        // set the field null
        jobCard.setPerformance(null);

        // Create the JobCard, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(jobCard))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<JobCard> jobCardList = jobCardRepository.findAll().collectList().block();
        assertThat(jobCardList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkStatusIsRequired() throws Exception {
        int databaseSizeBeforeTest = jobCardRepository.findAll().collectList().block().size();
        // set the field null
        jobCard.setStatus(null);

        // Create the JobCard, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(jobCard))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<JobCard> jobCardList = jobCardRepository.findAll().collectList().block();
        assertThat(jobCardList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void getAllJobCards() {
        // Initialize the database
        jobCardRepository.save(jobCard).block();

        // Get all the jobCardList
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
            .value(hasItem(jobCard.getId().intValue()))
            .jsonPath("$.[*].description")
            .value(hasItem(DEFAULT_DESCRIPTION))
            .jsonPath("$.[*].quantity")
            .value(hasItem(DEFAULT_QUANTITY.intValue()))
            .jsonPath("$.[*].unitPrice")
            .value(hasItem(DEFAULT_UNIT_PRICE.doubleValue()))
            .jsonPath("$.[*].startedOn")
            .value(hasItem(sameInstant(DEFAULT_STARTED_ON)))
            .jsonPath("$.[*].completedOn")
            .value(hasItem(sameInstant(DEFAULT_COMPLETED_ON)))
            .jsonPath("$.[*].divisionId")
            .value(hasItem(DEFAULT_DIVISION_ID.intValue()))
            .jsonPath("$.[*].divisionName")
            .value(hasItem(DEFAULT_DIVISION_NAME.intValue()))
            .jsonPath("$.[*].performance")
            .value(hasItem(DEFAULT_PERFORMANCE.toString()))
            .jsonPath("$.[*].status")
            .value(hasItem(DEFAULT_STATUS.toString()));
    }

    @Test
    void getJobCard() {
        // Initialize the database
        jobCardRepository.save(jobCard).block();

        // Get the jobCard
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, jobCard.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(jobCard.getId().intValue()))
            .jsonPath("$.description")
            .value(is(DEFAULT_DESCRIPTION))
            .jsonPath("$.quantity")
            .value(is(DEFAULT_QUANTITY.intValue()))
            .jsonPath("$.unitPrice")
            .value(is(DEFAULT_UNIT_PRICE.doubleValue()))
            .jsonPath("$.startedOn")
            .value(is(sameInstant(DEFAULT_STARTED_ON)))
            .jsonPath("$.completedOn")
            .value(is(sameInstant(DEFAULT_COMPLETED_ON)))
            .jsonPath("$.divisionId")
            .value(is(DEFAULT_DIVISION_ID.intValue()))
            .jsonPath("$.divisionName")
            .value(is(DEFAULT_DIVISION_NAME.intValue()))
            .jsonPath("$.performance")
            .value(is(DEFAULT_PERFORMANCE.toString()))
            .jsonPath("$.status")
            .value(is(DEFAULT_STATUS.toString()));
    }

    @Test
    void getNonExistingJobCard() {
        // Get the jobCard
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putExistingJobCard() throws Exception {
        // Initialize the database
        jobCardRepository.save(jobCard).block();

        int databaseSizeBeforeUpdate = jobCardRepository.findAll().collectList().block().size();

        // Update the jobCard
        JobCard updatedJobCard = jobCardRepository.findById(jobCard.getId()).block();
        updatedJobCard
            .description(UPDATED_DESCRIPTION)
            .quantity(UPDATED_QUANTITY)
            .unitPrice(UPDATED_UNIT_PRICE)
            .startedOn(UPDATED_STARTED_ON)
            .completedOn(UPDATED_COMPLETED_ON)
            .divisionId(UPDATED_DIVISION_ID)
            .divisionName(UPDATED_DIVISION_NAME)
            .performance(UPDATED_PERFORMANCE)
            .status(UPDATED_STATUS);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, updatedJobCard.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(updatedJobCard))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the JobCard in the database
        List<JobCard> jobCardList = jobCardRepository.findAll().collectList().block();
        assertThat(jobCardList).hasSize(databaseSizeBeforeUpdate);
        JobCard testJobCard = jobCardList.get(jobCardList.size() - 1);
        assertThat(testJobCard.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testJobCard.getQuantity()).isEqualTo(UPDATED_QUANTITY);
        assertThat(testJobCard.getUnitPrice()).isEqualTo(UPDATED_UNIT_PRICE);
        assertThat(testJobCard.getStartedOn()).isEqualTo(UPDATED_STARTED_ON);
        assertThat(testJobCard.getCompletedOn()).isEqualTo(UPDATED_COMPLETED_ON);
        assertThat(testJobCard.getDivisionId()).isEqualTo(UPDATED_DIVISION_ID);
        assertThat(testJobCard.getDivisionName()).isEqualTo(UPDATED_DIVISION_NAME);
        assertThat(testJobCard.getPerformance()).isEqualTo(UPDATED_PERFORMANCE);
        assertThat(testJobCard.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    void putNonExistingJobCard() throws Exception {
        int databaseSizeBeforeUpdate = jobCardRepository.findAll().collectList().block().size();
        jobCard.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, jobCard.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(jobCard))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the JobCard in the database
        List<JobCard> jobCardList = jobCardRepository.findAll().collectList().block();
        assertThat(jobCardList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchJobCard() throws Exception {
        int databaseSizeBeforeUpdate = jobCardRepository.findAll().collectList().block().size();
        jobCard.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(jobCard))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the JobCard in the database
        List<JobCard> jobCardList = jobCardRepository.findAll().collectList().block();
        assertThat(jobCardList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamJobCard() throws Exception {
        int databaseSizeBeforeUpdate = jobCardRepository.findAll().collectList().block().size();
        jobCard.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(jobCard))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the JobCard in the database
        List<JobCard> jobCardList = jobCardRepository.findAll().collectList().block();
        assertThat(jobCardList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateJobCardWithPatch() throws Exception {
        // Initialize the database
        jobCardRepository.save(jobCard).block();

        int databaseSizeBeforeUpdate = jobCardRepository.findAll().collectList().block().size();

        // Update the jobCard using partial update
        JobCard partialUpdatedJobCard = new JobCard();
        partialUpdatedJobCard.setId(jobCard.getId());

        partialUpdatedJobCard
            .description(UPDATED_DESCRIPTION)
            .startedOn(UPDATED_STARTED_ON)
            .divisionId(UPDATED_DIVISION_ID)
            .divisionName(UPDATED_DIVISION_NAME)
            .status(UPDATED_STATUS);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedJobCard.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedJobCard))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the JobCard in the database
        List<JobCard> jobCardList = jobCardRepository.findAll().collectList().block();
        assertThat(jobCardList).hasSize(databaseSizeBeforeUpdate);
        JobCard testJobCard = jobCardList.get(jobCardList.size() - 1);
        assertThat(testJobCard.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testJobCard.getQuantity()).isEqualTo(DEFAULT_QUANTITY);
        assertThat(testJobCard.getUnitPrice()).isEqualTo(DEFAULT_UNIT_PRICE);
        assertThat(testJobCard.getStartedOn()).isEqualTo(UPDATED_STARTED_ON);
        assertThat(testJobCard.getCompletedOn()).isEqualTo(DEFAULT_COMPLETED_ON);
        assertThat(testJobCard.getDivisionId()).isEqualTo(UPDATED_DIVISION_ID);
        assertThat(testJobCard.getDivisionName()).isEqualTo(UPDATED_DIVISION_NAME);
        assertThat(testJobCard.getPerformance()).isEqualTo(DEFAULT_PERFORMANCE);
        assertThat(testJobCard.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    void fullUpdateJobCardWithPatch() throws Exception {
        // Initialize the database
        jobCardRepository.save(jobCard).block();

        int databaseSizeBeforeUpdate = jobCardRepository.findAll().collectList().block().size();

        // Update the jobCard using partial update
        JobCard partialUpdatedJobCard = new JobCard();
        partialUpdatedJobCard.setId(jobCard.getId());

        partialUpdatedJobCard
            .description(UPDATED_DESCRIPTION)
            .quantity(UPDATED_QUANTITY)
            .unitPrice(UPDATED_UNIT_PRICE)
            .startedOn(UPDATED_STARTED_ON)
            .completedOn(UPDATED_COMPLETED_ON)
            .divisionId(UPDATED_DIVISION_ID)
            .divisionName(UPDATED_DIVISION_NAME)
            .performance(UPDATED_PERFORMANCE)
            .status(UPDATED_STATUS);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedJobCard.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedJobCard))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the JobCard in the database
        List<JobCard> jobCardList = jobCardRepository.findAll().collectList().block();
        assertThat(jobCardList).hasSize(databaseSizeBeforeUpdate);
        JobCard testJobCard = jobCardList.get(jobCardList.size() - 1);
        assertThat(testJobCard.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testJobCard.getQuantity()).isEqualTo(UPDATED_QUANTITY);
        assertThat(testJobCard.getUnitPrice()).isEqualTo(UPDATED_UNIT_PRICE);
        assertThat(testJobCard.getStartedOn()).isEqualTo(UPDATED_STARTED_ON);
        assertThat(testJobCard.getCompletedOn()).isEqualTo(UPDATED_COMPLETED_ON);
        assertThat(testJobCard.getDivisionId()).isEqualTo(UPDATED_DIVISION_ID);
        assertThat(testJobCard.getDivisionName()).isEqualTo(UPDATED_DIVISION_NAME);
        assertThat(testJobCard.getPerformance()).isEqualTo(UPDATED_PERFORMANCE);
        assertThat(testJobCard.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    void patchNonExistingJobCard() throws Exception {
        int databaseSizeBeforeUpdate = jobCardRepository.findAll().collectList().block().size();
        jobCard.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, jobCard.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(jobCard))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the JobCard in the database
        List<JobCard> jobCardList = jobCardRepository.findAll().collectList().block();
        assertThat(jobCardList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchJobCard() throws Exception {
        int databaseSizeBeforeUpdate = jobCardRepository.findAll().collectList().block().size();
        jobCard.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(jobCard))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the JobCard in the database
        List<JobCard> jobCardList = jobCardRepository.findAll().collectList().block();
        assertThat(jobCardList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamJobCard() throws Exception {
        int databaseSizeBeforeUpdate = jobCardRepository.findAll().collectList().block().size();
        jobCard.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(jobCard))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the JobCard in the database
        List<JobCard> jobCardList = jobCardRepository.findAll().collectList().block();
        assertThat(jobCardList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteJobCard() {
        // Initialize the database
        jobCardRepository.save(jobCard).block();

        int databaseSizeBeforeDelete = jobCardRepository.findAll().collectList().block().size();

        // Delete the jobCard
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, jobCard.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<JobCard> jobCardList = jobCardRepository.findAll().collectList().block();
        assertThat(jobCardList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
