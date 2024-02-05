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
import org.nta.idc.donatien.domain.Supplier;
import org.nta.idc.donatien.domain.enumeration.Status;
import org.nta.idc.donatien.repository.EntityManager;
import org.nta.idc.donatien.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.reactive.server.WebTestClient;

/**
 * Integration tests for the {@link SupplierResource} REST controller.
 */
@IntegrationTest
@AutoConfigureWebTestClient(timeout = IntegrationTest.DEFAULT_ENTITY_TIMEOUT)
@WithMockUser
class SupplierResourceIT {

    private static final String DEFAULT_ADDRESS = "AAAAAAAAAA";
    private static final String UPDATED_ADDRESS = "BBBBBBBBBB";

    private static final String DEFAULT_PHONE_NUMBER = "AAAAAAAAAA";
    private static final String UPDATED_PHONE_NUMBER = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String DEFAULT_SPECIALIZATION = "AAAAAAAAAA";
    private static final String UPDATED_SPECIALIZATION = "BBBBBBBBBB";

    private static final Status DEFAULT_STATUS = Status.ACTIVE;
    private static final Status UPDATED_STATUS = Status.INACTIVE;

    private static final String ENTITY_API_URL = "/api/suppliers";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private WebTestClient webTestClient;

    private Supplier supplier;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Supplier createEntity(EntityManager em) {
        Supplier supplier = new Supplier()
            .address(DEFAULT_ADDRESS)
            .phoneNumber(DEFAULT_PHONE_NUMBER)
            .description(DEFAULT_DESCRIPTION)
            .specialization(DEFAULT_SPECIALIZATION)
            .status(DEFAULT_STATUS);
        return supplier;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Supplier createUpdatedEntity(EntityManager em) {
        Supplier supplier = new Supplier()
            .address(UPDATED_ADDRESS)
            .phoneNumber(UPDATED_PHONE_NUMBER)
            .description(UPDATED_DESCRIPTION)
            .specialization(UPDATED_SPECIALIZATION)
            .status(UPDATED_STATUS);
        return supplier;
    }

    public static void deleteEntities(EntityManager em) {
        try {
            em.deleteAll(Supplier.class).block();
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
        supplier = createEntity(em);
    }

    @Test
    void createSupplier() throws Exception {
        int databaseSizeBeforeCreate = supplierRepository.findAll().collectList().block().size();
        // Create the Supplier
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(supplier))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the Supplier in the database
        List<Supplier> supplierList = supplierRepository.findAll().collectList().block();
        assertThat(supplierList).hasSize(databaseSizeBeforeCreate + 1);
        Supplier testSupplier = supplierList.get(supplierList.size() - 1);
        assertThat(testSupplier.getAddress()).isEqualTo(DEFAULT_ADDRESS);
        assertThat(testSupplier.getPhoneNumber()).isEqualTo(DEFAULT_PHONE_NUMBER);
        assertThat(testSupplier.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testSupplier.getSpecialization()).isEqualTo(DEFAULT_SPECIALIZATION);
        assertThat(testSupplier.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    void createSupplierWithExistingId() throws Exception {
        // Create the Supplier with an existing ID
        supplier.setId(1L);

        int databaseSizeBeforeCreate = supplierRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(supplier))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Supplier in the database
        List<Supplier> supplierList = supplierRepository.findAll().collectList().block();
        assertThat(supplierList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void checkAddressIsRequired() throws Exception {
        int databaseSizeBeforeTest = supplierRepository.findAll().collectList().block().size();
        // set the field null
        supplier.setAddress(null);

        // Create the Supplier, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(supplier))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Supplier> supplierList = supplierRepository.findAll().collectList().block();
        assertThat(supplierList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkPhoneNumberIsRequired() throws Exception {
        int databaseSizeBeforeTest = supplierRepository.findAll().collectList().block().size();
        // set the field null
        supplier.setPhoneNumber(null);

        // Create the Supplier, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(supplier))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Supplier> supplierList = supplierRepository.findAll().collectList().block();
        assertThat(supplierList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkDescriptionIsRequired() throws Exception {
        int databaseSizeBeforeTest = supplierRepository.findAll().collectList().block().size();
        // set the field null
        supplier.setDescription(null);

        // Create the Supplier, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(supplier))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Supplier> supplierList = supplierRepository.findAll().collectList().block();
        assertThat(supplierList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkSpecializationIsRequired() throws Exception {
        int databaseSizeBeforeTest = supplierRepository.findAll().collectList().block().size();
        // set the field null
        supplier.setSpecialization(null);

        // Create the Supplier, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(supplier))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Supplier> supplierList = supplierRepository.findAll().collectList().block();
        assertThat(supplierList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkStatusIsRequired() throws Exception {
        int databaseSizeBeforeTest = supplierRepository.findAll().collectList().block().size();
        // set the field null
        supplier.setStatus(null);

        // Create the Supplier, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(supplier))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Supplier> supplierList = supplierRepository.findAll().collectList().block();
        assertThat(supplierList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void getAllSuppliersAsStream() {
        // Initialize the database
        supplierRepository.save(supplier).block();

        List<Supplier> supplierList = webTestClient
            .get()
            .uri(ENTITY_API_URL)
            .accept(MediaType.APPLICATION_NDJSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentTypeCompatibleWith(MediaType.APPLICATION_NDJSON)
            .returnResult(Supplier.class)
            .getResponseBody()
            .filter(supplier::equals)
            .collectList()
            .block(Duration.ofSeconds(5));

        assertThat(supplierList).isNotNull();
        assertThat(supplierList).hasSize(1);
        Supplier testSupplier = supplierList.get(0);
        assertThat(testSupplier.getAddress()).isEqualTo(DEFAULT_ADDRESS);
        assertThat(testSupplier.getPhoneNumber()).isEqualTo(DEFAULT_PHONE_NUMBER);
        assertThat(testSupplier.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testSupplier.getSpecialization()).isEqualTo(DEFAULT_SPECIALIZATION);
        assertThat(testSupplier.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    void getAllSuppliers() {
        // Initialize the database
        supplierRepository.save(supplier).block();

        // Get all the supplierList
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
            .value(hasItem(supplier.getId().intValue()))
            .jsonPath("$.[*].address")
            .value(hasItem(DEFAULT_ADDRESS))
            .jsonPath("$.[*].phoneNumber")
            .value(hasItem(DEFAULT_PHONE_NUMBER))
            .jsonPath("$.[*].description")
            .value(hasItem(DEFAULT_DESCRIPTION))
            .jsonPath("$.[*].specialization")
            .value(hasItem(DEFAULT_SPECIALIZATION))
            .jsonPath("$.[*].status")
            .value(hasItem(DEFAULT_STATUS.toString()));
    }

    @Test
    void getSupplier() {
        // Initialize the database
        supplierRepository.save(supplier).block();

        // Get the supplier
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, supplier.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(supplier.getId().intValue()))
            .jsonPath("$.address")
            .value(is(DEFAULT_ADDRESS))
            .jsonPath("$.phoneNumber")
            .value(is(DEFAULT_PHONE_NUMBER))
            .jsonPath("$.description")
            .value(is(DEFAULT_DESCRIPTION))
            .jsonPath("$.specialization")
            .value(is(DEFAULT_SPECIALIZATION))
            .jsonPath("$.status")
            .value(is(DEFAULT_STATUS.toString()));
    }

    @Test
    void getNonExistingSupplier() {
        // Get the supplier
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putExistingSupplier() throws Exception {
        // Initialize the database
        supplierRepository.save(supplier).block();

        int databaseSizeBeforeUpdate = supplierRepository.findAll().collectList().block().size();

        // Update the supplier
        Supplier updatedSupplier = supplierRepository.findById(supplier.getId()).block();
        updatedSupplier
            .address(UPDATED_ADDRESS)
            .phoneNumber(UPDATED_PHONE_NUMBER)
            .description(UPDATED_DESCRIPTION)
            .specialization(UPDATED_SPECIALIZATION)
            .status(UPDATED_STATUS);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, updatedSupplier.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(updatedSupplier))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Supplier in the database
        List<Supplier> supplierList = supplierRepository.findAll().collectList().block();
        assertThat(supplierList).hasSize(databaseSizeBeforeUpdate);
        Supplier testSupplier = supplierList.get(supplierList.size() - 1);
        assertThat(testSupplier.getAddress()).isEqualTo(UPDATED_ADDRESS);
        assertThat(testSupplier.getPhoneNumber()).isEqualTo(UPDATED_PHONE_NUMBER);
        assertThat(testSupplier.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testSupplier.getSpecialization()).isEqualTo(UPDATED_SPECIALIZATION);
        assertThat(testSupplier.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    void putNonExistingSupplier() throws Exception {
        int databaseSizeBeforeUpdate = supplierRepository.findAll().collectList().block().size();
        supplier.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, supplier.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(supplier))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Supplier in the database
        List<Supplier> supplierList = supplierRepository.findAll().collectList().block();
        assertThat(supplierList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchSupplier() throws Exception {
        int databaseSizeBeforeUpdate = supplierRepository.findAll().collectList().block().size();
        supplier.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(supplier))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Supplier in the database
        List<Supplier> supplierList = supplierRepository.findAll().collectList().block();
        assertThat(supplierList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamSupplier() throws Exception {
        int databaseSizeBeforeUpdate = supplierRepository.findAll().collectList().block().size();
        supplier.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(supplier))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Supplier in the database
        List<Supplier> supplierList = supplierRepository.findAll().collectList().block();
        assertThat(supplierList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateSupplierWithPatch() throws Exception {
        // Initialize the database
        supplierRepository.save(supplier).block();

        int databaseSizeBeforeUpdate = supplierRepository.findAll().collectList().block().size();

        // Update the supplier using partial update
        Supplier partialUpdatedSupplier = new Supplier();
        partialUpdatedSupplier.setId(supplier.getId());

        partialUpdatedSupplier.phoneNumber(UPDATED_PHONE_NUMBER).specialization(UPDATED_SPECIALIZATION).status(UPDATED_STATUS);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedSupplier.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedSupplier))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Supplier in the database
        List<Supplier> supplierList = supplierRepository.findAll().collectList().block();
        assertThat(supplierList).hasSize(databaseSizeBeforeUpdate);
        Supplier testSupplier = supplierList.get(supplierList.size() - 1);
        assertThat(testSupplier.getAddress()).isEqualTo(DEFAULT_ADDRESS);
        assertThat(testSupplier.getPhoneNumber()).isEqualTo(UPDATED_PHONE_NUMBER);
        assertThat(testSupplier.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testSupplier.getSpecialization()).isEqualTo(UPDATED_SPECIALIZATION);
        assertThat(testSupplier.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    void fullUpdateSupplierWithPatch() throws Exception {
        // Initialize the database
        supplierRepository.save(supplier).block();

        int databaseSizeBeforeUpdate = supplierRepository.findAll().collectList().block().size();

        // Update the supplier using partial update
        Supplier partialUpdatedSupplier = new Supplier();
        partialUpdatedSupplier.setId(supplier.getId());

        partialUpdatedSupplier
            .address(UPDATED_ADDRESS)
            .phoneNumber(UPDATED_PHONE_NUMBER)
            .description(UPDATED_DESCRIPTION)
            .specialization(UPDATED_SPECIALIZATION)
            .status(UPDATED_STATUS);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedSupplier.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedSupplier))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Supplier in the database
        List<Supplier> supplierList = supplierRepository.findAll().collectList().block();
        assertThat(supplierList).hasSize(databaseSizeBeforeUpdate);
        Supplier testSupplier = supplierList.get(supplierList.size() - 1);
        assertThat(testSupplier.getAddress()).isEqualTo(UPDATED_ADDRESS);
        assertThat(testSupplier.getPhoneNumber()).isEqualTo(UPDATED_PHONE_NUMBER);
        assertThat(testSupplier.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testSupplier.getSpecialization()).isEqualTo(UPDATED_SPECIALIZATION);
        assertThat(testSupplier.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    void patchNonExistingSupplier() throws Exception {
        int databaseSizeBeforeUpdate = supplierRepository.findAll().collectList().block().size();
        supplier.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, supplier.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(supplier))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Supplier in the database
        List<Supplier> supplierList = supplierRepository.findAll().collectList().block();
        assertThat(supplierList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchSupplier() throws Exception {
        int databaseSizeBeforeUpdate = supplierRepository.findAll().collectList().block().size();
        supplier.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(supplier))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Supplier in the database
        List<Supplier> supplierList = supplierRepository.findAll().collectList().block();
        assertThat(supplierList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamSupplier() throws Exception {
        int databaseSizeBeforeUpdate = supplierRepository.findAll().collectList().block().size();
        supplier.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(supplier))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Supplier in the database
        List<Supplier> supplierList = supplierRepository.findAll().collectList().block();
        assertThat(supplierList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteSupplier() {
        // Initialize the database
        supplierRepository.save(supplier).block();

        int databaseSizeBeforeDelete = supplierRepository.findAll().collectList().block().size();

        // Delete the supplier
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, supplier.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<Supplier> supplierList = supplierRepository.findAll().collectList().block();
        assertThat(supplierList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
