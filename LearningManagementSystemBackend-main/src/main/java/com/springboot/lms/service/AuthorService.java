package com.springboot.lms.service;

import com.springboot.lms.controller.AuthorController;
import com.springboot.lms.exception.ResourceNotFoundException;
import com.springboot.lms.model.Author;
import com.springboot.lms.model.User;
import com.springboot.lms.repository.AuthorRepository;
import com.springboot.lms.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthorService {

    private static final Logger logger = LoggerFactory.getLogger(AuthorService.class);

    @Autowired
    private AuthorRepository authorRepository;

    @Autowired
    private UserRepository userRepository;

    public Author createAuthor(AuthorController.AuthorRegistrationRequest request) {
        logger.info("Creating author profile for userId: {}", request.getUserId());

        // Find the user
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));

        // Check if author already exists for this user (using user ID is more efficient)
        Author existingAuthor = authorRepository.findByUserId(user.getId());
        if (existingAuthor != null) {
            throw new RuntimeException("Author profile already exists for this user");
        }

        // Create new author
        Author author = new Author();
        author.setFullName(request.getFullName());
        author.setContact(request.getContact());
        author.setWebsite(request.getWebsite());
        author.setProfilePic(request.getProfilePic());
        author.setUser(user);
        author.setActive(true); // Set as active by default

        Author savedAuthor = authorRepository.save(author);
        logger.info("Author profile created successfully with ID: {} for user: {}",
                savedAuthor.getId(), user.getUsername());

        return savedAuthor;
    }

    public Author getAuthorByUsername(String username) {
        return authorRepository.getByUsername(username);
    }
}