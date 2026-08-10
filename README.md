# iiko_clone_py

Python-клон приложения iiko-clone с API каталога, локальным хранением данных и готовностью к production-развёртыванию.

## Что уже готово

- Flask backend с API для каталога и CRUD операций
- статический фронтенд в папке `static/`
- поддержка PostgreSQL через `POSTGRES_URL` / `DATABASE_URL`
- файлы для деплоя на Render и Vercel
- `requirements.txt` и `gunicorn` для production запуска

## Локальная установка

1. Создайте виртуальное окружение:

```bash
python -m venv .venv
.venv\Scripts\activate
```

2. Установите зависимости:

```bash
pip install -r requirements.txt
```

3. Запустите проект:

```bash
python app.py
```

Сервер будет доступен по адресу `http://localhost:3000`.

## API

- `GET /health` — проверка статуса
- `GET /api/catalog` — загрузка каталога
- `POST /api/catalog` — перезапись каталога
- `PUT /api/items/<id>` — обновление товара
- `PUT /api/categories/<id>` — обновление категории

## Переменные окружения

- `PORT` — порт сервера (по умолчанию `3000`)
- `ADMIN_TOKEN` — токен администратора
- `CATALOG_STORAGE_DIR` — папка с данными каталога
- `POSTGRES_URL` / `DATABASE_URL` — строка подключения к PostgreSQL
- `PG_SSL` — `false` для отключения SSL, иначе `require`
- `GITHUB_SYNC` — `true` для включения синхронизации с GitHub
- `GITHUB_REPO` — репозиторий в формате `owner/repo`
- `GITHUB_TOKEN` — токен GitHub
- `GITHUB_BRANCH` — ветка для синхронизации (по умолчанию `main`)
- `GITHUB_PATH` — путь к файлу в репозитории (по умолчанию `data/catalog.json`)

## Production архитектура

- Frontend: Vercel
- Backend: Render
- Database: Railway PostgreSQL
- Monitoring: UptimeRobot

### Vercel

Загружайте статический фронтенд в Vercel. Для SPA используйте `vercel.json` и корневой путь проекта.

### Render

Используйте `render.yaml` и start command:

```bash
gunicorn app:app --bind 0.0.0.0:$PORT
```

### Railway

Создайте PostgreSQL сервис на Railway и передайте в Render переменную:

```bash
POSTGRES_URL=postgresql://... 
```

### UptimeRobot

Добавьте мониторинг на URL Render API, например `https://your-app.onrender.com/health`.

## GitHub / репозиторий

Папка проекта в текущей среде не является Git-репозиторием. Для деплоя и публикации нужно инициализировать Git и подключить удалённый репозиторий:

```bash
git init
git remote add origin https://github.com/<user>/<repo>.git
```
