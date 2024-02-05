package org.nta.idc.donatien.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.nta.idc.donatien.web.rest.TestUtil;

class PayRollTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(PayRoll.class);
        PayRoll payRoll1 = new PayRoll();
        payRoll1.setId(1L);
        PayRoll payRoll2 = new PayRoll();
        payRoll2.setId(payRoll1.getId());
        assertThat(payRoll1).isEqualTo(payRoll2);
        payRoll2.setId(2L);
        assertThat(payRoll1).isNotEqualTo(payRoll2);
        payRoll1.setId(null);
        assertThat(payRoll1).isNotEqualTo(payRoll2);
    }
}
