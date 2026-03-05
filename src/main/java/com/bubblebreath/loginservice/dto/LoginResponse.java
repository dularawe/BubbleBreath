package com.bubblebreath.loginservice.dto;

public class LoginResponse {

    private String token;
    private String type = "Bearer";
    private Long id;
    private String email;
    private String fullName;
    private String country;

    public LoginResponse() {
    }

    public LoginResponse(String token, String type, Long id, String email, String fullName, String country) {
        this.token = token;
        if (type != null)
            this.type = type;
        this.id = id;
        this.email = email;
        this.fullName = fullName;
        this.country = country;
    }

    public static LoginResponseBuilder builder() {
        return new LoginResponseBuilder();
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public static class LoginResponseBuilder {
        private String token;
        private String type = "Bearer";
        private Long id;
        private String email;
        private String fullName;
        private String country;

        LoginResponseBuilder() {
        }

        public LoginResponseBuilder token(String token) {
            this.token = token;
            return this;
        }

        public LoginResponseBuilder type(String type) {
            this.type = type;
            return this;
        }

        public LoginResponseBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public LoginResponseBuilder email(String email) {
            this.email = email;
            return this;
        }

        public LoginResponseBuilder fullName(String fullName) {
            this.fullName = fullName;
            return this;
        }

        public LoginResponseBuilder country(String country) {
            this.country = country;
            return this;
        }

        public LoginResponse build() {
            return new LoginResponse(token, type, id, email, fullName, country);
        }
    }
}
