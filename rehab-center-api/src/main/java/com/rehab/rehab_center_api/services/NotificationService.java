package com.rehab.rehab_center_api.services;

import com.rehab.rehab_center_api.dtos.NotificationDto;

import java.util.List;

public interface NotificationService {
    List<NotificationDto> getNotificationsForUser(Integer userId);
    void markAsRead(String id, Integer userId);
    void markAllAsRead(Integer userId);
}
