package org.nta.idc.donatien.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.nta.idc.donatien.web.rest.TestUtil;

class UserDivisionEnrolmentTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(UserDivisionEnrolment.class);
        UserDivisionEnrolment userDivisionEnrolment1 = new UserDivisionEnrolment();
        userDivisionEnrolment1.setId(1L);
        UserDivisionEnrolment userDivisionEnrolment2 = new UserDivisionEnrolment();
        userDivisionEnrolment2.setId(userDivisionEnrolment1.getId());
        assertThat(userDivisionEnrolment1).isEqualTo(userDivisionEnrolment2);
        userDivisionEnrolment2.setId(2L);
        assertThat(userDivisionEnrolment1).isNotEqualTo(userDivisionEnrolment2);
        userDivisionEnrolment1.setId(null);
        assertThat(userDivisionEnrolment1).isNotEqualTo(userDivisionEnrolment2);
    }
}
