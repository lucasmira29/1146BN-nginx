package com.example.gateway_service.infrastructure.config;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;

import com.example.gateway_service.domain.user.vo.RoleType;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import reactor.core.publisher.Mono;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;

@Component
public class AuthorizationFilter implements GatewayFilter {

    private final SecretKey key;

    private static final Map<String, List<RoleType>> SECURED_PATHS = Map.of(
            "/api/clinica/pacientes", List.of(RoleType.RECEPCIONISTA, RoleType.ADMIN),
            "/api/clinica/medicos", List.of(RoleType.RECEPCIONISTA, RoleType.ADMIN),
            "/api/clinica/consultas", List.of(RoleType.PACIENTE, RoleType.MEDICO, RoleType.RECEPCIONISTA, RoleType.ADMIN)
    );


    public AuthorizationFilter(@Value("${jwt.secret}") String jwtSecret) {
        if (jwtSecret.getBytes(StandardCharsets.UTF_8).length * 8 < 256) {
            throw new IllegalArgumentException("Chave JWT é muito fraca! Deve ter no mínimo 256 bits.");
        }
        this.key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }


    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String path = request.getURI().getPath();

        if (!isSecured(path)) {
            return chain.filter(exchange);
        }

        String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return onError(exchange, HttpStatus.UNAUTHORIZED, "Token de autorização ausente ou mal formatado.");
        }

        String token = authHeader.substring(7);

        try {
            Claims claims = Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            @SuppressWarnings("unchecked")
            List<String> rolesFromToken = claims.get("roles", List.class);
            if (rolesFromToken == null) {
                return onError(exchange, HttpStatus.FORBIDDEN, "Token inválido: papéis (roles) não encontrados.");
            }

            List<RoleType> userRoles = rolesFromToken.stream()
                    .map(RoleType::valueOf)
                    .collect(Collectors.toList());

            if (hasPermission(path, userRoles)) {
                return chain.filter(exchange);
            } else {
                return onError(exchange, HttpStatus.FORBIDDEN, "Acesso negado: você não tem permissão.");
            }

        } catch (Exception e) {
            return onError(exchange, HttpStatus.UNAUTHORIZED, "Token inválido ou expirado.");
        }
    }

    private boolean isSecured(String path) {
        return SECURED_PATHS.keySet().stream().anyMatch(path::startsWith);
    }

    private boolean hasPermission(String path, List<RoleType> userRoles) {
        return SECURED_PATHS.entrySet().stream()
                .filter(entry -> path.startsWith(entry.getKey()))
                .findFirst()
                .map(entry -> entry.getValue().stream().anyMatch(userRoles::contains))
                .orElse(false);
    }

    private Mono<Void> onError(ServerWebExchange exchange, HttpStatus status, String message) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(status);
        response.getHeaders().add(HttpHeaders.CONTENT_TYPE, "application/json; charset=UTF-8");
        
        String errorJson = "{\"status\": " + status.value() + ", \"error\": \"" + message + "\"}";
        DataBuffer buffer = response.bufferFactory().wrap(errorJson.getBytes(StandardCharsets.UTF_8));
        
        return response.writeWith(Mono.just(buffer));
    }
}
