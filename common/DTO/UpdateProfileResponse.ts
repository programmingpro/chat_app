import {ProfileUpdateFailureCause} from "../Enum/ProfileUpdateFailureCause";

interface UpdateProfileResponse {
    success: boolean;
    cause?: ProfileUpdateFailureCause; // Причина неудачи, если обновление не удалось
}