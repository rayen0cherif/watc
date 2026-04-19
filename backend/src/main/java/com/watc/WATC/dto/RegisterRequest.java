package com.watc.WATC.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String fullName;
    private String email;
    private String password;
    private String role; // STUDENT, ACADEMIC_MENTOR, PRO_MENTOR
    private String department;
}
