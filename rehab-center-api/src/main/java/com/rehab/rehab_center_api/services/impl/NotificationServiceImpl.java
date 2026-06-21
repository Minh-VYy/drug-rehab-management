package com.rehab.rehab_center_api.services.impl;

import com.rehab.rehab_center_api.dtos.NotificationDto;
import com.rehab.rehab_center_api.entities.Notification;
import com.rehab.rehab_center_api.enums.NotificationStatus;
import com.rehab.rehab_center_api.enums.NotificationType;
import com.rehab.rehab_center_api.exceptions.AppException;
import com.rehab.rehab_center_api.exceptions.ErrorCode;
import com.rehab.rehab_center_api.repositories.NotificationRepository;
import com.rehab.rehab_center_api.services.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

    @Override
    @Transactional(readOnly = true)
    public List<NotificationDto> getNotificationsForUser(Integer userId) {
        List<Notification> notifications = notificationRepository.findByRecipientUser_IdOrderByCreatedAtDesc(userId);
        return notifications.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void markAsRead(String id, Integer userId) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.VALIDATION_ERROR, "Không tìm thấy thông báo"));
        if (!notification.getRecipientUser().getId().equals(userId)) {
            throw new AppException(ErrorCode.ACCESS_DENIED, "Không có quyền sửa thông báo này");
        }
        notification.setStatus(NotificationStatus.DA_DOC);
        notificationRepository.save(notification);
    }

    @Override
    @Transactional
    public void markAllAsRead(Integer userId) {
        List<Notification> notifications = notificationRepository.findByRecipientUser_IdOrderByCreatedAtDesc(userId);
        for (Notification n : notifications) {
            if (n.getStatus() == NotificationStatus.CHUA_DOC) {
                n.setStatus(NotificationStatus.DA_DOC);
            }
        }
        notificationRepository.saveAll(notifications);
    }

    private NotificationDto mapToDto(Notification notification) {
        String typeStr = "info";
        if (notification.getNotificationType() != null) {
            switch (notification.getNotificationType()) {
                case TatCa:
                    typeStr = "info";
                    break;
                case NoiBo:
                    typeStr = "warning";
                    break;
                case CaNhan:
                    typeStr = "success";
                    break;
            }
        }

        return NotificationDto.builder()
                .id(notification.getId())
                .type(typeStr)
                .title(notification.getTitle())
                .desc(notification.getContent())
                .time(formatTimeAgo(notification.getCreatedAt()))
                .isRead(notification.getStatus() == NotificationStatus.DA_DOC)
                .build();
    }

    private String formatTimeAgo(LocalDateTime dateTime) {
        if (dateTime == null) return "Gần đây";
        Duration duration = Duration.between(dateTime, LocalDateTime.now());
        long seconds = duration.getSeconds();
        if (seconds < 60) {
            return "Vừa xong";
        } else if (seconds < 3600) {
            return (seconds / 60) + " phút trước";
        } else if (seconds < 86400) {
            return (seconds / 3600) + " giờ trước";
        } else {
            return dateTime.format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"));
        }
    }
}
