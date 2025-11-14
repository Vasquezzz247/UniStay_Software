package com.dog.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class RoomInUseException extends RuntimeException {
    public RoomInUseException(String message) {
        super(message);
    }
}