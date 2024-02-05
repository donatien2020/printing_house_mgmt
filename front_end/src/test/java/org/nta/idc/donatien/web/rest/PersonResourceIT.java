package org.nta.idc.donatien.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.is;

import java.time.Duration;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.nta.idc.donatien.IntegrationTest;
import org.nta.idc.donatien.domain.Person;
import org.nta.idc.donatien.domain.enumeration.DocumentTypes;
import org.nta.idc.donatien.domain.enumeration.Genders;
import org.nta.idc.donatien.domain.enumeration.Status;
import org.nta.idc.donatien.repository.EntityManager;
import org.nta.idc.donatien.repository.PersonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.reactive.server.WebTestClient;

/**
 * Integration tests for the {@link PersonResource} REST controller.
 */
@IntegrationTest
@AutoConfigureWebTestClient(timeout = IntegrationTest.DEFAULT_ENTITY_TIMEOUT)
@WithMockUser
class PersonResourceIT {

    private static final String DEFAULT_NID = "AAAAAAAAAA";
    private static final String UPDATED_NID = "BBBBBBBBBB";

    private static final DocumentTypes DEFAULT_DOC_TYPE = DocumentTypes.NID;
    private static final DocumentTypes UPDATED_DOC_TYPE = DocumentTypes.PASSPORT;

    private static final String DEFAULT_FIRST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_FIRST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_LAST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_LAST_NAME = "BBBBBBBBBB";

    private static final Genders DEFAULT_GENDER = Genders.MALE;
    private static final Genders UPDATED_GENDER = Genders.FEMALE;

    private static final LocalDate DEFAULT_BIRTH_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_BIRTH_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_BIRTH_ADDRESS = "AAAAAAAAAA";
    private static final String UPDATED_BIRTH_ADDRESS = "BBBBBBBBBB";

    private static final Status DEFAULT_STATUS = Status.ACTIVE;
    private static final Status UPDATED_STATUS = Status.INACTIVE;

    private static final String ENTITY_API_URL = "/api/people";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PersonRepository personRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private WebTestClient webTestClient;

