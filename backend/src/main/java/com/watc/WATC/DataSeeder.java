package com.watc.WATC;

import com.watc.WATC.domain.Project;
import com.watc.WATC.domain.User;
import com.watc.WATC.repository.ProjectRepository;
import com.watc.WATC.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataSeeder {

    @Bean
    public CommandLineRunner initData(UserRepository userRepo, ProjectRepository projectRepo, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepo.count() == 0) {
                // Create Mentor
                User mentor = new User();
                mentor.setFullName("Dr. Hatem Belaïd");
                mentor.setEmail("mentor@watc.tn");
                mentor.setPassword(passwordEncoder.encode("password123"));
                mentor.setRole("ACADEMIC_MENTOR");
                mentor.setDepartment("ENSI");
                mentor.setInitials("HB");
                userRepo.save(mentor);

                // Create Student 1 (Actif)
                User student1 = new User();
                student1.setFullName("Sami Belkacem");
                student1.setEmail("sami@watc.tn");
                student1.setPassword(passwordEncoder.encode("password123"));
                student1.setRole("STUDENT");
                student1.setDepartment("ENSI · 5A");
                student1.setInitials("SB");
                userRepo.save(student1);

                // Create Project for Student 1
                Project p1 = new Project();
                p1.setStudent(student1);
                p1.setAcademicMentor(mentor);
                p1.setTitle("Plateforme d'analyse de logs distribués en temps réel");
                p1.setProgress(78);
                projectRepo.save(p1);

                // Create Student 2 (A risque)
                User student2 = new User();
                student2.setFullName("Inès Triki");
                student2.setEmail("ines@watc.tn");
                student2.setPassword(passwordEncoder.encode("password123"));
                student2.setRole("STUDENT");
                student2.setDepartment("ENSI · 5A");
                student2.setInitials("IT");
                userRepo.save(student2);

                // Create Project for Student 2
                Project p2 = new Project();
                p2.setStudent(student2);
                p2.setAcademicMentor(mentor);
                p2.setTitle("Détection d'anomalies sur réseaux IoT industriels");
                p2.setProgress(24);
                projectRepo.save(p2);
                
                System.out.println("✅ Data seeded: Mentor and Students created.");
            }
        };
    }
}
