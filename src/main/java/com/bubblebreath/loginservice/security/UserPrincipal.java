package com.bubblebreath.loginservice.security;

import com.bubblebreath.loginservice.entity.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

public class UserPrincipal implements UserDetails {

    private Long id;
    private String email;

    @JsonIgnore
    private String password;

    private Collection<? extends GrantedAuthority> authorities;
    private boolean enabled;
    private boolean accountNonLocked;

    public UserPrincipal() {
    }

    public UserPrincipal(Long id, String email, String password,
            Collection<? extends GrantedAuthority> authorities,
            boolean enabled, boolean accountNonLocked) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.authorities = authorities;
        this.enabled = enabled;
        this.accountNonLocked = accountNonLocked;
    }

    public static UserPrincipalBuilder builder() {
        return new UserPrincipalBuilder();
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public static UserPrincipal create(User user) {
        Collection<GrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));
        return new UserPrincipal(
                user.getId(),
                user.getEmail(),
                user.getPassword(),
                authorities,
                true,
                user.getAccountLockedUntil() == null
                        || user.getAccountLockedUntil().isBefore(java.time.LocalDateTime.now()));
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return accountNonLocked;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }

    public static class UserPrincipalBuilder {
        private Long id;
        private String email;
        private String password;
        private Collection<? extends GrantedAuthority> authorities;
        private boolean enabled;
        private boolean accountNonLocked;

        UserPrincipalBuilder() {
        }

        public UserPrincipalBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public UserPrincipalBuilder email(String email) {
            this.email = email;
            return this;
        }

        public UserPrincipalBuilder password(String password) {
            this.password = password;
            return this;
        }

        public UserPrincipalBuilder authorities(Collection<? extends GrantedAuthority> authorities) {
            this.authorities = authorities;
            return this;
        }

        public UserPrincipalBuilder enabled(boolean enabled) {
            this.enabled = enabled;
            return this;
        }

        public UserPrincipalBuilder accountNonLocked(boolean accountNonLocked) {
            this.accountNonLocked = accountNonLocked;
            return this;
        }

        public UserPrincipal build() {
            return new UserPrincipal(id, email, password, authorities, enabled, accountNonLocked);
        }
    }
}
