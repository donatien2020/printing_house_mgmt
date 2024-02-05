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
import org.nta.idc.donatien.domain.Contract;
import org.nta.idc.donatien.domain.enumeration.ContractAcquiringStatuses;
import org.nta.idc.donatien.domain.enumeration.ContractOwnerTypes;
import org.nta.idc.donatien.domain.enumeration.ContractTypes;
import org.nta.idc.donatien.domain.enumeration.Status;
import org.nta.idc.donatien.repository.ContractRepository;
import org.nta.idc.donatien.repository.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.reactive.server.WebTestClient;

/**
 * Integration tests for the {@link ContractResource} REST controller.
 */
@IntegrationTest
@AutoConfigureWebTestClient(timeout = IntegrationTest.DEFAULT_ENTITY_TIMEOUT)
@WithMockUser
class ContractResourceIT {

    private static final ContractTypes DEFAULT_CONTRACT_TYPE = ContractTypes.PURCHASE;
    private static final ContractTypes UPDATED_CONTRACT_TYPE = ContractTypes.EMPLOYMENT;

    private static final String DEFAULT_CONTRACT_NUMBER = "AAAAAAAAAA";
    private static final String UPDATED_CONTRACT_NUMBER = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_VALID_FROM = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_VALID_FROM = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_VALID_TO = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_VALID_TO = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final Status DEFAULT_STATUS = Status.ACTIVE;
    private static final Status UPDATED_STATUS = Status.INACTIVE;

    private static final Long DEFAULT_CURRENT_ATTACHMENT_ID = 1L;
    private static final Long UPDATED_CURRENT_ATTACHMENT_ID = 2L;

    private static final Long DEFAULT_OWNER_ID = 1L;
    private static final Long UPDATED_OWNER_ID = 2L;

    private static final ContractOwnerTypes DEFAULT_OWNER_TYPE = ContractOwnerTypes.CLIENT;
    private static final ContractOwnerTypes UPDATED_OWNER_TYPE = ContractOwnerTypes.EMPLOYEE;

    private static final ContractAcquiringStatuses DEFAULT_ACQUIRING_STATUS = ContractAcquiringStatuses.NEW;
    private static final ContractAcquiringStatuses UPDATED_ACQUIRING_STATUS = ContractAcquiringStatuses.RENEWED;

    private static final String ENTITY_API_URL = "/api/contracts";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ContractRepository contractRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private WebTestClient webTestClient;

