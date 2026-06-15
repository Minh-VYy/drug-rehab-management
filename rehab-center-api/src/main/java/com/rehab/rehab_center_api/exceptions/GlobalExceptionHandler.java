package com.rehab.rehab_center_api.exceptions;

import com.rehab.rehab_center_api.dto.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.orm.ObjectOptimisticLockingFailureException;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @Value("${spring.profiles.active:dev}")
    private String activeProfile;

    // ==================== Helper Methods ====================

    private boolean isProductionProfile() {
        return "prod".equalsIgnoreCase(activeProfile);
    }

    /**
     * Helper tạo error response thống nhất — giảm trùng lặp code.
     */
    private ResponseEntity<ApiResponse<Object>> buildErrorResponse(
            Exception ex, HttpStatus status, String message, String errorCode) {
        return buildErrorResponse(ex, status, message, errorCode, null);
    }

    private ResponseEntity<ApiResponse<Object>> buildErrorResponse(
            Exception ex, HttpStatus status, String message, String errorCode, Object errors) {
        ApiResponse<Object> response = ApiResponse.builder()
                .success(false)
                .timestamp(LocalDateTime.now())
                .message(message)
                .errorCode(errorCode)
                .errors(errors)
                .debugMessage(isProductionProfile() ? null : ex.getMessage())
                .stackTrace(isProductionProfile() ? null : getStackTraceString(ex))
                .build();
        return new ResponseEntity<>(response, status);
    }

    private String getStackTraceString(Exception ex) {
        StringWriter sw = new StringWriter();
        PrintWriter pw = new PrintWriter(sw);
        ex.printStackTrace(pw);
        return sw.toString();
    }

    // ==================== Exception Handlers ====================

    @ExceptionHandler(AppException.class)
    public ResponseEntity<ApiResponse<Object>> handleAppException(AppException ex, HttpServletRequest request) {
        ErrorCode errorCode = ex.getErrorCode();
        log.error("AppException [{}]: {}", errorCode.getCode(), ex.getMessage());
        return buildErrorResponse(ex, errorCode.getHttpStatus(), ex.getMessage(), errorCode.getCode());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Object>> handleValidationException(MethodArgumentNotValidException ex, HttpServletRequest request) {
        log.error("Validation error: {}", ex.getMessage());
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            errors.put(fieldName, error.getDefaultMessage());
        });
        return buildErrorResponse(ex, HttpStatus.BAD_REQUEST,
                "Dữ liệu đầu vào không hợp lệ", ErrorCode.VALIDATION_ERROR.getCode(), errors);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiResponse<Object>> handleAuthenticationException(AuthenticationException ex, HttpServletRequest request) {
        log.error("AuthenticationException: {}", ex.getMessage());
        String message = (ex instanceof BadCredentialsException)
                ? "Tên đăng nhập hoặc mật khẩu không chính xác"
                : "Xác thực không thành công";
        return buildErrorResponse(ex, HttpStatus.UNAUTHORIZED, message, ErrorCode.INVALID_CREDENTIALS.getCode());
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<Object>> handleAccessDeniedException(AccessDeniedException ex, HttpServletRequest request) {
        log.error("AccessDeniedException: {}", ex.getMessage());
        return buildErrorResponse(ex, HttpStatus.FORBIDDEN,
                "Bạn không có quyền truy cập chức năng này", ErrorCode.ACCESS_DENIED.getCode());
    }

    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    public ResponseEntity<ApiResponse<Object>> handleMediaTypeNotSupportedException(
            HttpMediaTypeNotSupportedException ex,
            HttpServletRequest request
    ) {
        log.error("Unsupported media type: {}", ex.getMessage());
        return buildErrorResponse(ex, HttpStatus.UNSUPPORTED_MEDIA_TYPE,
                "Định dạng request không được hỗ trợ. Với tạo phiếu bàn giao, dùng multipart/form-data (data=JSON, file=PDF).",
                "UNSUPPORTED_MEDIA_TYPE");
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ApiResponse<Object>> handleMethodNotSupportedException(HttpRequestMethodNotSupportedException ex, HttpServletRequest request) {
        log.error("Method not supported: {}", ex.getMessage());
        return buildErrorResponse(ex, HttpStatus.METHOD_NOT_ALLOWED,
                "Phương thức HTTP không được hỗ trợ: " + ex.getMethod(), "METHOD_NOT_ALLOWED");
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiResponse<Object>> handleMessageNotReadableException(HttpMessageNotReadableException ex, HttpServletRequest request) {
        log.error("Message not readable: {}", ex.getMessage());
        return buildErrorResponse(ex, HttpStatus.BAD_REQUEST,
                "Cấu trúc yêu cầu gửi lên không hợp lệ hoặc không đọc được JSON", "BAD_REQUEST_BODY");
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiResponse<Object>> handleTypeMismatchException(MethodArgumentTypeMismatchException ex, HttpServletRequest request) {
        log.error("Type mismatch: {}", ex.getMessage());
        String msg = String.format("Tham số '%s' có giá trị '%s' không khớp với kiểu yêu cầu (%s)",
                ex.getName(), ex.getValue(), ex.getRequiredType() != null ? ex.getRequiredType().getSimpleName() : "unknown");
        return buildErrorResponse(ex, HttpStatus.BAD_REQUEST, msg, "TYPE_MISMATCH");
    }

    @ExceptionHandler(ObjectOptimisticLockingFailureException.class)
    public ResponseEntity<ApiResponse<Object>> handleOptimisticLockingFailureException(
            ObjectOptimisticLockingFailureException ex,
            HttpServletRequest request
    ) {
        log.error("Optimistic locking failure: {}", ex.getMessage());
        return buildErrorResponse(
                ex,
                ErrorCode.CONCURRENT_MODIFICATION.getHttpStatus(),
                "Dữ liệu đã được cập nhật bởi người khác. Vui lòng tải lại và thử lại.",
                ErrorCode.CONCURRENT_MODIFICATION.getCode()
        );
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiResponse<Object>> handleDataIntegrityViolationException(DataIntegrityViolationException ex, HttpServletRequest request) {
        log.error("Database integrity violation: ", ex);
        return buildErrorResponse(ex, HttpStatus.CONFLICT,
                "Lỗi xung đột dữ liệu cơ sở dữ liệu (ví dụ: vi phạm ràng buộc khóa ngoại hoặc giá trị duy nhất)", "DATABASE_ERROR");
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ApiResponse<Object>> handleMaxUploadSizeExceededException(
            MaxUploadSizeExceededException ex,
            HttpServletRequest request
    ) {
        log.error("Upload size exceeded: {}", ex.getMessage());
        return buildErrorResponse(ex, HttpStatus.BAD_REQUEST,
                "File size exceeds the maximum allowed limit of 10MB", ErrorCode.FILE_TOO_LARGE.getCode());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleGeneralException(Exception ex, HttpServletRequest request) {
        log.error("Unexpected error occurred: ", ex);
        return buildErrorResponse(ex, HttpStatus.INTERNAL_SERVER_ERROR,
                "Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau.", ErrorCode.INTERNAL_SERVER_ERROR.getCode());
    }
}
