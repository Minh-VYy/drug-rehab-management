package com.rehab.rehab_center_api.controllers;

import com.rehab.rehab_center_api.dtos.NotificationDto;
import com.rehab.rehab_center_api.security.CustomUserDetails;
import com.rehab.rehab_center_api.security.SecurityUtils;
import com.rehab.rehab_center_api.services.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    private Integer getCurrentUserId() {
        CustomUserDetails userDetails = SecurityUtils.getCurrentUser();
        return userDetails.getUser().getId();
    }

    @GetMapping
    public ResponseEntity<List<NotificationDto>> getNotifications() {
        return ResponseEntity.ok(notificationService.getNotificationsForUser(getCurrentUserId()));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable String id) {
        notificationService.markAsRead(id, getCurrentUserId());
        return ResponseEntity.ok().build();
    }

    @PutMapping("/mark-all-read")
    public ResponseEntity<Void> markAllAsRead() {
        notificationService.markAllAsRead(getCurrentUserId());
        return ResponseEntity.ok().build();
    }
}
