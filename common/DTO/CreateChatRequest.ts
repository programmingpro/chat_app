// dtos/CreateChatRequest.dto.ts
import { ChatType} from "../Enum/ChatType";
import { ChatParticipant} from "./ChatParticipant";

export interface CreateChatRequest {
    chatType: ChatType;
    name: string;
    participants: ChatParticipant[];
}