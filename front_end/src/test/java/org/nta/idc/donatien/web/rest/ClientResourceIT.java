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
import org.nta.idc.donatien.domain.Client;
import org.nta.idc.donatien.domain.enumeration.ClientTypes;
import org.nta.idc.donatien.domain.enumeration.EngagementModes;
import org.nta.idc.donatien.repository.ClientRepository;
import org.nta.idc.donatien.repository.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.reactive.server.WebTestClient;

/**
 * Integration tests for the {@link ClientResource} REST controller.
 */
@IntegrationTest
@AutoConfigureWebTestClient(timeout = IntegrationTest.DEFAULT_ENTITY_TIMEOUT)
@WithMockUser
class ClientResourceIT {

    private static final ClientTypes DEFAULT_CLIENT_TYPE = ClientTypes.COMPANY;
    private static final ClientTypes UPDATED_CLIENT_TYPE = ClientTypes.INDIVIDUAL;

    private static final EngagementModes DEFAULT_ENGAGEMENT_MODE = EngagementModes.CONTRACTUAL;
    private static final EngagementModes UPDATED_ENGAGEMENT_MODE = EngagementModes.PASSENGER;

    private static final String DEFAULT_ADDRESS = "AAAAAAAAAA";
    private static final String UPDATED_ADDRESS = "BBBBBBBBBB";

    private static final Long DEFAULT_CURRENT_CONTRACT_ID = 1L;
    private static final Long UPDATED_CURRENT_CONTRACT_ID = 2L;

    private static final String DEFAULT_CONTACT_PHONE_NUMBER = "AAAAAAAAAA";
    private static final String UPDATED_CONTACT_PHONE_NUMBER = "BBBBBBBBBB";

    private static final Long DEFAULT_ORGANIZATION_ID = 1L;
    private static final Long UPDATED_ORGANIZATION_ID = 2L;

    private static final String ENTITY_API_URL = "/api/clients";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private WebTestClient webTestClient;

