package com.dog.service;

import com.dog.dto.request.Post.PostFilterRequest;
import com.dog.dto.response.PostResponse;

import java.util.List;

public interface PostFilterService {

    /**
     * Filtra posts por rango de precio y/o distancia a la UCA.
     * Cualquiera de los parámetros puede ir en null.
     */
    List<PostResponse> filterPosts(PostFilterRequest filterRequest);
}