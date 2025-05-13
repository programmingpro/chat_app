// dtos/ChatInfo.dto.ts
import {ChatType} from "../Enum/ChatType";

export interface ChatInfo {
    chatId: string;
    chatType: ChatType;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}