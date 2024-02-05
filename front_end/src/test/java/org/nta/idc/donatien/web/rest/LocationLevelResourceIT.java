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
import org.nta.idc.donatien.domain.LocationLevel;
import org.nta.idc.donatien.repository.EntityManager;
import org.nta.idc.donatien.repository.LocationLevelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.reactive.server.WebTestClient;

/**
 * Integration tests for the {@link LocationLevelResource} REST controller.
 */
@IntegrationTest
@AutoConfigureWebTestClient(timeout = IntegrationTest.DEFAULT_ENTITY_TIMEOUT)
@WithMockUser
class LocationLevelResourceIT {

    private static final String DEFAULT_CODE = "AAAAAAAAAA";
    private static final String UPDATED_CODE = "BBBBBBBBBB";

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_CREATED_ON = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CREATED_ON = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final Long DEFAULT_CREATED_BY_ID = 1L;
    private static final Long UPDATED_CREATED_BY_ID = 2L;

    private static final String DEFAULT_CREATED_BY_USERNAME = "AAAAAAAAAA";
    private static final String UPDATED_CREATED_BY_USERNAME = "BBBBBBBBBB";

    private static final Long DEFAULT_UPDATED_BY_ID = 1L;
    private static final Long UPDATED_UPDATED_BY_ID = 2L;

    private static final String DEFAULT_UPDATED_BY_USERNAME = "AAAAAAAAAA";
    private static final String UPDATED_UPDATED_BY_USERNAME = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_UPDATED_ON = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_UPDATED_ON = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String ENTITY_API_URL = "/api/location-levels";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private LocationLevelRepository locationLevelRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private WebTestClient webTestClient;

