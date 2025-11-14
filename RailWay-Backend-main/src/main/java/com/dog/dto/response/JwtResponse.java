package com.dog.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class JwtResponse {
    private final String token;
    private final String type = "Bearer";
    public JwtResponse(String token) { this.token = token; }
    public String getToken() { return token; }
    public String getType() { return type; }
}
