package com.rehab.rehab_center_api.security;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TokenBlacklistService {

    private final Map<String, Date> blacklistByJti = new ConcurrentHashMap<>();

    public void blacklist(String jti, Date expirationDate) {
        if (jti == null || expirationDate == null) {
            return;
        }
        blacklistByJti.put(jti, expirationDate);
    }

    public boolean isBlacklisted(String jti) {
        if (jti == null) {
            return false;
        }
        Date expiration = blacklistByJti.get(jti);
        if (expiration == null) {
            return false;
        }
        if (expiration.before(new Date())) {
            blacklistByJti.remove(jti);
            return false;
        }
        return true;
    }

    @Scheduled(fixedRate = 3_600_000)
    public void cleanupExpiredEntries() {
        Date now = new Date();
        blacklistByJti.entrySet().removeIf(entry -> entry.getValue().before(now));
    }
}
