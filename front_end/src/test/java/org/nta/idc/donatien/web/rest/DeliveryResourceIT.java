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
import org.nta.idc.donatien.domain.Delivery;
import org.nta.idc.donatien.domain.enumeration.DeliveryStatuses;
import org.nta.idc.donatien.repository.DeliveryRepository;
import org.nta.idc.donatien.repository.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.reactive.server.WebTestClient;

/**
 * Integration tests for the {@link DeliveryResource} REST controller.
 */
@IntegrationTest
@AutoConfigureWebTestClient(timeout = IntegrationTest.DEFAULT_ENTITY_TIMEOUT)
@WithMockUser
class DeliveryResourceIT {

    private static final Long DEFAULT_ORDER_ID = 1L;
    private static final Long UPDATED_ORDER_ID = 2L;

    private static final Long DEFAULT_ORDER_NUMBER = 1L;
    private static final Long UPDATED_ORDER_NUMBER = 2L;

    private static final Long DEFAULT_DELIVERER_ID = 1L;
    private static final Long UPDATED_DELIVERER_ID = 2L;

    private static final String DEFAULT_DELIVERY_NOTE = "AAAAAAAAAA";
    private static final String UPDATED_DELIVERY_NOTE = "BBBBBBBBBB";

    private static final Long DEFAULT_RECEIVER_CLIENT_ID = 1L;
    private static final Long UPDATED_RECEIVER_CLIENT_ID = 2L;

    private static final Long DEFAULT_ATTACHMENT_ID = 1L;
    private static final Long UPDATED_ATTACHMENT_ID = 2L;

    private static final ZonedDateTime DEFAULT_DELIVERY_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DELIVERY_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_DELIVERY_ADDRESS = "AAAAAAAAAA";
    private static final String UPDATED_DELIVERY_ADDRESS = "BBBBBBBBBB";

    private static final Long DEFAULT_DELIVERY_LOCATION_ID = 1L;
    private static final Long UPDATED_DELIVERY_LOCATION_ID = 2L;

    private static final DeliveryStatuses DEFAULT_STATUS = DeliveryStatuses.INITIATED;
    private static final DeliveryStatuses UPDATED_STATUS = DeliveryStatuses.ASSIGNED;

    private static final String ENTITY_API_URL = "/api/deliveries";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private DeliveryRepository deliveryRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private WebTestClient webTestClient;

