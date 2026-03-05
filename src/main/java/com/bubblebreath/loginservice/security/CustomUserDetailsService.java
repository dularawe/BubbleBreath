package com.bubblebreath.loginservice.security;

import com.bubblebreath.loginservice.entity.User;
import com.bubblebreath.loginservice.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        System.out.println("Attempting to load user by email: " + email);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    System.out.println("User not found in DB with email: " + email);
                    return new UsernameNotFoundException("User not found with email: " + email);
                });

        System.out.println("User found! ID: " + user.getId() + " Email Verified: " + user.getEmailVerified()
                + " Active: " + user.getActive());

        return UserPrincipal.create(user);
    }
}
