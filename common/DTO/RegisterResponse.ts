import { RegistrationFailureCause } from '../Enum/RegistrationFailureCause'

interface RegisterResponse {
    success: boolean;
    token?: string; // JWT токен, если регистрация удалась
    cause?: RegistrationFailureCause; // Причина неудачи, если регистрация не удалась
}