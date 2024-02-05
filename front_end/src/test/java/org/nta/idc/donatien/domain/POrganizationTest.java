package org.nta.idc.donatien.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.nta.idc.donatien.web.rest.TestUtil;

class POrganizationTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(POrganization.class);
        POrganization pOrganization1 = new POrganization();
        pOrganization1.setId(1L);
        POrganization pOrganization2 = new POrganization();
        pOrganization2.setId(pOrganization1.getId());
        assertThat(pOrganization1).isEqualTo(pOrganization2);
        pOrganization2.setId(2L);
        assertThat(pOrganization1).isNotEqualTo(pOrganization2);
        pOrganization1.setId(null);
        assertThat(pOrganization1).isNotEqualTo(pOrganization2);
    }
}
