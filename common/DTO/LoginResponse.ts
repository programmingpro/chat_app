interface LoginResponse {
    success: boolean;
    token?: string; // JWT токен, если авторизация удалась
}