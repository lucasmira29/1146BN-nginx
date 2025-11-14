package com.example.auth_service.messaging.events;

import java.util.UUID;

public record UserCreatedEvent(
    UUID userId,
    String email,
    String name,
    String role,

    String document,
    String birthdate,
    String phone,
    String postal_code
) {}