    private Delivery delivery;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Delivery createEntity(EntityManager em) {
        Delivery delivery = new Delivery()
            .orderNumber(DEFAULT_ORDER_NUMBER)
            .delivererId(DEFAULT_DELIVERER_ID)
            .deliveryNote(DEFAULT_DELIVERY_NOTE)
            .receiverClientId(DEFAULT_RECEIVER_CLIENT_ID)
            .deliveryDate(DEFAULT_DELIVERY_DATE)
            .deliveryAddress(DEFAULT_DELIVERY_ADDRESS)
            .status(DEFAULT_STATUS);
        return delivery;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Delivery createUpdatedEntity(EntityManager em) {
        Delivery delivery = new Delivery()
            .orderNumber(UPDATED_ORDER_NUMBER)
            .delivererId(UPDATED_DELIVERER_ID)
            .deliveryNote(UPDATED_DELIVERY_NOTE)
            .receiverClientId(UPDATED_RECEIVER_CLIENT_ID)
            .deliveryDate(UPDATED_DELIVERY_DATE)
            .deliveryAddress(UPDATED_DELIVERY_ADDRESS)
            .status(UPDATED_STATUS);
        return delivery;
    }

    public static void deleteEntities(EntityManager em) {
        try {
            em.deleteAll(Delivery.class).block();
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
        delivery = createEntity(em);
    }

    @Test
    void createDelivery() throws Exception {
        int databaseSizeBeforeCreate = deliveryRepository.findAll().collectList().block().size();
        // Create the Delivery
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(delivery))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the Delivery in the database
        List<Delivery> deliveryList = deliveryRepository.findAll().collectList().block();
        assertThat(deliveryList).hasSize(databaseSizeBeforeCreate + 1);
        Delivery testDelivery = deliveryList.get(deliveryList.size() - 1);
        assertThat(testDelivery.getOrderNumber()).isEqualTo(DEFAULT_ORDER_NUMBER);
        assertThat(testDelivery.getDelivererId()).isEqualTo(DEFAULT_DELIVERER_ID);
        assertThat(testDelivery.getDeliveryNote()).isEqualTo(DEFAULT_DELIVERY_NOTE);
        assertThat(testDelivery.getReceiverClientId()).isEqualTo(DEFAULT_RECEIVER_CLIENT_ID);
        assertThat(testDelivery.getDeliveryDate()).isEqualTo(DEFAULT_DELIVERY_DATE);
        assertThat(testDelivery.getDeliveryAddress()).isEqualTo(DEFAULT_DELIVERY_ADDRESS);
        assertThat(testDelivery.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    void createDeliveryWithExistingId() throws Exception {
        // Create the Delivery with an existing ID
        delivery.setId(1L);

        int databaseSizeBeforeCreate = deliveryRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(delivery))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Delivery in the database
        List<Delivery> deliveryList = deliveryRepository.findAll().collectList().block();
        assertThat(deliveryList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void checkOrderIdIsRequired() throws Exception {
        int databaseSizeBeforeTest = deliveryRepository.findAll().collectList().block().size();
        // set the field null
        // Create the Delivery, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(delivery))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Delivery> deliveryList = deliveryRepository.findAll().collectList().block();
        assertThat(deliveryList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkOrderNumberIsRequired() throws Exception {
        int databaseSizeBeforeTest = deliveryRepository.findAll().collectList().block().size();
        // set the field null
        delivery.setOrderNumber(null);

        // Create the Delivery, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(delivery))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Delivery> deliveryList = deliveryRepository.findAll().collectList().block();
        assertThat(deliveryList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkDelivererIdIsRequired() throws Exception {
        int databaseSizeBeforeTest = deliveryRepository.findAll().collectList().block().size();
        // set the field null
        delivery.setDelivererId(null);

        // Create the Delivery, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(delivery))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Delivery> deliveryList = deliveryRepository.findAll().collectList().block();
        assertThat(deliveryList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkReceiverClientIdIsRequired() throws Exception {
        int databaseSizeBeforeTest = deliveryRepository.findAll().collectList().block().size();
        // set the field null
        delivery.setReceiverClientId(null);

        // Create the Delivery, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(delivery))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Delivery> deliveryList = deliveryRepository.findAll().collectList().block();
        assertThat(deliveryList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkStatusIsRequired() throws Exception {
        int databaseSizeBeforeTest = deliveryRepository.findAll().collectList().block().size();
        // set the field null
        delivery.setStatus(null);

        // Create the Delivery, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(delivery))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Delivery> deliveryList = deliveryRepository.findAll().collectList().block();
        assertThat(deliveryList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void getAllDeliveriesAsStream() {
        // Initialize the database
        deliveryRepository.save(delivery).block();

        List<Delivery> deliveryList = webTestClient
            .get()
            .uri(ENTITY_API_URL)
            .accept(MediaType.APPLICATION_NDJSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentTypeCompatibleWith(MediaType.APPLICATION_NDJSON)
            .returnResult(Delivery.class)
            .getResponseBody()
            .filter(delivery::equals)
            .collectList()
            .block(Duration.ofSeconds(5));

        assertThat(deliveryList).isNotNull();
        assertThat(deliveryList).hasSize(1);
        Delivery testDelivery = deliveryList.get(0);
        assertThat(testDelivery.getOrderNumber()).isEqualTo(DEFAULT_ORDER_NUMBER);
        assertThat(testDelivery.getDelivererId()).isEqualTo(DEFAULT_DELIVERER_ID);
        assertThat(testDelivery.getDeliveryNote()).isEqualTo(DEFAULT_DELIVERY_NOTE);
        assertThat(testDelivery.getReceiverClientId()).isEqualTo(DEFAULT_RECEIVER_CLIENT_ID);
        assertThat(testDelivery.getDeliveryDate()).isEqualTo(DEFAULT_DELIVERY_DATE);
        assertThat(testDelivery.getDeliveryAddress()).isEqualTo(DEFAULT_DELIVERY_ADDRESS);
        assertThat(testDelivery.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    void getAllDeliveries() {
        // Initialize the database
        deliveryRepository.save(delivery).block();

        // Get all the deliveryList
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
            .value(hasItem(delivery.getId().intValue()))
            .jsonPath("$.[*].orderId")
            .value(hasItem(DEFAULT_ORDER_ID.intValue()))
            .jsonPath("$.[*].orderNumber")
            .value(hasItem(DEFAULT_ORDER_NUMBER.intValue()))
            .jsonPath("$.[*].delivererId")
            .value(hasItem(DEFAULT_DELIVERER_ID.intValue()))
            .jsonPath("$.[*].deliveryNote")
            .value(hasItem(DEFAULT_DELIVERY_NOTE))
            .jsonPath("$.[*].receiverClientId")
            .value(hasItem(DEFAULT_RECEIVER_CLIENT_ID.intValue()))
            .jsonPath("$.[*].attachmentId")
            .value(hasItem(DEFAULT_ATTACHMENT_ID.intValue()))
            .jsonPath("$.[*].deliveryDate")
            .value(hasItem(sameInstant(DEFAULT_DELIVERY_DATE)))
            .jsonPath("$.[*].deliveryAddress")
            .value(hasItem(DEFAULT_DELIVERY_ADDRESS))
            .jsonPath("$.[*].deliveryLocationId")
            .value(hasItem(DEFAULT_DELIVERY_LOCATION_ID.intValue()))
            .jsonPath("$.[*].status")
            .value(hasItem(DEFAULT_STATUS.toString()));
    }

    @Test
    void getDelivery() {
        // Initialize the database
        deliveryRepository.save(delivery).block();

        // Get the delivery
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, delivery.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(delivery.getId().intValue()))
            .jsonPath("$.orderId")
            .value(is(DEFAULT_ORDER_ID.intValue()))
            .jsonPath("$.orderNumber")
            .value(is(DEFAULT_ORDER_NUMBER.intValue()))
            .jsonPath("$.delivererId")
            .value(is(DEFAULT_DELIVERER_ID.intValue()))
            .jsonPath("$.deliveryNote")
            .value(is(DEFAULT_DELIVERY_NOTE))
            .jsonPath("$.receiverClientId")
            .value(is(DEFAULT_RECEIVER_CLIENT_ID.intValue()))
            .jsonPath("$.attachmentId")
            .value(is(DEFAULT_ATTACHMENT_ID.intValue()))
            .jsonPath("$.deliveryDate")
            .value(is(sameInstant(DEFAULT_DELIVERY_DATE)))
            .jsonPath("$.deliveryAddress")
            .value(is(DEFAULT_DELIVERY_ADDRESS))
            .jsonPath("$.deliveryLocationId")
            .value(is(DEFAULT_DELIVERY_LOCATION_ID.intValue()))
            .jsonPath("$.status")
            .value(is(DEFAULT_STATUS.toString()));
    }

    @Test
    void getNonExistingDelivery() {
        // Get the delivery
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putExistingDelivery() throws Exception {
        // Initialize the database
        deliveryRepository.save(delivery).block();

        int databaseSizeBeforeUpdate = deliveryRepository.findAll().collectList().block().size();

        // Update the delivery
        Delivery updatedDelivery = deliveryRepository.findById(delivery.getId()).block();
        updatedDelivery
            .orderNumber(UPDATED_ORDER_NUMBER)
            .delivererId(UPDATED_DELIVERER_ID)
            .deliveryNote(UPDATED_DELIVERY_NOTE)
            .receiverClientId(UPDATED_RECEIVER_CLIENT_ID)
            .deliveryDate(UPDATED_DELIVERY_DATE)
            .deliveryAddress(UPDATED_DELIVERY_ADDRESS)
            .status(UPDATED_STATUS);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, updatedDelivery.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(updatedDelivery))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Delivery in the database
        List<Delivery> deliveryList = deliveryRepository.findAll().collectList().block();
        assertThat(deliveryList).hasSize(databaseSizeBeforeUpdate);
        Delivery testDelivery = deliveryList.get(deliveryList.size() - 1);
        assertThat(testDelivery.getOrderNumber()).isEqualTo(UPDATED_ORDER_NUMBER);
        assertThat(testDelivery.getDelivererId()).isEqualTo(UPDATED_DELIVERER_ID);
        assertThat(testDelivery.getDeliveryNote()).isEqualTo(UPDATED_DELIVERY_NOTE);
        assertThat(testDelivery.getReceiverClientId()).isEqualTo(UPDATED_RECEIVER_CLIENT_ID);
        assertThat(testDelivery.getDeliveryDate()).isEqualTo(UPDATED_DELIVERY_DATE);
        assertThat(testDelivery.getDeliveryAddress()).isEqualTo(UPDATED_DELIVERY_ADDRESS);
        assertThat(testDelivery.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    void putNonExistingDelivery() throws Exception {
        int databaseSizeBeforeUpdate = deliveryRepository.findAll().collectList().block().size();
        delivery.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, delivery.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(delivery))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Delivery in the database
        List<Delivery> deliveryList = deliveryRepository.findAll().collectList().block();
        assertThat(deliveryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchDelivery() throws Exception {
        int databaseSizeBeforeUpdate = deliveryRepository.findAll().collectList().block().size();
        delivery.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(delivery))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Delivery in the database
        List<Delivery> deliveryList = deliveryRepository.findAll().collectList().block();
        assertThat(deliveryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamDelivery() throws Exception {
        int databaseSizeBeforeUpdate = deliveryRepository.findAll().collectList().block().size();
        delivery.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(delivery))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Delivery in the database
        List<Delivery> deliveryList = deliveryRepository.findAll().collectList().block();
        assertThat(deliveryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateDeliveryWithPatch() throws Exception {
        // Initialize the database
        deliveryRepository.save(delivery).block();

        int databaseSizeBeforeUpdate = deliveryRepository.findAll().collectList().block().size();

        // Update the delivery using partial update
        Delivery partialUpdatedDelivery = new Delivery();
        partialUpdatedDelivery.setId(delivery.getId());

        partialUpdatedDelivery
            .deliveryNote(UPDATED_DELIVERY_NOTE)
            .receiverClientId(UPDATED_RECEIVER_CLIENT_ID)
            .deliveryDate(UPDATED_DELIVERY_DATE)
            .status(UPDATED_STATUS);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedDelivery.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedDelivery))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Delivery in the database
        List<Delivery> deliveryList = deliveryRepository.findAll().collectList().block();
        assertThat(deliveryList).hasSize(databaseSizeBeforeUpdate);
        Delivery testDelivery = deliveryList.get(deliveryList.size() - 1);
        assertThat(testDelivery.getOrderNumber()).isEqualTo(DEFAULT_ORDER_NUMBER);
        assertThat(testDelivery.getDelivererId()).isEqualTo(DEFAULT_DELIVERER_ID);
        assertThat(testDelivery.getDeliveryNote()).isEqualTo(UPDATED_DELIVERY_NOTE);
        assertThat(testDelivery.getReceiverClientId()).isEqualTo(UPDATED_RECEIVER_CLIENT_ID);
        assertThat(testDelivery.getDeliveryDate()).isEqualTo(UPDATED_DELIVERY_DATE);
        assertThat(testDelivery.getDeliveryAddress()).isEqualTo(DEFAULT_DELIVERY_ADDRESS);
        assertThat(testDelivery.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    void fullUpdateDeliveryWithPatch() throws Exception {
        // Initialize the database
        deliveryRepository.save(delivery).block();

        int databaseSizeBeforeUpdate = deliveryRepository.findAll().collectList().block().size();

        // Update the delivery using partial update
        Delivery partialUpdatedDelivery = new Delivery();
        partialUpdatedDelivery.setId(delivery.getId());

        partialUpdatedDelivery
            .orderNumber(UPDATED_ORDER_NUMBER)
            .delivererId(UPDATED_DELIVERER_ID)
            .deliveryNote(UPDATED_DELIVERY_NOTE)
            .receiverClientId(UPDATED_RECEIVER_CLIENT_ID)
            .deliveryDate(UPDATED_DELIVERY_DATE)
            .deliveryAddress(UPDATED_DELIVERY_ADDRESS)
            .status(UPDATED_STATUS);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedDelivery.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedDelivery))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Delivery in the database
        List<Delivery> deliveryList = deliveryRepository.findAll().collectList().block();
        assertThat(deliveryList).hasSize(databaseSizeBeforeUpdate);
        Delivery testDelivery = deliveryList.get(deliveryList.size() - 1);
        assertThat(testDelivery.getOrderNumber()).isEqualTo(UPDATED_ORDER_NUMBER);
        assertThat(testDelivery.getDelivererId()).isEqualTo(UPDATED_DELIVERER_ID);
        assertThat(testDelivery.getDeliveryNote()).isEqualTo(UPDATED_DELIVERY_NOTE);
        assertThat(testDelivery.getReceiverClientId()).isEqualTo(UPDATED_RECEIVER_CLIENT_ID);
        assertThat(testDelivery.getDeliveryDate()).isEqualTo(UPDATED_DELIVERY_DATE);
        assertThat(testDelivery.getDeliveryAddress()).isEqualTo(UPDATED_DELIVERY_ADDRESS);
        assertThat(testDelivery.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    void patchNonExistingDelivery() throws Exception {
        int databaseSizeBeforeUpdate = deliveryRepository.findAll().collectList().block().size();
        delivery.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, delivery.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(delivery))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Delivery in the database
        List<Delivery> deliveryList = deliveryRepository.findAll().collectList().block();
        assertThat(deliveryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchDelivery() throws Exception {
        int databaseSizeBeforeUpdate = deliveryRepository.findAll().collectList().block().size();
        delivery.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(delivery))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Delivery in the database
        List<Delivery> deliveryList = deliveryRepository.findAll().collectList().block();
        assertThat(deliveryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamDelivery() throws Exception {
        int databaseSizeBeforeUpdate = deliveryRepository.findAll().collectList().block().size();
        delivery.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(delivery))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Delivery in the database
        List<Delivery> deliveryList = deliveryRepository.findAll().collectList().block();
        assertThat(deliveryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteDelivery() {
        // Initialize the database
        deliveryRepository.save(delivery).block();

        int databaseSizeBeforeDelete = deliveryRepository.findAll().collectList().block().size();

        // Delete the delivery
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, delivery.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<Delivery> deliveryList = deliveryRepository.findAll().collectList().block();
        assertThat(deliveryList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
