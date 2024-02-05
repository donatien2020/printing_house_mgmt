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
import org.nta.idc.donatien.domain.Attachment;
import org.nta.idc.donatien.domain.enumeration.FileExtensions;
import org.nta.idc.donatien.domain.enumeration.FileOwnerTypes;
import org.nta.idc.donatien.domain.enumeration.FileTypes;
import org.nta.idc.donatien.domain.enumeration.Status;
import org.nta.idc.donatien.repository.AttachmentRepository;
import org.nta.idc.donatien.repository.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.reactive.server.WebTestClient;

/**
 * Integration tests for the {@link AttachmentResource} REST controller.
 */
@IntegrationTest
@AutoConfigureWebTestClient(timeout = IntegrationTest.DEFAULT_ENTITY_TIMEOUT)
@WithMockUser
class AttachmentResourceIT {

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String DEFAULT_FILE_NAME = "AAAAAAAAAA";
    private static final String UPDATED_FILE_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_PATH_TO_FILE = "AAAAAAAAAA";
    private static final String UPDATED_PATH_TO_FILE = "BBBBBBBBBB";

    private static final FileTypes DEFAULT_TYPE = FileTypes.IMAGE;
    private static final FileTypes UPDATED_TYPE = FileTypes.VIDEO;

    private static final FileExtensions DEFAULT_EXTENSION = FileExtensions.XLS;
    private static final FileExtensions UPDATED_EXTENSION = FileExtensions.XLSX;

    private static final FileOwnerTypes DEFAULT_OWNER_TYPE = FileOwnerTypes.ORGANIZATION;
    private static final FileOwnerTypes UPDATED_OWNER_TYPE = FileOwnerTypes.CLIENT;

    private static final Long DEFAULT_OWNER_ID = 1L;
    private static final Long UPDATED_OWNER_ID = 2L;

    private static final Status DEFAULT_STATUS = Status.ACTIVE;
    private static final Status UPDATED_STATUS = Status.INACTIVE;

    private static final String ENTITY_API_URL = "/api/attachments";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AttachmentRepository attachmentRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private WebTestClient webTestClient;

