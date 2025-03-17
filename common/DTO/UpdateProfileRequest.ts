interface UpdateProfileRequest {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    twoFactorAuth?: boolean;
    pushNotifications?: boolean;
    notificationSound?: boolean;
    darkTheme?: boolean;
}