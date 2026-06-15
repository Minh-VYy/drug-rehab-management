package com.rehab.rehab_center_api.utils;

import java.time.Year;

public final class HandoverSlipIdGenerator {

    private HandoverSlipIdGenerator() {}

    public static String generateSlipId(long sequence) {
        return String.format("PBG-%d-%05d", Year.now().getValue(), sequence);
    }

    public static String generateDetailId(String slipId, int index) {
        return String.format("CTPBG-%s-%02d", slipId.substring(4), index);
    }
}
