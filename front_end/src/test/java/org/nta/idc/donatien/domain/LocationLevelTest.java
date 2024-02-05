package org.nta.idc.donatien.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.nta.idc.donatien.web.rest.TestUtil;

class LocationLevelTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(LocationLevel.class);
        LocationLevel locationLevel1 = new LocationLevel();
        locationLevel1.setId(1L);
        LocationLevel locationLevel2 = new LocationLevel();
        locationLevel2.setId(locationLevel1.getId());
        assertThat(locationLevel1).isEqualTo(locationLevel2);
        locationLevel2.setId(2L);
        assertThat(locationLevel1).isNotEqualTo(locationLevel2);
        locationLevel1.setId(null);
        assertThat(locationLevel1).isNotEqualTo(locationLevel2);
    }
}
