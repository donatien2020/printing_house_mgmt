package org.nta.idc.donatien.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.nta.idc.donatien.web.rest.TestUtil;

class JobCardTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(JobCard.class);
        JobCard jobCard1 = new JobCard();
        jobCard1.setId(1L);
        JobCard jobCard2 = new JobCard();
        jobCard2.setId(jobCard1.getId());
        assertThat(jobCard1).isEqualTo(jobCard2);
        jobCard2.setId(2L);
        assertThat(jobCard1).isNotEqualTo(jobCard2);
        jobCard1.setId(null);
        assertThat(jobCard1).isNotEqualTo(jobCard2);
    }
}
