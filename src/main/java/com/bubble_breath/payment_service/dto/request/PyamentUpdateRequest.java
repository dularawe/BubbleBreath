package com.bubble_breath.payment_service.dto.request;
import com.bubble_breath.payment_service.enums.PaymentStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import java.util.UUID;
@Data
public class PyamentUpdateRequest {
    @NotNull
    private UUID id;
    @NotNull
    private UUID userId;
    @NotNull
    @Positive
    private Double amount;
    @NotNull
    private PaymentStatus status;
}
