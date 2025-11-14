package com.example.auth_service.domain.auth;

import java.time.Instant;
import java.util.UUID;

import com.example.auth_service.domain.auth.vo.ExpiresAt;
import com.example.auth_service.domain.auth.vo.HashedToken;
import com.example.auth_service.domain.user.User.UserId;
import com.example.auth_service.support.Digests;

import jakarta.persistence.Embedded;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Embeddable;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "magic_links")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class MagicLink {

    @EmbeddedId
    private MagicLinkId id;

    @Embedded
    private UserId userId;

    @Embedded
    private HashedToken tokenHash;

    @Embedded
    private ExpiresAt expiresAt;

    private MagicLink(MagicLinkId id, UserId userId, HashedToken tokenHash, ExpiresAt expiresAt) {
        this.id = id;
        this.userId = userId;
        this.tokenHash = tokenHash;
        this.expiresAt = expiresAt;
    }

    public static MagicLink create(UserId userId, String token, long validityInSeconds) {
        return new MagicLink(
                new MagicLinkId(UUID.randomUUID()),
                userId,
                new HashedToken(Digests.sha256(token)),
                new ExpiresAt(Instant.now().plusSeconds(validityInSeconds)));
    }

    @Embeddable
    @Getter
    @NoArgsConstructor(access = AccessLevel.PROTECTED)
    public static class MagicLinkId {
        private UUID value;

        public MagicLinkId(UUID value) {
            this.value = value;
        }

        public UUID value() {
            return value;
        }
    }
}