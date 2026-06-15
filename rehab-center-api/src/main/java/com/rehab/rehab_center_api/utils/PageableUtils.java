package com.rehab.rehab_center_api.utils;

import com.rehab.rehab_center_api.exceptions.AppException;
import com.rehab.rehab_center_api.exceptions.ErrorCode;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.Set;

public final class PageableUtils {

    private PageableUtils() {
    }

    public static Pageable of(
            int page,
            int size,
            String sortBy,
            Sort.Direction sortDirection,
            Set<String> allowedSortFields,
            String defaultSortField
    ) {
        String field = sortBy != null && !sortBy.isBlank() ? sortBy.trim() : defaultSortField;
        if (!allowedSortFields.contains(field)) {
            throw new AppException(
                    ErrorCode.VALIDATION_ERROR,
                    "Invalid sort field. Allowed values: " + String.join(", ", allowedSortFields)
            );
        }
        return PageRequest.of(page, size, Sort.by(sortDirection, field));
    }
}
