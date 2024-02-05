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
import org.nta.idc.donatien.domain.JobCardAssignment;
import org.nta.idc.donatien.domain.enumeration.JobCardAssignmentModes;
import org.nta.idc.donatien.domain.enumeration.JobCardAssignmentStatuses;
import org.nta.idc.donatien.repository.EntityManager;
import org.nta.idc.donatien.repository.JobCardAssignmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.reactive.server.WebTestClient;

/**
 * Integration tests for the {@link JobCardAssignmentResource} REST controller.
 */
@IntegrationTest
@AutoConfigureWebTestClient(timeout = IntegrationTest.DEFAULT_ENTITY_TIMEOUT)
@WithMockUser
class JobCardAssignmentResourceIT {

    private static final Long DEFAULT_ASSIGNED_TO_ID = 1L;
    private static final Long UPDATED_ASSIGNED_TO_ID = 2L;

    private static final Long DEFAULT_ASSIGNED_NAMES = 1L;
    private static final Long UPDATED_ASSIGNED_NAMES = 2L;

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final JobCardAssignmentModes DEFAULT_ASSIGNMENT_MODE = JobCardAssignmentModes.FIRST;
    private static final JobCardAssignmentModes UPDATED_ASSIGNMENT_MODE = JobCardAssignmentModes.REDO;

    private static final JobCardAssignmentStatuses DEFAULT_STATUS = JobCardAssignmentStatuses.ASSIGNED;
    private static final JobCardAssignmentStatuses UPDATED_STATUS = JobCardAssignmentStatuses.CANCELED;

    private static final String ENTITY_API_URL = "/api/job-card-assignments";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private JobCardAssignmentRepository jobCardAssignmentRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private WebTestClient webTestClient;

