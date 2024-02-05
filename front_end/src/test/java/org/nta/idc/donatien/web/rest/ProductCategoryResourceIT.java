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
import org.nta.idc.donatien.domain.ProductCategory;
import org.nta.idc.donatien.domain.enumeration.Status;
import org.nta.idc.donatien.repository.EntityManager;
import org.nta.idc.donatien.repository.ProductCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.reactive.server.WebTestClient;

/**
 * Integration tests for the {@link ProductCategoryResource} REST controller.
 */
@IntegrationTest
@AutoConfigureWebTestClient(timeout = IntegrationTest.DEFAULT_ENTITY_TIMEOUT)
@WithMockUser
class ProductCategoryResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final Status DEFAULT_STATU = Status.ACTIVE;
    private static final Status UPDATED_STATU = Status.INACTIVE;

    private static final String DEFAULT_PARENT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_PARENT_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/product-categories";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ProductCategoryRepository productCategoryRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private WebTestClient webTestClient;

    private ProductCategory productCategory;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProductCategory createEntity(EntityManager em) {
        ProductCategory productCategory = new ProductCategory()
            .name(DEFAULT_NAME)
            .description(DEFAULT_DESCRIPTION)
            .statu(DEFAULT_STATU)
            .parentName(DEFAULT_PARENT_NAME);
        return productCategory;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProductCategory createUpdatedEntity(EntityManager em) {
        ProductCategory productCategory = new ProductCategory()
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .statu(UPDATED_STATU)
            .parentName(UPDATED_PARENT_NAME);
        return productCategory;
    }

    public static void deleteEntities(EntityManager em) {
        try {
            em.deleteAll(ProductCategory.class).block();
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
        productCategory = createEntity(em);
    }

    @Test
    void createProductCategory() throws Exception {
        int databaseSizeBeforeCreate = productCategoryRepository.findAll().collectList().block().size();
        // Create the ProductCategory
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(productCategory))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the ProductCategory in the database
        List<ProductCategory> productCategoryList = productCategoryRepository.findAll().collectList().block();
        assertThat(productCategoryList).hasSize(databaseSizeBeforeCreate + 1);
        ProductCategory testProductCategory = productCategoryList.get(productCategoryList.size() - 1);
        assertThat(testProductCategory.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testProductCategory.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testProductCategory.getStatu()).isEqualTo(DEFAULT_STATU);
        assertThat(testProductCategory.getParentName()).isEqualTo(DEFAULT_PARENT_NAME);
    }

    @Test
    void createProductCategoryWithExistingId() throws Exception {
        // Create the ProductCategory with an existing ID
        productCategory.setId(1L);

        int databaseSizeBeforeCreate = productCategoryRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(productCategory))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the ProductCategory in the database
        List<ProductCategory> productCategoryList = productCategoryRepository.findAll().collectList().block();
        assertThat(productCategoryList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = productCategoryRepository.findAll().collectList().block().size();
        // set the field null
        productCategory.setName(null);

        // Create the ProductCategory, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(productCategory))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<ProductCategory> productCategoryList = productCategoryRepository.findAll().collectList().block();
        assertThat(productCategoryList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkDescriptionIsRequired() throws Exception {
        int databaseSizeBeforeTest = productCategoryRepository.findAll().collectList().block().size();
        // set the field null
        productCategory.setDescription(null);

        // Create the ProductCategory, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(productCategory))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<ProductCategory> productCategoryList = productCategoryRepository.findAll().collectList().block();
        assertThat(productCategoryList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkStatuIsRequired() throws Exception {
        int databaseSizeBeforeTest = productCategoryRepository.findAll().collectList().block().size();
        // set the field null
        productCategory.setStatu(null);

        // Create the ProductCategory, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(productCategory))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<ProductCategory> productCategoryList = productCategoryRepository.findAll().collectList().block();
        assertThat(productCategoryList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void getAllProductCategoriesAsStream() {
        // Initialize the database
        productCategoryRepository.save(productCategory).block();

        List<ProductCategory> productCategoryList = webTestClient
            .get()
            .uri(ENTITY_API_URL)
            .accept(MediaType.APPLICATION_NDJSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentTypeCompatibleWith(MediaType.APPLICATION_NDJSON)
            .returnResult(ProductCategory.class)
            .getResponseBody()
            .filter(productCategory::equals)
            .collectList()
            .block(Duration.ofSeconds(5));

        assertThat(productCategoryList).isNotNull();
        assertThat(productCategoryList).hasSize(1);
        ProductCategory testProductCategory = productCategoryList.get(0);
        assertThat(testProductCategory.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testProductCategory.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testProductCategory.getStatu()).isEqualTo(DEFAULT_STATU);
        assertThat(testProductCategory.getParentName()).isEqualTo(DEFAULT_PARENT_NAME);
    }

    @Test
    void getAllProductCategories() {
        // Initialize the database
        productCategoryRepository.save(productCategory).block();

        // Get all the productCategoryList
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
            .value(hasItem(productCategory.getId().intValue()))
            .jsonPath("$.[*].name")
            .value(hasItem(DEFAULT_NAME))
            .jsonPath("$.[*].description")
            .value(hasItem(DEFAULT_DESCRIPTION))
            .jsonPath("$.[*].statu")
            .value(hasItem(DEFAULT_STATU.toString()))
            .jsonPath("$.[*].parentName")
            .value(hasItem(DEFAULT_PARENT_NAME));
    }

    @Test
    void getProductCategory() {
        // Initialize the database
        productCategoryRepository.save(productCategory).block();

        // Get the productCategory
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, productCategory.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(productCategory.getId().intValue()))
            .jsonPath("$.name")
            .value(is(DEFAULT_NAME))
            .jsonPath("$.description")
            .value(is(DEFAULT_DESCRIPTION))
            .jsonPath("$.statu")
            .value(is(DEFAULT_STATU.toString()))
            .jsonPath("$.parentName")
            .value(is(DEFAULT_PARENT_NAME));
    }

    @Test
    void getNonExistingProductCategory() {
        // Get the productCategory
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putExistingProductCategory() throws Exception {
        // Initialize the database
        productCategoryRepository.save(productCategory).block();

        int databaseSizeBeforeUpdate = productCategoryRepository.findAll().collectList().block().size();

        // Update the productCategory
        ProductCategory updatedProductCategory = productCategoryRepository.findById(productCategory.getId()).block();
        updatedProductCategory.name(UPDATED_NAME).description(UPDATED_DESCRIPTION).statu(UPDATED_STATU).parentName(UPDATED_PARENT_NAME);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, updatedProductCategory.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(updatedProductCategory))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the ProductCategory in the database
        List<ProductCategory> productCategoryList = productCategoryRepository.findAll().collectList().block();
        assertThat(productCategoryList).hasSize(databaseSizeBeforeUpdate);
        ProductCategory testProductCategory = productCategoryList.get(productCategoryList.size() - 1);
        assertThat(testProductCategory.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testProductCategory.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testProductCategory.getStatu()).isEqualTo(UPDATED_STATU);
        assertThat(testProductCategory.getParentName()).isEqualTo(UPDATED_PARENT_NAME);
    }

    @Test
    void putNonExistingProductCategory() throws Exception {
        int databaseSizeBeforeUpdate = productCategoryRepository.findAll().collectList().block().size();
        productCategory.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, productCategory.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(productCategory))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the ProductCategory in the database
        List<ProductCategory> productCategoryList = productCategoryRepository.findAll().collectList().block();
        assertThat(productCategoryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchProductCategory() throws Exception {
        int databaseSizeBeforeUpdate = productCategoryRepository.findAll().collectList().block().size();
        productCategory.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(productCategory))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the ProductCategory in the database
        List<ProductCategory> productCategoryList = productCategoryRepository.findAll().collectList().block();
        assertThat(productCategoryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamProductCategory() throws Exception {
        int databaseSizeBeforeUpdate = productCategoryRepository.findAll().collectList().block().size();
        productCategory.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(productCategory))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the ProductCategory in the database
        List<ProductCategory> productCategoryList = productCategoryRepository.findAll().collectList().block();
        assertThat(productCategoryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateProductCategoryWithPatch() throws Exception {
        // Initialize the database
        productCategoryRepository.save(productCategory).block();

        int databaseSizeBeforeUpdate = productCategoryRepository.findAll().collectList().block().size();

        // Update the productCategory using partial update
        ProductCategory partialUpdatedProductCategory = new ProductCategory();
        partialUpdatedProductCategory.setId(productCategory.getId());

        partialUpdatedProductCategory.name(UPDATED_NAME).statu(UPDATED_STATU);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedProductCategory.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedProductCategory))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the ProductCategory in the database
        List<ProductCategory> productCategoryList = productCategoryRepository.findAll().collectList().block();
        assertThat(productCategoryList).hasSize(databaseSizeBeforeUpdate);
        ProductCategory testProductCategory = productCategoryList.get(productCategoryList.size() - 1);
        assertThat(testProductCategory.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testProductCategory.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testProductCategory.getStatu()).isEqualTo(UPDATED_STATU);
        assertThat(testProductCategory.getParentName()).isEqualTo(DEFAULT_PARENT_NAME);
    }

    @Test
    void fullUpdateProductCategoryWithPatch() throws Exception {
        // Initialize the database
        productCategoryRepository.save(productCategory).block();

        int databaseSizeBeforeUpdate = productCategoryRepository.findAll().collectList().block().size();

        // Update the productCategory using partial update
        ProductCategory partialUpdatedProductCategory = new ProductCategory();
        partialUpdatedProductCategory.setId(productCategory.getId());

        partialUpdatedProductCategory
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .statu(UPDATED_STATU)
            .parentName(UPDATED_PARENT_NAME);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedProductCategory.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedProductCategory))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the ProductCategory in the database
        List<ProductCategory> productCategoryList = productCategoryRepository.findAll().collectList().block();
        assertThat(productCategoryList).hasSize(databaseSizeBeforeUpdate);
        ProductCategory testProductCategory = productCategoryList.get(productCategoryList.size() - 1);
        assertThat(testProductCategory.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testProductCategory.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testProductCategory.getStatu()).isEqualTo(UPDATED_STATU);
        assertThat(testProductCategory.getParentName()).isEqualTo(UPDATED_PARENT_NAME);
    }

    @Test
    void patchNonExistingProductCategory() throws Exception {
        int databaseSizeBeforeUpdate = productCategoryRepository.findAll().collectList().block().size();
        productCategory.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, productCategory.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(productCategory))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the ProductCategory in the database
        List<ProductCategory> productCategoryList = productCategoryRepository.findAll().collectList().block();
        assertThat(productCategoryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchProductCategory() throws Exception {
        int databaseSizeBeforeUpdate = productCategoryRepository.findAll().collectList().block().size();
        productCategory.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(productCategory))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the ProductCategory in the database
        List<ProductCategory> productCategoryList = productCategoryRepository.findAll().collectList().block();
        assertThat(productCategoryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamProductCategory() throws Exception {
        int databaseSizeBeforeUpdate = productCategoryRepository.findAll().collectList().block().size();
        productCategory.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(productCategory))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the ProductCategory in the database
        List<ProductCategory> productCategoryList = productCategoryRepository.findAll().collectList().block();
        assertThat(productCategoryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteProductCategory() {
        // Initialize the database
        productCategoryRepository.save(productCategory).block();

        int databaseSizeBeforeDelete = productCategoryRepository.findAll().collectList().block().size();

        // Delete the productCategory
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, productCategory.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<ProductCategory> productCategoryList = productCategoryRepository.findAll().collectList().block();
        assertThat(productCategoryList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
