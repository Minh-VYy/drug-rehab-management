package com.rehab.rehab_center_api.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class JwtService {

    @Value("${application.security.jwt.secret-key}")
    private String secretKey;

    @Value("${application.security.jwt.expiration}")
    private long expiration;

    private final TokenBlacklistService blacklistService;

    public String generateToken(UserDetails userDetails) {
        long now = System.currentTimeMillis();
        return Jwts.builder()
                .id(UUID.randomUUID().toString())
                .subject(userDetails.getUsername())
                .issuedAt(new Date(now))
                .expiration(new Date(now + expiration))
                .signWith(getSigningKey(), Jwts.SIG.HS256)
                .compact();
    }

    public Optional<Claims> parseClaims(String token) {
        try {
            return Optional.of(extractAllClaims(token));
        } catch (JwtException | IllegalArgumentException ex) {
            return Optional.empty();
        }
    }

    public boolean isTokenValid(Claims claims, UserDetails userDetails) {
        return claims.getSubject().equals(userDetails.getUsername())
                && !isExpired(claims)
                && !blacklistService.isBlacklisted(claims.getId())
                && userDetails.isEnabled()
                && userDetails.isAccountNonLocked();
    }

    public void blacklistToken(String token) {
        parseClaims(token).ifPresent(this::blacklistClaims);
    }

    public void blacklistClaims(Claims claims) {
        String jti = claims.getId();
        Date expirationDate = claims.getExpiration();
        if (jti != null && expirationDate != null) {
            blacklistService.blacklist(jti, expirationDate);
        }
    }

    private boolean isExpired(Claims claims) {
        return claims.getExpiration().before(new Date());
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private SecretKey getSigningKey() {
        byte[] keyBytes = decodeSecretKey(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    private byte[] decodeSecretKey(String key) {
        try {
            byte[] decoded = Base64.getDecoder().decode(key);
            if (decoded.length >= 32) {
                return decoded;
            }
        } catch (IllegalArgumentException ignored) {
            // Fall back to UTF-8 bytes when the configured value is not valid Base64.
        }
        return key.getBytes(java.nio.charset.StandardCharsets.UTF_8);
    }
}