    private JobCardAssignment jobCardAssignment;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static JobCardAssignment createEntity(EntityManager em) {
        JobCardAssignment jobCardAssignment = new JobCardAssignment()
            .assignedToId(DEFAULT_ASSIGNED_TO_ID)
            .assignedNames(DEFAULT_ASSIGNED_NAMES)
            .description(DEFAULT_DESCRIPTION)
            .assignmentMode(DEFAULT_ASSIGNMENT_MODE)
            .status(DEFAULT_STATUS);
        return jobCardAssignment;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static JobCardAssignment createUpdatedEntity(EntityManager em) {
        JobCardAssignment jobCardAssignment = new JobCardAssignment()
            .assignedToId(UPDATED_ASSIGNED_TO_ID)
            .assignedNames(UPDATED_ASSIGNED_NAMES)
            .description(UPDATED_DESCRIPTION)
            .assignmentMode(UPDATED_ASSIGNMENT_MODE)
            .status(UPDATED_STATUS);
        return jobCardAssignment;
    }

    public static void deleteEntities(EntityManager em) {
        try {
            em.deleteAll(JobCardAssignment.class).block();
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
        jobCardAssignment = createEntity(em);
    }

    @Test
    void createJobCardAssignment() throws Exception {
        int databaseSizeBeforeCreate = jobCardAssignmentRepository.findAll().collectList().block().size();
        // Create the JobCardAssignment
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(jobCardAssignment))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the JobCardAssignment in the database
        List<JobCardAssignment> jobCardAssignmentList = jobCardAssignmentRepository.findAll().collectList().block();
        assertThat(jobCardAssignmentList).hasSize(databaseSizeBeforeCreate + 1);
        JobCardAssignment testJobCardAssignment = jobCardAssignmentList.get(jobCardAssignmentList.size() - 1);
        assertThat(testJobCardAssignment.getAssignedToId()).isEqualTo(DEFAULT_ASSIGNED_TO_ID);
        assertThat(testJobCardAssignment.getAssignedNames()).isEqualTo(DEFAULT_ASSIGNED_NAMES);
        assertThat(testJobCardAssignment.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testJobCardAssignment.getAssignmentMode()).isEqualTo(DEFAULT_ASSIGNMENT_MODE);
        assertThat(testJobCardAssignment.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    void createJobCardAssignmentWithExistingId() throws Exception {
        // Create the JobCardAssignment with an existing ID
        jobCardAssignment.setId(1L);

        int databaseSizeBeforeCreate = jobCardAssignmentRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(jobCardAssignment))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the JobCardAssignment in the database
        List<JobCardAssignment> jobCardAssignmentList = jobCardAssignmentRepository.findAll().collectList().block();
        assertThat(jobCardAssignmentList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void checkAssignedToIdIsRequired() throws Exception {
        int databaseSizeBeforeTest = jobCardAssignmentRepository.findAll().collectList().block().size();
        // set the field null
        jobCardAssignment.setAssignedToId(null);

        // Create the JobCardAssignment, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(jobCardAssignment))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<JobCardAssignment> jobCardAssignmentList = jobCardAssignmentRepository.findAll().collectList().block();
        assertThat(jobCardAssignmentList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkAssignedNamesIsRequired() throws Exception {
        int databaseSizeBeforeTest = jobCardAssignmentRepository.findAll().collectList().block().size();
        // set the field null
        jobCardAssignment.setAssignedNames(null);

        // Create the JobCardAssignment, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(jobCardAssignment))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<JobCardAssignment> jobCardAssignmentList = jobCardAssignmentRepository.findAll().collectList().block();
        assertThat(jobCardAssignmentList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkDescriptionIsRequired() throws Exception {
        int databaseSizeBeforeTest = jobCardAssignmentRepository.findAll().collectList().block().size();
        // set the field null
        jobCardAssignment.setDescription(null);

        // Create the JobCardAssignment, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(jobCardAssignment))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<JobCardAssignment> jobCardAssignmentList = jobCardAssignmentRepository.findAll().collectList().block();
        assertThat(jobCardAssignmentList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkAssignmentModeIsRequired() throws Exception {
        int databaseSizeBeforeTest = jobCardAssignmentRepository.findAll().collectList().block().size();
        // set the field null
        jobCardAssignment.setAssignmentMode(null);

        // Create the JobCardAssignment, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(jobCardAssignment))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<JobCardAssignment> jobCardAssignmentList = jobCardAssignmentRepository.findAll().collectList().block();
        assertThat(jobCardAssignmentList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkStatusIsRequired() throws Exception {
        int databaseSizeBeforeTest = jobCardAssignmentRepository.findAll().collectList().block().size();
        // set the field null
        jobCardAssignment.setStatus(null);

        // Create the JobCardAssignment, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(jobCardAssignment))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<JobCardAssignment> jobCardAssignmentList = jobCardAssignmentRepository.findAll().collectList().block();
        assertThat(jobCardAssignmentList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void getAllJobCardAssignmentsAsStream() {
        // Initialize the database
        jobCardAssignmentRepository.save(jobCardAssignment).block();

        List<JobCardAssignment> jobCardAssignmentList = webTestClient
            .get()
            .uri(ENTITY_API_URL)
            .accept(MediaType.APPLICATION_NDJSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentTypeCompatibleWith(MediaType.APPLICATION_NDJSON)
            .returnResult(JobCardAssignment.class)
            .getResponseBody()
            .filter(jobCardAssignment::equals)
            .collectList()
            .block(Duration.ofSeconds(5));

        assertThat(jobCardAssignmentList).isNotNull();
        assertThat(jobCardAssignmentList).hasSize(1);
        JobCardAssignment testJobCardAssignment = jobCardAssignmentList.get(0);
        assertThat(testJobCardAssignment.getAssignedToId()).isEqualTo(DEFAULT_ASSIGNED_TO_ID);
        assertThat(testJobCardAssignment.getAssignedNames()).isEqualTo(DEFAULT_ASSIGNED_NAMES);
        assertThat(testJobCardAssignment.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testJobCardAssignment.getAssignmentMode()).isEqualTo(DEFAULT_ASSIGNMENT_MODE);
        assertThat(testJobCardAssignment.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    void getAllJobCardAssignments() {
        // Initialize the database
        jobCardAssignmentRepository.save(jobCardAssignment).block();

        // Get all the jobCardAssignmentList
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
            .value(hasItem(jobCardAssignment.getId().intValue()))
            .jsonPath("$.[*].assignedToId")
            .value(hasItem(DEFAULT_ASSIGNED_TO_ID.intValue()))
            .jsonPath("$.[*].assignedNames")
            .value(hasItem(DEFAULT_ASSIGNED_NAMES.intValue()))
            .jsonPath("$.[*].description")
            .value(hasItem(DEFAULT_DESCRIPTION))
            .jsonPath("$.[*].assignmentMode")
            .value(hasItem(DEFAULT_ASSIGNMENT_MODE.toString()))
            .jsonPath("$.[*].status")
            .value(hasItem(DEFAULT_STATUS.toString()));
    }

    @Test
    void getJobCardAssignment() {
        // Initialize the database
        jobCardAssignmentRepository.save(jobCardAssignment).block();

        // Get the jobCardAssignment
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, jobCardAssignment.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(jobCardAssignment.getId().intValue()))
            .jsonPath("$.assignedToId")
            .value(is(DEFAULT_ASSIGNED_TO_ID.intValue()))
            .jsonPath("$.assignedNames")
            .value(is(DEFAULT_ASSIGNED_NAMES.intValue()))
            .jsonPath("$.description")
            .value(is(DEFAULT_DESCRIPTION))
            .jsonPath("$.assignmentMode")
            .value(is(DEFAULT_ASSIGNMENT_MODE.toString()))
            .jsonPath("$.status")
            .value(is(DEFAULT_STATUS.toString()));
    }

    @Test
    void getNonExistingJobCardAssignment() {
        // Get the jobCardAssignment
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putExistingJobCardAssignment() throws Exception {
        // Initialize the database
        jobCardAssignmentRepository.save(jobCardAssignment).block();

        int databaseSizeBeforeUpdate = jobCardAssignmentRepository.findAll().collectList().block().size();

        // Update the jobCardAssignment
        JobCardAssignment updatedJobCardAssignment = jobCardAssignmentRepository.findById(jobCardAssignment.getId()).block();
        updatedJobCardAssignment
            .assignedToId(UPDATED_ASSIGNED_TO_ID)
            .assignedNames(UPDATED_ASSIGNED_NAMES)
            .description(UPDATED_DESCRIPTION)
            .assignmentMode(UPDATED_ASSIGNMENT_MODE)
            .status(UPDATED_STATUS);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, updatedJobCardAssignment.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(updatedJobCardAssignment))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the JobCardAssignment in the database
        List<JobCardAssignment> jobCardAssignmentList = jobCardAssignmentRepository.findAll().collectList().block();
        assertThat(jobCardAssignmentList).hasSize(databaseSizeBeforeUpdate);
        JobCardAssignment testJobCardAssignment = jobCardAssignmentList.get(jobCardAssignmentList.size() - 1);
        assertThat(testJobCardAssignment.getAssignedToId()).isEqualTo(UPDATED_ASSIGNED_TO_ID);
        assertThat(testJobCardAssignment.getAssignedNames()).isEqualTo(UPDATED_ASSIGNED_NAMES);
        assertThat(testJobCardAssignment.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testJobCardAssignment.getAssignmentMode()).isEqualTo(UPDATED_ASSIGNMENT_MODE);
        assertThat(testJobCardAssignment.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    void putNonExistingJobCardAssignment() throws Exception {
        int databaseSizeBeforeUpdate = jobCardAssignmentRepository.findAll().collectList().block().size();
        jobCardAssignment.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, jobCardAssignment.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(jobCardAssignment))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the JobCardAssignment in the database
        List<JobCardAssignment> jobCardAssignmentList = jobCardAssignmentRepository.findAll().collectList().block();
        assertThat(jobCardAssignmentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchJobCardAssignment() throws Exception {
        int databaseSizeBeforeUpdate = jobCardAssignmentRepository.findAll().collectList().block().size();
        jobCardAssignment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(jobCardAssignment))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the JobCardAssignment in the database
        List<JobCardAssignment> jobCardAssignmentList = jobCardAssignmentRepository.findAll().collectList().block();
        assertThat(jobCardAssignmentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamJobCardAssignment() throws Exception {
        int databaseSizeBeforeUpdate = jobCardAssignmentRepository.findAll().collectList().block().size();
        jobCardAssignment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(jobCardAssignment))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the JobCardAssignment in the database
        List<JobCardAssignment> jobCardAssignmentList = jobCardAssignmentRepository.findAll().collectList().block();
        assertThat(jobCardAssignmentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateJobCardAssignmentWithPatch() throws Exception {
        // Initialize the database
        jobCardAssignmentRepository.save(jobCardAssignment).block();

        int databaseSizeBeforeUpdate = jobCardAssignmentRepository.findAll().collectList().block().size();

        // Update the jobCardAssignment using partial update
        JobCardAssignment partialUpdatedJobCardAssignment = new JobCardAssignment();
        partialUpdatedJobCardAssignment.setId(jobCardAssignment.getId());

        partialUpdatedJobCardAssignment.assignedNames(UPDATED_ASSIGNED_NAMES).assignmentMode(UPDATED_ASSIGNMENT_MODE);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedJobCardAssignment.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedJobCardAssignment))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the JobCardAssignment in the database
        List<JobCardAssignment> jobCardAssignmentList = jobCardAssignmentRepository.findAll().collectList().block();
        assertThat(jobCardAssignmentList).hasSize(databaseSizeBeforeUpdate);
        JobCardAssignment testJobCardAssignment = jobCardAssignmentList.get(jobCardAssignmentList.size() - 1);
        assertThat(testJobCardAssignment.getAssignedToId()).isEqualTo(DEFAULT_ASSIGNED_TO_ID);
        assertThat(testJobCardAssignment.getAssignedNames()).isEqualTo(UPDATED_ASSIGNED_NAMES);
        assertThat(testJobCardAssignment.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testJobCardAssignment.getAssignmentMode()).isEqualTo(UPDATED_ASSIGNMENT_MODE);
        assertThat(testJobCardAssignment.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    void fullUpdateJobCardAssignmentWithPatch() throws Exception {
        // Initialize the database
        jobCardAssignmentRepository.save(jobCardAssignment).block();

        int databaseSizeBeforeUpdate = jobCardAssignmentRepository.findAll().collectList().block().size();

        // Update the jobCardAssignment using partial update
        JobCardAssignment partialUpdatedJobCardAssignment = new JobCardAssignment();
        partialUpdatedJobCardAssignment.setId(jobCardAssignment.getId());

        partialUpdatedJobCardAssignment
            .assignedToId(UPDATED_ASSIGNED_TO_ID)
            .assignedNames(UPDATED_ASSIGNED_NAMES)
            .description(UPDATED_DESCRIPTION)
            .assignmentMode(UPDATED_ASSIGNMENT_MODE)
            .status(UPDATED_STATUS);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedJobCardAssignment.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedJobCardAssignment))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the JobCardAssignment in the database
        List<JobCardAssignment> jobCardAssignmentList = jobCardAssignmentRepository.findAll().collectList().block();
        assertThat(jobCardAssignmentList).hasSize(databaseSizeBeforeUpdate);
        JobCardAssignment testJobCardAssignment = jobCardAssignmentList.get(jobCardAssignmentList.size() - 1);
        assertThat(testJobCardAssignment.getAssignedToId()).isEqualTo(UPDATED_ASSIGNED_TO_ID);
        assertThat(testJobCardAssignment.getAssignedNames()).isEqualTo(UPDATED_ASSIGNED_NAMES);
        assertThat(testJobCardAssignment.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testJobCardAssignment.getAssignmentMode()).isEqualTo(UPDATED_ASSIGNMENT_MODE);
        assertThat(testJobCardAssignment.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    void patchNonExistingJobCardAssignment() throws Exception {
        int databaseSizeBeforeUpdate = jobCardAssignmentRepository.findAll().collectList().block().size();
        jobCardAssignment.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, jobCardAssignment.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(jobCardAssignment))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the JobCardAssignment in the database
        List<JobCardAssignment> jobCardAssignmentList = jobCardAssignmentRepository.findAll().collectList().block();
        assertThat(jobCardAssignmentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchJobCardAssignment() throws Exception {
        int databaseSizeBeforeUpdate = jobCardAssignmentRepository.findAll().collectList().block().size();
        jobCardAssignment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(jobCardAssignment))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the JobCardAssignment in the database
        List<JobCardAssignment> jobCardAssignmentList = jobCardAssignmentRepository.findAll().collectList().block();
        assertThat(jobCardAssignmentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamJobCardAssignment() throws Exception {
        int databaseSizeBeforeUpdate = jobCardAssignmentRepository.findAll().collectList().block().size();
        jobCardAssignment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(jobCardAssignment))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the JobCardAssignment in the database
        List<JobCardAssignment> jobCardAssignmentList = jobCardAssignmentRepository.findAll().collectList().block();
        assertThat(jobCardAssignmentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteJobCardAssignment() {
        // Initialize the database
        jobCardAssignmentRepository.save(jobCardAssignment).block();

        int databaseSizeBeforeDelete = jobCardAssignmentRepository.findAll().collectList().block().size();

        // Delete the jobCardAssignment
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, jobCardAssignment.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<JobCardAssignment> jobCardAssignmentList = jobCardAssignmentRepository.findAll().collectList().block();
        assertThat(jobCardAssignmentList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
