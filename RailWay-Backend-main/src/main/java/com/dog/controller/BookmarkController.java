package com.dog.controller;

import com.dog.dto.response.GeneralResponse;
import com.dog.dto.response.PostResponse;
import com.dog.service.BookmarkService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = {
        "http://localhost:5173",
        "https://unistayf.netlify.app"
})
@RestController
@RequestMapping("/api/bookmarks")
@RequiredArgsConstructor
public class BookmarkController {

    private final BookmarkService bookmarkService;

    // Guardar un post como favorito
    @PostMapping("/{postId}")
    @PreAuthorize("hasAnyRole('ADMIN','PROPIETARIO','ESTUDIANTE','USER')")
    public ResponseEntity<GeneralResponse> addBookmark(
            @PathVariable UUID postId,
            Authentication authentication
    ) {
        String email = authentication.getName();
        bookmarkService.addBookmark(postId, email);

        return buildResponse(
                "Post guardado en favoritos",
                HttpStatus.OK,
                null
        );
    }

    // Eliminar un favorito
    @DeleteMapping("/{postId}")
    @PreAuthorize("hasAnyRole('ADMIN','PROPIETARIO','ESTUDIANTE','USER')")
    public ResponseEntity<GeneralResponse> removeBookmark(
            @PathVariable UUID postId,
            Authentication authentication
    ) {
        String email = authentication.getName();
        bookmarkService.removeBookmark(postId, email);

        return buildResponse(
                "Post eliminado de favoritos",
                HttpStatus.OK,
                null
        );
    }

    // Listar todos mis favoritos
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','PROPIETARIO','ESTUDIANTE','USER')")
    public ResponseEntity<GeneralResponse> getMyBookmarks(Authentication authentication) {
        String email = authentication.getName();
        List<PostResponse> favorites = bookmarkService.getMyBookmarks(email);

        return buildResponse(
                "Posts favoritos del usuario",
                HttpStatus.OK,
                favorites
        );
    }

    private ResponseEntity<GeneralResponse> buildResponse(String message, HttpStatus status, Object data) {
        String uri = ServletUriComponentsBuilder.fromCurrentRequest().toUriString();
        return ResponseEntity.status(status).body(
                GeneralResponse.builder()
                        .message(message)
                        .status(status.value())
                        .data(data)
                        .uri(uri)
                        .build()
        );
    }
}