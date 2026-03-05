package com.bubble_breath.payment_service.dto.response;
import com.bubble_breath.payment_service.enums.IsDeleted;
import com.bubble_breath.payment_service.enums.PaymentStatus;
import lombok.Data;
import java.util.UUID;
@Data
public class PyamentResponse {
    private UUID id;
    private UUID userId;
    private Double amount;
    private PaymentStatus status;
    private String createdBy;
    private String createdDateTime;
    private String modifiedBy;
    private String modifiedDateTime;
    private IsDeleted isDeleted;
}
