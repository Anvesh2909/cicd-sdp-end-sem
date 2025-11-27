package com.springboot.lms.service;

import com.springboot.lms.model.User;
import com.springboot.lms.repository.UserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        //Fetching user with the given username
        User user = userRepository.getByUsername(username);

        //Granting authority for spring for specific role
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority(user.getRole());
        List<GrantedAuthority> authList = List.of(authority); //Creating a list as there can be many roles

        org.springframework.security.core.userdetails.User springUser = new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(), authList);
        return springUser;
    }
}
