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
import org.nta.idc.donatien.domain.FinancialClientEngagement;
import org.nta.idc.donatien.domain.enumeration.EngagementReasons;
import org.nta.idc.donatien.repository.EntityManager;
import org.nta.idc.donatien.repository.FinancialClientEngagementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.reactive.server.WebTestClient;

/**
 * Integration tests for the {@link FinancialClientEngagementResource} REST controller.
 */
@IntegrationTest
@AutoConfigureWebTestClient(timeout = IntegrationTest.DEFAULT_ENTITY_TIMEOUT)
@WithMockUser
class FinancialClientEngagementResourceIT {

    private static final Long DEFAULT_USER_ID = 1L;
    private static final Long UPDATED_USER_ID = 2L;

    private static final Long DEFAULT_CLIENT_ID = 1L;
    private static final Long UPDATED_CLIENT_ID = 2L;

    private static final Long DEFAULT_CLIENT_NAMES = 1L;
    private static final Long UPDATED_CLIENT_NAMES = 2L;

    private static final String DEFAULT_DISCUSSION_SUMMARY = "AAAAAAAAAA";
    private static final String UPDATED_DISCUSSION_SUMMARY = "BBBBBBBBBB";

    private static final EngagementReasons DEFAULT_REASON = EngagementReasons.CONTRACT_RENEWAL;
    private static final EngagementReasons UPDATED_REASON = EngagementReasons.INVOICING;

    private static final String DEFAULT_CONCLUSION = "AAAAAAAAAA";
    private static final String UPDATED_CONCLUSION = "BBBBBBBBBB";

    private static final Long DEFAULT_CONTRACT_ID = 1L;
    private static final Long UPDATED_CONTRACT_ID = 2L;

    private static final String ENTITY_API_URL = "/api/financial-client-engagements";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private FinancialClientEngagementRepository financialClientEngagementRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private WebTestClient webTestClient;

