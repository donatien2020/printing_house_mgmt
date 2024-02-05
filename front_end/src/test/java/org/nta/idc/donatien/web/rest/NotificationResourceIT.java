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
import org.nta.idc.donatien.domain.Notification;
import org.nta.idc.donatien.domain.enumeration.NotificationProducts;
import org.nta.idc.donatien.domain.enumeration.NotificationReceivers;
import org.nta.idc.donatien.domain.enumeration.NotificationTypes;
import org.nta.idc.donatien.domain.enumeration.Status;
import org.nta.idc.donatien.repository.EntityManager;
import org.nta.idc.donatien.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.reactive.server.WebTestClient;

/**
 * Integration tests for the {@link NotificationResource} REST controller.
 */
@IntegrationTest
@AutoConfigureWebTestClient(timeout = IntegrationTest.DEFAULT_ENTITY_TIMEOUT)
@WithMockUser
class NotificationResourceIT {

    private static final NotificationTypes DEFAULT_NOTIFICATION_TYPE = NotificationTypes.E_MAIL;
    private static final NotificationTypes UPDATED_NOTIFICATION_TYPE = NotificationTypes.SMS;

    private static final String DEFAULT_CONTENT = "AAAAAAAAAA";
    private static final String UPDATED_CONTENT = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_SENT_AT = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_SENT_AT = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final NotificationProducts DEFAULT_PRODUCT = NotificationProducts.ORDER;
    private static final NotificationProducts UPDATED_PRODUCT = NotificationProducts.INVOICE;

    private static final Long DEFAULT_RECEIVER_ID = 1L;
    private static final Long UPDATED_RECEIVER_ID = 2L;

    private static final Long DEFAULT_RECEIVER_NAMES = 1L;
    private static final Long UPDATED_RECEIVER_NAMES = 2L;

    private static final String DEFAULT_RECEIVER_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_RECEIVER_EMAIL = "BBBBBBBBBB";

    private static final NotificationReceivers DEFAULT_RECEIVER_TYPE = NotificationReceivers.CLIENT;
    private static final NotificationReceivers UPDATED_RECEIVER_TYPE = NotificationReceivers.ORGANIZATION;

    private static final Status DEFAULT_STATUS = Status.ACTIVE;
    private static final Status UPDATED_STATUS = Status.INACTIVE;

    private static final String ENTITY_API_URL = "/api/notifications";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private WebTestClient webTestClient;

