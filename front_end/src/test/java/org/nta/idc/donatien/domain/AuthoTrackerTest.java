package org.nta.idc.donatien.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.nta.idc.donatien.web.rest.TestUtil;

class AuthoTrackerTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(AuthoTracker.class);
        AuthoTracker authoTracker1 = new AuthoTracker();
        authoTracker1.setId(1L);
        AuthoTracker authoTracker2 = new AuthoTracker();
        authoTracker2.setId(authoTracker1.getId());
        assertThat(authoTracker1).isEqualTo(authoTracker2);
        authoTracker2.setId(2L);
        assertThat(authoTracker1).isNotEqualTo(authoTracker2);
        authoTracker1.setId(null);
        assertThat(authoTracker1).isNotEqualTo(authoTracker2);
    }
}
