package org.nta.idc.donatien.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.nta.idc.donatien.web.rest.TestUtil;

class ClientReceptionOrderTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ClientReceptionOrder.class);
        ClientReceptionOrder clientReceptionOrder1 = new ClientReceptionOrder();
        clientReceptionOrder1.setId(1L);
        ClientReceptionOrder clientReceptionOrder2 = new ClientReceptionOrder();
        clientReceptionOrder2.setId(clientReceptionOrder1.getId());
        assertThat(clientReceptionOrder1).isEqualTo(clientReceptionOrder2);
        clientReceptionOrder2.setId(2L);
        assertThat(clientReceptionOrder1).isNotEqualTo(clientReceptionOrder2);
        clientReceptionOrder1.setId(null);
        assertThat(clientReceptionOrder1).isNotEqualTo(clientReceptionOrder2);
    }
}
