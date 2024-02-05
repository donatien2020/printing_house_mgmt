package org.nta.idc.donatien.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.nta.idc.donatien.web.rest.TestUtil;

class InvoiceHistoryTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(InvoiceHistory.class);
        InvoiceHistory invoiceHistory1 = new InvoiceHistory();
        invoiceHistory1.setId(1L);
        InvoiceHistory invoiceHistory2 = new InvoiceHistory();
        invoiceHistory2.setId(invoiceHistory1.getId());
        assertThat(invoiceHistory1).isEqualTo(invoiceHistory2);
        invoiceHistory2.setId(2L);
        assertThat(invoiceHistory1).isNotEqualTo(invoiceHistory2);
        invoiceHistory1.setId(null);
        assertThat(invoiceHistory1).isNotEqualTo(invoiceHistory2);
    }
}
