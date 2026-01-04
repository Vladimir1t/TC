# TCatalog

## About

Приложение для Telegram. Включает в себя умный поиск по категорям и ключевым словам, рекомендательную систему, а также удобный интерфейс.

## Видео демонстрация работы приложения

<div align="center">

[![Смотреть видео демонстрации](https://img.shields.io/badge/▶️_Смотреть_видео_демонстрации-FF6B6B?style=for-the-badge&logo=github&logoColor=white)](https://github.com/user-attachments/assets/95e1e94c-628f-4895-90f7-65589e042b20)

</div>

## Developers

| Role | Name |
|------|------------|
| Backend + DevOps | **Владимир** |
| Frontend | **Даниил** |
| Backend | **Федор** |

## Запуск 

```
docker build --network=host -t telegram-app .
```
```
docker run -d --name running-app -p 8000:8000 --memory=1g --memory-swap=2g --cpus=0.8 --memory-reservation=300m --restart=unless-stopped --env UVICORN_WORKERS=1 --env PYTHONUNBUFFERED=1 telegram-app
```

- В Frontend/js/main.js поменять API_URL на const API_URL = 'http://localhost:8000';

```
open Frontend/index.html
```
