package org.nta.idc.donatien.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.nta.idc.donatien.web.rest.TestUtil;

class JobCardItemTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(JobCardItem.class);
        JobCardItem jobCardItem1 = new JobCardItem();
        jobCardItem1.setId(1L);
        JobCardItem jobCardItem2 = new JobCardItem();
        jobCardItem2.setId(jobCardItem1.getId());
        assertThat(jobCardItem1).isEqualTo(jobCardItem2);
        jobCardItem2.setId(2L);
        assertThat(jobCardItem1).isNotEqualTo(jobCardItem2);
        jobCardItem1.setId(null);
        assertThat(jobCardItem1).isNotEqualTo(jobCardItem2);
    }
}
