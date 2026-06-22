package com.rehab.rehab_center_api.services;

import com.rehab.rehab_center_api.dto.request.NotificationCreateRequest;
import com.rehab.rehab_center_api.dto.request.NotificationUpdateRequest;
import com.rehab.rehab_center_api.dto.response.NotificationSentResponse;
import com.rehab.rehab_center_api.dtos.NotificationDto;

import java.util.List;

public interface NotificationService {
    List<NotificationDto> getNotificationsForUser(Integer userId);
    List<NotificationSentResponse> getSentNotifications(Integer userId);
    NotificationSentResponse createNotification(NotificationCreateRequest request, Integer senderUserId);
    NotificationSentResponse updateSentNotification(String id, NotificationUpdateRequest request, Integer senderUserId);
    void deleteSentNotification(String id, Integer senderUserId);
    void markAsRead(String id, Integer userId);
    void markAllAsRead(Integer userId);
}
