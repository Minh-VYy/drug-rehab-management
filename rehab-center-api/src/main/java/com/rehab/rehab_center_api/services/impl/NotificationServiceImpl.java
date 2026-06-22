package com.rehab.rehab_center_api.services.impl;

import com.rehab.rehab_center_api.dto.request.NotificationCreateRequest;
import com.rehab.rehab_center_api.dto.request.NotificationUpdateRequest;
import com.rehab.rehab_center_api.dto.response.NotificationSentResponse;
import com.rehab.rehab_center_api.dtos.NotificationDto;
import com.rehab.rehab_center_api.entities.Notification;
import com.rehab.rehab_center_api.entities.NotificationReadReceipt;
import com.rehab.rehab_center_api.entities.Staff;
import com.rehab.rehab_center_api.entities.User;
import com.rehab.rehab_center_api.enums.NotificationStatus;
import com.rehab.rehab_center_api.enums.NotificationType;
import com.rehab.rehab_center_api.enums.StaffStatus;
import com.rehab.rehab_center_api.exceptions.AppException;
import com.rehab.rehab_center_api.exceptions.ErrorCode;
import com.rehab.rehab_center_api.repositories.NotificationReadReceiptRepository;
import com.rehab.rehab_center_api.repositories.NotificationRepository;
import com.rehab.rehab_center_api.repositories.StaffRepository;
import com.rehab.rehab_center_api.repositories.UserRepository;
import com.rehab.rehab_center_api.services.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private static final DateTimeFormatter SENT_TIME_FORMAT = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
    private static final DateTimeFormatter SENT_GROUP_FORMAT = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");

    private final NotificationRepository notificationRepository;
    private final NotificationReadReceiptRepository notificationReadReceiptRepository;
    private final StaffRepository staffRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public List<NotificationDto> getNotificationsForUser(Integer userId) {
        List<Notification> notifications = notificationRepository.findVisibleForUserOrderByCreatedAtDesc(userId);
        Map<String, NotificationStatus> broadcastReadMap = getBroadcastReadMap(notifications, userId);
        return notifications.stream()
                .map(notification -> mapToDto(notification, isReadForUser(notification, userId, broadcastReadMap)))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationSentResponse> getSentNotifications(Integer userId) {
        List<Notification> notifications = notificationRepository.findByStaff_User_IdOrderByCreatedAtDesc(userId);

        Map<String, List<Notification>> grouped = notifications.stream()
                .collect(Collectors.groupingBy(
                        this::buildSentGroupKey,
                        LinkedHashMap::new,
                        Collectors.toList()));

        return grouped.values().stream()
                .map(group -> mapToSentResponse(group, "ThongTin", Collections.emptyList()))
                .toList();
    }

    @Override
    @Transactional
    public NotificationSentResponse createNotification(NotificationCreateRequest request, Integer senderUserId) {
        Staff sender = resolveSenderStaff(senderUserId);

        NotificationType notificationType = parseNotificationType(request.getLoaiGui());
        LocalDateTime now = LocalDateTime.now();
        List<Notification> notifications = new ArrayList<>();

        if (notificationType == NotificationType.CaNhan) {
            List<Integer> recipientIds = request.getNguoiNhan() == null ? Collections.emptyList() : request.getNguoiNhan();
            if (recipientIds.isEmpty()) {
                throw new AppException(ErrorCode.VALIDATION_ERROR, "Vui lòng chọn ít nhất một người nhận");
            }

            List<User> recipients = userRepository.findAllById(recipientIds);
            if (recipients.size() != recipientIds.size()) {
                throw new AppException(ErrorCode.USER_NOT_FOUND, "Một hoặc nhiều người nhận không tồn tại");
            }

            for (User recipient : recipients) {
                notifications.add(buildNotification(request, notificationType, sender, recipient, now));
            }
        } else {
            // ERD hiện tại yêu cầu TatCa/NoiBo có MaNguoiDungNhan = NULL.
            notifications.add(buildNotification(request, notificationType, sender, null, now));
        }

        List<Notification> saved = notificationRepository.saveAll(notifications);
        return mapToSentResponse(saved, normalizeLevel(request.getMucDo()), safeRoleGroups(request.getNhomVaiTro()));
    }

    @Override
    @Transactional
    public NotificationSentResponse updateSentNotification(String id, NotificationUpdateRequest request, Integer senderUserId) {
        List<Notification> group = findSentGroupByAnchor(id, senderUserId);
        for (Notification notification : group) {
            notification.setTitle(request.getTieuDe().trim());
            notification.setContent(request.getNoiDung().trim());
        }

        List<Notification> saved = notificationRepository.saveAll(group);
        return mapToSentResponse(saved, normalizeLevel(request.getMucDo()), Collections.emptyList());
    }

    @Override
    @Transactional
    public void deleteSentNotification(String id, Integer senderUserId) {
        List<Notification> group = findSentGroupByAnchor(id, senderUserId);
        List<String> ids = group.stream().map(Notification::getId).toList();
        notificationReadReceiptRepository.deleteByNotification_IdIn(ids);
        notificationRepository.deleteAll(group);
    }

    @Override
    @Transactional
    public void markAsRead(String id, Integer userId) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.VALIDATION_ERROR, "Không tìm thấy thông báo"));
        if (notification.getRecipientUser() != null && !notification.getRecipientUser().getId().equals(userId)) {
            throw new AppException(ErrorCode.ACCESS_DENIED, "Không có quyền sửa thông báo này");
        }

        if (notification.getRecipientUser() == null) {
            saveBroadcastReadReceipt(notification, userId);
        } else {
            notification.setStatus(NotificationStatus.DA_DOC);
            notificationRepository.save(notification);
        }
    }

    @Override
    @Transactional
    public void markAllAsRead(Integer userId) {
        List<Notification> notifications = notificationRepository.findVisibleForUserOrderByCreatedAtDesc(userId);
        List<Notification> personalNotifications = new ArrayList<>();
        for (Notification n : notifications) {
            if (n.getRecipientUser() == null) {
                saveBroadcastReadReceipt(n, userId);
            } else if (n.getStatus() == NotificationStatus.CHUA_DOC) {
                n.setStatus(NotificationStatus.DA_DOC);
                personalNotifications.add(n);
            }
        }
        if (!personalNotifications.isEmpty()) {
            notificationRepository.saveAll(personalNotifications);
        }
    }

    private Notification buildNotification(
            NotificationCreateRequest request,
            NotificationType notificationType,
            Staff sender,
            User recipient,
            LocalDateTime createdAt) {
        return Notification.builder()
                .id(generateNotificationId())
                .staff(sender)
                .title(request.getTieuDe().trim())
                .content(request.getNoiDung().trim())
                .createdAt(createdAt)
                .notificationType(notificationType)
                .recipientUser(recipient)
                .status(NotificationStatus.CHUA_DOC)
                .build();
    }

    private NotificationType parseNotificationType(String type) {
        try {
            return NotificationType.valueOf(type);
        } catch (Exception ex) {
            throw new AppException(ErrorCode.VALIDATION_ERROR, "Loại thông báo không hợp lệ");
        }
    }

    private String generateNotificationId() {
        for (int attempt = 0; attempt < 20; attempt++) {
            String id = "TB" + String.format("%08d", ThreadLocalRandom.current().nextInt(100_000_000));
            if (!notificationRepository.existsById(id)) {
                return id;
            }
        }
        throw new AppException(ErrorCode.INTERNAL_SERVER_ERROR, "Không thể sinh mã thông báo");
    }

    private Staff resolveSenderStaff(Integer senderUserId) {
        return staffRepository.findByUser_Id(senderUserId)
                .orElseGet(() -> {
                    User user = userRepository.findById(senderUserId)
                            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND, "Không tìm thấy người gửi"));

                    Staff staff = Staff.builder()
                            .id(generateStaffId(senderUserId))
                            .user(user)
                            .status(StaffStatus.DANG_LAM_VIEC)
                            .position(resolveSenderPosition(user))
                            .build();

                    return staffRepository.save(staff);
                });
    }

    private String generateStaffId(Integer senderUserId) {
        String candidate = "NS" + String.format("%08d", senderUserId);
        if (!staffRepository.existsById(candidate)) {
            return candidate;
        }

        for (int attempt = 0; attempt < 20; attempt++) {
            String id = "NS" + String.format("%08d", ThreadLocalRandom.current().nextInt(100_000_000));
            if (!staffRepository.existsById(id)) {
                return id;
            }
        }

        throw new AppException(ErrorCode.INTERNAL_SERVER_ERROR, "Không thể sinh mã nhân sự gửi thông báo");
    }

    private String resolveSenderPosition(User user) {
        if (user.getRole() == null || user.getRole().getName() == null) {
            return "Nhân sự trung tâm";
        }

        return switch (user.getRole().getName()) {
            case "ADMIN", "QUANTRI_HETHONG" -> "Quản trị hệ thống";
            case "LEADER", "LANH_DAO", "NGUOI_LANH_DAO" -> "Lãnh đạo trung tâm";
            case "MANAGER", "CAN_BO_QUAN_LY" -> "Cán bộ quản lý";
            case "DOCTOR", "BAC_SI" -> "Bác sĩ phụ trách";
            case "STAFF", "CAN_BO_TRUNG_TAM", "CAN_BO_PHU_TRACH" -> "Cán bộ trung tâm";
            default -> "Nhân sự trung tâm";
        };
    }

    private String buildSentGroupKey(Notification notification) {
        String created = notification.getCreatedAt() == null ? "" : notification.getCreatedAt().format(SENT_GROUP_FORMAT);
        return notification.getNotificationType() + "|" + notification.getTitle() + "|" + notification.getContent() + "|" + created;
    }

    private List<Notification> findSentGroupByAnchor(String id, Integer senderUserId) {
        Notification anchor = notificationRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.VALIDATION_ERROR, "Không tìm thấy thông báo đã gửi"));
        if (anchor.getStaff() == null
                || anchor.getStaff().getUser() == null
                || !anchor.getStaff().getUser().getId().equals(senderUserId)) {
            throw new AppException(ErrorCode.ACCESS_DENIED, "Không có quyền chỉnh sửa thông báo này");
        }

        String groupKey = buildSentGroupKey(anchor);
        return notificationRepository.findByStaff_User_IdOrderByCreatedAtDesc(senderUserId)
                .stream()
                .filter(notification -> buildSentGroupKey(notification).equals(groupKey))
                .toList();
    }

    private NotificationSentResponse mapToSentResponse(List<Notification> notifications, String level, List<String> roleGroups) {
        Notification first = notifications.getFirst();
        int recipientCount = first.getNotificationType() == NotificationType.CaNhan
                ? notifications.size()
                : estimateBroadcastRecipientCount(first.getNotificationType());

        return NotificationSentResponse.builder()
                .id(first.getId())
                .tieuDe(first.getTitle())
                .noiDung(first.getContent())
                .loaiGui(first.getNotificationType().name())
                .nhomVaiTro(roleGroups)
                .mucDo(level)
                .thoiGianGui(first.getCreatedAt() == null ? "" : first.getCreatedAt().format(SENT_TIME_FORMAT))
                .soNguoiNhan(recipientCount)
                .build();
    }

    private int estimateBroadcastRecipientCount(NotificationType type) {
        if (type == NotificationType.TatCa) {
            return (int) userRepository.count();
        }

        return (int) userRepository.findAllWithRoleOrderByFullName().stream()
                .filter(user -> isInternalRole(user.getRole() != null ? user.getRole().getName() : ""))
                .count();
    }

    private boolean isInternalRole(String roleName) {
        return switch (roleName) {
            case "DOCTOR", "STAFF", "MANAGER", "LEADER", "DIRECTOR",
                 "CAN_BO_PHU_TRACH", "CAN_BO_TRUNG_TAM", "CAN_BO_QUAN_LY", "NGUOI_LANH_DAO",
                 "BacSi", "CanBoTrungTam", "CanBoQuanLy", "LanhDao" -> true;
            default -> false;
        };
    }

    private String normalizeLevel(String level) {
        if (level == null || level.isBlank()) {
            return "ThongTin";
        }
        return level;
    }

    private List<String> safeRoleGroups(List<String> roleGroups) {
        return roleGroups == null ? Collections.emptyList() : roleGroups;
    }

    private Map<String, NotificationStatus> getBroadcastReadMap(List<Notification> notifications, Integer userId) {
        List<String> broadcastIds = notifications.stream()
                .filter(notification -> notification.getRecipientUser() == null)
                .map(Notification::getId)
                .toList();

        if (broadcastIds.isEmpty()) {
            return Collections.emptyMap();
        }

        return notificationReadReceiptRepository.findByNotification_IdInAndUser_Id(broadcastIds, userId)
                .stream()
                .collect(Collectors.toMap(
                        receipt -> receipt.getNotification().getId(),
                        NotificationReadReceipt::getStatus,
                        (left, right) -> right));
    }

    private boolean isReadForUser(Notification notification, Integer userId, Map<String, NotificationStatus> broadcastReadMap) {
        if (notification.getRecipientUser() != null) {
            return notification.getStatus() == NotificationStatus.DA_DOC;
        }
        return broadcastReadMap.get(notification.getId()) == NotificationStatus.DA_DOC;
    }

    private void saveBroadcastReadReceipt(Notification notification, Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND, "Không tìm thấy người dùng"));

        Optional<NotificationReadReceipt> existing =
                notificationReadReceiptRepository.findByNotification_IdAndUser_Id(notification.getId(), userId);

        NotificationReadReceipt receipt = existing.orElseGet(() -> NotificationReadReceipt.builder()
                .notification(notification)
                .user(user)
                .build());
        receipt.setStatus(NotificationStatus.DA_DOC);
        receipt.setReadAt(LocalDateTime.now());

        notificationReadReceiptRepository.save(receipt);
    }

    private NotificationDto mapToDto(Notification notification, boolean isRead) {
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
                .isRead(isRead)
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