    private FinancialClientEngagement financialClientEngagement;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static FinancialClientEngagement createEntity(EntityManager em) {
        FinancialClientEngagement financialClientEngagement = new FinancialClientEngagement()
            .userId(DEFAULT_USER_ID)
            .clientId(DEFAULT_CLIENT_ID)
            .clientNames(DEFAULT_CLIENT_NAMES)
            .discussionSummary(DEFAULT_DISCUSSION_SUMMARY)
            .reason(DEFAULT_REASON)
            .conclusion(DEFAULT_CONCLUSION)
            .contractId(DEFAULT_CONTRACT_ID);
        return financialClientEngagement;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static FinancialClientEngagement createUpdatedEntity(EntityManager em) {
        FinancialClientEngagement financialClientEngagement = new FinancialClientEngagement()
            .userId(UPDATED_USER_ID)
            .clientId(UPDATED_CLIENT_ID)
            .clientNames(UPDATED_CLIENT_NAMES)
            .discussionSummary(UPDATED_DISCUSSION_SUMMARY)
            .reason(UPDATED_REASON)
            .conclusion(UPDATED_CONCLUSION)
            .contractId(UPDATED_CONTRACT_ID);
        return financialClientEngagement;
    }

    public static void deleteEntities(EntityManager em) {
        try {
            em.deleteAll(FinancialClientEngagement.class).block();
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
        financialClientEngagement = createEntity(em);
    }

    @Test
    void createFinancialClientEngagement() throws Exception {
        int databaseSizeBeforeCreate = financialClientEngagementRepository.findAll().collectList().block().size();
        // Create the FinancialClientEngagement
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(financialClientEngagement))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the FinancialClientEngagement in the database
        List<FinancialClientEngagement> financialClientEngagementList = financialClientEngagementRepository.findAll().collectList().block();
        assertThat(financialClientEngagementList).hasSize(databaseSizeBeforeCreate + 1);
        FinancialClientEngagement testFinancialClientEngagement = financialClientEngagementList.get(
            financialClientEngagementList.size() - 1
        );
        assertThat(testFinancialClientEngagement.getUserId()).isEqualTo(DEFAULT_USER_ID);
        assertThat(testFinancialClientEngagement.getClientId()).isEqualTo(DEFAULT_CLIENT_ID);
        assertThat(testFinancialClientEngagement.getClientNames()).isEqualTo(DEFAULT_CLIENT_NAMES);
        assertThat(testFinancialClientEngagement.getDiscussionSummary()).isEqualTo(DEFAULT_DISCUSSION_SUMMARY);
        assertThat(testFinancialClientEngagement.getReason()).isEqualTo(DEFAULT_REASON);
        assertThat(testFinancialClientEngagement.getConclusion()).isEqualTo(DEFAULT_CONCLUSION);
        assertThat(testFinancialClientEngagement.getContractId()).isEqualTo(DEFAULT_CONTRACT_ID);
    }

    @Test
    void createFinancialClientEngagementWithExistingId() throws Exception {
        // Create the FinancialClientEngagement with an existing ID
        financialClientEngagement.setId(1L);

        int databaseSizeBeforeCreate = financialClientEngagementRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(financialClientEngagement))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the FinancialClientEngagement in the database
        List<FinancialClientEngagement> financialClientEngagementList = financialClientEngagementRepository.findAll().collectList().block();
        assertThat(financialClientEngagementList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void checkUserIdIsRequired() throws Exception {
        int databaseSizeBeforeTest = financialClientEngagementRepository.findAll().collectList().block().size();
        // set the field null
        financialClientEngagement.setUserId(null);

        // Create the FinancialClientEngagement, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(financialClientEngagement))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<FinancialClientEngagement> financialClientEngagementList = financialClientEngagementRepository.findAll().collectList().block();
        assertThat(financialClientEngagementList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkClientIdIsRequired() throws Exception {
        int databaseSizeBeforeTest = financialClientEngagementRepository.findAll().collectList().block().size();
        // set the field null
        financialClientEngagement.setClientId(null);

        // Create the FinancialClientEngagement, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(financialClientEngagement))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<FinancialClientEngagement> financialClientEngagementList = financialClientEngagementRepository.findAll().collectList().block();
        assertThat(financialClientEngagementList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkClientNamesIsRequired() throws Exception {
        int databaseSizeBeforeTest = financialClientEngagementRepository.findAll().collectList().block().size();
        // set the field null
        financialClientEngagement.setClientNames(null);

        // Create the FinancialClientEngagement, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(financialClientEngagement))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<FinancialClientEngagement> financialClientEngagementList = financialClientEngagementRepository.findAll().collectList().block();
        assertThat(financialClientEngagementList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkReasonIsRequired() throws Exception {
        int databaseSizeBeforeTest = financialClientEngagementRepository.findAll().collectList().block().size();
        // set the field null
        financialClientEngagement.setReason(null);

        // Create the FinancialClientEngagement, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(financialClientEngagement))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<FinancialClientEngagement> financialClientEngagementList = financialClientEngagementRepository.findAll().collectList().block();
        assertThat(financialClientEngagementList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void getAllFinancialClientEngagementsAsStream() {
        // Initialize the database
        financialClientEngagementRepository.save(financialClientEngagement).block();

        List<FinancialClientEngagement> financialClientEngagementList = webTestClient
            .get()
            .uri(ENTITY_API_URL)
            .accept(MediaType.APPLICATION_NDJSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentTypeCompatibleWith(MediaType.APPLICATION_NDJSON)
            .returnResult(FinancialClientEngagement.class)
            .getResponseBody()
            .filter(financialClientEngagement::equals)
            .collectList()
            .block(Duration.ofSeconds(5));

        assertThat(financialClientEngagementList).isNotNull();
        assertThat(financialClientEngagementList).hasSize(1);
        FinancialClientEngagement testFinancialClientEngagement = financialClientEngagementList.get(0);
        assertThat(testFinancialClientEngagement.getUserId()).isEqualTo(DEFAULT_USER_ID);
        assertThat(testFinancialClientEngagement.getClientId()).isEqualTo(DEFAULT_CLIENT_ID);
        assertThat(testFinancialClientEngagement.getClientNames()).isEqualTo(DEFAULT_CLIENT_NAMES);
        assertThat(testFinancialClientEngagement.getDiscussionSummary()).isEqualTo(DEFAULT_DISCUSSION_SUMMARY);
        assertThat(testFinancialClientEngagement.getReason()).isEqualTo(DEFAULT_REASON);
        assertThat(testFinancialClientEngagement.getConclusion()).isEqualTo(DEFAULT_CONCLUSION);
        assertThat(testFinancialClientEngagement.getContractId()).isEqualTo(DEFAULT_CONTRACT_ID);
    }

    @Test
    void getAllFinancialClientEngagements() {
        // Initialize the database
        financialClientEngagementRepository.save(financialClientEngagement).block();

        // Get all the financialClientEngagementList
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
            .value(hasItem(financialClientEngagement.getId().intValue()))
            .jsonPath("$.[*].userId")
            .value(hasItem(DEFAULT_USER_ID.intValue()))
            .jsonPath("$.[*].clientId")
            .value(hasItem(DEFAULT_CLIENT_ID.intValue()))
            .jsonPath("$.[*].clientNames")
            .value(hasItem(DEFAULT_CLIENT_NAMES.intValue()))
            .jsonPath("$.[*].discussionSummary")
            .value(hasItem(DEFAULT_DISCUSSION_SUMMARY))
            .jsonPath("$.[*].reason")
            .value(hasItem(DEFAULT_REASON.toString()))
            .jsonPath("$.[*].conclusion")
            .value(hasItem(DEFAULT_CONCLUSION))
            .jsonPath("$.[*].contractId")
            .value(hasItem(DEFAULT_CONTRACT_ID.intValue()));
    }

    @Test
    void getFinancialClientEngagement() {
        // Initialize the database
        financialClientEngagementRepository.save(financialClientEngagement).block();

        // Get the financialClientEngagement
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, financialClientEngagement.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(financialClientEngagement.getId().intValue()))
            .jsonPath("$.userId")
            .value(is(DEFAULT_USER_ID.intValue()))
            .jsonPath("$.clientId")
            .value(is(DEFAULT_CLIENT_ID.intValue()))
            .jsonPath("$.clientNames")
            .value(is(DEFAULT_CLIENT_NAMES.intValue()))
            .jsonPath("$.discussionSummary")
            .value(is(DEFAULT_DISCUSSION_SUMMARY))
            .jsonPath("$.reason")
            .value(is(DEFAULT_REASON.toString()))
            .jsonPath("$.conclusion")
            .value(is(DEFAULT_CONCLUSION))
            .jsonPath("$.contractId")
            .value(is(DEFAULT_CONTRACT_ID.intValue()));
    }

    @Test
    void getNonExistingFinancialClientEngagement() {
        // Get the financialClientEngagement
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putExistingFinancialClientEngagement() throws Exception {
        // Initialize the database
        financialClientEngagementRepository.save(financialClientEngagement).block();

        int databaseSizeBeforeUpdate = financialClientEngagementRepository.findAll().collectList().block().size();

        // Update the financialClientEngagement
        FinancialClientEngagement updatedFinancialClientEngagement = financialClientEngagementRepository
            .findById(financialClientEngagement.getId())
            .block();
        updatedFinancialClientEngagement
            .userId(UPDATED_USER_ID)
            .clientId(UPDATED_CLIENT_ID)
            .clientNames(UPDATED_CLIENT_NAMES)
            .discussionSummary(UPDATED_DISCUSSION_SUMMARY)
            .reason(UPDATED_REASON)
            .conclusion(UPDATED_CONCLUSION)
            .contractId(UPDATED_CONTRACT_ID);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, updatedFinancialClientEngagement.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(updatedFinancialClientEngagement))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the FinancialClientEngagement in the database
        List<FinancialClientEngagement> financialClientEngagementList = financialClientEngagementRepository.findAll().collectList().block();
        assertThat(financialClientEngagementList).hasSize(databaseSizeBeforeUpdate);
        FinancialClientEngagement testFinancialClientEngagement = financialClientEngagementList.get(
            financialClientEngagementList.size() - 1
        );
        assertThat(testFinancialClientEngagement.getUserId()).isEqualTo(UPDATED_USER_ID);
        assertThat(testFinancialClientEngagement.getClientId()).isEqualTo(UPDATED_CLIENT_ID);
        assertThat(testFinancialClientEngagement.getClientNames()).isEqualTo(UPDATED_CLIENT_NAMES);
        assertThat(testFinancialClientEngagement.getDiscussionSummary()).isEqualTo(UPDATED_DISCUSSION_SUMMARY);
        assertThat(testFinancialClientEngagement.getReason()).isEqualTo(UPDATED_REASON);
        assertThat(testFinancialClientEngagement.getConclusion()).isEqualTo(UPDATED_CONCLUSION);
        assertThat(testFinancialClientEngagement.getContractId()).isEqualTo(UPDATED_CONTRACT_ID);
    }

    @Test
    void putNonExistingFinancialClientEngagement() throws Exception {
        int databaseSizeBeforeUpdate = financialClientEngagementRepository.findAll().collectList().block().size();
        financialClientEngagement.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, financialClientEngagement.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(financialClientEngagement))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the FinancialClientEngagement in the database
        List<FinancialClientEngagement> financialClientEngagementList = financialClientEngagementRepository.findAll().collectList().block();
        assertThat(financialClientEngagementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchFinancialClientEngagement() throws Exception {
        int databaseSizeBeforeUpdate = financialClientEngagementRepository.findAll().collectList().block().size();
        financialClientEngagement.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(financialClientEngagement))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the FinancialClientEngagement in the database
        List<FinancialClientEngagement> financialClientEngagementList = financialClientEngagementRepository.findAll().collectList().block();
        assertThat(financialClientEngagementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamFinancialClientEngagement() throws Exception {
        int databaseSizeBeforeUpdate = financialClientEngagementRepository.findAll().collectList().block().size();
        financialClientEngagement.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(financialClientEngagement))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the FinancialClientEngagement in the database
        List<FinancialClientEngagement> financialClientEngagementList = financialClientEngagementRepository.findAll().collectList().block();
        assertThat(financialClientEngagementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateFinancialClientEngagementWithPatch() throws Exception {
        // Initialize the database
        financialClientEngagementRepository.save(financialClientEngagement).block();

        int databaseSizeBeforeUpdate = financialClientEngagementRepository.findAll().collectList().block().size();

        // Update the financialClientEngagement using partial update
        FinancialClientEngagement partialUpdatedFinancialClientEngagement = new FinancialClientEngagement();
        partialUpdatedFinancialClientEngagement.setId(financialClientEngagement.getId());

        partialUpdatedFinancialClientEngagement
            .clientNames(UPDATED_CLIENT_NAMES)
            .discussionSummary(UPDATED_DISCUSSION_SUMMARY)
            .reason(UPDATED_REASON)
            .conclusion(UPDATED_CONCLUSION)
            .contractId(UPDATED_CONTRACT_ID);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedFinancialClientEngagement.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedFinancialClientEngagement))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the FinancialClientEngagement in the database
        List<FinancialClientEngagement> financialClientEngagementList = financialClientEngagementRepository.findAll().collectList().block();
        assertThat(financialClientEngagementList).hasSize(databaseSizeBeforeUpdate);
        FinancialClientEngagement testFinancialClientEngagement = financialClientEngagementList.get(
            financialClientEngagementList.size() - 1
        );
        assertThat(testFinancialClientEngagement.getUserId()).isEqualTo(DEFAULT_USER_ID);
        assertThat(testFinancialClientEngagement.getClientId()).isEqualTo(DEFAULT_CLIENT_ID);
        assertThat(testFinancialClientEngagement.getClientNames()).isEqualTo(UPDATED_CLIENT_NAMES);
        assertThat(testFinancialClientEngagement.getDiscussionSummary()).isEqualTo(UPDATED_DISCUSSION_SUMMARY);
        assertThat(testFinancialClientEngagement.getReason()).isEqualTo(UPDATED_REASON);
        assertThat(testFinancialClientEngagement.getConclusion()).isEqualTo(UPDATED_CONCLUSION);
        assertThat(testFinancialClientEngagement.getContractId()).isEqualTo(UPDATED_CONTRACT_ID);
    }

    @Test
    void fullUpdateFinancialClientEngagementWithPatch() throws Exception {
        // Initialize the database
        financialClientEngagementRepository.save(financialClientEngagement).block();

        int databaseSizeBeforeUpdate = financialClientEngagementRepository.findAll().collectList().block().size();

        // Update the financialClientEngagement using partial update
        FinancialClientEngagement partialUpdatedFinancialClientEngagement = new FinancialClientEngagement();
        partialUpdatedFinancialClientEngagement.setId(financialClientEngagement.getId());

        partialUpdatedFinancialClientEngagement
            .userId(UPDATED_USER_ID)
            .clientId(UPDATED_CLIENT_ID)
            .clientNames(UPDATED_CLIENT_NAMES)
            .discussionSummary(UPDATED_DISCUSSION_SUMMARY)
            .reason(UPDATED_REASON)
            .conclusion(UPDATED_CONCLUSION)
            .contractId(UPDATED_CONTRACT_ID);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedFinancialClientEngagement.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedFinancialClientEngagement))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the FinancialClientEngagement in the database
        List<FinancialClientEngagement> financialClientEngagementList = financialClientEngagementRepository.findAll().collectList().block();
        assertThat(financialClientEngagementList).hasSize(databaseSizeBeforeUpdate);
        FinancialClientEngagement testFinancialClientEngagement = financialClientEngagementList.get(
            financialClientEngagementList.size() - 1
        );
        assertThat(testFinancialClientEngagement.getUserId()).isEqualTo(UPDATED_USER_ID);
        assertThat(testFinancialClientEngagement.getClientId()).isEqualTo(UPDATED_CLIENT_ID);
        assertThat(testFinancialClientEngagement.getClientNames()).isEqualTo(UPDATED_CLIENT_NAMES);
        assertThat(testFinancialClientEngagement.getDiscussionSummary()).isEqualTo(UPDATED_DISCUSSION_SUMMARY);
        assertThat(testFinancialClientEngagement.getReason()).isEqualTo(UPDATED_REASON);
        assertThat(testFinancialClientEngagement.getConclusion()).isEqualTo(UPDATED_CONCLUSION);
        assertThat(testFinancialClientEngagement.getContractId()).isEqualTo(UPDATED_CONTRACT_ID);
    }

    @Test
    void patchNonExistingFinancialClientEngagement() throws Exception {
        int databaseSizeBeforeUpdate = financialClientEngagementRepository.findAll().collectList().block().size();
        financialClientEngagement.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, financialClientEngagement.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(financialClientEngagement))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the FinancialClientEngagement in the database
        List<FinancialClientEngagement> financialClientEngagementList = financialClientEngagementRepository.findAll().collectList().block();
        assertThat(financialClientEngagementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchFinancialClientEngagement() throws Exception {
        int databaseSizeBeforeUpdate = financialClientEngagementRepository.findAll().collectList().block().size();
        financialClientEngagement.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(financialClientEngagement))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the FinancialClientEngagement in the database
        List<FinancialClientEngagement> financialClientEngagementList = financialClientEngagementRepository.findAll().collectList().block();
        assertThat(financialClientEngagementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamFinancialClientEngagement() throws Exception {
        int databaseSizeBeforeUpdate = financialClientEngagementRepository.findAll().collectList().block().size();
        financialClientEngagement.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(financialClientEngagement))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the FinancialClientEngagement in the database
        List<FinancialClientEngagement> financialClientEngagementList = financialClientEngagementRepository.findAll().collectList().block();
        assertThat(financialClientEngagementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteFinancialClientEngagement() {
        // Initialize the database
        financialClientEngagementRepository.save(financialClientEngagement).block();

        int databaseSizeBeforeDelete = financialClientEngagementRepository.findAll().collectList().block().size();

        // Delete the financialClientEngagement
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, financialClientEngagement.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<FinancialClientEngagement> financialClientEngagementList = financialClientEngagementRepository.findAll().collectList().block();
        assertThat(financialClientEngagementList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
