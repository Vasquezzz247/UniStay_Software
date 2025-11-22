// src/main/java/com/dog/service/GoogleAuthService.java
package com.dog.service;

public interface GoogleAuthService {
    /**
     * Recibe el idToken de Google (JWT de Google) y devuelve
     * tu JWT propio de UniStay si todo es correcto.
     */
    String authenticateWithGoogle(String idTokenString) throws Exception;
}