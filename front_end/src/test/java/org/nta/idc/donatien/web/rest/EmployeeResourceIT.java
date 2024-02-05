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
import org.nta.idc.donatien.domain.Employee;
import org.nta.idc.donatien.domain.enumeration.EmploymentStatuses;
import org.nta.idc.donatien.domain.enumeration.EmploymentTypes;
import org.nta.idc.donatien.domain.enumeration.PaymentPeriods;
import org.nta.idc.donatien.repository.EmployeeRepository;
import org.nta.idc.donatien.repository.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.reactive.server.WebTestClient;

/**
 * Integration tests for the {@link EmployeeResource} REST controller.
 */
@IntegrationTest
@AutoConfigureWebTestClient(timeout = IntegrationTest.DEFAULT_ENTITY_TIMEOUT)
@WithMockUser
class EmployeeResourceIT {

    private static final String DEFAULT_EMP_NUMBER = "AAAAAAAAAA";
    private static final String UPDATED_EMP_NUMBER = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String DEFAULT_PHONE_NUMBER = "AAAAAAAAAA";
    private static final String UPDATED_PHONE_NUMBER = "BBBBBBBBBB";

    private static final String DEFAULT_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL = "BBBBBBBBBB";

    private static final EmploymentStatuses DEFAULT_STATUS = EmploymentStatuses.RECRUITED;
    private static final EmploymentStatuses UPDATED_STATUS = EmploymentStatuses.ACTIVE;

    private static final ZonedDateTime DEFAULT_STARTED_ON = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_STARTED_ON = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_TERMINATED_ON = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_TERMINATED_ON = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final EmploymentTypes DEFAULT_EMP_TYPE = EmploymentTypes.CONTRACTUAL;
    private static final EmploymentTypes UPDATED_EMP_TYPE = EmploymentTypes.CASUAL;

    private static final Double DEFAULT_BASE_PAYMENT = 1D;
    private static final Double UPDATED_BASE_PAYMENT = 2D;

    private static final Double DEFAULT_NET_PAYMENT = 1D;
    private static final Double UPDATED_NET_PAYMENT = 2D;

    private static final Double DEFAULT_GROSS_PAYMENT = 1D;
    private static final Double UPDATED_GROSS_PAYMENT = 2D;

    private static final PaymentPeriods DEFAULT_PAYMENT_PERIOD = PaymentPeriods.HOURLY;
    private static final PaymentPeriods UPDATED_PAYMENT_PERIOD = PaymentPeriods.DAILY;

    private static final String ENTITY_API_URL = "/api/employees";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private WebTestClient webTestClient;

