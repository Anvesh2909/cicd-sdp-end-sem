package com.springboot.lms.service;

import com.springboot.lms.model.Author;
import com.springboot.lms.model.Learner;
import com.springboot.lms.model.User;
import com.springboot.lms.repository.AuthorRepository;
import com.springboot.lms.repository.LearnerRepository;
import com.springboot.lms.repository.UserRepository;
import com.springboot.lms.util.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class UserService {

    private final LearnerRepository learnerRepository;
    private final AuthorRepository authorRepository;
    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, LearnerRepository learnerRepository, AuthorRepository authorRepository){
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.learnerRepository = learnerRepository;
        this.authorRepository = authorRepository;
    }

    public Map<String, String> login(String username, String password) {
        User user = userRepository.getByUsername(username);

        if (user == null) {
            throw new RuntimeException("User not found");
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        JwtUtil jwtUtil = new JwtUtil();
        String token = jwtUtil.createToken(username);

        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        response.put("role", user.getRole());

        return response;
    }

    public User signUp(User user){
        String password = user.getPassword();
        String encryptedPassword = passwordEncoder.encode(password);
        user.setPassword(encryptedPassword);
        return userRepository.save(user);
    }

    public Map<String, Object> getLoggedInUser(String username) {
        User user = userRepository.getByUsername(username);

        if (user == null) {
            throw new RuntimeException("User not found");
        }

        // Create a response map with user details
        Map<String, Object> response = new HashMap<>();
        response.put("username", user.getUsername());
        response.put("role", user.getRole());

        // Create a user object for consistency with your frontend expectations
        Map<String, Object> userDetails = new HashMap<>();
        userDetails.put("role", user.getRole());
        userDetails.put("username", user.getUsername());

        response.put("user", userDetails);

        switch (user.getRole().toUpperCase()){
            case "LEARNER" -> {
                Learner learner = learnerRepository.getByUsername(username);
                if (learner != null) {
                    response.put("learnerDetails", learner);
                }
            }
            case "AUTHOR" -> {
                Author author = authorRepository.getByUsername(username);
                if (author != null) {
                    if (author.isActive()) {
                        response.put("authorDetails", author);
                    } else {
                        throw new RuntimeException("Author Not Active");
                    }
                }
            }
            case "EXECUTIVE" -> {
                // Add any executive-specific details if needed
                response.put("executiveDetails", "Executive user logged in");
            }
        }

        return response;
    }
}