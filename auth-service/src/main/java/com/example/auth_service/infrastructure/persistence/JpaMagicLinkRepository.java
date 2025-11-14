package com.example.auth_service.infrastructure.persistence;

import com.example.auth_service.domain.auth.MagicLink;
import com.example.auth_service.domain.auth.MagicLinkRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class JpaMagicLinkRepository implements MagicLinkRepository {

    private final SpringDataMagicLink jpa;

    @Override
    public MagicLink save(MagicLink magicLink) {
        return jpa.save(magicLink);
    }

    @Override
   
    public Optional<MagicLink> findById(MagicLink.MagicLinkId id) {

        return jpa.findById(id); 
    }

    @Override
    public Optional<MagicLink> findValidByHash(String hashedToken, Instant now) {
        return jpa.findByTokenHashValueAndExpiresAtValueIsAfter(hashedToken, now);
    }

    @Override
    public void delete(MagicLink magicLink) {
        jpa.delete(magicLink);
    }
}