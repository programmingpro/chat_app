// dtos/CreateChatResponse.dto.ts
import { ChatType} from "../Enum/ChatType";
import { ChatParticipant} from "./ChatParticipant";

export interface CreateChatResponse {
    chatId: string;
    chatType: ChatType;
    name: string;
    participants: ChatParticipant[];
    createdAt: Date;
    updatedAt: Date;
}