package com.dog.service;

import com.dog.dto.response.PostResponse;

import java.util.List;
import java.util.UUID;

public interface BookmarkService {

    void addBookmark(UUID postId, String userEmail);

    void removeBookmark(UUID postId, String userEmail);

    List<PostResponse> getMyBookmarks(String userEmail);
}
