package com.pioneerpicks.pioneerpicks.user;

import com.pioneerpicks.pioneerpicks.courses.Course;
import com.pioneerpicks.pioneerpicks.professors.Professor;
import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name="users")
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(unique=true, nullable=false)
    private String username;

    @Column(unique=true, nullable=false)
    private String email;

    @Column(nullable=true)
    private String password;

    @Column(nullable = false)
    private Boolean enabled;

    @Column(name="verification_code")
    private String verificationCode;

    @Column(name="verification_expiration")
    private LocalDateTime verificationCodeExpiresAt;

    // for OAuth2 (local only for now)
    @Column(name="provider")
    private String provider;
    @Column(name="provider_id")
    private String providerId;

    @Enumerated(EnumType.STRING)
    @Column(nullable=false)
    private Role role;

    @Column(name="forgot_token")
    private String forgotPasswordToken;
    @Column(name="forgot_expiration")
    private LocalDateTime forgotPasswordTokenExpiresAt;

    @ManyToMany
    @JoinTable(
            name = "user_course_favorites",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "course_id")
    )
    private final Set<Course> favoriteCourses = new HashSet<>();

    @ManyToMany
    @JoinTable(
            name = "user_professor_favorites",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "professor_id")
    )
    private final Set<Professor> favoriteProfessors = new HashSet<>();

    // regular signups
    public User(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.provider = "local";
        this.role = Role.USER;
    }
    // signups through an OAuth2 provider (later, not in use)
    public User(String username, String email, String provider, String providerId) {
        this.username = username;
        this.email = email;
        this.provider = provider;
        this.providerId = providerId;
        this.enabled = true; // OAuth2 users are auto-enabled since Google verified them
        this.role = Role.USER;
    }
    public User() {}

    @Override
    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    @Override
    public String getPassword() {
        return password;
    }

    public String getVerificationCode() {
        return verificationCode;
    }

    public LocalDateTime getVerificationCodeExpiresAt() {
        return verificationCodeExpiresAt;
    }

    public String getProvider() {
        return provider;
    }

    public void setProviderId(String providerId) {
        this.providerId = providerId;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }

    public void setVerificationCode(String verificationCode) {
        this.verificationCode = verificationCode;
    }

    public void setVerificationCodeExpiresAt(LocalDateTime verificationCodeExpiresAt) {
        this.verificationCodeExpiresAt = verificationCodeExpiresAt;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getForgotPasswordToken() {
        return forgotPasswordToken;
    }

    public void setForgotPasswordToken(String forgotPasswordToken) {
        this.forgotPasswordToken = forgotPasswordToken;
    }

    public LocalDateTime getForgotPasswordTokenExpiresAt() {
        return forgotPasswordTokenExpiresAt;
    }

    public void setForgotPasswordTokenExpiresAt(LocalDateTime forgotPasswordTokenExpiresAt) {
        this.forgotPasswordTokenExpiresAt = forgotPasswordTokenExpiresAt;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    // For simplification purposes, 3 of these 4 return naively
    @Override public boolean isAccountNonExpired() {
        return true;
    }
    @Override public boolean isAccountNonLocked() {
        return true;
    }
    @Override public boolean isCredentialsNonExpired() {
        return true;
    }
    @Override public boolean isEnabled() {
        return enabled;
    }

    // For OAuth2 (later)
//    public boolean isOAuth2User() {
//        return !"local".equals(provider);
//    }
    public boolean hasPassword() {
        return password != null && !password.isEmpty();
    }

    public Set<Course> getFavoriteCourses() {
        return favoriteCourses;
    }

    public Set<Professor> getFavoriteProfessors() {
        return favoriteProfessors;
    }

    public Long getId() {
        return id;
    }

    public Role getRole() {
        return role;
    }

}