    private Person person;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Person createEntity(EntityManager em) {
        Person person = new Person()
            .nid(DEFAULT_NID)
            .docType(DEFAULT_DOC_TYPE)
            .firstName(DEFAULT_FIRST_NAME)
            .lastName(DEFAULT_LAST_NAME)
            .gender(DEFAULT_GENDER)
            .birthDate(DEFAULT_BIRTH_DATE)
            .birthAddress(DEFAULT_BIRTH_ADDRESS)
            .status(DEFAULT_STATUS);
        return person;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Person createUpdatedEntity(EntityManager em) {
        Person person = new Person()
            .nid(UPDATED_NID)
            .docType(UPDATED_DOC_TYPE)
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .gender(UPDATED_GENDER)
            .birthDate(UPDATED_BIRTH_DATE)
            .birthAddress(UPDATED_BIRTH_ADDRESS)
            .status(UPDATED_STATUS);
        return person;
    }

    public static void deleteEntities(EntityManager em) {
        try {
            em.deleteAll(Person.class).block();
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
        person = createEntity(em);
    }

    @Test
    void createPerson() throws Exception {
        int databaseSizeBeforeCreate = personRepository.findAll().collectList().block().size();
        // Create the Person
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(person))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the Person in the database
        List<Person> personList = personRepository.findAll().collectList().block();
        assertThat(personList).hasSize(databaseSizeBeforeCreate + 1);
        Person testPerson = personList.get(personList.size() - 1);
        assertThat(testPerson.getNid()).isEqualTo(DEFAULT_NID);
        assertThat(testPerson.getDocType()).isEqualTo(DEFAULT_DOC_TYPE);
        assertThat(testPerson.getFirstName()).isEqualTo(DEFAULT_FIRST_NAME);
        assertThat(testPerson.getLastName()).isEqualTo(DEFAULT_LAST_NAME);
        assertThat(testPerson.getGender()).isEqualTo(DEFAULT_GENDER);
        assertThat(testPerson.getBirthDate()).isEqualTo(DEFAULT_BIRTH_DATE);
        assertThat(testPerson.getBirthAddress()).isEqualTo(DEFAULT_BIRTH_ADDRESS);
        assertThat(testPerson.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    void createPersonWithExistingId() throws Exception {
        // Create the Person with an existing ID
        person.setId(1L);

        int databaseSizeBeforeCreate = personRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(person))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Person in the database
        List<Person> personList = personRepository.findAll().collectList().block();
        assertThat(personList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void checkNidIsRequired() throws Exception {
        int databaseSizeBeforeTest = personRepository.findAll().collectList().block().size();
        // set the field null
        person.setNid(null);

        // Create the Person, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(person))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Person> personList = personRepository.findAll().collectList().block();
        assertThat(personList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkDocTypeIsRequired() throws Exception {
        int databaseSizeBeforeTest = personRepository.findAll().collectList().block().size();
        // set the field null
        person.setDocType(null);

        // Create the Person, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(person))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Person> personList = personRepository.findAll().collectList().block();
        assertThat(personList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkGenderIsRequired() throws Exception {
        int databaseSizeBeforeTest = personRepository.findAll().collectList().block().size();
        // set the field null
        person.setGender(null);

        // Create the Person, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(person))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Person> personList = personRepository.findAll().collectList().block();
        assertThat(personList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkStatusIsRequired() throws Exception {
        int databaseSizeBeforeTest = personRepository.findAll().collectList().block().size();
        // set the field null
        person.setStatus(null);

        // Create the Person, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(person))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Person> personList = personRepository.findAll().collectList().block();
        assertThat(personList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void getAllPeopleAsStream() {
        // Initialize the database
        personRepository.save(person).block();

        List<Person> personList = webTestClient
            .get()
            .uri(ENTITY_API_URL)
            .accept(MediaType.APPLICATION_NDJSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentTypeCompatibleWith(MediaType.APPLICATION_NDJSON)
            .returnResult(Person.class)
            .getResponseBody()
            .filter(person::equals)
            .collectList()
            .block(Duration.ofSeconds(5));

        assertThat(personList).isNotNull();
        assertThat(personList).hasSize(1);
        Person testPerson = personList.get(0);
        assertThat(testPerson.getNid()).isEqualTo(DEFAULT_NID);
        assertThat(testPerson.getDocType()).isEqualTo(DEFAULT_DOC_TYPE);
        assertThat(testPerson.getFirstName()).isEqualTo(DEFAULT_FIRST_NAME);
        assertThat(testPerson.getLastName()).isEqualTo(DEFAULT_LAST_NAME);
        assertThat(testPerson.getGender()).isEqualTo(DEFAULT_GENDER);
        assertThat(testPerson.getBirthDate()).isEqualTo(DEFAULT_BIRTH_DATE);
        assertThat(testPerson.getBirthAddress()).isEqualTo(DEFAULT_BIRTH_ADDRESS);
        assertThat(testPerson.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    void getAllPeople() {
        // Initialize the database
        personRepository.save(person).block();

        // Get all the personList
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
            .value(hasItem(person.getId().intValue()))
            .jsonPath("$.[*].nid")
            .value(hasItem(DEFAULT_NID))
            .jsonPath("$.[*].docType")
            .value(hasItem(DEFAULT_DOC_TYPE.toString()))
            .jsonPath("$.[*].firstName")
            .value(hasItem(DEFAULT_FIRST_NAME))
            .jsonPath("$.[*].lastName")
            .value(hasItem(DEFAULT_LAST_NAME))
            .jsonPath("$.[*].gender")
            .value(hasItem(DEFAULT_GENDER.toString()))
            .jsonPath("$.[*].birthDate")
            .value(hasItem(DEFAULT_BIRTH_DATE.toString()))
            .jsonPath("$.[*].birthAddress")
            .value(hasItem(DEFAULT_BIRTH_ADDRESS))
            .jsonPath("$.[*].status")
            .value(hasItem(DEFAULT_STATUS.toString()));
    }

    @Test
    void getPerson() {
        // Initialize the database
        personRepository.save(person).block();

        // Get the person
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, person.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(person.getId().intValue()))
            .jsonPath("$.nid")
            .value(is(DEFAULT_NID))
            .jsonPath("$.docType")
            .value(is(DEFAULT_DOC_TYPE.toString()))
            .jsonPath("$.firstName")
            .value(is(DEFAULT_FIRST_NAME))
            .jsonPath("$.lastName")
            .value(is(DEFAULT_LAST_NAME))
            .jsonPath("$.gender")
            .value(is(DEFAULT_GENDER.toString()))
            .jsonPath("$.birthDate")
            .value(is(DEFAULT_BIRTH_DATE.toString()))
            .jsonPath("$.birthAddress")
            .value(is(DEFAULT_BIRTH_ADDRESS))
            .jsonPath("$.status")
            .value(is(DEFAULT_STATUS.toString()));
    }

    @Test
    void getNonExistingPerson() {
        // Get the person
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putExistingPerson() throws Exception {
        // Initialize the database
        personRepository.save(person).block();

        int databaseSizeBeforeUpdate = personRepository.findAll().collectList().block().size();

        // Update the person
        Person updatedPerson = personRepository.findById(person.getId()).block();
        updatedPerson
            .nid(UPDATED_NID)
            .docType(UPDATED_DOC_TYPE)
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .gender(UPDATED_GENDER)
            .birthDate(UPDATED_BIRTH_DATE)
            .birthAddress(UPDATED_BIRTH_ADDRESS)
            .status(UPDATED_STATUS);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, updatedPerson.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(updatedPerson))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Person in the database
        List<Person> personList = personRepository.findAll().collectList().block();
        assertThat(personList).hasSize(databaseSizeBeforeUpdate);
        Person testPerson = personList.get(personList.size() - 1);
        assertThat(testPerson.getNid()).isEqualTo(UPDATED_NID);
        assertThat(testPerson.getDocType()).isEqualTo(UPDATED_DOC_TYPE);
        assertThat(testPerson.getFirstName()).isEqualTo(UPDATED_FIRST_NAME);
        assertThat(testPerson.getLastName()).isEqualTo(UPDATED_LAST_NAME);
        assertThat(testPerson.getGender()).isEqualTo(UPDATED_GENDER);
        assertThat(testPerson.getBirthDate()).isEqualTo(UPDATED_BIRTH_DATE);
        assertThat(testPerson.getBirthAddress()).isEqualTo(UPDATED_BIRTH_ADDRESS);
        assertThat(testPerson.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    void putNonExistingPerson() throws Exception {
        int databaseSizeBeforeUpdate = personRepository.findAll().collectList().block().size();
        person.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, person.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(person))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Person in the database
        List<Person> personList = personRepository.findAll().collectList().block();
        assertThat(personList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchPerson() throws Exception {
        int databaseSizeBeforeUpdate = personRepository.findAll().collectList().block().size();
        person.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(person))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Person in the database
        List<Person> personList = personRepository.findAll().collectList().block();
        assertThat(personList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamPerson() throws Exception {
        int databaseSizeBeforeUpdate = personRepository.findAll().collectList().block().size();
        person.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(person))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Person in the database
        List<Person> personList = personRepository.findAll().collectList().block();
        assertThat(personList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdatePersonWithPatch() throws Exception {
        // Initialize the database
        personRepository.save(person).block();

        int databaseSizeBeforeUpdate = personRepository.findAll().collectList().block().size();

        // Update the person using partial update
        Person partialUpdatedPerson = new Person();
        partialUpdatedPerson.setId(person.getId());

        partialUpdatedPerson.firstName(UPDATED_FIRST_NAME).status(UPDATED_STATUS);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedPerson.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedPerson))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Person in the database
        List<Person> personList = personRepository.findAll().collectList().block();
        assertThat(personList).hasSize(databaseSizeBeforeUpdate);
        Person testPerson = personList.get(personList.size() - 1);
        assertThat(testPerson.getNid()).isEqualTo(DEFAULT_NID);
        assertThat(testPerson.getDocType()).isEqualTo(DEFAULT_DOC_TYPE);
        assertThat(testPerson.getFirstName()).isEqualTo(UPDATED_FIRST_NAME);
        assertThat(testPerson.getLastName()).isEqualTo(DEFAULT_LAST_NAME);
        assertThat(testPerson.getGender()).isEqualTo(DEFAULT_GENDER);
        assertThat(testPerson.getBirthDate()).isEqualTo(DEFAULT_BIRTH_DATE);
        assertThat(testPerson.getBirthAddress()).isEqualTo(DEFAULT_BIRTH_ADDRESS);
        assertThat(testPerson.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    void fullUpdatePersonWithPatch() throws Exception {
        // Initialize the database
        personRepository.save(person).block();

        int databaseSizeBeforeUpdate = personRepository.findAll().collectList().block().size();

        // Update the person using partial update
        Person partialUpdatedPerson = new Person();
        partialUpdatedPerson.setId(person.getId());

        partialUpdatedPerson
            .nid(UPDATED_NID)
            .docType(UPDATED_DOC_TYPE)
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .gender(UPDATED_GENDER)
            .birthDate(UPDATED_BIRTH_DATE)
            .birthAddress(UPDATED_BIRTH_ADDRESS)
            .status(UPDATED_STATUS);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedPerson.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedPerson))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Person in the database
        List<Person> personList = personRepository.findAll().collectList().block();
        assertThat(personList).hasSize(databaseSizeBeforeUpdate);
        Person testPerson = personList.get(personList.size() - 1);
        assertThat(testPerson.getNid()).isEqualTo(UPDATED_NID);
        assertThat(testPerson.getDocType()).isEqualTo(UPDATED_DOC_TYPE);
        assertThat(testPerson.getFirstName()).isEqualTo(UPDATED_FIRST_NAME);
        assertThat(testPerson.getLastName()).isEqualTo(UPDATED_LAST_NAME);
        assertThat(testPerson.getGender()).isEqualTo(UPDATED_GENDER);
        assertThat(testPerson.getBirthDate()).isEqualTo(UPDATED_BIRTH_DATE);
        assertThat(testPerson.getBirthAddress()).isEqualTo(UPDATED_BIRTH_ADDRESS);
        assertThat(testPerson.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    void patchNonExistingPerson() throws Exception {
        int databaseSizeBeforeUpdate = personRepository.findAll().collectList().block().size();
        person.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, person.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(person))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Person in the database
        List<Person> personList = personRepository.findAll().collectList().block();
        assertThat(personList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchPerson() throws Exception {
        int databaseSizeBeforeUpdate = personRepository.findAll().collectList().block().size();
        person.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(person))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Person in the database
        List<Person> personList = personRepository.findAll().collectList().block();
        assertThat(personList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamPerson() throws Exception {
        int databaseSizeBeforeUpdate = personRepository.findAll().collectList().block().size();
        person.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(person))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Person in the database
        List<Person> personList = personRepository.findAll().collectList().block();
        assertThat(personList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deletePerson() {
        // Initialize the database
        personRepository.save(person).block();

        int databaseSizeBeforeDelete = personRepository.findAll().collectList().block().size();

        // Delete the person
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, person.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<Person> personList = personRepository.findAll().collectList().block();
        assertThat(personList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
