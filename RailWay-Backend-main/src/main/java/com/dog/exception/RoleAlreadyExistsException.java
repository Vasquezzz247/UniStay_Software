package com.dog.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT) // Esto hace que la excepción devuelva un error 409
public class RoleAlreadyExistsException extends RuntimeException {
    public RoleAlreadyExistsException(String message) {
        super(message);
    }
}