import { Role } from "../Enum/Role";

export interface ChatParticipant {
    role: Role;
    userId: string;
}