package com.example.auth_service.application.auth;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.auth_service.application.ports.MailSender;
import com.example.auth_service.domain.auth.MagicLink;
import com.example.auth_service.domain.auth.MagicLinkRepository;
import com.example.auth_service.domain.user.UserRepository;
import com.example.auth_service.domain.user.vo.Email;
import com.example.auth_service.interfaces.rest.dto.auth.MagicLinkRequest;
import com.example.auth_service.support.RandomTokenGenerator;
import com.example.auth_service.infrastructure.config.AppProperties;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RequestMagicLinkHandler {

    private final UserRepository userRepository;
    private final MagicLinkRepository magicLinkRepository;
    private final MailSender mailSender;
    private final AppProperties appProperties;

    @Transactional
    public void handle(MagicLinkRequest request) {
        var email = new Email(request.email());
        var user = userRepository.findByEmail(email.value())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        var token = RandomTokenGenerator.urlSafeToken(64);

        var magicLink = MagicLink.create(
                user.getId(), 
                token,
                appProperties.getMagicLink().getTtlSeconds()
        );

        magicLinkRepository.save(magicLink);

        var verifyUrl = appProperties.getMagicLink().getVerifyUrlBase() + "?token=" + token;
        mailSender.sendMagicLink(
                email.value(),
                verifyUrl,
                magicLink.getExpiresAt().getValue()
        );
    }
}
