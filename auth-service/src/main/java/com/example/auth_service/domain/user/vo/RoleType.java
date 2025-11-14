package com.example.auth_service.domain.user.vo;


public enum RoleType {
    PACIENTE(1),
    MEDICO(2),
    RECEPCIONISTA(3),
    ADMIN(4);

    private final int level;

    RoleType(int level) {
        this.level = level;
    }

    public int getLevel() {
        return level;
    }
}