package com.dog.exception;

public class PostNotFoundException extends RuntimeException {
    public PostNotFoundException(String message) {
        super(message);
    }

    public PostNotFoundException() {
    }

    public PostNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