    private LocationLevel locationLevel;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static LocationLevel createEntity(EntityManager em) {
        LocationLevel locationLevel = new LocationLevel()
            .code(DEFAULT_CODE)
            .name(DEFAULT_NAME)
            .createdOn(DEFAULT_CREATED_ON)
            .createdById(DEFAULT_CREATED_BY_ID)
            .createdByUsername(DEFAULT_CREATED_BY_USERNAME)
            .updatedById(DEFAULT_UPDATED_BY_ID)
            .updatedByUsername(DEFAULT_UPDATED_BY_USERNAME)
            .updatedOn(DEFAULT_UPDATED_ON);
        return locationLevel;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static LocationLevel createUpdatedEntity(EntityManager em) {
        LocationLevel locationLevel = new LocationLevel()
            .code(UPDATED_CODE)
            .name(UPDATED_NAME)
            .createdOn(UPDATED_CREATED_ON)
            .createdById(UPDATED_CREATED_BY_ID)
            .createdByUsername(UPDATED_CREATED_BY_USERNAME)
            .updatedById(UPDATED_UPDATED_BY_ID)
            .updatedByUsername(UPDATED_UPDATED_BY_USERNAME)
            .updatedOn(UPDATED_UPDATED_ON);
        return locationLevel;
    }

    public static void deleteEntities(EntityManager em) {
        try {
            em.deleteAll(LocationLevel.class).block();
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
        locationLevel = createEntity(em);
    }

    @Test
    void createLocationLevel() throws Exception {
        int databaseSizeBeforeCreate = locationLevelRepository.findAll().collectList().block().size();
        // Create the LocationLevel
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(locationLevel))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the LocationLevel in the database
        List<LocationLevel> locationLevelList = locationLevelRepository.findAll().collectList().block();
        assertThat(locationLevelList).hasSize(databaseSizeBeforeCreate + 1);
        LocationLevel testLocationLevel = locationLevelList.get(locationLevelList.size() - 1);
        assertThat(testLocationLevel.getCode()).isEqualTo(DEFAULT_CODE);
        assertThat(testLocationLevel.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testLocationLevel.getCreatedOn()).isEqualTo(DEFAULT_CREATED_ON);
        assertThat(testLocationLevel.getCreatedById()).isEqualTo(DEFAULT_CREATED_BY_ID);
        assertThat(testLocationLevel.getCreatedByUsername()).isEqualTo(DEFAULT_CREATED_BY_USERNAME);
        assertThat(testLocationLevel.getUpdatedById()).isEqualTo(DEFAULT_UPDATED_BY_ID);
        assertThat(testLocationLevel.getUpdatedByUsername()).isEqualTo(DEFAULT_UPDATED_BY_USERNAME);
        assertThat(testLocationLevel.getUpdatedOn()).isEqualTo(DEFAULT_UPDATED_ON);
    }

    @Test
    void createLocationLevelWithExistingId() throws Exception {
        // Create the LocationLevel with an existing ID
        locationLevel.setId(1L);

        int databaseSizeBeforeCreate = locationLevelRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(locationLevel))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the LocationLevel in the database
        List<LocationLevel> locationLevelList = locationLevelRepository.findAll().collectList().block();
        assertThat(locationLevelList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void checkCodeIsRequired() throws Exception {
        int databaseSizeBeforeTest = locationLevelRepository.findAll().collectList().block().size();
        // set the field null
        locationLevel.setCode(null);

        // Create the LocationLevel, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(locationLevel))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<LocationLevel> locationLevelList = locationLevelRepository.findAll().collectList().block();
        assertThat(locationLevelList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = locationLevelRepository.findAll().collectList().block().size();
        // set the field null
        locationLevel.setName(null);

        // Create the LocationLevel, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(locationLevel))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<LocationLevel> locationLevelList = locationLevelRepository.findAll().collectList().block();
        assertThat(locationLevelList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void getAllLocationLevelsAsStream() {
        // Initialize the database
        locationLevelRepository.save(locationLevel).block();

        List<LocationLevel> locationLevelList = webTestClient
            .get()
            .uri(ENTITY_API_URL)
            .accept(MediaType.APPLICATION_NDJSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentTypeCompatibleWith(MediaType.APPLICATION_NDJSON)
            .returnResult(LocationLevel.class)
            .getResponseBody()
            .filter(locationLevel::equals)
            .collectList()
            .block(Duration.ofSeconds(5));

        assertThat(locationLevelList).isNotNull();
        assertThat(locationLevelList).hasSize(1);
        LocationLevel testLocationLevel = locationLevelList.get(0);
        assertThat(testLocationLevel.getCode()).isEqualTo(DEFAULT_CODE);
        assertThat(testLocationLevel.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testLocationLevel.getCreatedOn()).isEqualTo(DEFAULT_CREATED_ON);
        assertThat(testLocationLevel.getCreatedById()).isEqualTo(DEFAULT_CREATED_BY_ID);
        assertThat(testLocationLevel.getCreatedByUsername()).isEqualTo(DEFAULT_CREATED_BY_USERNAME);
        assertThat(testLocationLevel.getUpdatedById()).isEqualTo(DEFAULT_UPDATED_BY_ID);
        assertThat(testLocationLevel.getUpdatedByUsername()).isEqualTo(DEFAULT_UPDATED_BY_USERNAME);
        assertThat(testLocationLevel.getUpdatedOn()).isEqualTo(DEFAULT_UPDATED_ON);
    }

    @Test
    void getAllLocationLevels() {
        // Initialize the database
        locationLevelRepository.save(locationLevel).block();

        // Get all the locationLevelList
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
            .value(hasItem(locationLevel.getId().intValue()))
            .jsonPath("$.[*].code")
            .value(hasItem(DEFAULT_CODE))
            .jsonPath("$.[*].name")
            .value(hasItem(DEFAULT_NAME))
            .jsonPath("$.[*].createdOn")
            .value(hasItem(sameInstant(DEFAULT_CREATED_ON)))
            .jsonPath("$.[*].createdById")
            .value(hasItem(DEFAULT_CREATED_BY_ID.intValue()))
            .jsonPath("$.[*].createdByUsername")
            .value(hasItem(DEFAULT_CREATED_BY_USERNAME))
            .jsonPath("$.[*].updatedById")
            .value(hasItem(DEFAULT_UPDATED_BY_ID.intValue()))
            .jsonPath("$.[*].updatedByUsername")
            .value(hasItem(DEFAULT_UPDATED_BY_USERNAME))
            .jsonPath("$.[*].updatedOn")
            .value(hasItem(sameInstant(DEFAULT_UPDATED_ON)));
    }

    @Test
    void getLocationLevel() {
        // Initialize the database
        locationLevelRepository.save(locationLevel).block();

        // Get the locationLevel
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, locationLevel.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(locationLevel.getId().intValue()))
            .jsonPath("$.code")
            .value(is(DEFAULT_CODE))
            .jsonPath("$.name")
            .value(is(DEFAULT_NAME))
            .jsonPath("$.createdOn")
            .value(is(sameInstant(DEFAULT_CREATED_ON)))
            .jsonPath("$.createdById")
            .value(is(DEFAULT_CREATED_BY_ID.intValue()))
            .jsonPath("$.createdByUsername")
            .value(is(DEFAULT_CREATED_BY_USERNAME))
            .jsonPath("$.updatedById")
            .value(is(DEFAULT_UPDATED_BY_ID.intValue()))
            .jsonPath("$.updatedByUsername")
            .value(is(DEFAULT_UPDATED_BY_USERNAME))
            .jsonPath("$.updatedOn")
            .value(is(sameInstant(DEFAULT_UPDATED_ON)));
    }

    @Test
    void getNonExistingLocationLevel() {
        // Get the locationLevel
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putExistingLocationLevel() throws Exception {
        // Initialize the database
        locationLevelRepository.save(locationLevel).block();

        int databaseSizeBeforeUpdate = locationLevelRepository.findAll().collectList().block().size();

        // Update the locationLevel
        LocationLevel updatedLocationLevel = locationLevelRepository.findById(locationLevel.getId()).block();
        updatedLocationLevel
            .code(UPDATED_CODE)
            .name(UPDATED_NAME)
            .createdOn(UPDATED_CREATED_ON)
            .createdById(UPDATED_CREATED_BY_ID)
            .createdByUsername(UPDATED_CREATED_BY_USERNAME)
            .updatedById(UPDATED_UPDATED_BY_ID)
            .updatedByUsername(UPDATED_UPDATED_BY_USERNAME)
            .updatedOn(UPDATED_UPDATED_ON);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, updatedLocationLevel.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(updatedLocationLevel))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the LocationLevel in the database
        List<LocationLevel> locationLevelList = locationLevelRepository.findAll().collectList().block();
        assertThat(locationLevelList).hasSize(databaseSizeBeforeUpdate);
        LocationLevel testLocationLevel = locationLevelList.get(locationLevelList.size() - 1);
        assertThat(testLocationLevel.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testLocationLevel.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testLocationLevel.getCreatedOn()).isEqualTo(UPDATED_CREATED_ON);
        assertThat(testLocationLevel.getCreatedById()).isEqualTo(UPDATED_CREATED_BY_ID);
        assertThat(testLocationLevel.getCreatedByUsername()).isEqualTo(UPDATED_CREATED_BY_USERNAME);
        assertThat(testLocationLevel.getUpdatedById()).isEqualTo(UPDATED_UPDATED_BY_ID);
        assertThat(testLocationLevel.getUpdatedByUsername()).isEqualTo(UPDATED_UPDATED_BY_USERNAME);
        assertThat(testLocationLevel.getUpdatedOn()).isEqualTo(UPDATED_UPDATED_ON);
    }

    @Test
    void putNonExistingLocationLevel() throws Exception {
        int databaseSizeBeforeUpdate = locationLevelRepository.findAll().collectList().block().size();
        locationLevel.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, locationLevel.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(locationLevel))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the LocationLevel in the database
        List<LocationLevel> locationLevelList = locationLevelRepository.findAll().collectList().block();
        assertThat(locationLevelList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchLocationLevel() throws Exception {
        int databaseSizeBeforeUpdate = locationLevelRepository.findAll().collectList().block().size();
        locationLevel.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(locationLevel))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the LocationLevel in the database
        List<LocationLevel> locationLevelList = locationLevelRepository.findAll().collectList().block();
        assertThat(locationLevelList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamLocationLevel() throws Exception {
        int databaseSizeBeforeUpdate = locationLevelRepository.findAll().collectList().block().size();
        locationLevel.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(locationLevel))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the LocationLevel in the database
        List<LocationLevel> locationLevelList = locationLevelRepository.findAll().collectList().block();
        assertThat(locationLevelList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateLocationLevelWithPatch() throws Exception {
        // Initialize the database
        locationLevelRepository.save(locationLevel).block();

        int databaseSizeBeforeUpdate = locationLevelRepository.findAll().collectList().block().size();

        // Update the locationLevel using partial update
        LocationLevel partialUpdatedLocationLevel = new LocationLevel();
        partialUpdatedLocationLevel.setId(locationLevel.getId());

        partialUpdatedLocationLevel.code(UPDATED_CODE).createdById(UPDATED_CREATED_BY_ID).updatedById(UPDATED_UPDATED_BY_ID);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedLocationLevel.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedLocationLevel))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the LocationLevel in the database
        List<LocationLevel> locationLevelList = locationLevelRepository.findAll().collectList().block();
        assertThat(locationLevelList).hasSize(databaseSizeBeforeUpdate);
        LocationLevel testLocationLevel = locationLevelList.get(locationLevelList.size() - 1);
        assertThat(testLocationLevel.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testLocationLevel.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testLocationLevel.getCreatedOn()).isEqualTo(DEFAULT_CREATED_ON);
        assertThat(testLocationLevel.getCreatedById()).isEqualTo(UPDATED_CREATED_BY_ID);
        assertThat(testLocationLevel.getCreatedByUsername()).isEqualTo(DEFAULT_CREATED_BY_USERNAME);
        assertThat(testLocationLevel.getUpdatedById()).isEqualTo(UPDATED_UPDATED_BY_ID);
        assertThat(testLocationLevel.getUpdatedByUsername()).isEqualTo(DEFAULT_UPDATED_BY_USERNAME);
        assertThat(testLocationLevel.getUpdatedOn()).isEqualTo(DEFAULT_UPDATED_ON);
    }

    @Test
    void fullUpdateLocationLevelWithPatch() throws Exception {
        // Initialize the database
        locationLevelRepository.save(locationLevel).block();

        int databaseSizeBeforeUpdate = locationLevelRepository.findAll().collectList().block().size();

        // Update the locationLevel using partial update
        LocationLevel partialUpdatedLocationLevel = new LocationLevel();
        partialUpdatedLocationLevel.setId(locationLevel.getId());

        partialUpdatedLocationLevel
            .code(UPDATED_CODE)
            .name(UPDATED_NAME)
            .createdOn(UPDATED_CREATED_ON)
            .createdById(UPDATED_CREATED_BY_ID)
            .createdByUsername(UPDATED_CREATED_BY_USERNAME)
            .updatedById(UPDATED_UPDATED_BY_ID)
            .updatedByUsername(UPDATED_UPDATED_BY_USERNAME)
            .updatedOn(UPDATED_UPDATED_ON);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedLocationLevel.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedLocationLevel))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the LocationLevel in the database
        List<LocationLevel> locationLevelList = locationLevelRepository.findAll().collectList().block();
        assertThat(locationLevelList).hasSize(databaseSizeBeforeUpdate);
        LocationLevel testLocationLevel = locationLevelList.get(locationLevelList.size() - 1);
        assertThat(testLocationLevel.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testLocationLevel.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testLocationLevel.getCreatedOn()).isEqualTo(UPDATED_CREATED_ON);
        assertThat(testLocationLevel.getCreatedById()).isEqualTo(UPDATED_CREATED_BY_ID);
        assertThat(testLocationLevel.getCreatedByUsername()).isEqualTo(UPDATED_CREATED_BY_USERNAME);
        assertThat(testLocationLevel.getUpdatedById()).isEqualTo(UPDATED_UPDATED_BY_ID);
        assertThat(testLocationLevel.getUpdatedByUsername()).isEqualTo(UPDATED_UPDATED_BY_USERNAME);
        assertThat(testLocationLevel.getUpdatedOn()).isEqualTo(UPDATED_UPDATED_ON);
    }

    @Test
    void patchNonExistingLocationLevel() throws Exception {
        int databaseSizeBeforeUpdate = locationLevelRepository.findAll().collectList().block().size();
        locationLevel.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, locationLevel.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(locationLevel))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the LocationLevel in the database
        List<LocationLevel> locationLevelList = locationLevelRepository.findAll().collectList().block();
        assertThat(locationLevelList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchLocationLevel() throws Exception {
        int databaseSizeBeforeUpdate = locationLevelRepository.findAll().collectList().block().size();
        locationLevel.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(locationLevel))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the LocationLevel in the database
        List<LocationLevel> locationLevelList = locationLevelRepository.findAll().collectList().block();
        assertThat(locationLevelList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamLocationLevel() throws Exception {
        int databaseSizeBeforeUpdate = locationLevelRepository.findAll().collectList().block().size();
        locationLevel.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(locationLevel))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the LocationLevel in the database
        List<LocationLevel> locationLevelList = locationLevelRepository.findAll().collectList().block();
        assertThat(locationLevelList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteLocationLevel() {
        // Initialize the database
        locationLevelRepository.save(locationLevel).block();

        int databaseSizeBeforeDelete = locationLevelRepository.findAll().collectList().block().size();

        // Delete the locationLevel
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, locationLevel.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<LocationLevel> locationLevelList = locationLevelRepository.findAll().collectList().block();
        assertThat(locationLevelList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
