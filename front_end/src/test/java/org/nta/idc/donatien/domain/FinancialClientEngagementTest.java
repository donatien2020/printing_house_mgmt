package org.nta.idc.donatien.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.nta.idc.donatien.web.rest.TestUtil;

class FinancialClientEngagementTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(FinancialClientEngagement.class);
        FinancialClientEngagement financialClientEngagement1 = new FinancialClientEngagement();
        financialClientEngagement1.setId(1L);
        FinancialClientEngagement financialClientEngagement2 = new FinancialClientEngagement();
        financialClientEngagement2.setId(financialClientEngagement1.getId());
        assertThat(financialClientEngagement1).isEqualTo(financialClientEngagement2);
        financialClientEngagement2.setId(2L);
        assertThat(financialClientEngagement1).isNotEqualTo(financialClientEngagement2);
        financialClientEngagement1.setId(null);
        assertThat(financialClientEngagement1).isNotEqualTo(financialClientEngagement2);
    }
}
