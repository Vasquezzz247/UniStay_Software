// src/main/java/com/dog/dto/request/Auth/GoogleLoginRequest.java
package com.dog.dto.request.Auth;

import lombok.Data;

@Data
public class GoogleLoginRequest {
    private String idToken;
}