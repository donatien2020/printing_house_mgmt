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
import org.nta.idc.donatien.domain.AuthoTracker;
import org.nta.idc.donatien.domain.enumeration.Status;
import org.nta.idc.donatien.repository.AuthoTrackerRepository;
import org.nta.idc.donatien.repository.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.reactive.server.WebTestClient;

/**
 * Integration tests for the {@link AuthoTrackerResource} REST controller.
 */
@IntegrationTest
@AutoConfigureWebTestClient(timeout = IntegrationTest.DEFAULT_ENTITY_TIMEOUT)
@WithMockUser
class AuthoTrackerResourceIT {

    private static final String DEFAULT_USERNAME = "AAAAAAAAAA";
    private static final String UPDATED_USERNAME = "BBBBBBBBBB";

    private static final String DEFAULT_TOKEN = "AAAAAAAAAA";
    private static final String UPDATED_TOKEN = "BBBBBBBBBB";

    private static final Status DEFAULT_STATUS = Status.ACTIVE;
    private static final Status UPDATED_STATUS = Status.INACTIVE;

    private static final ZonedDateTime DEFAULT_LOGED_IN_ON = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_LOGED_IN_ON = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String ENTITY_API_URL = "/api/autho-trackers";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AuthoTrackerRepository authoTrackerRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private WebTestClient webTestClient;

