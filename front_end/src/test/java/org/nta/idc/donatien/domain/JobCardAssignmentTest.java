package org.nta.idc.donatien.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.nta.idc.donatien.web.rest.TestUtil;

class JobCardAssignmentTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(JobCardAssignment.class);
        JobCardAssignment jobCardAssignment1 = new JobCardAssignment();
        jobCardAssignment1.setId(1L);
        JobCardAssignment jobCardAssignment2 = new JobCardAssignment();
        jobCardAssignment2.setId(jobCardAssignment1.getId());
        assertThat(jobCardAssignment1).isEqualTo(jobCardAssignment2);
        jobCardAssignment2.setId(2L);
        assertThat(jobCardAssignment1).isNotEqualTo(jobCardAssignment2);
        jobCardAssignment1.setId(null);
        assertThat(jobCardAssignment1).isNotEqualTo(jobCardAssignment2);
    }
}
