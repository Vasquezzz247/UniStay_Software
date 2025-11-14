package com.dog.exception;

import com.dog.dto.response.ApiErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.List;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleUserNotFoundException(UserNotFoundException e) {
        return buildErrorResponse(e, HttpStatus.NOT_FOUND, e.getMessage());
    }

    @ExceptionHandler(RoleNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleRoleNotFoundException(RoleNotFoundException e) {
        return buildErrorResponse(e, HttpStatus.NOT_FOUND, e.getMessage());
    }

    @ExceptionHandler(RoomNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleRoomNotFoundException(RoomNotFoundException e) {
        return buildErrorResponse(e, HttpStatus.NOT_FOUND, e.getMessage());
    }

    @ExceptionHandler(PostNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handlePostNotFoundException(PostNotFoundException e) {
        return buildErrorResponse(e, HttpStatus.NOT_FOUND, e.getMessage());
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleResourceNotFoundException(ResourceNotFoundException e) {
        return buildErrorResponse(e, HttpStatus.NOT_FOUND, e.getMessage());
    }

    @ExceptionHandler(RoleAlreadyExistsException.class)
    public ResponseEntity<ApiErrorResponse> handleRoleAlreadyExistsException(RoleAlreadyExistsException e) {
        return buildErrorResponse(e, HttpStatus.CONFLICT, e.getMessage());
    }

    @ExceptionHandler(RoleInUseException.class)
    public ResponseEntity<ApiErrorResponse> handleRoleInUseException(RoleInUseException e) {
        return buildErrorResponse(e, HttpStatus.CONFLICT, e.getMessage());
    }

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<ApiErrorResponse> handleUserAlreadyExistsException(EmailAlreadyExistsException e) {
        return buildErrorResponse(e, HttpStatus.CONFLICT, e.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValueOfEntity(MethodArgumentNotValidException e) {
        List<String> errors = e.getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .toList();
        return buildErrorResponse(e, HttpStatus.BAD_REQUEST, errors);
    }

    private ResponseEntity<ApiErrorResponse> buildErrorResponse(Exception e, HttpStatus status, Object data) {
        String uri = ServletUriComponentsBuilder.fromCurrentRequestUri().build().getPath();
        return ResponseEntity.status(status).body(ApiErrorResponse.builder()
                .message(data)
                .status(status.value())
                .uri(uri)
                .build());
    }

}
