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
import org.nta.idc.donatien.domain.UserDivisionEnrolment;
import org.nta.idc.donatien.domain.enumeration.EnrollmentStatus;
import org.nta.idc.donatien.repository.EntityManager;
import org.nta.idc.donatien.repository.UserDivisionEnrolmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.reactive.server.WebTestClient;

/**
 * Integration tests for the {@link UserDivisionEnrolmentResource} REST controller.
 */
@IntegrationTest
@AutoConfigureWebTestClient(timeout = IntegrationTest.DEFAULT_ENTITY_TIMEOUT)
@WithMockUser
class UserDivisionEnrolmentResourceIT {

    private static final ZonedDateTime DEFAULT_STARTED_ON = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_STARTED_ON = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_ENDED_ON = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_ENDED_ON = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final EnrollmentStatus DEFAULT_STATUS = EnrollmentStatus.ENROLLED;
    private static final EnrollmentStatus UPDATED_STATUS = EnrollmentStatus.REMOVED;

    private static final String ENTITY_API_URL = "/api/user-division-enrolments";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private UserDivisionEnrolmentRepository userDivisionEnrolmentRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private WebTestClient webTestClient;

    private UserDivisionEnrolment userDivisionEnrolment;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserDivisionEnrolment createEntity(EntityManager em) {
        UserDivisionEnrolment userDivisionEnrolment = new UserDivisionEnrolment()
            .startedOn(DEFAULT_STARTED_ON)
            .endedOn(DEFAULT_ENDED_ON)
            .status(DEFAULT_STATUS);
        return userDivisionEnrolment;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserDivisionEnrolment createUpdatedEntity(EntityManager em) {
        UserDivisionEnrolment userDivisionEnrolment = new UserDivisionEnrolment()
            .startedOn(UPDATED_STARTED_ON)
            .endedOn(UPDATED_ENDED_ON)
            .status(UPDATED_STATUS);
        return userDivisionEnrolment;
    }

    public static void deleteEntities(EntityManager em) {
        try {
            em.deleteAll(UserDivisionEnrolment.class).block();
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
        userDivisionEnrolment = createEntity(em);
    }

    @Test
    void createUserDivisionEnrolment() throws Exception {
        int databaseSizeBeforeCreate = userDivisionEnrolmentRepository.findAll().collectList().block().size();
        // Create the UserDivisionEnrolment
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(userDivisionEnrolment))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the UserDivisionEnrolment in the database
        List<UserDivisionEnrolment> userDivisionEnrolmentList = userDivisionEnrolmentRepository.findAll().collectList().block();
        assertThat(userDivisionEnrolmentList).hasSize(databaseSizeBeforeCreate + 1);
        UserDivisionEnrolment testUserDivisionEnrolment = userDivisionEnrolmentList.get(userDivisionEnrolmentList.size() - 1);
        assertThat(testUserDivisionEnrolment.getStartedOn()).isEqualTo(DEFAULT_STARTED_ON);
        assertThat(testUserDivisionEnrolment.getEndedOn()).isEqualTo(DEFAULT_ENDED_ON);
        assertThat(testUserDivisionEnrolment.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    void createUserDivisionEnrolmentWithExistingId() throws Exception {
        // Create the UserDivisionEnrolment with an existing ID
        userDivisionEnrolment.setId(1L);

        int databaseSizeBeforeCreate = userDivisionEnrolmentRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(userDivisionEnrolment))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the UserDivisionEnrolment in the database
        List<UserDivisionEnrolment> userDivisionEnrolmentList = userDivisionEnrolmentRepository.findAll().collectList().block();
        assertThat(userDivisionEnrolmentList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void checkStartedOnIsRequired() throws Exception {
        int databaseSizeBeforeTest = userDivisionEnrolmentRepository.findAll().collectList().block().size();
        // set the field null
        userDivisionEnrolment.setStartedOn(null);

        // Create the UserDivisionEnrolment, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(userDivisionEnrolment))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<UserDivisionEnrolment> userDivisionEnrolmentList = userDivisionEnrolmentRepository.findAll().collectList().block();
        assertThat(userDivisionEnrolmentList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkStatusIsRequired() throws Exception {
        int databaseSizeBeforeTest = userDivisionEnrolmentRepository.findAll().collectList().block().size();
        // set the field null
        userDivisionEnrolment.setStatus(null);

        // Create the UserDivisionEnrolment, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(userDivisionEnrolment))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<UserDivisionEnrolment> userDivisionEnrolmentList = userDivisionEnrolmentRepository.findAll().collectList().block();
        assertThat(userDivisionEnrolmentList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void getAllUserDivisionEnrolmentsAsStream() {
        // Initialize the database
        userDivisionEnrolmentRepository.save(userDivisionEnrolment).block();

        List<UserDivisionEnrolment> userDivisionEnrolmentList = webTestClient
            .get()
            .uri(ENTITY_API_URL)
            .accept(MediaType.APPLICATION_NDJSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentTypeCompatibleWith(MediaType.APPLICATION_NDJSON)
            .returnResult(UserDivisionEnrolment.class)
            .getResponseBody()
            .filter(userDivisionEnrolment::equals)
            .collectList()
            .block(Duration.ofSeconds(5));

        assertThat(userDivisionEnrolmentList).isNotNull();
        assertThat(userDivisionEnrolmentList).hasSize(1);
        UserDivisionEnrolment testUserDivisionEnrolment = userDivisionEnrolmentList.get(0);
        assertThat(testUserDivisionEnrolment.getStartedOn()).isEqualTo(DEFAULT_STARTED_ON);
        assertThat(testUserDivisionEnrolment.getEndedOn()).isEqualTo(DEFAULT_ENDED_ON);
        assertThat(testUserDivisionEnrolment.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    void getAllUserDivisionEnrolments() {
        // Initialize the database
        userDivisionEnrolmentRepository.save(userDivisionEnrolment).block();

        // Get all the userDivisionEnrolmentList
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
            .value(hasItem(userDivisionEnrolment.getId().intValue()))
            .jsonPath("$.[*].startedOn")
            .value(hasItem(sameInstant(DEFAULT_STARTED_ON)))
            .jsonPath("$.[*].endedOn")
            .value(hasItem(sameInstant(DEFAULT_ENDED_ON)))
            .jsonPath("$.[*].status")
            .value(hasItem(DEFAULT_STATUS.toString()));
    }

    @Test
    void getUserDivisionEnrolment() {
        // Initialize the database
        userDivisionEnrolmentRepository.save(userDivisionEnrolment).block();

        // Get the userDivisionEnrolment
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, userDivisionEnrolment.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(userDivisionEnrolment.getId().intValue()))
            .jsonPath("$.startedOn")
            .value(is(sameInstant(DEFAULT_STARTED_ON)))
            .jsonPath("$.endedOn")
            .value(is(sameInstant(DEFAULT_ENDED_ON)))
            .jsonPath("$.status")
            .value(is(DEFAULT_STATUS.toString()));
    }

    @Test
    void getNonExistingUserDivisionEnrolment() {
        // Get the userDivisionEnrolment
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putExistingUserDivisionEnrolment() throws Exception {
        // Initialize the database
        userDivisionEnrolmentRepository.save(userDivisionEnrolment).block();

        int databaseSizeBeforeUpdate = userDivisionEnrolmentRepository.findAll().collectList().block().size();

        // Update the userDivisionEnrolment
        UserDivisionEnrolment updatedUserDivisionEnrolment = userDivisionEnrolmentRepository
            .findById(userDivisionEnrolment.getId())
            .block();
        updatedUserDivisionEnrolment.startedOn(UPDATED_STARTED_ON).endedOn(UPDATED_ENDED_ON).status(UPDATED_STATUS);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, updatedUserDivisionEnrolment.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(updatedUserDivisionEnrolment))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the UserDivisionEnrolment in the database
        List<UserDivisionEnrolment> userDivisionEnrolmentList = userDivisionEnrolmentRepository.findAll().collectList().block();
        assertThat(userDivisionEnrolmentList).hasSize(databaseSizeBeforeUpdate);
        UserDivisionEnrolment testUserDivisionEnrolment = userDivisionEnrolmentList.get(userDivisionEnrolmentList.size() - 1);
        assertThat(testUserDivisionEnrolment.getStartedOn()).isEqualTo(UPDATED_STARTED_ON);
        assertThat(testUserDivisionEnrolment.getEndedOn()).isEqualTo(UPDATED_ENDED_ON);
        assertThat(testUserDivisionEnrolment.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    void putNonExistingUserDivisionEnrolment() throws Exception {
        int databaseSizeBeforeUpdate = userDivisionEnrolmentRepository.findAll().collectList().block().size();
        userDivisionEnrolment.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, userDivisionEnrolment.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(userDivisionEnrolment))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the UserDivisionEnrolment in the database
        List<UserDivisionEnrolment> userDivisionEnrolmentList = userDivisionEnrolmentRepository.findAll().collectList().block();
        assertThat(userDivisionEnrolmentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchUserDivisionEnrolment() throws Exception {
        int databaseSizeBeforeUpdate = userDivisionEnrolmentRepository.findAll().collectList().block().size();
        userDivisionEnrolment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(userDivisionEnrolment))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the UserDivisionEnrolment in the database
        List<UserDivisionEnrolment> userDivisionEnrolmentList = userDivisionEnrolmentRepository.findAll().collectList().block();
        assertThat(userDivisionEnrolmentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamUserDivisionEnrolment() throws Exception {
        int databaseSizeBeforeUpdate = userDivisionEnrolmentRepository.findAll().collectList().block().size();
        userDivisionEnrolment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(userDivisionEnrolment))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the UserDivisionEnrolment in the database
        List<UserDivisionEnrolment> userDivisionEnrolmentList = userDivisionEnrolmentRepository.findAll().collectList().block();
        assertThat(userDivisionEnrolmentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateUserDivisionEnrolmentWithPatch() throws Exception {
        // Initialize the database
        userDivisionEnrolmentRepository.save(userDivisionEnrolment).block();

        int databaseSizeBeforeUpdate = userDivisionEnrolmentRepository.findAll().collectList().block().size();

        // Update the userDivisionEnrolment using partial update
        UserDivisionEnrolment partialUpdatedUserDivisionEnrolment = new UserDivisionEnrolment();
        partialUpdatedUserDivisionEnrolment.setId(userDivisionEnrolment.getId());

        partialUpdatedUserDivisionEnrolment.startedOn(UPDATED_STARTED_ON).endedOn(UPDATED_ENDED_ON).status(UPDATED_STATUS);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedUserDivisionEnrolment.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedUserDivisionEnrolment))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the UserDivisionEnrolment in the database
        List<UserDivisionEnrolment> userDivisionEnrolmentList = userDivisionEnrolmentRepository.findAll().collectList().block();
        assertThat(userDivisionEnrolmentList).hasSize(databaseSizeBeforeUpdate);
        UserDivisionEnrolment testUserDivisionEnrolment = userDivisionEnrolmentList.get(userDivisionEnrolmentList.size() - 1);
        assertThat(testUserDivisionEnrolment.getStartedOn()).isEqualTo(UPDATED_STARTED_ON);
        assertThat(testUserDivisionEnrolment.getEndedOn()).isEqualTo(UPDATED_ENDED_ON);
        assertThat(testUserDivisionEnrolment.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    void fullUpdateUserDivisionEnrolmentWithPatch() throws Exception {
        // Initialize the database
        userDivisionEnrolmentRepository.save(userDivisionEnrolment).block();

        int databaseSizeBeforeUpdate = userDivisionEnrolmentRepository.findAll().collectList().block().size();

        // Update the userDivisionEnrolment using partial update
        UserDivisionEnrolment partialUpdatedUserDivisionEnrolment = new UserDivisionEnrolment();
        partialUpdatedUserDivisionEnrolment.setId(userDivisionEnrolment.getId());

        partialUpdatedUserDivisionEnrolment.startedOn(UPDATED_STARTED_ON).endedOn(UPDATED_ENDED_ON).status(UPDATED_STATUS);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedUserDivisionEnrolment.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedUserDivisionEnrolment))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the UserDivisionEnrolment in the database
        List<UserDivisionEnrolment> userDivisionEnrolmentList = userDivisionEnrolmentRepository.findAll().collectList().block();
        assertThat(userDivisionEnrolmentList).hasSize(databaseSizeBeforeUpdate);
        UserDivisionEnrolment testUserDivisionEnrolment = userDivisionEnrolmentList.get(userDivisionEnrolmentList.size() - 1);
        assertThat(testUserDivisionEnrolment.getStartedOn()).isEqualTo(UPDATED_STARTED_ON);
        assertThat(testUserDivisionEnrolment.getEndedOn()).isEqualTo(UPDATED_ENDED_ON);
        assertThat(testUserDivisionEnrolment.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    void patchNonExistingUserDivisionEnrolment() throws Exception {
        int databaseSizeBeforeUpdate = userDivisionEnrolmentRepository.findAll().collectList().block().size();
        userDivisionEnrolment.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, userDivisionEnrolment.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(userDivisionEnrolment))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the UserDivisionEnrolment in the database
        List<UserDivisionEnrolment> userDivisionEnrolmentList = userDivisionEnrolmentRepository.findAll().collectList().block();
        assertThat(userDivisionEnrolmentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchUserDivisionEnrolment() throws Exception {
        int databaseSizeBeforeUpdate = userDivisionEnrolmentRepository.findAll().collectList().block().size();
        userDivisionEnrolment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(userDivisionEnrolment))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the UserDivisionEnrolment in the database
        List<UserDivisionEnrolment> userDivisionEnrolmentList = userDivisionEnrolmentRepository.findAll().collectList().block();
        assertThat(userDivisionEnrolmentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamUserDivisionEnrolment() throws Exception {
        int databaseSizeBeforeUpdate = userDivisionEnrolmentRepository.findAll().collectList().block().size();
        userDivisionEnrolment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(userDivisionEnrolment))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the UserDivisionEnrolment in the database
        List<UserDivisionEnrolment> userDivisionEnrolmentList = userDivisionEnrolmentRepository.findAll().collectList().block();
        assertThat(userDivisionEnrolmentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteUserDivisionEnrolment() {
        // Initialize the database
        userDivisionEnrolmentRepository.save(userDivisionEnrolment).block();

        int databaseSizeBeforeDelete = userDivisionEnrolmentRepository.findAll().collectList().block().size();

        // Delete the userDivisionEnrolment
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, userDivisionEnrolment.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<UserDivisionEnrolment> userDivisionEnrolmentList = userDivisionEnrolmentRepository.findAll().collectList().block();
        assertThat(userDivisionEnrolmentList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
