package org.nta.idc.donatien.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.nta.idc.donatien.web.rest.TestUtil;

class PayRollItemTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(PayRollItem.class);
        PayRollItem payRollItem1 = new PayRollItem();
        payRollItem1.setId(1L);
        PayRollItem payRollItem2 = new PayRollItem();
        payRollItem2.setId(payRollItem1.getId());
        assertThat(payRollItem1).isEqualTo(payRollItem2);
        payRollItem2.setId(2L);
        assertThat(payRollItem1).isNotEqualTo(payRollItem2);
        payRollItem1.setId(null);
        assertThat(payRollItem1).isNotEqualTo(payRollItem2);
    }
}