    private Attachment attachment;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Attachment createEntity(EntityManager em) {
        Attachment attachment = new Attachment()
            .description(DEFAULT_DESCRIPTION)
            .fileName(DEFAULT_FILE_NAME)
            .pathToFile(DEFAULT_PATH_TO_FILE)
            .type(DEFAULT_TYPE)
            .extension(DEFAULT_EXTENSION)
            .ownerType(DEFAULT_OWNER_TYPE)
            .ownerId(DEFAULT_OWNER_ID)
            .status(DEFAULT_STATUS);
        return attachment;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Attachment createUpdatedEntity(EntityManager em) {
        Attachment attachment = new Attachment()
            .description(UPDATED_DESCRIPTION)
            .fileName(UPDATED_FILE_NAME)
            .pathToFile(UPDATED_PATH_TO_FILE)
            .type(UPDATED_TYPE)
            .extension(UPDATED_EXTENSION)
            .ownerType(UPDATED_OWNER_TYPE)
            .ownerId(UPDATED_OWNER_ID)
            .status(UPDATED_STATUS);
        return attachment;
    }

    public static void deleteEntities(EntityManager em) {
        try {
            em.deleteAll(Attachment.class).block();
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
        attachment = createEntity(em);
    }

    @Test
    void createAttachment() throws Exception {
        int databaseSizeBeforeCreate = attachmentRepository.findAll().collectList().block().size();
        // Create the Attachment
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(attachment))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the Attachment in the database
        List<Attachment> attachmentList = attachmentRepository.findAll().collectList().block();
        assertThat(attachmentList).hasSize(databaseSizeBeforeCreate + 1);
        Attachment testAttachment = attachmentList.get(attachmentList.size() - 1);
        assertThat(testAttachment.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testAttachment.getFileName()).isEqualTo(DEFAULT_FILE_NAME);
        assertThat(testAttachment.getPathToFile()).isEqualTo(DEFAULT_PATH_TO_FILE);
        assertThat(testAttachment.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testAttachment.getExtension()).isEqualTo(DEFAULT_EXTENSION);
        assertThat(testAttachment.getOwnerType()).isEqualTo(DEFAULT_OWNER_TYPE);
        assertThat(testAttachment.getOwnerId()).isEqualTo(DEFAULT_OWNER_ID);
        assertThat(testAttachment.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    void createAttachmentWithExistingId() throws Exception {
        // Create the Attachment with an existing ID
        attachment.setId(1L);

        int databaseSizeBeforeCreate = attachmentRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(attachment))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Attachment in the database
        List<Attachment> attachmentList = attachmentRepository.findAll().collectList().block();
        assertThat(attachmentList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void getAllAttachmentsAsStream() {
        // Initialize the database
        attachmentRepository.save(attachment).block();

        List<Attachment> attachmentList = webTestClient
            .get()
            .uri(ENTITY_API_URL)
            .accept(MediaType.APPLICATION_NDJSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentTypeCompatibleWith(MediaType.APPLICATION_NDJSON)
            .returnResult(Attachment.class)
            .getResponseBody()
            .filter(attachment::equals)
            .collectList()
            .block(Duration.ofSeconds(5));

        assertThat(attachmentList).isNotNull();
        assertThat(attachmentList).hasSize(1);
        Attachment testAttachment = attachmentList.get(0);
        assertThat(testAttachment.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testAttachment.getFileName()).isEqualTo(DEFAULT_FILE_NAME);
        assertThat(testAttachment.getPathToFile()).isEqualTo(DEFAULT_PATH_TO_FILE);
        assertThat(testAttachment.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testAttachment.getExtension()).isEqualTo(DEFAULT_EXTENSION);
        assertThat(testAttachment.getOwnerType()).isEqualTo(DEFAULT_OWNER_TYPE);
        assertThat(testAttachment.getOwnerId()).isEqualTo(DEFAULT_OWNER_ID);
        assertThat(testAttachment.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    void getAllAttachments() {
        // Initialize the database
        attachmentRepository.save(attachment).block();

        // Get all the attachmentList
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
            .value(hasItem(attachment.getId().intValue()))
            .jsonPath("$.[*].description")
            .value(hasItem(DEFAULT_DESCRIPTION))
            .jsonPath("$.[*].fileName")
            .value(hasItem(DEFAULT_FILE_NAME))
            .jsonPath("$.[*].pathToFile")
            .value(hasItem(DEFAULT_PATH_TO_FILE))
            .jsonPath("$.[*].type")
            .value(hasItem(DEFAULT_TYPE.toString()))
            .jsonPath("$.[*].extension")
            .value(hasItem(DEFAULT_EXTENSION.toString()))
            .jsonPath("$.[*].ownerType")
            .value(hasItem(DEFAULT_OWNER_TYPE.toString()))
            .jsonPath("$.[*].ownerId")
            .value(hasItem(DEFAULT_OWNER_ID.intValue()))
            .jsonPath("$.[*].status")
            .value(hasItem(DEFAULT_STATUS.toString()));
    }

    @Test
    void getAttachment() {
        // Initialize the database
        attachmentRepository.save(attachment).block();

        // Get the attachment
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, attachment.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(attachment.getId().intValue()))
            .jsonPath("$.description")
            .value(is(DEFAULT_DESCRIPTION))
            .jsonPath("$.fileName")
            .value(is(DEFAULT_FILE_NAME))
            .jsonPath("$.pathToFile")
            .value(is(DEFAULT_PATH_TO_FILE))
            .jsonPath("$.type")
            .value(is(DEFAULT_TYPE.toString()))
            .jsonPath("$.extension")
            .value(is(DEFAULT_EXTENSION.toString()))
            .jsonPath("$.ownerType")
            .value(is(DEFAULT_OWNER_TYPE.toString()))
            .jsonPath("$.ownerId")
            .value(is(DEFAULT_OWNER_ID.intValue()))
            .jsonPath("$.status")
            .value(is(DEFAULT_STATUS.toString()));
    }

    @Test
    void getNonExistingAttachment() {
        // Get the attachment
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putExistingAttachment() throws Exception {
        // Initialize the database
        attachmentRepository.save(attachment).block();

        int databaseSizeBeforeUpdate = attachmentRepository.findAll().collectList().block().size();

        // Update the attachment
        Attachment updatedAttachment = attachmentRepository.findById(attachment.getId()).block();
        updatedAttachment
            .description(UPDATED_DESCRIPTION)
            .fileName(UPDATED_FILE_NAME)
            .pathToFile(UPDATED_PATH_TO_FILE)
            .type(UPDATED_TYPE)
            .extension(UPDATED_EXTENSION)
            .ownerType(UPDATED_OWNER_TYPE)
            .ownerId(UPDATED_OWNER_ID)
            .status(UPDATED_STATUS);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, updatedAttachment.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(updatedAttachment))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Attachment in the database
        List<Attachment> attachmentList = attachmentRepository.findAll().collectList().block();
        assertThat(attachmentList).hasSize(databaseSizeBeforeUpdate);
        Attachment testAttachment = attachmentList.get(attachmentList.size() - 1);
        assertThat(testAttachment.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testAttachment.getFileName()).isEqualTo(UPDATED_FILE_NAME);
        assertThat(testAttachment.getPathToFile()).isEqualTo(UPDATED_PATH_TO_FILE);
        assertThat(testAttachment.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testAttachment.getExtension()).isEqualTo(UPDATED_EXTENSION);
        assertThat(testAttachment.getOwnerType()).isEqualTo(UPDATED_OWNER_TYPE);
        assertThat(testAttachment.getOwnerId()).isEqualTo(UPDATED_OWNER_ID);
        assertThat(testAttachment.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    void putNonExistingAttachment() throws Exception {
        int databaseSizeBeforeUpdate = attachmentRepository.findAll().collectList().block().size();
        attachment.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, attachment.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(attachment))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Attachment in the database
        List<Attachment> attachmentList = attachmentRepository.findAll().collectList().block();
        assertThat(attachmentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchAttachment() throws Exception {
        int databaseSizeBeforeUpdate = attachmentRepository.findAll().collectList().block().size();
        attachment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(attachment))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Attachment in the database
        List<Attachment> attachmentList = attachmentRepository.findAll().collectList().block();
        assertThat(attachmentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamAttachment() throws Exception {
        int databaseSizeBeforeUpdate = attachmentRepository.findAll().collectList().block().size();
        attachment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(attachment))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Attachment in the database
        List<Attachment> attachmentList = attachmentRepository.findAll().collectList().block();
        assertThat(attachmentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateAttachmentWithPatch() throws Exception {
        // Initialize the database
        attachmentRepository.save(attachment).block();

        int databaseSizeBeforeUpdate = attachmentRepository.findAll().collectList().block().size();

        // Update the attachment using partial update
        Attachment partialUpdatedAttachment = new Attachment();
        partialUpdatedAttachment.setId(attachment.getId());

        partialUpdatedAttachment.fileName(UPDATED_FILE_NAME).type(UPDATED_TYPE).ownerId(UPDATED_OWNER_ID).status(UPDATED_STATUS);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedAttachment.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedAttachment))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Attachment in the database
        List<Attachment> attachmentList = attachmentRepository.findAll().collectList().block();
        assertThat(attachmentList).hasSize(databaseSizeBeforeUpdate);
        Attachment testAttachment = attachmentList.get(attachmentList.size() - 1);
        assertThat(testAttachment.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testAttachment.getFileName()).isEqualTo(UPDATED_FILE_NAME);
        assertThat(testAttachment.getPathToFile()).isEqualTo(DEFAULT_PATH_TO_FILE);
        assertThat(testAttachment.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testAttachment.getExtension()).isEqualTo(DEFAULT_EXTENSION);
        assertThat(testAttachment.getOwnerType()).isEqualTo(DEFAULT_OWNER_TYPE);
        assertThat(testAttachment.getOwnerId()).isEqualTo(UPDATED_OWNER_ID);
        assertThat(testAttachment.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    void fullUpdateAttachmentWithPatch() throws Exception {
        // Initialize the database
        attachmentRepository.save(attachment).block();

        int databaseSizeBeforeUpdate = attachmentRepository.findAll().collectList().block().size();

        // Update the attachment using partial update
        Attachment partialUpdatedAttachment = new Attachment();
        partialUpdatedAttachment.setId(attachment.getId());

        partialUpdatedAttachment
            .description(UPDATED_DESCRIPTION)
            .fileName(UPDATED_FILE_NAME)
            .pathToFile(UPDATED_PATH_TO_FILE)
            .type(UPDATED_TYPE)
            .extension(UPDATED_EXTENSION)
            .ownerType(UPDATED_OWNER_TYPE)
            .ownerId(UPDATED_OWNER_ID)
            .status(UPDATED_STATUS);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedAttachment.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedAttachment))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Attachment in the database
        List<Attachment> attachmentList = attachmentRepository.findAll().collectList().block();
        assertThat(attachmentList).hasSize(databaseSizeBeforeUpdate);
        Attachment testAttachment = attachmentList.get(attachmentList.size() - 1);
        assertThat(testAttachment.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testAttachment.getFileName()).isEqualTo(UPDATED_FILE_NAME);
        assertThat(testAttachment.getPathToFile()).isEqualTo(UPDATED_PATH_TO_FILE);
        assertThat(testAttachment.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testAttachment.getExtension()).isEqualTo(UPDATED_EXTENSION);
        assertThat(testAttachment.getOwnerType()).isEqualTo(UPDATED_OWNER_TYPE);
        assertThat(testAttachment.getOwnerId()).isEqualTo(UPDATED_OWNER_ID);
        assertThat(testAttachment.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    void patchNonExistingAttachment() throws Exception {
        int databaseSizeBeforeUpdate = attachmentRepository.findAll().collectList().block().size();
        attachment.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, attachment.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(attachment))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Attachment in the database
        List<Attachment> attachmentList = attachmentRepository.findAll().collectList().block();
        assertThat(attachmentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchAttachment() throws Exception {
        int databaseSizeBeforeUpdate = attachmentRepository.findAll().collectList().block().size();
        attachment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(attachment))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Attachment in the database
        List<Attachment> attachmentList = attachmentRepository.findAll().collectList().block();
        assertThat(attachmentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamAttachment() throws Exception {
        int databaseSizeBeforeUpdate = attachmentRepository.findAll().collectList().block().size();
        attachment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(attachment))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Attachment in the database
        List<Attachment> attachmentList = attachmentRepository.findAll().collectList().block();
        assertThat(attachmentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteAttachment() {
        // Initialize the database
        attachmentRepository.save(attachment).block();

        int databaseSizeBeforeDelete = attachmentRepository.findAll().collectList().block().size();

        // Delete the attachment
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, attachment.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<Attachment> attachmentList = attachmentRepository.findAll().collectList().block();
        assertThat(attachmentList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
