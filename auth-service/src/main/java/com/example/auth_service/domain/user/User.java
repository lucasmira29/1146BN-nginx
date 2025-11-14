package com.example.auth_service.domain.user;

import java.util.UUID;
import com.example.auth_service.domain.user.vo.Email;
import com.example.auth_service.domain.user.vo.Role;
import jakarta.persistence.Embedded;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Embeddable; 
import lombok.EqualsAndHashCode;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;


@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User {

    @EmbeddedId
    private UserId id;

    private String name;

    @Embedded
    @AttributeOverride(name = "value", column = @Column(name = "email", nullable = false, unique = true, length = 255))
    private Email email;

    private String password;

    @Embedded
    @AttributeOverride(name = "value", column = @Column(name = "role", nullable = false, length = 50))
    private Role role;

    private User(UserId id, String name, Email email, String password, Role role) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    public static User create(String name, Email email, String password, Role role) {
        return new User(
                new UserId(UUID.randomUUID()),
                name,
                email,
                password,
                role);
    }

    @Embeddable 
    @Getter
    @NoArgsConstructor(access = AccessLevel.PROTECTED)
    @EqualsAndHashCode
    public static class UserId {
       
        @Column(name = "id") 
        private UUID value;

        public UserId(UUID value) {
            this.value = value;
        }

        public UUID value() {
            return value;
        }
    }
}