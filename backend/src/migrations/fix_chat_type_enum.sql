-- Удаляем существующий enum
DROP TYPE IF EXISTS chats_chattype_enum CASCADE;

-- Создаем новый enum с правильными значениями
CREATE TYPE chats_chattype_enum AS ENUM ('GROUP', 'PRIVATE');

-- Обновляем колонку в таблице chats
ALTER TABLE chats 
  ALTER COLUMN chat_type TYPE chats_chattype_enum 
  USING chat_type::text::chats_chattype_enum; 