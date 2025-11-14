package com.dog.dto.response;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class GeneralResponse {
    private String uri;
    private String message;
    private int status;
    private Object data;
}


