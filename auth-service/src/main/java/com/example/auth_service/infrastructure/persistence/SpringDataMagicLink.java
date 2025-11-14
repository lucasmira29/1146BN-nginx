package com.example.auth_service.infrastructure.persistence;

import com.example.auth_service.domain.auth.MagicLink;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.Optional;

public interface SpringDataMagicLink extends JpaRepository<MagicLink, MagicLink.MagicLinkId> {
    
    Optional<MagicLink> findByTokenHashValueAndExpiresAtValueIsAfter(String tokenHash, Instant now);
}