    private Contract contract;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Contract createEntity(EntityManager em) {
        Contract contract = new Contract()
            .contractType(DEFAULT_CONTRACT_TYPE)
            .contractNumber(DEFAULT_CONTRACT_NUMBER)
            .description(DEFAULT_DESCRIPTION)
            .validFrom(DEFAULT_VALID_FROM)
            .validTo(DEFAULT_VALID_TO)
            .status(DEFAULT_STATUS)
            .currentAttachmentId(DEFAULT_CURRENT_ATTACHMENT_ID)
            .ownerId(DEFAULT_OWNER_ID)
            .ownerType(DEFAULT_OWNER_TYPE)
            .acquiringStatus(DEFAULT_ACQUIRING_STATUS);
        return contract;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Contract createUpdatedEntity(EntityManager em) {
        Contract contract = new Contract()
            .contractType(UPDATED_CONTRACT_TYPE)
            .contractNumber(UPDATED_CONTRACT_NUMBER)
            .description(UPDATED_DESCRIPTION)
            .validFrom(UPDATED_VALID_FROM)
            .validTo(UPDATED_VALID_TO)
            .status(UPDATED_STATUS)
            .currentAttachmentId(UPDATED_CURRENT_ATTACHMENT_ID)
            .ownerId(UPDATED_OWNER_ID)
            .ownerType(UPDATED_OWNER_TYPE)
            .acquiringStatus(UPDATED_ACQUIRING_STATUS);
        return contract;
    }

    public static void deleteEntities(EntityManager em) {
        try {
            em.deleteAll(Contract.class).block();
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
        contract = createEntity(em);
    }

    @Test
    void createContract() throws Exception {
        int databaseSizeBeforeCreate = contractRepository.findAll().collectList().block().size();
        // Create the Contract
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(contract))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the Contract in the database
        List<Contract> contractList = contractRepository.findAll().collectList().block();
        assertThat(contractList).hasSize(databaseSizeBeforeCreate + 1);
        Contract testContract = contractList.get(contractList.size() - 1);
        assertThat(testContract.getContractType()).isEqualTo(DEFAULT_CONTRACT_TYPE);
        assertThat(testContract.getContractNumber()).isEqualTo(DEFAULT_CONTRACT_NUMBER);
        assertThat(testContract.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testContract.getValidFrom()).isEqualTo(DEFAULT_VALID_FROM);
        assertThat(testContract.getValidTo()).isEqualTo(DEFAULT_VALID_TO);
        assertThat(testContract.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testContract.getCurrentAttachmentId()).isEqualTo(DEFAULT_CURRENT_ATTACHMENT_ID);
        assertThat(testContract.getOwnerId()).isEqualTo(DEFAULT_OWNER_ID);
        assertThat(testContract.getOwnerType()).isEqualTo(DEFAULT_OWNER_TYPE);
        assertThat(testContract.getAcquiringStatus()).isEqualTo(DEFAULT_ACQUIRING_STATUS);
    }

    @Test
    void createContractWithExistingId() throws Exception {
        // Create the Contract with an existing ID
        contract.setId(1L);

        int databaseSizeBeforeCreate = contractRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(contract))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Contract in the database
        List<Contract> contractList = contractRepository.findAll().collectList().block();
        assertThat(contractList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void checkContractTypeIsRequired() throws Exception {
        int databaseSizeBeforeTest = contractRepository.findAll().collectList().block().size();
        // set the field null
        contract.setContractType(null);

        // Create the Contract, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(contract))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Contract> contractList = contractRepository.findAll().collectList().block();
        assertThat(contractList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkContractNumberIsRequired() throws Exception {
        int databaseSizeBeforeTest = contractRepository.findAll().collectList().block().size();
        // set the field null
        contract.setContractNumber(null);

        // Create the Contract, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(contract))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Contract> contractList = contractRepository.findAll().collectList().block();
        assertThat(contractList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkStatusIsRequired() throws Exception {
        int databaseSizeBeforeTest = contractRepository.findAll().collectList().block().size();
        // set the field null
        contract.setStatus(null);

        // Create the Contract, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(contract))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Contract> contractList = contractRepository.findAll().collectList().block();
        assertThat(contractList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkOwnerIdIsRequired() throws Exception {
        int databaseSizeBeforeTest = contractRepository.findAll().collectList().block().size();
        // set the field null
        contract.setOwnerId(null);

        // Create the Contract, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(contract))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Contract> contractList = contractRepository.findAll().collectList().block();
        assertThat(contractList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkOwnerTypeIsRequired() throws Exception {
        int databaseSizeBeforeTest = contractRepository.findAll().collectList().block().size();
        // set the field null
        contract.setOwnerType(null);

        // Create the Contract, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(contract))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Contract> contractList = contractRepository.findAll().collectList().block();
        assertThat(contractList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkAcquiringStatusIsRequired() throws Exception {
        int databaseSizeBeforeTest = contractRepository.findAll().collectList().block().size();
        // set the field null
        contract.setAcquiringStatus(null);

        // Create the Contract, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(contract))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Contract> contractList = contractRepository.findAll().collectList().block();
        assertThat(contractList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void getAllContractsAsStream() {
        // Initialize the database
        contractRepository.save(contract).block();

        List<Contract> contractList = webTestClient
            .get()
            .uri(ENTITY_API_URL)
            .accept(MediaType.APPLICATION_NDJSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentTypeCompatibleWith(MediaType.APPLICATION_NDJSON)
            .returnResult(Contract.class)
            .getResponseBody()
            .filter(contract::equals)
            .collectList()
            .block(Duration.ofSeconds(5));

        assertThat(contractList).isNotNull();
        assertThat(contractList).hasSize(1);
        Contract testContract = contractList.get(0);
        assertThat(testContract.getContractType()).isEqualTo(DEFAULT_CONTRACT_TYPE);
        assertThat(testContract.getContractNumber()).isEqualTo(DEFAULT_CONTRACT_NUMBER);
        assertThat(testContract.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testContract.getValidFrom()).isEqualTo(DEFAULT_VALID_FROM);
        assertThat(testContract.getValidTo()).isEqualTo(DEFAULT_VALID_TO);
        assertThat(testContract.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testContract.getCurrentAttachmentId()).isEqualTo(DEFAULT_CURRENT_ATTACHMENT_ID);
        assertThat(testContract.getOwnerId()).isEqualTo(DEFAULT_OWNER_ID);
        assertThat(testContract.getOwnerType()).isEqualTo(DEFAULT_OWNER_TYPE);
        assertThat(testContract.getAcquiringStatus()).isEqualTo(DEFAULT_ACQUIRING_STATUS);
    }

    @Test
    void getAllContracts() {
        // Initialize the database
        contractRepository.save(contract).block();

        // Get all the contractList
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
            .value(hasItem(contract.getId().intValue()))
            .jsonPath("$.[*].contractType")
            .value(hasItem(DEFAULT_CONTRACT_TYPE.toString()))
            .jsonPath("$.[*].contractNumber")
            .value(hasItem(DEFAULT_CONTRACT_NUMBER))
            .jsonPath("$.[*].description")
            .value(hasItem(DEFAULT_DESCRIPTION))
            .jsonPath("$.[*].validFrom")
            .value(hasItem(sameInstant(DEFAULT_VALID_FROM)))
            .jsonPath("$.[*].validTo")
            .value(hasItem(sameInstant(DEFAULT_VALID_TO)))
            .jsonPath("$.[*].status")
            .value(hasItem(DEFAULT_STATUS.toString()))
            .jsonPath("$.[*].currentAttachmentId")
            .value(hasItem(DEFAULT_CURRENT_ATTACHMENT_ID.intValue()))
            .jsonPath("$.[*].ownerId")
            .value(hasItem(DEFAULT_OWNER_ID.intValue()))
            .jsonPath("$.[*].ownerType")
            .value(hasItem(DEFAULT_OWNER_TYPE.toString()))
            .jsonPath("$.[*].acquiringStatus")
            .value(hasItem(DEFAULT_ACQUIRING_STATUS.toString()));
    }

    @Test
    void getContract() {
        // Initialize the database
        contractRepository.save(contract).block();

        // Get the contract
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, contract.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(contract.getId().intValue()))
            .jsonPath("$.contractType")
            .value(is(DEFAULT_CONTRACT_TYPE.toString()))
            .jsonPath("$.contractNumber")
            .value(is(DEFAULT_CONTRACT_NUMBER))
            .jsonPath("$.description")
            .value(is(DEFAULT_DESCRIPTION))
            .jsonPath("$.validFrom")
            .value(is(sameInstant(DEFAULT_VALID_FROM)))
            .jsonPath("$.validTo")
            .value(is(sameInstant(DEFAULT_VALID_TO)))
            .jsonPath("$.status")
            .value(is(DEFAULT_STATUS.toString()))
            .jsonPath("$.currentAttachmentId")
            .value(is(DEFAULT_CURRENT_ATTACHMENT_ID.intValue()))
            .jsonPath("$.ownerId")
            .value(is(DEFAULT_OWNER_ID.intValue()))
            .jsonPath("$.ownerType")
            .value(is(DEFAULT_OWNER_TYPE.toString()))
            .jsonPath("$.acquiringStatus")
            .value(is(DEFAULT_ACQUIRING_STATUS.toString()));
    }

    @Test
    void getNonExistingContract() {
        // Get the contract
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putExistingContract() throws Exception {
        // Initialize the database
        contractRepository.save(contract).block();

        int databaseSizeBeforeUpdate = contractRepository.findAll().collectList().block().size();

        // Update the contract
        Contract updatedContract = contractRepository.findById(contract.getId()).block();
        updatedContract
            .contractType(UPDATED_CONTRACT_TYPE)
            .contractNumber(UPDATED_CONTRACT_NUMBER)
            .description(UPDATED_DESCRIPTION)
            .validFrom(UPDATED_VALID_FROM)
            .validTo(UPDATED_VALID_TO)
            .status(UPDATED_STATUS)
            .currentAttachmentId(UPDATED_CURRENT_ATTACHMENT_ID)
            .ownerId(UPDATED_OWNER_ID)
            .ownerType(UPDATED_OWNER_TYPE)
            .acquiringStatus(UPDATED_ACQUIRING_STATUS);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, updatedContract.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(updatedContract))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Contract in the database
        List<Contract> contractList = contractRepository.findAll().collectList().block();
        assertThat(contractList).hasSize(databaseSizeBeforeUpdate);
        Contract testContract = contractList.get(contractList.size() - 1);
        assertThat(testContract.getContractType()).isEqualTo(UPDATED_CONTRACT_TYPE);
        assertThat(testContract.getContractNumber()).isEqualTo(UPDATED_CONTRACT_NUMBER);
        assertThat(testContract.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testContract.getValidFrom()).isEqualTo(UPDATED_VALID_FROM);
        assertThat(testContract.getValidTo()).isEqualTo(UPDATED_VALID_TO);
        assertThat(testContract.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testContract.getCurrentAttachmentId()).isEqualTo(UPDATED_CURRENT_ATTACHMENT_ID);
        assertThat(testContract.getOwnerId()).isEqualTo(UPDATED_OWNER_ID);
        assertThat(testContract.getOwnerType()).isEqualTo(UPDATED_OWNER_TYPE);
        assertThat(testContract.getAcquiringStatus()).isEqualTo(UPDATED_ACQUIRING_STATUS);
    }

    @Test
    void putNonExistingContract() throws Exception {
        int databaseSizeBeforeUpdate = contractRepository.findAll().collectList().block().size();
        contract.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, contract.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(contract))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Contract in the database
        List<Contract> contractList = contractRepository.findAll().collectList().block();
        assertThat(contractList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchContract() throws Exception {
        int databaseSizeBeforeUpdate = contractRepository.findAll().collectList().block().size();
        contract.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(contract))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Contract in the database
        List<Contract> contractList = contractRepository.findAll().collectList().block();
        assertThat(contractList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamContract() throws Exception {
        int databaseSizeBeforeUpdate = contractRepository.findAll().collectList().block().size();
        contract.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(contract))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Contract in the database
        List<Contract> contractList = contractRepository.findAll().collectList().block();
        assertThat(contractList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateContractWithPatch() throws Exception {
        // Initialize the database
        contractRepository.save(contract).block();

        int databaseSizeBeforeUpdate = contractRepository.findAll().collectList().block().size();

        // Update the contract using partial update
        Contract partialUpdatedContract = new Contract();
        partialUpdatedContract.setId(contract.getId());

        partialUpdatedContract
            .contractNumber(UPDATED_CONTRACT_NUMBER)
            .description(UPDATED_DESCRIPTION)
            .status(UPDATED_STATUS)
            .ownerType(UPDATED_OWNER_TYPE);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedContract.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedContract))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Contract in the database
        List<Contract> contractList = contractRepository.findAll().collectList().block();
        assertThat(contractList).hasSize(databaseSizeBeforeUpdate);
        Contract testContract = contractList.get(contractList.size() - 1);
        assertThat(testContract.getContractType()).isEqualTo(DEFAULT_CONTRACT_TYPE);
        assertThat(testContract.getContractNumber()).isEqualTo(UPDATED_CONTRACT_NUMBER);
        assertThat(testContract.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testContract.getValidFrom()).isEqualTo(DEFAULT_VALID_FROM);
        assertThat(testContract.getValidTo()).isEqualTo(DEFAULT_VALID_TO);
        assertThat(testContract.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testContract.getCurrentAttachmentId()).isEqualTo(DEFAULT_CURRENT_ATTACHMENT_ID);
        assertThat(testContract.getOwnerId()).isEqualTo(DEFAULT_OWNER_ID);
        assertThat(testContract.getOwnerType()).isEqualTo(UPDATED_OWNER_TYPE);
        assertThat(testContract.getAcquiringStatus()).isEqualTo(DEFAULT_ACQUIRING_STATUS);
    }

    @Test
    void fullUpdateContractWithPatch() throws Exception {
        // Initialize the database
        contractRepository.save(contract).block();

        int databaseSizeBeforeUpdate = contractRepository.findAll().collectList().block().size();

        // Update the contract using partial update
        Contract partialUpdatedContract = new Contract();
        partialUpdatedContract.setId(contract.getId());

        partialUpdatedContract
            .contractType(UPDATED_CONTRACT_TYPE)
            .contractNumber(UPDATED_CONTRACT_NUMBER)
            .description(UPDATED_DESCRIPTION)
            .validFrom(UPDATED_VALID_FROM)
            .validTo(UPDATED_VALID_TO)
            .status(UPDATED_STATUS)
            .currentAttachmentId(UPDATED_CURRENT_ATTACHMENT_ID)
            .ownerId(UPDATED_OWNER_ID)
            .ownerType(UPDATED_OWNER_TYPE)
            .acquiringStatus(UPDATED_ACQUIRING_STATUS);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedContract.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedContract))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Contract in the database
        List<Contract> contractList = contractRepository.findAll().collectList().block();
        assertThat(contractList).hasSize(databaseSizeBeforeUpdate);
        Contract testContract = contractList.get(contractList.size() - 1);
        assertThat(testContract.getContractType()).isEqualTo(UPDATED_CONTRACT_TYPE);
        assertThat(testContract.getContractNumber()).isEqualTo(UPDATED_CONTRACT_NUMBER);
        assertThat(testContract.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testContract.getValidFrom()).isEqualTo(UPDATED_VALID_FROM);
        assertThat(testContract.getValidTo()).isEqualTo(UPDATED_VALID_TO);
        assertThat(testContract.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testContract.getCurrentAttachmentId()).isEqualTo(UPDATED_CURRENT_ATTACHMENT_ID);
        assertThat(testContract.getOwnerId()).isEqualTo(UPDATED_OWNER_ID);
        assertThat(testContract.getOwnerType()).isEqualTo(UPDATED_OWNER_TYPE);
        assertThat(testContract.getAcquiringStatus()).isEqualTo(UPDATED_ACQUIRING_STATUS);
    }

    @Test
    void patchNonExistingContract() throws Exception {
        int databaseSizeBeforeUpdate = contractRepository.findAll().collectList().block().size();
        contract.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, contract.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(contract))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Contract in the database
        List<Contract> contractList = contractRepository.findAll().collectList().block();
        assertThat(contractList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchContract() throws Exception {
        int databaseSizeBeforeUpdate = contractRepository.findAll().collectList().block().size();
        contract.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(contract))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Contract in the database
        List<Contract> contractList = contractRepository.findAll().collectList().block();
        assertThat(contractList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamContract() throws Exception {
        int databaseSizeBeforeUpdate = contractRepository.findAll().collectList().block().size();
        contract.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(contract))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Contract in the database
        List<Contract> contractList = contractRepository.findAll().collectList().block();
        assertThat(contractList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteContract() {
        // Initialize the database
        contractRepository.save(contract).block();

        int databaseSizeBeforeDelete = contractRepository.findAll().collectList().block().size();

        // Delete the contract
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, contract.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<Contract> contractList = contractRepository.findAll().collectList().block();
        assertThat(contractList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