    private Notification notification;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Notification createEntity(EntityManager em) {
        Notification notification = new Notification()
            .notificationType(DEFAULT_NOTIFICATION_TYPE)
            .content(DEFAULT_CONTENT)
            .sentAt(DEFAULT_SENT_AT)
            .product(DEFAULT_PRODUCT)
            .receiverId(DEFAULT_RECEIVER_ID)
            .receiverNames(DEFAULT_RECEIVER_NAMES)
            .receiverEmail(DEFAULT_RECEIVER_EMAIL)
            .receiverType(DEFAULT_RECEIVER_TYPE)
            .status(DEFAULT_STATUS);
        return notification;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Notification createUpdatedEntity(EntityManager em) {
        Notification notification = new Notification()
            .notificationType(UPDATED_NOTIFICATION_TYPE)
            .content(UPDATED_CONTENT)
            .sentAt(UPDATED_SENT_AT)
            .product(UPDATED_PRODUCT)
            .receiverId(UPDATED_RECEIVER_ID)
            .receiverNames(UPDATED_RECEIVER_NAMES)
            .receiverEmail(UPDATED_RECEIVER_EMAIL)
            .receiverType(UPDATED_RECEIVER_TYPE)
            .status(UPDATED_STATUS);
        return notification;
    }

    public static void deleteEntities(EntityManager em) {
        try {
            em.deleteAll(Notification.class).block();
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
        notification = createEntity(em);
    }

    @Test
    void createNotification() throws Exception {
        int databaseSizeBeforeCreate = notificationRepository.findAll().collectList().block().size();
        // Create the Notification
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(notification))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the Notification in the database
        List<Notification> notificationList = notificationRepository.findAll().collectList().block();
        assertThat(notificationList).hasSize(databaseSizeBeforeCreate + 1);
        Notification testNotification = notificationList.get(notificationList.size() - 1);
        assertThat(testNotification.getNotificationType()).isEqualTo(DEFAULT_NOTIFICATION_TYPE);
        assertThat(testNotification.getContent()).isEqualTo(DEFAULT_CONTENT);
        assertThat(testNotification.getSentAt()).isEqualTo(DEFAULT_SENT_AT);
        assertThat(testNotification.getProduct()).isEqualTo(DEFAULT_PRODUCT);
        assertThat(testNotification.getReceiverId()).isEqualTo(DEFAULT_RECEIVER_ID);
        assertThat(testNotification.getReceiverNames()).isEqualTo(DEFAULT_RECEIVER_NAMES);
        assertThat(testNotification.getReceiverEmail()).isEqualTo(DEFAULT_RECEIVER_EMAIL);
        assertThat(testNotification.getReceiverType()).isEqualTo(DEFAULT_RECEIVER_TYPE);
        assertThat(testNotification.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    void createNotificationWithExistingId() throws Exception {
        // Create the Notification with an existing ID
        notification.setId(1L);

        int databaseSizeBeforeCreate = notificationRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(notification))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Notification in the database
        List<Notification> notificationList = notificationRepository.findAll().collectList().block();
        assertThat(notificationList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void checkNotificationTypeIsRequired() throws Exception {
        int databaseSizeBeforeTest = notificationRepository.findAll().collectList().block().size();
        // set the field null
        notification.setNotificationType(null);

        // Create the Notification, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(notification))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Notification> notificationList = notificationRepository.findAll().collectList().block();
        assertThat(notificationList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkContentIsRequired() throws Exception {
        int databaseSizeBeforeTest = notificationRepository.findAll().collectList().block().size();
        // set the field null
        notification.setContent(null);

        // Create the Notification, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(notification))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Notification> notificationList = notificationRepository.findAll().collectList().block();
        assertThat(notificationList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkProductIsRequired() throws Exception {
        int databaseSizeBeforeTest = notificationRepository.findAll().collectList().block().size();
        // set the field null
        notification.setProduct(null);

        // Create the Notification, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(notification))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Notification> notificationList = notificationRepository.findAll().collectList().block();
        assertThat(notificationList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkReceiverIdIsRequired() throws Exception {
        int databaseSizeBeforeTest = notificationRepository.findAll().collectList().block().size();
        // set the field null
        notification.setReceiverId(null);

        // Create the Notification, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(notification))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Notification> notificationList = notificationRepository.findAll().collectList().block();
        assertThat(notificationList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkReceiverNamesIsRequired() throws Exception {
        int databaseSizeBeforeTest = notificationRepository.findAll().collectList().block().size();
        // set the field null
        notification.setReceiverNames(null);

        // Create the Notification, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(notification))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Notification> notificationList = notificationRepository.findAll().collectList().block();
        assertThat(notificationList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkReceiverEmailIsRequired() throws Exception {
        int databaseSizeBeforeTest = notificationRepository.findAll().collectList().block().size();
        // set the field null
        notification.setReceiverEmail(null);

        // Create the Notification, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(notification))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Notification> notificationList = notificationRepository.findAll().collectList().block();
        assertThat(notificationList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkReceiverTypeIsRequired() throws Exception {
        int databaseSizeBeforeTest = notificationRepository.findAll().collectList().block().size();
        // set the field null
        notification.setReceiverType(null);

        // Create the Notification, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(notification))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Notification> notificationList = notificationRepository.findAll().collectList().block();
        assertThat(notificationList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkStatusIsRequired() throws Exception {
        int databaseSizeBeforeTest = notificationRepository.findAll().collectList().block().size();
        // set the field null
        notification.setStatus(null);

        // Create the Notification, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(notification))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Notification> notificationList = notificationRepository.findAll().collectList().block();
        assertThat(notificationList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void getAllNotificationsAsStream() {
        // Initialize the database
        notificationRepository.save(notification).block();

        List<Notification> notificationList = webTestClient
            .get()
            .uri(ENTITY_API_URL)
            .accept(MediaType.APPLICATION_NDJSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentTypeCompatibleWith(MediaType.APPLICATION_NDJSON)
            .returnResult(Notification.class)
            .getResponseBody()
            .filter(notification::equals)
            .collectList()
            .block(Duration.ofSeconds(5));

        assertThat(notificationList).isNotNull();
        assertThat(notificationList).hasSize(1);
        Notification testNotification = notificationList.get(0);
        assertThat(testNotification.getNotificationType()).isEqualTo(DEFAULT_NOTIFICATION_TYPE);
        assertThat(testNotification.getContent()).isEqualTo(DEFAULT_CONTENT);
        assertThat(testNotification.getSentAt()).isEqualTo(DEFAULT_SENT_AT);
        assertThat(testNotification.getProduct()).isEqualTo(DEFAULT_PRODUCT);
        assertThat(testNotification.getReceiverId()).isEqualTo(DEFAULT_RECEIVER_ID);
        assertThat(testNotification.getReceiverNames()).isEqualTo(DEFAULT_RECEIVER_NAMES);
        assertThat(testNotification.getReceiverEmail()).isEqualTo(DEFAULT_RECEIVER_EMAIL);
        assertThat(testNotification.getReceiverType()).isEqualTo(DEFAULT_RECEIVER_TYPE);
        assertThat(testNotification.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    void getAllNotifications() {
        // Initialize the database
        notificationRepository.save(notification).block();

        // Get all the notificationList
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
            .value(hasItem(notification.getId().intValue()))
            .jsonPath("$.[*].notificationType")
            .value(hasItem(DEFAULT_NOTIFICATION_TYPE.toString()))
            .jsonPath("$.[*].content")
            .value(hasItem(DEFAULT_CONTENT))
            .jsonPath("$.[*].sentAt")
            .value(hasItem(sameInstant(DEFAULT_SENT_AT)))
            .jsonPath("$.[*].product")
            .value(hasItem(DEFAULT_PRODUCT.toString()))
            .jsonPath("$.[*].receiverId")
            .value(hasItem(DEFAULT_RECEIVER_ID.intValue()))
            .jsonPath("$.[*].receiverNames")
            .value(hasItem(DEFAULT_RECEIVER_NAMES.intValue()))
            .jsonPath("$.[*].receiverEmail")
            .value(hasItem(DEFAULT_RECEIVER_EMAIL))
            .jsonPath("$.[*].receiverType")
            .value(hasItem(DEFAULT_RECEIVER_TYPE.toString()))
            .jsonPath("$.[*].status")
            .value(hasItem(DEFAULT_STATUS.toString()));
    }

    @Test
    void getNotification() {
        // Initialize the database
        notificationRepository.save(notification).block();

        // Get the notification
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, notification.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(notification.getId().intValue()))
            .jsonPath("$.notificationType")
            .value(is(DEFAULT_NOTIFICATION_TYPE.toString()))
            .jsonPath("$.content")
            .value(is(DEFAULT_CONTENT))
            .jsonPath("$.sentAt")
            .value(is(sameInstant(DEFAULT_SENT_AT)))
            .jsonPath("$.product")
            .value(is(DEFAULT_PRODUCT.toString()))
            .jsonPath("$.receiverId")
            .value(is(DEFAULT_RECEIVER_ID.intValue()))
            .jsonPath("$.receiverNames")
            .value(is(DEFAULT_RECEIVER_NAMES.intValue()))
            .jsonPath("$.receiverEmail")
            .value(is(DEFAULT_RECEIVER_EMAIL))
            .jsonPath("$.receiverType")
            .value(is(DEFAULT_RECEIVER_TYPE.toString()))
            .jsonPath("$.status")
            .value(is(DEFAULT_STATUS.toString()));
    }

    @Test
    void getNonExistingNotification() {
        // Get the notification
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putExistingNotification() throws Exception {
        // Initialize the database
        notificationRepository.save(notification).block();

        int databaseSizeBeforeUpdate = notificationRepository.findAll().collectList().block().size();

        // Update the notification
        Notification updatedNotification = notificationRepository.findById(notification.getId()).block();
        updatedNotification
            .notificationType(UPDATED_NOTIFICATION_TYPE)
            .content(UPDATED_CONTENT)
            .sentAt(UPDATED_SENT_AT)
            .product(UPDATED_PRODUCT)
            .receiverId(UPDATED_RECEIVER_ID)
            .receiverNames(UPDATED_RECEIVER_NAMES)
            .receiverEmail(UPDATED_RECEIVER_EMAIL)
            .receiverType(UPDATED_RECEIVER_TYPE)
            .status(UPDATED_STATUS);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, updatedNotification.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(updatedNotification))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Notification in the database
        List<Notification> notificationList = notificationRepository.findAll().collectList().block();
        assertThat(notificationList).hasSize(databaseSizeBeforeUpdate);
        Notification testNotification = notificationList.get(notificationList.size() - 1);
        assertThat(testNotification.getNotificationType()).isEqualTo(UPDATED_NOTIFICATION_TYPE);
        assertThat(testNotification.getContent()).isEqualTo(UPDATED_CONTENT);
        assertThat(testNotification.getSentAt()).isEqualTo(UPDATED_SENT_AT);
        assertThat(testNotification.getProduct()).isEqualTo(UPDATED_PRODUCT);
        assertThat(testNotification.getReceiverId()).isEqualTo(UPDATED_RECEIVER_ID);
        assertThat(testNotification.getReceiverNames()).isEqualTo(UPDATED_RECEIVER_NAMES);
        assertThat(testNotification.getReceiverEmail()).isEqualTo(UPDATED_RECEIVER_EMAIL);
        assertThat(testNotification.getReceiverType()).isEqualTo(UPDATED_RECEIVER_TYPE);
        assertThat(testNotification.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    void putNonExistingNotification() throws Exception {
        int databaseSizeBeforeUpdate = notificationRepository.findAll().collectList().block().size();
        notification.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, notification.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(notification))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Notification in the database
        List<Notification> notificationList = notificationRepository.findAll().collectList().block();
        assertThat(notificationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchNotification() throws Exception {
        int databaseSizeBeforeUpdate = notificationRepository.findAll().collectList().block().size();
        notification.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(notification))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Notification in the database
        List<Notification> notificationList = notificationRepository.findAll().collectList().block();
        assertThat(notificationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamNotification() throws Exception {
        int databaseSizeBeforeUpdate = notificationRepository.findAll().collectList().block().size();
        notification.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(notification))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Notification in the database
        List<Notification> notificationList = notificationRepository.findAll().collectList().block();
        assertThat(notificationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateNotificationWithPatch() throws Exception {
        // Initialize the database
        notificationRepository.save(notification).block();

        int databaseSizeBeforeUpdate = notificationRepository.findAll().collectList().block().size();

        // Update the notification using partial update
        Notification partialUpdatedNotification = new Notification();
        partialUpdatedNotification.setId(notification.getId());

        partialUpdatedNotification
            .sentAt(UPDATED_SENT_AT)
            .product(UPDATED_PRODUCT)
            .receiverId(UPDATED_RECEIVER_ID)
            .receiverNames(UPDATED_RECEIVER_NAMES)
            .receiverEmail(UPDATED_RECEIVER_EMAIL)
            .status(UPDATED_STATUS);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedNotification.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedNotification))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Notification in the database
        List<Notification> notificationList = notificationRepository.findAll().collectList().block();
        assertThat(notificationList).hasSize(databaseSizeBeforeUpdate);
        Notification testNotification = notificationList.get(notificationList.size() - 1);
        assertThat(testNotification.getNotificationType()).isEqualTo(DEFAULT_NOTIFICATION_TYPE);
        assertThat(testNotification.getContent()).isEqualTo(DEFAULT_CONTENT);
        assertThat(testNotification.getSentAt()).isEqualTo(UPDATED_SENT_AT);
        assertThat(testNotification.getProduct()).isEqualTo(UPDATED_PRODUCT);
        assertThat(testNotification.getReceiverId()).isEqualTo(UPDATED_RECEIVER_ID);
        assertThat(testNotification.getReceiverNames()).isEqualTo(UPDATED_RECEIVER_NAMES);
        assertThat(testNotification.getReceiverEmail()).isEqualTo(UPDATED_RECEIVER_EMAIL);
        assertThat(testNotification.getReceiverType()).isEqualTo(DEFAULT_RECEIVER_TYPE);
        assertThat(testNotification.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    void fullUpdateNotificationWithPatch() throws Exception {
        // Initialize the database
        notificationRepository.save(notification).block();

        int databaseSizeBeforeUpdate = notificationRepository.findAll().collectList().block().size();

        // Update the notification using partial update
        Notification partialUpdatedNotification = new Notification();
        partialUpdatedNotification.setId(notification.getId());

        partialUpdatedNotification
            .notificationType(UPDATED_NOTIFICATION_TYPE)
            .content(UPDATED_CONTENT)
            .sentAt(UPDATED_SENT_AT)
            .product(UPDATED_PRODUCT)
            .receiverId(UPDATED_RECEIVER_ID)
            .receiverNames(UPDATED_RECEIVER_NAMES)
            .receiverEmail(UPDATED_RECEIVER_EMAIL)
            .receiverType(UPDATED_RECEIVER_TYPE)
            .status(UPDATED_STATUS);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedNotification.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedNotification))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Notification in the database
        List<Notification> notificationList = notificationRepository.findAll().collectList().block();
        assertThat(notificationList).hasSize(databaseSizeBeforeUpdate);
        Notification testNotification = notificationList.get(notificationList.size() - 1);
        assertThat(testNotification.getNotificationType()).isEqualTo(UPDATED_NOTIFICATION_TYPE);
        assertThat(testNotification.getContent()).isEqualTo(UPDATED_CONTENT);
        assertThat(testNotification.getSentAt()).isEqualTo(UPDATED_SENT_AT);
        assertThat(testNotification.getProduct()).isEqualTo(UPDATED_PRODUCT);
        assertThat(testNotification.getReceiverId()).isEqualTo(UPDATED_RECEIVER_ID);
        assertThat(testNotification.getReceiverNames()).isEqualTo(UPDATED_RECEIVER_NAMES);
        assertThat(testNotification.getReceiverEmail()).isEqualTo(UPDATED_RECEIVER_EMAIL);
        assertThat(testNotification.getReceiverType()).isEqualTo(UPDATED_RECEIVER_TYPE);
        assertThat(testNotification.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    void patchNonExistingNotification() throws Exception {
        int databaseSizeBeforeUpdate = notificationRepository.findAll().collectList().block().size();
        notification.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, notification.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(notification))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Notification in the database
        List<Notification> notificationList = notificationRepository.findAll().collectList().block();
        assertThat(notificationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchNotification() throws Exception {
        int databaseSizeBeforeUpdate = notificationRepository.findAll().collectList().block().size();
        notification.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(notification))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Notification in the database
        List<Notification> notificationList = notificationRepository.findAll().collectList().block();
        assertThat(notificationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamNotification() throws Exception {
        int databaseSizeBeforeUpdate = notificationRepository.findAll().collectList().block().size();
        notification.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(notification))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Notification in the database
        List<Notification> notificationList = notificationRepository.findAll().collectList().block();
        assertThat(notificationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteNotification() {
        // Initialize the database
        notificationRepository.save(notification).block();

        int databaseSizeBeforeDelete = notificationRepository.findAll().collectList().block().size();

        // Delete the notification
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, notification.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<Notification> notificationList = notificationRepository.findAll().collectList().block();
        assertThat(notificationList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
