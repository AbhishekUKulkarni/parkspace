package com.abhi.parkspace.common.response;

import java.time.LocalDateTime;

public record ApiErrorResponse(

        int status,
        String error,
        String message,
        LocalDateTime timestamp
) {
}