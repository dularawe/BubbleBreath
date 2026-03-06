package com.bubble_breath.game_service.entity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import java.util.Date;
@Getter
@Setter
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class AuditEntity {
    @CreatedBy
    @Column(name = "CREATED_BY", updatable = false)
    private String createdBy;
    @CreatedDate
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "CREATED_DATE_TIME", updatable = false)
    private Date createdDateTime;
    @LastModifiedBy
    @Column(name = "MODIFIED_BY")
    private String modifiedBy;
    @LastModifiedDate
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "MODIFIED_DATE_TIME")
    private Date modifiedDateTime;
}
