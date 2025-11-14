package com.dog.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ApiErrorResponse {
    private Object message;
    private int status;
    private String uri;
}
