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
import org.nta.idc.donatien.domain.Location;
import org.nta.idc.donatien.repository.EntityManager;
import org.nta.idc.donatien.repository.LocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.reactive.server.WebTestClient;

/**
 * Integration tests for the {@link LocationResource} REST controller.
 */
@IntegrationTest
@AutoConfigureWebTestClient(timeout = IntegrationTest.DEFAULT_ENTITY_TIMEOUT)
@WithMockUser
class LocationResourceIT {

    private static final String DEFAULT_CODE = "AAAAAAAAAA";
    private static final String UPDATED_CODE = "BBBBBBBBBB";

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

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

    private static final String ENTITY_API_URL = "/api/locations";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private WebTestClient webTestClient;

    private Location location;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Location createEntity(EntityManager em) {
        Location location = new Location()
            .code(DEFAULT_CODE)
            .name(DEFAULT_NAME)
            .description(DEFAULT_DESCRIPTION)
            .createdOn(DEFAULT_CREATED_ON)
            .createdById(DEFAULT_CREATED_BY_ID)
            .createdByUsername(DEFAULT_CREATED_BY_USERNAME)
            .updatedById(DEFAULT_UPDATED_BY_ID)
            .updatedByUsername(DEFAULT_UPDATED_BY_USERNAME)
            .updatedOn(DEFAULT_UPDATED_ON);
        return location;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Location createUpdatedEntity(EntityManager em) {
        Location location = new Location()
            .code(UPDATED_CODE)
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .createdOn(UPDATED_CREATED_ON)
            .createdById(UPDATED_CREATED_BY_ID)
            .createdByUsername(UPDATED_CREATED_BY_USERNAME)
            .updatedById(UPDATED_UPDATED_BY_ID)
            .updatedByUsername(UPDATED_UPDATED_BY_USERNAME)
            .updatedOn(UPDATED_UPDATED_ON);
        return location;
    }

    public static void deleteEntities(EntityManager em) {
        try {
            em.deleteAll(Location.class).block();
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
        location = createEntity(em);
    }

    @Test
    void createLocation() throws Exception {
        int databaseSizeBeforeCreate = locationRepository.findAll().collectList().block().size();
        // Create the Location
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(location))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the Location in the database
        List<Location> locationList = locationRepository.findAll().collectList().block();
        assertThat(locationList).hasSize(databaseSizeBeforeCreate + 1);
        Location testLocation = locationList.get(locationList.size() - 1);
        assertThat(testLocation.getCode()).isEqualTo(DEFAULT_CODE);
        assertThat(testLocation.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testLocation.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testLocation.getCreatedOn()).isEqualTo(DEFAULT_CREATED_ON);
        assertThat(testLocation.getCreatedById()).isEqualTo(DEFAULT_CREATED_BY_ID);
        assertThat(testLocation.getCreatedByUsername()).isEqualTo(DEFAULT_CREATED_BY_USERNAME);
        assertThat(testLocation.getUpdatedById()).isEqualTo(DEFAULT_UPDATED_BY_ID);
        assertThat(testLocation.getUpdatedByUsername()).isEqualTo(DEFAULT_UPDATED_BY_USERNAME);
        assertThat(testLocation.getUpdatedOn()).isEqualTo(DEFAULT_UPDATED_ON);
    }

    @Test
    void createLocationWithExistingId() throws Exception {
        // Create the Location with an existing ID
        location.setId(1L);

        int databaseSizeBeforeCreate = locationRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(location))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Location in the database
        List<Location> locationList = locationRepository.findAll().collectList().block();
        assertThat(locationList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void checkCodeIsRequired() throws Exception {
        int databaseSizeBeforeTest = locationRepository.findAll().collectList().block().size();
        // set the field null
        location.setCode(null);

        // Create the Location, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(location))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Location> locationList = locationRepository.findAll().collectList().block();
        assertThat(locationList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = locationRepository.findAll().collectList().block().size();
        // set the field null
        location.setName(null);

        // Create the Location, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(location))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Location> locationList = locationRepository.findAll().collectList().block();
        assertThat(locationList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void getAllLocationsAsStream() {
        // Initialize the database
        locationRepository.save(location).block();

        List<Location> locationList = webTestClient
            .get()
            .uri(ENTITY_API_URL)
            .accept(MediaType.APPLICATION_NDJSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentTypeCompatibleWith(MediaType.APPLICATION_NDJSON)
            .returnResult(Location.class)
            .getResponseBody()
            .filter(location::equals)
            .collectList()
            .block(Duration.ofSeconds(5));

        assertThat(locationList).isNotNull();
        assertThat(locationList).hasSize(1);
        Location testLocation = locationList.get(0);
        assertThat(testLocation.getCode()).isEqualTo(DEFAULT_CODE);
        assertThat(testLocation.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testLocation.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testLocation.getCreatedOn()).isEqualTo(DEFAULT_CREATED_ON);
        assertThat(testLocation.getCreatedById()).isEqualTo(DEFAULT_CREATED_BY_ID);
        assertThat(testLocation.getCreatedByUsername()).isEqualTo(DEFAULT_CREATED_BY_USERNAME);
        assertThat(testLocation.getUpdatedById()).isEqualTo(DEFAULT_UPDATED_BY_ID);
        assertThat(testLocation.getUpdatedByUsername()).isEqualTo(DEFAULT_UPDATED_BY_USERNAME);
        assertThat(testLocation.getUpdatedOn()).isEqualTo(DEFAULT_UPDATED_ON);
    }

    @Test
    void getAllLocations() {
        // Initialize the database
        locationRepository.save(location).block();

        // Get all the locationList
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
            .value(hasItem(location.getId().intValue()))
            .jsonPath("$.[*].code")
            .value(hasItem(DEFAULT_CODE))
            .jsonPath("$.[*].name")
            .value(hasItem(DEFAULT_NAME))
            .jsonPath("$.[*].description")
            .value(hasItem(DEFAULT_DESCRIPTION))
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
    void getLocation() {
        // Initialize the database
        locationRepository.save(location).block();

        // Get the location
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, location.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(location.getId().intValue()))
            .jsonPath("$.code")
            .value(is(DEFAULT_CODE))
            .jsonPath("$.name")
            .value(is(DEFAULT_NAME))
            .jsonPath("$.description")
            .value(is(DEFAULT_DESCRIPTION))
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
    void getNonExistingLocation() {
        // Get the location
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putExistingLocation() throws Exception {
        // Initialize the database
        locationRepository.save(location).block();

        int databaseSizeBeforeUpdate = locationRepository.findAll().collectList().block().size();

        // Update the location
        Location updatedLocation = locationRepository.findById(location.getId()).block();
        updatedLocation
            .code(UPDATED_CODE)
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .createdOn(UPDATED_CREATED_ON)
            .createdById(UPDATED_CREATED_BY_ID)
            .createdByUsername(UPDATED_CREATED_BY_USERNAME)
            .updatedById(UPDATED_UPDATED_BY_ID)
            .updatedByUsername(UPDATED_UPDATED_BY_USERNAME)
            .updatedOn(UPDATED_UPDATED_ON);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, updatedLocation.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(updatedLocation))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Location in the database
        List<Location> locationList = locationRepository.findAll().collectList().block();
        assertThat(locationList).hasSize(databaseSizeBeforeUpdate);
        Location testLocation = locationList.get(locationList.size() - 1);
        assertThat(testLocation.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testLocation.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testLocation.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testLocation.getCreatedOn()).isEqualTo(UPDATED_CREATED_ON);
        assertThat(testLocation.getCreatedById()).isEqualTo(UPDATED_CREATED_BY_ID);
        assertThat(testLocation.getCreatedByUsername()).isEqualTo(UPDATED_CREATED_BY_USERNAME);
        assertThat(testLocation.getUpdatedById()).isEqualTo(UPDATED_UPDATED_BY_ID);
        assertThat(testLocation.getUpdatedByUsername()).isEqualTo(UPDATED_UPDATED_BY_USERNAME);
        assertThat(testLocation.getUpdatedOn()).isEqualTo(UPDATED_UPDATED_ON);
    }

    @Test
    void putNonExistingLocation() throws Exception {
        int databaseSizeBeforeUpdate = locationRepository.findAll().collectList().block().size();
        location.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, location.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(location))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Location in the database
        List<Location> locationList = locationRepository.findAll().collectList().block();
        assertThat(locationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchLocation() throws Exception {
        int databaseSizeBeforeUpdate = locationRepository.findAll().collectList().block().size();
        location.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(location))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Location in the database
        List<Location> locationList = locationRepository.findAll().collectList().block();
        assertThat(locationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamLocation() throws Exception {
        int databaseSizeBeforeUpdate = locationRepository.findAll().collectList().block().size();
        location.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(location))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Location in the database
        List<Location> locationList = locationRepository.findAll().collectList().block();
        assertThat(locationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateLocationWithPatch() throws Exception {
        // Initialize the database
        locationRepository.save(location).block();

        int databaseSizeBeforeUpdate = locationRepository.findAll().collectList().block().size();

        // Update the location using partial update
        Location partialUpdatedLocation = new Location();
        partialUpdatedLocation.setId(location.getId());

        partialUpdatedLocation
            .code(UPDATED_CODE)
            .description(UPDATED_DESCRIPTION)
            .createdOn(UPDATED_CREATED_ON)
            .createdByUsername(UPDATED_CREATED_BY_USERNAME)
            .updatedByUsername(UPDATED_UPDATED_BY_USERNAME)
            .updatedOn(UPDATED_UPDATED_ON);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedLocation.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedLocation))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Location in the database
        List<Location> locationList = locationRepository.findAll().collectList().block();
        assertThat(locationList).hasSize(databaseSizeBeforeUpdate);
        Location testLocation = locationList.get(locationList.size() - 1);
        assertThat(testLocation.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testLocation.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testLocation.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testLocation.getCreatedOn()).isEqualTo(UPDATED_CREATED_ON);
        assertThat(testLocation.getCreatedById()).isEqualTo(DEFAULT_CREATED_BY_ID);
        assertThat(testLocation.getCreatedByUsername()).isEqualTo(UPDATED_CREATED_BY_USERNAME);
        assertThat(testLocation.getUpdatedById()).isEqualTo(DEFAULT_UPDATED_BY_ID);
        assertThat(testLocation.getUpdatedByUsername()).isEqualTo(UPDATED_UPDATED_BY_USERNAME);
        assertThat(testLocation.getUpdatedOn()).isEqualTo(UPDATED_UPDATED_ON);
    }

    @Test
    void fullUpdateLocationWithPatch() throws Exception {
        // Initialize the database
        locationRepository.save(location).block();

        int databaseSizeBeforeUpdate = locationRepository.findAll().collectList().block().size();

        // Update the location using partial update
        Location partialUpdatedLocation = new Location();
        partialUpdatedLocation.setId(location.getId());

        partialUpdatedLocation
            .code(UPDATED_CODE)
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .createdOn(UPDATED_CREATED_ON)
            .createdById(UPDATED_CREATED_BY_ID)
            .createdByUsername(UPDATED_CREATED_BY_USERNAME)
            .updatedById(UPDATED_UPDATED_BY_ID)
            .updatedByUsername(UPDATED_UPDATED_BY_USERNAME)
            .updatedOn(UPDATED_UPDATED_ON);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedLocation.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedLocation))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Location in the database
        List<Location> locationList = locationRepository.findAll().collectList().block();
        assertThat(locationList).hasSize(databaseSizeBeforeUpdate);
        Location testLocation = locationList.get(locationList.size() - 1);
        assertThat(testLocation.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testLocation.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testLocation.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testLocation.getCreatedOn()).isEqualTo(UPDATED_CREATED_ON);
        assertThat(testLocation.getCreatedById()).isEqualTo(UPDATED_CREATED_BY_ID);
        assertThat(testLocation.getCreatedByUsername()).isEqualTo(UPDATED_CREATED_BY_USERNAME);
        assertThat(testLocation.getUpdatedById()).isEqualTo(UPDATED_UPDATED_BY_ID);
        assertThat(testLocation.getUpdatedByUsername()).isEqualTo(UPDATED_UPDATED_BY_USERNAME);
        assertThat(testLocation.getUpdatedOn()).isEqualTo(UPDATED_UPDATED_ON);
    }

    @Test
    void patchNonExistingLocation() throws Exception {
        int databaseSizeBeforeUpdate = locationRepository.findAll().collectList().block().size();
        location.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, location.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(location))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Location in the database
        List<Location> locationList = locationRepository.findAll().collectList().block();
        assertThat(locationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchLocation() throws Exception {
        int databaseSizeBeforeUpdate = locationRepository.findAll().collectList().block().size();
        location.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(location))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Location in the database
        List<Location> locationList = locationRepository.findAll().collectList().block();
        assertThat(locationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamLocation() throws Exception {
        int databaseSizeBeforeUpdate = locationRepository.findAll().collectList().block().size();
        location.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(location))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Location in the database
        List<Location> locationList = locationRepository.findAll().collectList().block();
        assertThat(locationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteLocation() {
        // Initialize the database
        locationRepository.save(location).block();

        int databaseSizeBeforeDelete = locationRepository.findAll().collectList().block().size();

        // Delete the location
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, location.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<Location> locationList = locationRepository.findAll().collectList().block();
        assertThat(locationList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
