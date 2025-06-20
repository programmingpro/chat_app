Проект ВКР - мессенджер Суар

https://chat-app-qwj9.vercel.app/ - фронтенд
https://api.evsuikov.students.nomorepartiessbs.ru/api - сваггер бэкенда

Данные для входа в демопрофиль:
vladimir@kiev-rus.ru
12345678

Запуск:
- поднять базу данных PostgreSQL
- cd backend && cp .env.example .env
- прописываем секреты в .env
- создаем бд и накатываем тестовые данные - cd backend && make init
- запуск бэкенда - cd backend && nvm use 18 && npm start
- запуска фронта - cd frontend && nvm use 18 && npm run dev

