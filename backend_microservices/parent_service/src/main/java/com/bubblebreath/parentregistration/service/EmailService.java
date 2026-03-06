package com.bubblebreath.parentregistration.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.io.UnsupportedEncodingException;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Value("${app.mail.from:noreply@bubblebreath.com}")
    private String fromEmail;

    @Value("${app.mail.from-name:BubbleBreath}")
    private String fromName;

    public void sendVerificationEmail(String to, String name, String verificationCode) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, fromName);
            helper.setTo(to);
            helper.setSubject("Verify Your Email - BubbleBreath");

            Context context = new Context();
            context.setVariable("name", name);
            context.setVariable("verificationCode", verificationCode);
            context.setVariable("expiryHours", 24);

            String htmlContent = templateEngine.process("email/verification", context);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("Verification email sent to: {}", to);
        } catch (MessagingException | UnsupportedEncodingException e) {
            log.error("Failed to send verification email to: {}", to, e);
            throw new RuntimeException("Failed to send verification email", e);
        }
    }

    public void sendWelcomeEmail(String to, String name) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, fromName);
            helper.setTo(to);
            helper.setSubject("Welcome to BubbleBreath!");

            Context context = new Context();
            context.setVariable("name", name);

            String htmlContent = templateEngine.process("email/welcome", context);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("Welcome email sent to: {}", to);
        } catch (MessagingException | UnsupportedEncodingException e) {
            log.error("Failed to send welcome email to: {}", to, e);
            throw new RuntimeException("Failed to send welcome email", e);
        }
    }

    public void sendPasswordResetEmail(String to, String name, String resetToken) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, fromName);
            helper.setTo(to);
            helper.setSubject("Reset Your Password - BubbleBreath");

            Context context = new Context();
            context.setVariable("name", name);
            context.setVariable("resetLink", "https://bubblebreath.com/reset-password?token=" + resetToken);
            context.setVariable("expiryHours", 1);

            String htmlContent = templateEngine.process("email/password-reset", context);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("Password reset email sent to: {}", to);
        } catch (MessagingException | UnsupportedEncodingException e) {
            log.error("Failed to send password reset email to: {}", to, e);
            throw new RuntimeException("Failed to send password reset email", e);
        }
    }
}
