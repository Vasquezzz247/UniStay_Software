package com.dog.exception;

public class InvalidRoomLocationException extends RuntimeException {
    public InvalidRoomLocationException(String message) {
        super(message);
    }
}