    private Employee employee;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Employee createEntity(EntityManager em) {
        Employee employee = new Employee()
            .empNumber(DEFAULT_EMP_NUMBER)
            .description(DEFAULT_DESCRIPTION)
            .phoneNumber(DEFAULT_PHONE_NUMBER)
            .email(DEFAULT_EMAIL)
            .status(DEFAULT_STATUS)
            .startedOn(DEFAULT_STARTED_ON)
            .terminatedOn(DEFAULT_TERMINATED_ON)
            .empType(DEFAULT_EMP_TYPE)
            .basePayment(DEFAULT_BASE_PAYMENT)
            .netPayment(DEFAULT_NET_PAYMENT)
            .grossPayment(DEFAULT_GROSS_PAYMENT)
            .paymentPeriod(DEFAULT_PAYMENT_PERIOD);
        return employee;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Employee createUpdatedEntity(EntityManager em) {
        Employee employee = new Employee()
            .empNumber(UPDATED_EMP_NUMBER)
            .description(UPDATED_DESCRIPTION)
            .phoneNumber(UPDATED_PHONE_NUMBER)
            .email(UPDATED_EMAIL)
            .status(UPDATED_STATUS)
            .startedOn(UPDATED_STARTED_ON)
            .terminatedOn(UPDATED_TERMINATED_ON)
            .empType(UPDATED_EMP_TYPE)
            .basePayment(UPDATED_BASE_PAYMENT)
            .netPayment(UPDATED_NET_PAYMENT)
            .grossPayment(UPDATED_GROSS_PAYMENT)
            .paymentPeriod(UPDATED_PAYMENT_PERIOD);
        return employee;
    }

    public static void deleteEntities(EntityManager em) {
        try {
            em.deleteAll(Employee.class).block();
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
        employee = createEntity(em);
    }

    @Test
    void createEmployee() throws Exception {
        int databaseSizeBeforeCreate = employeeRepository.findAll().collectList().block().size();
        // Create the Employee
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(employee))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the Employee in the database
        List<Employee> employeeList = employeeRepository.findAll().collectList().block();
        assertThat(employeeList).hasSize(databaseSizeBeforeCreate + 1);
        Employee testEmployee = employeeList.get(employeeList.size() - 1);
        assertThat(testEmployee.getEmpNumber()).isEqualTo(DEFAULT_EMP_NUMBER);
        assertThat(testEmployee.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testEmployee.getPhoneNumber()).isEqualTo(DEFAULT_PHONE_NUMBER);
        assertThat(testEmployee.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testEmployee.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testEmployee.getStartedOn()).isEqualTo(DEFAULT_STARTED_ON);
        assertThat(testEmployee.getTerminatedOn()).isEqualTo(DEFAULT_TERMINATED_ON);
        assertThat(testEmployee.getEmpType()).isEqualTo(DEFAULT_EMP_TYPE);
        assertThat(testEmployee.getBasePayment()).isEqualTo(DEFAULT_BASE_PAYMENT);
        assertThat(testEmployee.getNetPayment()).isEqualTo(DEFAULT_NET_PAYMENT);
        assertThat(testEmployee.getGrossPayment()).isEqualTo(DEFAULT_GROSS_PAYMENT);
        assertThat(testEmployee.getPaymentPeriod()).isEqualTo(DEFAULT_PAYMENT_PERIOD);
    }

    @Test
    void createEmployeeWithExistingId() throws Exception {
        // Create the Employee with an existing ID
        employee.setId(1L);

        int databaseSizeBeforeCreate = employeeRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(employee))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Employee in the database
        List<Employee> employeeList = employeeRepository.findAll().collectList().block();
        assertThat(employeeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void checkEmpNumberIsRequired() throws Exception {
        int databaseSizeBeforeTest = employeeRepository.findAll().collectList().block().size();
        // set the field null
        employee.setEmpNumber(null);

        // Create the Employee, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(employee))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Employee> employeeList = employeeRepository.findAll().collectList().block();
        assertThat(employeeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkStatusIsRequired() throws Exception {
        int databaseSizeBeforeTest = employeeRepository.findAll().collectList().block().size();
        // set the field null
        employee.setStatus(null);

        // Create the Employee, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(employee))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Employee> employeeList = employeeRepository.findAll().collectList().block();
        assertThat(employeeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkEmpTypeIsRequired() throws Exception {
        int databaseSizeBeforeTest = employeeRepository.findAll().collectList().block().size();
        // set the field null
        employee.setEmpType(null);

        // Create the Employee, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(employee))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Employee> employeeList = employeeRepository.findAll().collectList().block();
        assertThat(employeeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkPaymentPeriodIsRequired() throws Exception {
        int databaseSizeBeforeTest = employeeRepository.findAll().collectList().block().size();
        // set the field null
        employee.setPaymentPeriod(null);

        // Create the Employee, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(employee))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Employee> employeeList = employeeRepository.findAll().collectList().block();
        assertThat(employeeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void getAllEmployees() {
        // Initialize the database
        employeeRepository.save(employee).block();

        // Get all the employeeList
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
            .value(hasItem(employee.getId().intValue()))
            .jsonPath("$.[*].empNumber")
            .value(hasItem(DEFAULT_EMP_NUMBER))
            .jsonPath("$.[*].description")
            .value(hasItem(DEFAULT_DESCRIPTION))
            .jsonPath("$.[*].phoneNumber")
            .value(hasItem(DEFAULT_PHONE_NUMBER))
            .jsonPath("$.[*].email")
            .value(hasItem(DEFAULT_EMAIL))
            .jsonPath("$.[*].status")
            .value(hasItem(DEFAULT_STATUS.toString()))
            .jsonPath("$.[*].startedOn")
            .value(hasItem(sameInstant(DEFAULT_STARTED_ON)))
            .jsonPath("$.[*].terminatedOn")
            .value(hasItem(sameInstant(DEFAULT_TERMINATED_ON)))
            .jsonPath("$.[*].empType")
            .value(hasItem(DEFAULT_EMP_TYPE.toString()))
            .jsonPath("$.[*].basePayment")
            .value(hasItem(DEFAULT_BASE_PAYMENT.doubleValue()))
            .jsonPath("$.[*].netPayment")
            .value(hasItem(DEFAULT_NET_PAYMENT.doubleValue()))
            .jsonPath("$.[*].grossPayment")
            .value(hasItem(DEFAULT_GROSS_PAYMENT.doubleValue()))
            .jsonPath("$.[*].paymentPeriod")
            .value(hasItem(DEFAULT_PAYMENT_PERIOD.toString()));
    }

    @Test
    void getEmployee() {
        // Initialize the database
        employeeRepository.save(employee).block();

        // Get the employee
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, employee.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(employee.getId().intValue()))
            .jsonPath("$.empNumber")
            .value(is(DEFAULT_EMP_NUMBER))
            .jsonPath("$.description")
            .value(is(DEFAULT_DESCRIPTION))
            .jsonPath("$.phoneNumber")
            .value(is(DEFAULT_PHONE_NUMBER))
            .jsonPath("$.email")
            .value(is(DEFAULT_EMAIL))
            .jsonPath("$.status")
            .value(is(DEFAULT_STATUS.toString()))
            .jsonPath("$.startedOn")
            .value(is(sameInstant(DEFAULT_STARTED_ON)))
            .jsonPath("$.terminatedOn")
            .value(is(sameInstant(DEFAULT_TERMINATED_ON)))
            .jsonPath("$.empType")
            .value(is(DEFAULT_EMP_TYPE.toString()))
            .jsonPath("$.basePayment")
            .value(is(DEFAULT_BASE_PAYMENT.doubleValue()))
            .jsonPath("$.netPayment")
            .value(is(DEFAULT_NET_PAYMENT.doubleValue()))
            .jsonPath("$.grossPayment")
            .value(is(DEFAULT_GROSS_PAYMENT.doubleValue()))
            .jsonPath("$.paymentPeriod")
            .value(is(DEFAULT_PAYMENT_PERIOD.toString()));
    }

    @Test
    void getNonExistingEmployee() {
        // Get the employee
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putExistingEmployee() throws Exception {
        // Initialize the database
        employeeRepository.save(employee).block();

        int databaseSizeBeforeUpdate = employeeRepository.findAll().collectList().block().size();

        // Update the employee
        Employee updatedEmployee = employeeRepository.findById(employee.getId()).block();
        updatedEmployee
            .empNumber(UPDATED_EMP_NUMBER)
            .description(UPDATED_DESCRIPTION)
            .phoneNumber(UPDATED_PHONE_NUMBER)
            .email(UPDATED_EMAIL)
            .status(UPDATED_STATUS)
            .startedOn(UPDATED_STARTED_ON)
            .terminatedOn(UPDATED_TERMINATED_ON)
            .empType(UPDATED_EMP_TYPE)
            .basePayment(UPDATED_BASE_PAYMENT)
            .netPayment(UPDATED_NET_PAYMENT)
            .grossPayment(UPDATED_GROSS_PAYMENT)
            .paymentPeriod(UPDATED_PAYMENT_PERIOD);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, updatedEmployee.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(updatedEmployee))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Employee in the database
        List<Employee> employeeList = employeeRepository.findAll().collectList().block();
        assertThat(employeeList).hasSize(databaseSizeBeforeUpdate);
        Employee testEmployee = employeeList.get(employeeList.size() - 1);
        assertThat(testEmployee.getEmpNumber()).isEqualTo(UPDATED_EMP_NUMBER);
        assertThat(testEmployee.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testEmployee.getPhoneNumber()).isEqualTo(UPDATED_PHONE_NUMBER);
        assertThat(testEmployee.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testEmployee.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testEmployee.getStartedOn()).isEqualTo(UPDATED_STARTED_ON);
        assertThat(testEmployee.getTerminatedOn()).isEqualTo(UPDATED_TERMINATED_ON);
        assertThat(testEmployee.getEmpType()).isEqualTo(UPDATED_EMP_TYPE);
        assertThat(testEmployee.getBasePayment()).isEqualTo(UPDATED_BASE_PAYMENT);
        assertThat(testEmployee.getNetPayment()).isEqualTo(UPDATED_NET_PAYMENT);
        assertThat(testEmployee.getGrossPayment()).isEqualTo(UPDATED_GROSS_PAYMENT);
        assertThat(testEmployee.getPaymentPeriod()).isEqualTo(UPDATED_PAYMENT_PERIOD);
    }

    @Test
    void putNonExistingEmployee() throws Exception {
        int databaseSizeBeforeUpdate = employeeRepository.findAll().collectList().block().size();
        employee.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, employee.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(employee))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Employee in the database
        List<Employee> employeeList = employeeRepository.findAll().collectList().block();
        assertThat(employeeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchEmployee() throws Exception {
        int databaseSizeBeforeUpdate = employeeRepository.findAll().collectList().block().size();
        employee.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(employee))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Employee in the database
        List<Employee> employeeList = employeeRepository.findAll().collectList().block();
        assertThat(employeeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamEmployee() throws Exception {
        int databaseSizeBeforeUpdate = employeeRepository.findAll().collectList().block().size();
        employee.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(employee))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Employee in the database
        List<Employee> employeeList = employeeRepository.findAll().collectList().block();
        assertThat(employeeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateEmployeeWithPatch() throws Exception {
        // Initialize the database
        employeeRepository.save(employee).block();

        int databaseSizeBeforeUpdate = employeeRepository.findAll().collectList().block().size();

        // Update the employee using partial update
        Employee partialUpdatedEmployee = new Employee();
        partialUpdatedEmployee.setId(employee.getId());

        partialUpdatedEmployee
            .description(UPDATED_DESCRIPTION)
            .phoneNumber(UPDATED_PHONE_NUMBER)
            .terminatedOn(UPDATED_TERMINATED_ON)
            .empType(UPDATED_EMP_TYPE)
            .basePayment(UPDATED_BASE_PAYMENT)
            .netPayment(UPDATED_NET_PAYMENT);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedEmployee.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedEmployee))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Employee in the database
        List<Employee> employeeList = employeeRepository.findAll().collectList().block();
        assertThat(employeeList).hasSize(databaseSizeBeforeUpdate);
        Employee testEmployee = employeeList.get(employeeList.size() - 1);
        assertThat(testEmployee.getEmpNumber()).isEqualTo(DEFAULT_EMP_NUMBER);
        assertThat(testEmployee.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testEmployee.getPhoneNumber()).isEqualTo(UPDATED_PHONE_NUMBER);
        assertThat(testEmployee.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testEmployee.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testEmployee.getStartedOn()).isEqualTo(DEFAULT_STARTED_ON);
        assertThat(testEmployee.getTerminatedOn()).isEqualTo(UPDATED_TERMINATED_ON);
        assertThat(testEmployee.getEmpType()).isEqualTo(UPDATED_EMP_TYPE);
        assertThat(testEmployee.getBasePayment()).isEqualTo(UPDATED_BASE_PAYMENT);
        assertThat(testEmployee.getNetPayment()).isEqualTo(UPDATED_NET_PAYMENT);
        assertThat(testEmployee.getGrossPayment()).isEqualTo(DEFAULT_GROSS_PAYMENT);
        assertThat(testEmployee.getPaymentPeriod()).isEqualTo(DEFAULT_PAYMENT_PERIOD);
    }

    @Test
    void fullUpdateEmployeeWithPatch() throws Exception {
        // Initialize the database
        employeeRepository.save(employee).block();

        int databaseSizeBeforeUpdate = employeeRepository.findAll().collectList().block().size();

        // Update the employee using partial update
        Employee partialUpdatedEmployee = new Employee();
        partialUpdatedEmployee.setId(employee.getId());

        partialUpdatedEmployee
            .empNumber(UPDATED_EMP_NUMBER)
            .description(UPDATED_DESCRIPTION)
            .phoneNumber(UPDATED_PHONE_NUMBER)
            .email(UPDATED_EMAIL)
            .status(UPDATED_STATUS)
            .startedOn(UPDATED_STARTED_ON)
            .terminatedOn(UPDATED_TERMINATED_ON)
            .empType(UPDATED_EMP_TYPE)
            .basePayment(UPDATED_BASE_PAYMENT)
            .netPayment(UPDATED_NET_PAYMENT)
            .grossPayment(UPDATED_GROSS_PAYMENT)
            .paymentPeriod(UPDATED_PAYMENT_PERIOD);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedEmployee.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedEmployee))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Employee in the database
        List<Employee> employeeList = employeeRepository.findAll().collectList().block();
        assertThat(employeeList).hasSize(databaseSizeBeforeUpdate);
        Employee testEmployee = employeeList.get(employeeList.size() - 1);
        assertThat(testEmployee.getEmpNumber()).isEqualTo(UPDATED_EMP_NUMBER);
        assertThat(testEmployee.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testEmployee.getPhoneNumber()).isEqualTo(UPDATED_PHONE_NUMBER);
        assertThat(testEmployee.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testEmployee.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testEmployee.getStartedOn()).isEqualTo(UPDATED_STARTED_ON);
        assertThat(testEmployee.getTerminatedOn()).isEqualTo(UPDATED_TERMINATED_ON);
        assertThat(testEmployee.getEmpType()).isEqualTo(UPDATED_EMP_TYPE);
        assertThat(testEmployee.getBasePayment()).isEqualTo(UPDATED_BASE_PAYMENT);
        assertThat(testEmployee.getNetPayment()).isEqualTo(UPDATED_NET_PAYMENT);
        assertThat(testEmployee.getGrossPayment()).isEqualTo(UPDATED_GROSS_PAYMENT);
        assertThat(testEmployee.getPaymentPeriod()).isEqualTo(UPDATED_PAYMENT_PERIOD);
    }

    @Test
    void patchNonExistingEmployee() throws Exception {
        int databaseSizeBeforeUpdate = employeeRepository.findAll().collectList().block().size();
        employee.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, employee.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(employee))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Employee in the database
        List<Employee> employeeList = employeeRepository.findAll().collectList().block();
        assertThat(employeeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchEmployee() throws Exception {
        int databaseSizeBeforeUpdate = employeeRepository.findAll().collectList().block().size();
        employee.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(employee))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Employee in the database
        List<Employee> employeeList = employeeRepository.findAll().collectList().block();
        assertThat(employeeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamEmployee() throws Exception {
        int databaseSizeBeforeUpdate = employeeRepository.findAll().collectList().block().size();
        employee.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(employee))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Employee in the database
        List<Employee> employeeList = employeeRepository.findAll().collectList().block();
        assertThat(employeeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteEmployee() {
        // Initialize the database
        employeeRepository.save(employee).block();

        int databaseSizeBeforeDelete = employeeRepository.findAll().collectList().block().size();

        // Delete the employee
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, employee.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<Employee> employeeList = employeeRepository.findAll().collectList().block();
        assertThat(employeeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
