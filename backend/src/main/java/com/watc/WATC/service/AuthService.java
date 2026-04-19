package com.watc.WATC.service;

import com.watc.WATC.domain.User;
import com.watc.WATC.dto.AuthResponse;
import com.watc.WATC.dto.LoginRequest;
import com.watc.WATC.dto.RegisterRequest;
import com.watc.WATC.repository.UserRepository;
import com.watc.WATC.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       JwtService jwtService, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Un compte avec cet email existe déjà.");
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole() != null ? request.getRole() : "STUDENT");
        user.setDepartment(request.getDepartment());
        
        // Generate initials from full name
        String[] names = request.getFullName().trim().split("\\s+");
        String initials = names.length >= 2
                ? ("" + names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase()
                : ("" + names[0].charAt(0)).toUpperCase();
        user.setInitials(initials);

        userRepository.save(user);

        String jwtToken = jwtService.generateToken(user);
        return AuthResponse.builder()
                .token(jwtToken)
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .initials(user.getInitials())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable."));

        String jwtToken = jwtService.generateToken(user);
        return AuthResponse.builder()
                .token(jwtToken)
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .initials(user.getInitials())
                .build();
    }
}
