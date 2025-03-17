// dtos/GetChatsResponse.dto.ts
import {ChatInfo} from "./ChatInfo";

export interface GetChatsResponse {
    chats: ChatInfo[];
}