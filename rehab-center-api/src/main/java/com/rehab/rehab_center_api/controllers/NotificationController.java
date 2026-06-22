package com.rehab.rehab_center_api.controllers;

import com.rehab.rehab_center_api.dto.request.NotificationCreateRequest;
import com.rehab.rehab_center_api.dto.request.NotificationUpdateRequest;
import com.rehab.rehab_center_api.dto.response.NotificationSentResponse;
import com.rehab.rehab_center_api.dtos.NotificationDto;
import com.rehab.rehab_center_api.security.CustomUserDetails;
import com.rehab.rehab_center_api.security.SecurityUtils;
import com.rehab.rehab_center_api.services.NotificationService;
import jakarta.validation.Valid;
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

    @GetMapping("/sent")
    public ResponseEntity<List<NotificationSentResponse>> getSentNotifications() {
        return ResponseEntity.ok(notificationService.getSentNotifications(getCurrentUserId()));
    }

    @PostMapping
    public ResponseEntity<NotificationSentResponse> createNotification(@Valid @RequestBody NotificationCreateRequest request) {
        return ResponseEntity.ok(notificationService.createNotification(request, getCurrentUserId()));
    }

    @PutMapping("/sent/{id}")
    public ResponseEntity<NotificationSentResponse> updateSentNotification(
            @PathVariable String id,
            @Valid @RequestBody NotificationUpdateRequest request) {
        return ResponseEntity.ok(notificationService.updateSentNotification(id, request, getCurrentUserId()));
    }

    @DeleteMapping("/sent/{id}")
    public ResponseEntity<Void> deleteSentNotification(@PathVariable String id) {
        notificationService.deleteSentNotification(id, getCurrentUserId());
        return ResponseEntity.noContent().build();
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
