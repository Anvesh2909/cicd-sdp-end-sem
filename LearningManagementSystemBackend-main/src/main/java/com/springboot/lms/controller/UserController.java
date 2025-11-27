package com.springboot.lms.controller;

import com.springboot.lms.dto.LoginRequest;
import com.springboot.lms.model.User;
import com.springboot.lms.service.UserService;
import com.springboot.lms.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:8083")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<?> signUp(@RequestBody User user)
    {
        return ResponseEntity.status(HttpStatus.OK).body(userService.signUp(user));
    }

    @GetMapping("/token")
    public ResponseEntity<?> getToken(Principal principal) {
        System.out.println("I am in the API method");

        JwtUtil jwtUtil = new JwtUtil();
        try {
            String token =jwtUtil.createToken(principal.getName());
            Map<String,String> map = new HashMap<>();
            map.put("token", token);
            return ResponseEntity.status(HttpStatus.OK).body(map);
        }
        catch(Exception e){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    @GetMapping("/details")
    public Object getUserDetails(Principal principal){
        String username = principal.getName();
        return userService.getLoggedInUser(username);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            Map<String, String> response = userService.login(
                    loginRequest.getUsername(),
                    loginRequest.getPassword()
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", e.getMessage()));
        }
    }


}
