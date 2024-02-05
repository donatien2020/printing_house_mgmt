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
import org.nta.idc.donatien.domain.Division;
import org.nta.idc.donatien.domain.enumeration.DivisionLevels;
import org.nta.idc.donatien.domain.enumeration.DivisionTypes;
import org.nta.idc.donatien.domain.enumeration.Status;
import org.nta.idc.donatien.repository.DivisionRepository;
import org.nta.idc.donatien.repository.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.reactive.server.WebTestClient;

/**
 * Integration tests for the {@link DivisionResource} REST controller.
 */
@IntegrationTest
@AutoConfigureWebTestClient(timeout = IntegrationTest.DEFAULT_ENTITY_TIMEOUT)
@WithMockUser
class DivisionResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final DivisionLevels DEFAULT_LEVEL = DivisionLevels.DEPARTMENT;
    private static final DivisionLevels UPDATED_LEVEL = DivisionLevels.UNIT;

    private static final DivisionTypes DEFAULT_DIVISION_TYPE = DivisionTypes.ADMINISTRATION;
    private static final DivisionTypes UPDATED_DIVISION_TYPE = DivisionTypes.PRODUCTION;

    private static final Status DEFAULT_STATUS = Status.ACTIVE;
    private static final Status UPDATED_STATUS = Status.INACTIVE;

    private static final String ENTITY_API_URL = "/api/divisions";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private DivisionRepository divisionRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private WebTestClient webTestClient;

    private Division division;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Division createEntity(EntityManager em) {
        Division division = new Division()
            .name(DEFAULT_NAME)
            .description(DEFAULT_DESCRIPTION)
            .level(DEFAULT_LEVEL)
            .divisionType(DEFAULT_DIVISION_TYPE)
            .status(DEFAULT_STATUS);
        return division;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Division createUpdatedEntity(EntityManager em) {
        Division division = new Division()
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .level(UPDATED_LEVEL)
            .divisionType(UPDATED_DIVISION_TYPE)
            .status(UPDATED_STATUS);
        return division;
    }

    public static void deleteEntities(EntityManager em) {
        try {
            em.deleteAll(Division.class).block();
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
        division = createEntity(em);
    }

    @Test
    void createDivision() throws Exception {
        int databaseSizeBeforeCreate = divisionRepository.findAll().collectList().block().size();
        // Create the Division
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(division))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the Division in the database
        List<Division> divisionList = divisionRepository.findAll().collectList().block();
        assertThat(divisionList).hasSize(databaseSizeBeforeCreate + 1);
        Division testDivision = divisionList.get(divisionList.size() - 1);
        assertThat(testDivision.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testDivision.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testDivision.getLevel()).isEqualTo(DEFAULT_LEVEL);
        assertThat(testDivision.getDivisionType()).isEqualTo(DEFAULT_DIVISION_TYPE);
        assertThat(testDivision.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    void createDivisionWithExistingId() throws Exception {
        // Create the Division with an existing ID
        division.setId(1L);

        int databaseSizeBeforeCreate = divisionRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(division))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Division in the database
        List<Division> divisionList = divisionRepository.findAll().collectList().block();
        assertThat(divisionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void checkLevelIsRequired() throws Exception {
        int databaseSizeBeforeTest = divisionRepository.findAll().collectList().block().size();
        // set the field null
        division.setLevel(null);

        // Create the Division, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(division))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Division> divisionList = divisionRepository.findAll().collectList().block();
        assertThat(divisionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkDivisionTypeIsRequired() throws Exception {
        int databaseSizeBeforeTest = divisionRepository.findAll().collectList().block().size();
        // set the field null
        division.setDivisionType(null);

        // Create the Division, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(division))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Division> divisionList = divisionRepository.findAll().collectList().block();
        assertThat(divisionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkStatusIsRequired() throws Exception {
        int databaseSizeBeforeTest = divisionRepository.findAll().collectList().block().size();
        // set the field null
        division.setStatus(null);

        // Create the Division, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(division))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Division> divisionList = divisionRepository.findAll().collectList().block();
        assertThat(divisionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void getAllDivisionsAsStream() {
        // Initialize the database
        divisionRepository.save(division).block();

        List<Division> divisionList = webTestClient
            .get()
            .uri(ENTITY_API_URL)
            .accept(MediaType.APPLICATION_NDJSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentTypeCompatibleWith(MediaType.APPLICATION_NDJSON)
            .returnResult(Division.class)
            .getResponseBody()
            .filter(division::equals)
            .collectList()
            .block(Duration.ofSeconds(5));

        assertThat(divisionList).isNotNull();
        assertThat(divisionList).hasSize(1);
        Division testDivision = divisionList.get(0);
        assertThat(testDivision.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testDivision.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testDivision.getLevel()).isEqualTo(DEFAULT_LEVEL);
        assertThat(testDivision.getDivisionType()).isEqualTo(DEFAULT_DIVISION_TYPE);
        assertThat(testDivision.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    void getAllDivisions() {
        // Initialize the database
        divisionRepository.save(division).block();

        // Get all the divisionList
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
            .value(hasItem(division.getId().intValue()))
            .jsonPath("$.[*].name")
            .value(hasItem(DEFAULT_NAME))
            .jsonPath("$.[*].description")
            .value(hasItem(DEFAULT_DESCRIPTION))
            .jsonPath("$.[*].level")
            .value(hasItem(DEFAULT_LEVEL.toString()))
            .jsonPath("$.[*].divisionType")
            .value(hasItem(DEFAULT_DIVISION_TYPE.toString()))
            .jsonPath("$.[*].status")
            .value(hasItem(DEFAULT_STATUS.toString()));
    }

    @Test
    void getDivision() {
        // Initialize the database
        divisionRepository.save(division).block();

        // Get the division
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, division.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(division.getId().intValue()))
            .jsonPath("$.name")
            .value(is(DEFAULT_NAME))
            .jsonPath("$.description")
            .value(is(DEFAULT_DESCRIPTION))
            .jsonPath("$.level")
            .value(is(DEFAULT_LEVEL.toString()))
            .jsonPath("$.divisionType")
            .value(is(DEFAULT_DIVISION_TYPE.toString()))
            .jsonPath("$.status")
            .value(is(DEFAULT_STATUS.toString()));
    }

    @Test
    void getNonExistingDivision() {
        // Get the division
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putExistingDivision() throws Exception {
        // Initialize the database
        divisionRepository.save(division).block();

        int databaseSizeBeforeUpdate = divisionRepository.findAll().collectList().block().size();

        // Update the division
        Division updatedDivision = divisionRepository.findById(division.getId()).block();
        updatedDivision
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .level(UPDATED_LEVEL)
            .divisionType(UPDATED_DIVISION_TYPE)
            .status(UPDATED_STATUS);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, updatedDivision.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(updatedDivision))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Division in the database
        List<Division> divisionList = divisionRepository.findAll().collectList().block();
        assertThat(divisionList).hasSize(databaseSizeBeforeUpdate);
        Division testDivision = divisionList.get(divisionList.size() - 1);
        assertThat(testDivision.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testDivision.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testDivision.getLevel()).isEqualTo(UPDATED_LEVEL);
        assertThat(testDivision.getDivisionType()).isEqualTo(UPDATED_DIVISION_TYPE);
        assertThat(testDivision.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    void putNonExistingDivision() throws Exception {
        int databaseSizeBeforeUpdate = divisionRepository.findAll().collectList().block().size();
        division.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, division.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(division))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Division in the database
        List<Division> divisionList = divisionRepository.findAll().collectList().block();
        assertThat(divisionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchDivision() throws Exception {
        int databaseSizeBeforeUpdate = divisionRepository.findAll().collectList().block().size();
        division.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(division))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Division in the database
        List<Division> divisionList = divisionRepository.findAll().collectList().block();
        assertThat(divisionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamDivision() throws Exception {
        int databaseSizeBeforeUpdate = divisionRepository.findAll().collectList().block().size();
        division.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(division))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Division in the database
        List<Division> divisionList = divisionRepository.findAll().collectList().block();
        assertThat(divisionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateDivisionWithPatch() throws Exception {
        // Initialize the database
        divisionRepository.save(division).block();

        int databaseSizeBeforeUpdate = divisionRepository.findAll().collectList().block().size();

        // Update the division using partial update
        Division partialUpdatedDivision = new Division();
        partialUpdatedDivision.setId(division.getId());

        partialUpdatedDivision.description(UPDATED_DESCRIPTION).level(UPDATED_LEVEL).status(UPDATED_STATUS);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedDivision.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedDivision))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Division in the database
        List<Division> divisionList = divisionRepository.findAll().collectList().block();
        assertThat(divisionList).hasSize(databaseSizeBeforeUpdate);
        Division testDivision = divisionList.get(divisionList.size() - 1);
        assertThat(testDivision.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testDivision.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testDivision.getLevel()).isEqualTo(UPDATED_LEVEL);
        assertThat(testDivision.getDivisionType()).isEqualTo(DEFAULT_DIVISION_TYPE);
        assertThat(testDivision.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    void fullUpdateDivisionWithPatch() throws Exception {
        // Initialize the database
        divisionRepository.save(division).block();

        int databaseSizeBeforeUpdate = divisionRepository.findAll().collectList().block().size();

        // Update the division using partial update
        Division partialUpdatedDivision = new Division();
        partialUpdatedDivision.setId(division.getId());

        partialUpdatedDivision
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .level(UPDATED_LEVEL)
            .divisionType(UPDATED_DIVISION_TYPE)
            .status(UPDATED_STATUS);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedDivision.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedDivision))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Division in the database
        List<Division> divisionList = divisionRepository.findAll().collectList().block();
        assertThat(divisionList).hasSize(databaseSizeBeforeUpdate);
        Division testDivision = divisionList.get(divisionList.size() - 1);
        assertThat(testDivision.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testDivision.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testDivision.getLevel()).isEqualTo(UPDATED_LEVEL);
        assertThat(testDivision.getDivisionType()).isEqualTo(UPDATED_DIVISION_TYPE);
        assertThat(testDivision.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    void patchNonExistingDivision() throws Exception {
        int databaseSizeBeforeUpdate = divisionRepository.findAll().collectList().block().size();
        division.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, division.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(division))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Division in the database
        List<Division> divisionList = divisionRepository.findAll().collectList().block();
        assertThat(divisionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchDivision() throws Exception {
        int databaseSizeBeforeUpdate = divisionRepository.findAll().collectList().block().size();
        division.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(division))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Division in the database
        List<Division> divisionList = divisionRepository.findAll().collectList().block();
        assertThat(divisionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamDivision() throws Exception {
        int databaseSizeBeforeUpdate = divisionRepository.findAll().collectList().block().size();
        division.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(division))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Division in the database
        List<Division> divisionList = divisionRepository.findAll().collectList().block();
        assertThat(divisionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteDivision() {
        // Initialize the database
        divisionRepository.save(division).block();

        int databaseSizeBeforeDelete = divisionRepository.findAll().collectList().block().size();

        // Delete the division
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, division.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<Division> divisionList = divisionRepository.findAll().collectList().block();
        assertThat(divisionList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
