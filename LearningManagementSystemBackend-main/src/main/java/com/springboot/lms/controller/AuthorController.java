package com.springboot.lms.controller;

import com.springboot.lms.model.Author;
import com.springboot.lms.service.AuthorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/author")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthorController {

    @Autowired
    private AuthorService authorService;

    @PostMapping("/register")
    public ResponseEntity<?> registerAuthor(@RequestBody AuthorRegistrationRequest request) {
        try {
            Author author = authorService.createAuthor(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body("Author profile created successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error creating author profile: " + e.getMessage());
        }
    }

    // DTO class for author registration
    public static class AuthorRegistrationRequest {
        private String fullName;
        private String contact;
        private String website;
        private String profilePic;
        private int userId;

        // Constructors
        public AuthorRegistrationRequest() {}

        public AuthorRegistrationRequest(String fullName, String contact, String website, String profilePic, int userId) {
            this.fullName = fullName;
            this.contact = contact;
            this.website = website;
            this.profilePic = profilePic;
            this.userId = userId;
        }

        // Getters and Setters
        public String getFullName() {
            return fullName;
        }

        public void setFullName(String fullName) {
            this.fullName = fullName;
        }

        public String getContact() {
            return contact;
        }

        public void setContact(String contact) {
            this.contact = contact;
        }

        public String getWebsite() {
            return website;
        }

        public void setWebsite(String website) {
            this.website = website;
        }

        public String getProfilePic() {
            return profilePic;
        }

        public void setProfilePic(String profilePic) {
            this.profilePic = profilePic;
        }

        public int getUserId() {
            return userId;
        }

        public void setUserId(int userId) {
            this.userId = userId;
        }
    }
}