    private AuthoTracker authoTracker;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AuthoTracker createEntity(EntityManager em) {
        AuthoTracker authoTracker = new AuthoTracker()
            .username(DEFAULT_USERNAME)
            .token(DEFAULT_TOKEN)
            .status(DEFAULT_STATUS)
            .logedInOn(DEFAULT_LOGED_IN_ON);
        return authoTracker;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AuthoTracker createUpdatedEntity(EntityManager em) {
        AuthoTracker authoTracker = new AuthoTracker()
            .username(UPDATED_USERNAME)
            .token(UPDATED_TOKEN)
            .status(UPDATED_STATUS)
            .logedInOn(UPDATED_LOGED_IN_ON);
        return authoTracker;
    }

    public static void deleteEntities(EntityManager em) {
        try {
            em.deleteAll(AuthoTracker.class).block();
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
        authoTracker = createEntity(em);
    }

    @Test
    void createAuthoTracker() throws Exception {
        int databaseSizeBeforeCreate = authoTrackerRepository.findAll().collectList().block().size();
        // Create the AuthoTracker
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(authoTracker))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the AuthoTracker in the database
        List<AuthoTracker> authoTrackerList = authoTrackerRepository.findAll().collectList().block();
        assertThat(authoTrackerList).hasSize(databaseSizeBeforeCreate + 1);
        AuthoTracker testAuthoTracker = authoTrackerList.get(authoTrackerList.size() - 1);
        assertThat(testAuthoTracker.getUsername()).isEqualTo(DEFAULT_USERNAME);
        assertThat(testAuthoTracker.getToken()).isEqualTo(DEFAULT_TOKEN);
        assertThat(testAuthoTracker.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testAuthoTracker.getLogedInOn()).isEqualTo(DEFAULT_LOGED_IN_ON);
    }

    @Test
    void createAuthoTrackerWithExistingId() throws Exception {
        // Create the AuthoTracker with an existing ID
        authoTracker.setId(1L);

        int databaseSizeBeforeCreate = authoTrackerRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(authoTracker))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the AuthoTracker in the database
        List<AuthoTracker> authoTrackerList = authoTrackerRepository.findAll().collectList().block();
        assertThat(authoTrackerList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void getAllAuthoTrackersAsStream() {
        // Initialize the database
        authoTrackerRepository.save(authoTracker).block();

        List<AuthoTracker> authoTrackerList = webTestClient
            .get()
            .uri(ENTITY_API_URL)
            .accept(MediaType.APPLICATION_NDJSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentTypeCompatibleWith(MediaType.APPLICATION_NDJSON)
            .returnResult(AuthoTracker.class)
            .getResponseBody()
            .filter(authoTracker::equals)
            .collectList()
            .block(Duration.ofSeconds(5));

        assertThat(authoTrackerList).isNotNull();
        assertThat(authoTrackerList).hasSize(1);
        AuthoTracker testAuthoTracker = authoTrackerList.get(0);
        assertThat(testAuthoTracker.getUsername()).isEqualTo(DEFAULT_USERNAME);
        assertThat(testAuthoTracker.getToken()).isEqualTo(DEFAULT_TOKEN);
        assertThat(testAuthoTracker.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testAuthoTracker.getLogedInOn()).isEqualTo(DEFAULT_LOGED_IN_ON);
    }

    @Test
    void getAllAuthoTrackers() {
        // Initialize the database
        authoTrackerRepository.save(authoTracker).block();

        // Get all the authoTrackerList
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
            .value(hasItem(authoTracker.getId().intValue()))
            .jsonPath("$.[*].username")
            .value(hasItem(DEFAULT_USERNAME))
            .jsonPath("$.[*].token")
            .value(hasItem(DEFAULT_TOKEN))
            .jsonPath("$.[*].status")
            .value(hasItem(DEFAULT_STATUS.toString()))
            .jsonPath("$.[*].logedInOn")
            .value(hasItem(sameInstant(DEFAULT_LOGED_IN_ON)));
    }

    @Test
    void getAuthoTracker() {
        // Initialize the database
        authoTrackerRepository.save(authoTracker).block();

        // Get the authoTracker
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, authoTracker.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(authoTracker.getId().intValue()))
            .jsonPath("$.username")
            .value(is(DEFAULT_USERNAME))
            .jsonPath("$.token")
            .value(is(DEFAULT_TOKEN))
            .jsonPath("$.status")
            .value(is(DEFAULT_STATUS.toString()))
            .jsonPath("$.logedInOn")
            .value(is(sameInstant(DEFAULT_LOGED_IN_ON)));
    }

    @Test
    void getNonExistingAuthoTracker() {
        // Get the authoTracker
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putExistingAuthoTracker() throws Exception {
        // Initialize the database
        authoTrackerRepository.save(authoTracker).block();

        int databaseSizeBeforeUpdate = authoTrackerRepository.findAll().collectList().block().size();

        // Update the authoTracker
        AuthoTracker updatedAuthoTracker = authoTrackerRepository.findById(authoTracker.getId()).block();
        updatedAuthoTracker.username(UPDATED_USERNAME).token(UPDATED_TOKEN).status(UPDATED_STATUS).logedInOn(UPDATED_LOGED_IN_ON);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, updatedAuthoTracker.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(updatedAuthoTracker))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the AuthoTracker in the database
        List<AuthoTracker> authoTrackerList = authoTrackerRepository.findAll().collectList().block();
        assertThat(authoTrackerList).hasSize(databaseSizeBeforeUpdate);
        AuthoTracker testAuthoTracker = authoTrackerList.get(authoTrackerList.size() - 1);
        assertThat(testAuthoTracker.getUsername()).isEqualTo(UPDATED_USERNAME);
        assertThat(testAuthoTracker.getToken()).isEqualTo(UPDATED_TOKEN);
        assertThat(testAuthoTracker.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testAuthoTracker.getLogedInOn()).isEqualTo(UPDATED_LOGED_IN_ON);
    }

    @Test
    void putNonExistingAuthoTracker() throws Exception {
        int databaseSizeBeforeUpdate = authoTrackerRepository.findAll().collectList().block().size();
        authoTracker.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, authoTracker.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(authoTracker))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the AuthoTracker in the database
        List<AuthoTracker> authoTrackerList = authoTrackerRepository.findAll().collectList().block();
        assertThat(authoTrackerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchAuthoTracker() throws Exception {
        int databaseSizeBeforeUpdate = authoTrackerRepository.findAll().collectList().block().size();
        authoTracker.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(authoTracker))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the AuthoTracker in the database
        List<AuthoTracker> authoTrackerList = authoTrackerRepository.findAll().collectList().block();
        assertThat(authoTrackerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamAuthoTracker() throws Exception {
        int databaseSizeBeforeUpdate = authoTrackerRepository.findAll().collectList().block().size();
        authoTracker.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(authoTracker))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the AuthoTracker in the database
        List<AuthoTracker> authoTrackerList = authoTrackerRepository.findAll().collectList().block();
        assertThat(authoTrackerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateAuthoTrackerWithPatch() throws Exception {
        // Initialize the database
        authoTrackerRepository.save(authoTracker).block();

        int databaseSizeBeforeUpdate = authoTrackerRepository.findAll().collectList().block().size();

        // Update the authoTracker using partial update
        AuthoTracker partialUpdatedAuthoTracker = new AuthoTracker();
        partialUpdatedAuthoTracker.setId(authoTracker.getId());

        partialUpdatedAuthoTracker.token(UPDATED_TOKEN).status(UPDATED_STATUS);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedAuthoTracker.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedAuthoTracker))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the AuthoTracker in the database
        List<AuthoTracker> authoTrackerList = authoTrackerRepository.findAll().collectList().block();
        assertThat(authoTrackerList).hasSize(databaseSizeBeforeUpdate);
        AuthoTracker testAuthoTracker = authoTrackerList.get(authoTrackerList.size() - 1);
        assertThat(testAuthoTracker.getUsername()).isEqualTo(DEFAULT_USERNAME);
        assertThat(testAuthoTracker.getToken()).isEqualTo(UPDATED_TOKEN);
        assertThat(testAuthoTracker.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testAuthoTracker.getLogedInOn()).isEqualTo(DEFAULT_LOGED_IN_ON);
    }

    @Test
    void fullUpdateAuthoTrackerWithPatch() throws Exception {
        // Initialize the database
        authoTrackerRepository.save(authoTracker).block();

        int databaseSizeBeforeUpdate = authoTrackerRepository.findAll().collectList().block().size();

        // Update the authoTracker using partial update
        AuthoTracker partialUpdatedAuthoTracker = new AuthoTracker();
        partialUpdatedAuthoTracker.setId(authoTracker.getId());

        partialUpdatedAuthoTracker.username(UPDATED_USERNAME).token(UPDATED_TOKEN).status(UPDATED_STATUS).logedInOn(UPDATED_LOGED_IN_ON);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedAuthoTracker.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedAuthoTracker))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the AuthoTracker in the database
        List<AuthoTracker> authoTrackerList = authoTrackerRepository.findAll().collectList().block();
        assertThat(authoTrackerList).hasSize(databaseSizeBeforeUpdate);
        AuthoTracker testAuthoTracker = authoTrackerList.get(authoTrackerList.size() - 1);
        assertThat(testAuthoTracker.getUsername()).isEqualTo(UPDATED_USERNAME);
        assertThat(testAuthoTracker.getToken()).isEqualTo(UPDATED_TOKEN);
        assertThat(testAuthoTracker.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testAuthoTracker.getLogedInOn()).isEqualTo(UPDATED_LOGED_IN_ON);
    }

    @Test
    void patchNonExistingAuthoTracker() throws Exception {
        int databaseSizeBeforeUpdate = authoTrackerRepository.findAll().collectList().block().size();
        authoTracker.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, authoTracker.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(authoTracker))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the AuthoTracker in the database
        List<AuthoTracker> authoTrackerList = authoTrackerRepository.findAll().collectList().block();
        assertThat(authoTrackerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchAuthoTracker() throws Exception {
        int databaseSizeBeforeUpdate = authoTrackerRepository.findAll().collectList().block().size();
        authoTracker.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(authoTracker))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the AuthoTracker in the database
        List<AuthoTracker> authoTrackerList = authoTrackerRepository.findAll().collectList().block();
        assertThat(authoTrackerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamAuthoTracker() throws Exception {
        int databaseSizeBeforeUpdate = authoTrackerRepository.findAll().collectList().block().size();
        authoTracker.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(authoTracker))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the AuthoTracker in the database
        List<AuthoTracker> authoTrackerList = authoTrackerRepository.findAll().collectList().block();
        assertThat(authoTrackerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteAuthoTracker() {
        // Initialize the database
        authoTrackerRepository.save(authoTracker).block();

        int databaseSizeBeforeDelete = authoTrackerRepository.findAll().collectList().block().size();

        // Delete the authoTracker
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, authoTracker.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<AuthoTracker> authoTrackerList = authoTrackerRepository.findAll().collectList().block();
        assertThat(authoTrackerList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