    private Client client;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Client createEntity(EntityManager em) {
        Client client = new Client()
            .clientType(DEFAULT_CLIENT_TYPE)
            .engagementMode(DEFAULT_ENGAGEMENT_MODE)
            .address(DEFAULT_ADDRESS)
            .currentContractId(DEFAULT_CURRENT_CONTRACT_ID)
            .contactPhoneNumber(DEFAULT_CONTACT_PHONE_NUMBER)
            .organizationId(DEFAULT_ORGANIZATION_ID);
        return client;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Client createUpdatedEntity(EntityManager em) {
        Client client = new Client()
            .clientType(UPDATED_CLIENT_TYPE)
            .engagementMode(UPDATED_ENGAGEMENT_MODE)
            .address(UPDATED_ADDRESS)
            .currentContractId(UPDATED_CURRENT_CONTRACT_ID)
            .contactPhoneNumber(UPDATED_CONTACT_PHONE_NUMBER)
            .organizationId(UPDATED_ORGANIZATION_ID);
        return client;
    }

    public static void deleteEntities(EntityManager em) {
        try {
            em.deleteAll(Client.class).block();
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
        client = createEntity(em);
    }

    @Test
    void createClient() throws Exception {
        int databaseSizeBeforeCreate = clientRepository.findAll().collectList().block().size();
        // Create the Client
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(client))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the Client in the database
        List<Client> clientList = clientRepository.findAll().collectList().block();
        assertThat(clientList).hasSize(databaseSizeBeforeCreate + 1);
        Client testClient = clientList.get(clientList.size() - 1);
        assertThat(testClient.getClientType()).isEqualTo(DEFAULT_CLIENT_TYPE);
        assertThat(testClient.getEngagementMode()).isEqualTo(DEFAULT_ENGAGEMENT_MODE);
        assertThat(testClient.getAddress()).isEqualTo(DEFAULT_ADDRESS);
        assertThat(testClient.getCurrentContractId()).isEqualTo(DEFAULT_CURRENT_CONTRACT_ID);
        assertThat(testClient.getContactPhoneNumber()).isEqualTo(DEFAULT_CONTACT_PHONE_NUMBER);
        assertThat(testClient.getOrganizationId()).isEqualTo(DEFAULT_ORGANIZATION_ID);
    }

    @Test
    void createClientWithExistingId() throws Exception {
        // Create the Client with an existing ID
        client.setId(1L);

        int databaseSizeBeforeCreate = clientRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(client))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Client in the database
        List<Client> clientList = clientRepository.findAll().collectList().block();
        assertThat(clientList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void checkClientTypeIsRequired() throws Exception {
        int databaseSizeBeforeTest = clientRepository.findAll().collectList().block().size();
        // set the field null
        client.setClientType(null);

        // Create the Client, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(client))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Client> clientList = clientRepository.findAll().collectList().block();
        assertThat(clientList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkEngagementModeIsRequired() throws Exception {
        int databaseSizeBeforeTest = clientRepository.findAll().collectList().block().size();
        // set the field null
        client.setEngagementMode(null);

        // Create the Client, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(client))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Client> clientList = clientRepository.findAll().collectList().block();
        assertThat(clientList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkOrganizationIdIsRequired() throws Exception {
        int databaseSizeBeforeTest = clientRepository.findAll().collectList().block().size();
        // set the field null
        client.setOrganizationId(null);

        // Create the Client, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(client))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Client> clientList = clientRepository.findAll().collectList().block();
        assertThat(clientList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void getAllClients() {
        // Initialize the database
        clientRepository.save(client).block();

        // Get all the clientList
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
            .value(hasItem(client.getId().intValue()))
            .jsonPath("$.[*].clientType")
            .value(hasItem(DEFAULT_CLIENT_TYPE.toString()))
            .jsonPath("$.[*].engagementMode")
            .value(hasItem(DEFAULT_ENGAGEMENT_MODE.toString()))
            .jsonPath("$.[*].address")
            .value(hasItem(DEFAULT_ADDRESS))
            .jsonPath("$.[*].currentContractId")
            .value(hasItem(DEFAULT_CURRENT_CONTRACT_ID.intValue()))
            .jsonPath("$.[*].contactPhoneNumber")
            .value(hasItem(DEFAULT_CONTACT_PHONE_NUMBER))
            .jsonPath("$.[*].organizationId")
            .value(hasItem(DEFAULT_ORGANIZATION_ID.intValue()));
    }

    @Test
    void getClient() {
        // Initialize the database
        clientRepository.save(client).block();

        // Get the client
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, client.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(client.getId().intValue()))
            .jsonPath("$.clientType")
            .value(is(DEFAULT_CLIENT_TYPE.toString()))
            .jsonPath("$.engagementMode")
            .value(is(DEFAULT_ENGAGEMENT_MODE.toString()))
            .jsonPath("$.address")
            .value(is(DEFAULT_ADDRESS))
            .jsonPath("$.currentContractId")
            .value(is(DEFAULT_CURRENT_CONTRACT_ID.intValue()))
            .jsonPath("$.contactPhoneNumber")
            .value(is(DEFAULT_CONTACT_PHONE_NUMBER))
            .jsonPath("$.organizationId")
            .value(is(DEFAULT_ORGANIZATION_ID.intValue()));
    }

    @Test
    void getNonExistingClient() {
        // Get the client
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putExistingClient() throws Exception {
        // Initialize the database
        clientRepository.save(client).block();

        int databaseSizeBeforeUpdate = clientRepository.findAll().collectList().block().size();

        // Update the client
        Client updatedClient = clientRepository.findById(client.getId()).block();
        updatedClient
            .clientType(UPDATED_CLIENT_TYPE)
            .engagementMode(UPDATED_ENGAGEMENT_MODE)
            .address(UPDATED_ADDRESS)
            .currentContractId(UPDATED_CURRENT_CONTRACT_ID)
            .contactPhoneNumber(UPDATED_CONTACT_PHONE_NUMBER)
            .organizationId(UPDATED_ORGANIZATION_ID);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, updatedClient.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(updatedClient))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Client in the database
        List<Client> clientList = clientRepository.findAll().collectList().block();
        assertThat(clientList).hasSize(databaseSizeBeforeUpdate);
        Client testClient = clientList.get(clientList.size() - 1);
        assertThat(testClient.getClientType()).isEqualTo(UPDATED_CLIENT_TYPE);
        assertThat(testClient.getEngagementMode()).isEqualTo(UPDATED_ENGAGEMENT_MODE);
        assertThat(testClient.getAddress()).isEqualTo(UPDATED_ADDRESS);
        assertThat(testClient.getCurrentContractId()).isEqualTo(UPDATED_CURRENT_CONTRACT_ID);
        assertThat(testClient.getContactPhoneNumber()).isEqualTo(UPDATED_CONTACT_PHONE_NUMBER);
        assertThat(testClient.getOrganizationId()).isEqualTo(UPDATED_ORGANIZATION_ID);
    }

    @Test
    void putNonExistingClient() throws Exception {
        int databaseSizeBeforeUpdate = clientRepository.findAll().collectList().block().size();
        client.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, client.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(client))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Client in the database
        List<Client> clientList = clientRepository.findAll().collectList().block();
        assertThat(clientList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchClient() throws Exception {
        int databaseSizeBeforeUpdate = clientRepository.findAll().collectList().block().size();
        client.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(client))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Client in the database
        List<Client> clientList = clientRepository.findAll().collectList().block();
        assertThat(clientList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamClient() throws Exception {
        int databaseSizeBeforeUpdate = clientRepository.findAll().collectList().block().size();
        client.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(client))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Client in the database
        List<Client> clientList = clientRepository.findAll().collectList().block();
        assertThat(clientList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateClientWithPatch() throws Exception {
        // Initialize the database
        clientRepository.save(client).block();

        int databaseSizeBeforeUpdate = clientRepository.findAll().collectList().block().size();

        // Update the client using partial update
        Client partialUpdatedClient = new Client();
        partialUpdatedClient.setId(client.getId());

        partialUpdatedClient.clientType(UPDATED_CLIENT_TYPE).engagementMode(UPDATED_ENGAGEMENT_MODE).address(UPDATED_ADDRESS);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedClient.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedClient))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Client in the database
        List<Client> clientList = clientRepository.findAll().collectList().block();
        assertThat(clientList).hasSize(databaseSizeBeforeUpdate);
        Client testClient = clientList.get(clientList.size() - 1);
        assertThat(testClient.getClientType()).isEqualTo(UPDATED_CLIENT_TYPE);
        assertThat(testClient.getEngagementMode()).isEqualTo(UPDATED_ENGAGEMENT_MODE);
        assertThat(testClient.getAddress()).isEqualTo(UPDATED_ADDRESS);
        assertThat(testClient.getCurrentContractId()).isEqualTo(DEFAULT_CURRENT_CONTRACT_ID);
        assertThat(testClient.getContactPhoneNumber()).isEqualTo(DEFAULT_CONTACT_PHONE_NUMBER);
        assertThat(testClient.getOrganizationId()).isEqualTo(DEFAULT_ORGANIZATION_ID);
    }

    @Test
    void fullUpdateClientWithPatch() throws Exception {
        // Initialize the database
        clientRepository.save(client).block();

        int databaseSizeBeforeUpdate = clientRepository.findAll().collectList().block().size();

        // Update the client using partial update
        Client partialUpdatedClient = new Client();
        partialUpdatedClient.setId(client.getId());

        partialUpdatedClient
            .clientType(UPDATED_CLIENT_TYPE)
            .engagementMode(UPDATED_ENGAGEMENT_MODE)
            .address(UPDATED_ADDRESS)
            .currentContractId(UPDATED_CURRENT_CONTRACT_ID)
            .contactPhoneNumber(UPDATED_CONTACT_PHONE_NUMBER)
            .organizationId(UPDATED_ORGANIZATION_ID);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedClient.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedClient))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Client in the database
        List<Client> clientList = clientRepository.findAll().collectList().block();
        assertThat(clientList).hasSize(databaseSizeBeforeUpdate);
        Client testClient = clientList.get(clientList.size() - 1);
        assertThat(testClient.getClientType()).isEqualTo(UPDATED_CLIENT_TYPE);
        assertThat(testClient.getEngagementMode()).isEqualTo(UPDATED_ENGAGEMENT_MODE);
        assertThat(testClient.getAddress()).isEqualTo(UPDATED_ADDRESS);
        assertThat(testClient.getCurrentContractId()).isEqualTo(UPDATED_CURRENT_CONTRACT_ID);
        assertThat(testClient.getContactPhoneNumber()).isEqualTo(UPDATED_CONTACT_PHONE_NUMBER);
        assertThat(testClient.getOrganizationId()).isEqualTo(UPDATED_ORGANIZATION_ID);
    }

    @Test
    void patchNonExistingClient() throws Exception {
        int databaseSizeBeforeUpdate = clientRepository.findAll().collectList().block().size();
        client.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, client.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(client))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Client in the database
        List<Client> clientList = clientRepository.findAll().collectList().block();
        assertThat(clientList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchClient() throws Exception {
        int databaseSizeBeforeUpdate = clientRepository.findAll().collectList().block().size();
        client.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(client))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Client in the database
        List<Client> clientList = clientRepository.findAll().collectList().block();
        assertThat(clientList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamClient() throws Exception {
        int databaseSizeBeforeUpdate = clientRepository.findAll().collectList().block().size();
        client.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(client))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Client in the database
        List<Client> clientList = clientRepository.findAll().collectList().block();
        assertThat(clientList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteClient() {
        // Initialize the database
        clientRepository.save(client).block();

        int databaseSizeBeforeDelete = clientRepository.findAll().collectList().block().size();

        // Delete the client
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, client.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<Client> clientList = clientRepository.findAll().collectList().block();
        assertThat(clientList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
