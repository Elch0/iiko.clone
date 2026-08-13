import base64
import json
import os
from pathlib import Path

import psycopg2
import psycopg2.extras
import requests
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS

BASE_DIR = Path(__file__).resolve().parent
STORAGE_DIR = Path(os.getenv('CATALOG_STORAGE_DIR', BASE_DIR / 'data'))
DATA_FILE = STORAGE_DIR / 'catalog.json'
BACKUP_FILE = STORAGE_DIR / 'catalog.backup.json'
ADMIN_TOKEN = os.getenv('ADMIN_TOKEN', 'iiko-admin-token')
PORT = int(os.getenv('PORT', 3000))

GITHUB_REPO = os.getenv('GITHUB_REPO', '')
GITHUB_BRANCH = os.getenv('GITHUB_BRANCH', 'main')
GITHUB_TOKEN = os.getenv('GITHUB_TOKEN', '')
GITHUB_SYNC = os.getenv('GITHUB_SYNC', 'false').lower() == 'true'
GITHUB_PATH = os.getenv('GITHUB_PATH', 'data/catalog.json')

PG_CONNECTION_STRING = os.getenv('POSTGRES_URL') or os.getenv('DATABASE_URL') or ''
PG_SSL = os.getenv('PG_SSL', 'true').lower() != 'false'
USE_POSTGRES = bool(PG_CONNECTION_STRING)

app = Flask(__name__, static_folder='static', static_url_path='')
app.config['JSON_SORT_KEYS'] = False

# Более полная CORS конфигурация
CORS(
    app,
    origins=['*'],
    methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
    allow_headers=['Content-Type', 'x-admin-token', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    expose_headers=['Content-Type', 'Content-Length'],
    supports_credentials=False,
    max_age=3600
)

catalog = {
    'categories': [
        {
            'id': 'root',
            'title': 'Товары без папки',
            'parentId': None,
            'items': []
        }
    ],
    'items': []
}


def create_default_catalog():
    return {
        'categories': [
            {
                'id': 'root',
                'title': 'Товары без папки',
                'parentId': None,
                'items': []
            }
        ],
        'items': []
    }


def ensure_data_file():
    STORAGE_DIR.mkdir(parents=True, exist_ok=True)
    if not DATA_FILE.exists():
        DATA_FILE.write_text(json.dumps(create_default_catalog(), ensure_ascii=False, indent=2), encoding='utf-8')
    if not BACKUP_FILE.exists():
        BACKUP_FILE.write_text(DATA_FILE.read_text(encoding='utf-8'), encoding='utf-8')


def is_meaningful_catalog(raw_catalog):
    if not raw_catalog or not isinstance(raw_catalog.get('categories'), list):
        return False

    for category in raw_catalog['categories']:
        title = str(category.get('title', '')).strip()
        has_items = isinstance(category.get('items'), list) and len(category['items']) > 0
        is_root_fallback = title.lower() in ('root', 'товары без папки')
        if has_items or (title and not is_root_fallback):
            return True

    return False


def get_postgres_connection():
    if not USE_POSTGRES:
        raise RuntimeError('Postgres is not enabled')

    conn_args = {
        'dsn': PG_CONNECTION_STRING,
        'cursor_factory': psycopg2.extras.RealDictCursor
    }
    if PG_SSL:
        conn_args['sslmode'] = 'require'
    else:
        conn_args['sslmode'] = 'disable'
    return psycopg2.connect(**conn_args)


def init_postgres():
    if not USE_POSTGRES:
        return

    with get_postgres_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(
                '''
                CREATE TABLE IF NOT EXISTS categories (
                    id text PRIMARY KEY,
                    title text NOT NULL,
                    parent_id text,
                    position integer NOT NULL
                );
                CREATE TABLE IF NOT EXISTS items (
                    id text PRIMARY KEY,
                    name text NOT NULL,
                    price numeric,
                    modifier text,
                    modifiers jsonb,
                    category_id text REFERENCES categories(id),
                    position integer NOT NULL
                );
                '''
            )
        conn.commit()


def load_catalog_from_postgres():
    with get_postgres_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute('SELECT id, title, parent_id FROM categories ORDER BY position ASC')
            categories = [
                {
                    'id': row[0],
                    'title': row[1],
                    'parentId': row[2],
                    'items': []
                }
                for row in cursor.fetchall()
            ]
            if not categories:
                return create_default_catalog()

            cursor.execute(
                'SELECT id, name, price, modifier, modifiers, category_id FROM items ORDER BY position ASC'
            )
            items = cursor.fetchall()

    category_map = {category['id']: category for category in categories}
    for row in items:
        category = category_map.get(row[5])
        if not category:
            continue
        category['items'].append({
            'id': row[0],
            'name': row[1],
            'price': float(row[2]) if row[2] is not None else None,
            'modifier': row[3] or '',
            'modifiers': row[4] if isinstance(row[4], list) else []
        })

    return {'categories': categories, 'items': []}


def save_catalog_to_postgres(next_catalog):
    with get_postgres_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute('BEGIN')
            cursor.execute('DELETE FROM items')
            cursor.execute('DELETE FROM categories')

            for index, category in enumerate(next_catalog['categories']):
                cursor.execute(
                    'INSERT INTO categories (id, title, parent_id, position) VALUES (%s, %s, %s, %s)',
                    [category['id'], category['title'], category.get('parentId'), index]
                )

            for category in next_catalog['categories']:
                for item_index, item in enumerate(category.get('items', [])):
                    cursor.execute(
                        'INSERT INTO items (id, name, price, modifier, modifiers, category_id, position) VALUES (%s, %s, %s, %s, %s, %s, %s)',
                        [
                            item['id'],
                            item['name'],
                            item.get('price'),
                            item.get('modifier', ''),
                            item.get('modifiers') if isinstance(item.get('modifiers'), list) else [],
                            category['id'],
                            item_index
                        ]
                    )
            conn.commit()


def load_catalog():
    if USE_POSTGRES:
        try:
            return load_catalog_from_postgres()
        except Exception as error:
            print(f'Failed to load catalog from Postgres: {error}')
            return create_default_catalog()

    ensure_data_file()
    for candidate in (DATA_FILE, BACKUP_FILE):
        try:
            if not candidate.exists():
                print(f'Catalog file does not exist: {candidate}')
                continue
            raw = candidate.read_text(encoding='utf-8')
            if not raw.strip():
                print(f'Catalog file is empty: {candidate}')
                continue
            parsed = json.loads(raw)
            if not isinstance(parsed, dict):
                print(f'Catalog is not a dict in: {candidate}')
                continue
            if not is_meaningful_catalog(parsed):
                print(f'Catalog is not meaningful (empty) in: {candidate}')
                continue
            print(f'Loaded catalog from {candidate} with {len(parsed.get("categories", []))} categories')
            return {'categories': parsed.get('categories', []), 'items': []}
        except Exception as error:
            print(f'Failed to load catalog from {candidate}: {error}')

    print('Failed to load catalog from any source, using default')
    return create_default_catalog()


def sync_catalog_to_github(serialized):
    if not GITHUB_SYNC:
        return
    if not GITHUB_TOKEN:
        print('GITHUB_SYNC is enabled, but GITHUB_TOKEN is not set. Skipping GitHub sync.')
        return
    if not GITHUB_REPO or '/' not in GITHUB_REPO:
        print('GITHUB_REPO is invalid or missing. Expected format "owner/repo".')
        return

    github_api_url = f'https://api.github.com/repos/{GITHUB_REPO}/contents/{GITHUB_PATH}'
    headers = {
        'Authorization': f'token {GITHUB_TOKEN}',
        'Accept': 'application/vnd.github+json'
    }
    try:
        response = requests.get(github_api_url, headers=headers, params={'ref': GITHUB_BRANCH}, timeout=10)
        sha = None
        if response.status_code == 200:
            content = response.json()
            sha = content.get('sha')
        elif response.status_code == 404:
            print(f'GitHub GET returned 404 for {GITHUB_REPO}/{GITHUB_PATH}@{GITHUB_BRANCH}. '
                  'This usually means the repository or path was not found, or the token lacks read access. '
                  'If the path is new, the repository and branch must still exist and the token must have repository access.')
        else:
            print(f'GitHub GET returned {response.status_code}: {response.text}')

        payload = {
            'message': f'Update catalog.json via admin edit {__import__('datetime').datetime.utcnow().isoformat()}Z',
            'content': base64.b64encode(serialized.encode('utf-8')).decode('utf-8'),
            'branch': GITHUB_BRANCH
        }
        if sha:
            payload['sha'] = sha

        put_response = requests.put(github_api_url, headers=headers, json=payload, timeout=10)
        if put_response.status_code in (200, 201):
            return
        if put_response.status_code == 404:
            print(f'GitHub sync failed 404 for {GITHUB_REPO}/{GITHUB_PATH}@{GITHUB_BRANCH}. '
                  'Verify repository exists, the branch name is correct, and the token has appropriate permissions (public_repo for public repos or repo for private repos).')
        else:
            print(f'GitHub sync failed: {put_response.status_code} {put_response.text}')
    except Exception as error:
        print(f'Failed to sync catalog to GitHub: {error}')


def save_catalog(next_catalog):
    if USE_POSTGRES:
        try:
            save_catalog_to_postgres(next_catalog)
        except Exception as error:
            print(f'Failed to save catalog to Postgres: {error}')
            raise

    try:
        ensure_data_file()
        serialized = json.dumps(next_catalog, ensure_ascii=False, indent=2)
        DATA_FILE.write_text(serialized, encoding='utf-8')
        BACKUP_FILE.write_text(serialized, encoding='utf-8')
        sync_catalog_to_github(serialized)
    except Exception as error:
        print(f'Failed to save catalog to file: {error}')
        raise


def rebuild_items():
    catalog['items'] = [
        {
            **item,
            'categoryId': category['id'],
            'categoryTitle': category['title']
        }
        for category in catalog['categories']
        for item in category.get('items', [])
    ]


def initialize_catalog():
    if USE_POSTGRES:
        init_postgres()
    loaded = load_catalog()
    catalog.clear()
    catalog.update(loaded)
    rebuild_items()


def require_admin_token():
    token = request.headers.get('x-admin-token', '')
    return token == ADMIN_TOKEN


def invalid_payload(message='Invalid payload'):
    return jsonify({'error': message}), 400


def create_app():
    initialize_catalog()

    @app.before_request
    def log_request():
        method = request.method
        path = request.path
        origin = request.headers.get('Origin', 'unknown')
        print(f'[{method}] {path} from {origin}')

    @app.route('/health', methods=['GET'])
    def health():
        return jsonify({'status': 'ok', 'postgres': USE_POSTGRES})

    @app.route('/api/health-reload', methods=['POST'])
    def health_reload():
        """Emergency endpoint to reload catalog from file"""
        if not require_admin_token():
            return jsonify({'error': 'Forbidden'}), 403
        
        try:
            loaded = load_catalog()
            catalog.clear()
            catalog.update(loaded)
            rebuild_items()
            print(f'Reloaded catalog: {len(catalog.get("categories", []))} categories')
            return jsonify({'status': 'reloaded', 'catalog': catalog})
        except Exception as error:
            print(f'Failed to reload catalog: {error}')
            return jsonify({'error': f'Failed to reload: {str(error)}'}), 500

    @app.route('/api/catalog', methods=['GET'])
    def get_catalog():
        return jsonify(catalog)

    @app.route('/api/catalog', methods=['POST'])
    def post_catalog():
        if not require_admin_token():
            return jsonify({'error': 'Forbidden'}), 403

        body = request.get_json(silent=True)
        if not body or not isinstance(body.get('categories'), list):
            return invalid_payload('Invalid catalog payload')

        try:
            # Validate categories structure
            for category in body.get('categories', []):
                if not isinstance(category, dict):
                    return invalid_payload('Each category must be an object')
                if 'id' not in category or 'title' not in category:
                    return invalid_payload('Each category must have "id" and "title"')
                if not isinstance(category.get('items'), list):
                    category['items'] = []
            
            catalog['categories'] = body['categories']
            rebuild_items()
            save_catalog(catalog)
            return jsonify(catalog)
        except Exception as error:
            print(f'Error saving catalog: {error}')
            return jsonify({'error': f'Failed to save catalog: {str(error)}'}), 500

    @app.route('/api/items/<item_id>', methods=['PUT'])
    def put_item(item_id):
        if not require_admin_token():
            return jsonify({'error': 'Forbidden'}), 403

        try:
            body = request.get_json(silent=True) or {}
            updated = False
            for category in catalog['categories']:
                for item in category.get('items', []):
                    if item.get('id') == item_id:
                        if isinstance(body.get('name'), str):
                            item['name'] = body['name']
                        if isinstance(body.get('price'), (int, float)):
                            item['price'] = body['price']
                        if isinstance(body.get('modifiers'), list):
                            item['modifiers'] = body['modifiers']
                        if isinstance(body.get('modifier'), str):
                            item['modifier'] = body['modifier']
                        updated = True
                        break
                if updated:
                    break

            if not updated:
                return jsonify({'error': 'Item not found'}), 404

            rebuild_items()
            save_catalog(catalog)
            return jsonify(catalog)
        except Exception as error:
            print(f'Error updating item: {error}')
            return jsonify({'error': f'Failed to update item: {str(error)}'}), 500

    @app.route('/api/categories/<category_id>', methods=['PUT'])
    def put_category(category_id):
        if not require_admin_token():
            return jsonify({'error': 'Forbidden'}), 403

        try:
            body = request.get_json(silent=True) or {}
            title = body.get('title')
            if not isinstance(title, str) or not title.strip():
                return invalid_payload('Invalid category title')

            category = next((entry for entry in catalog['categories'] if entry.get('id') == category_id), None)
            if not category:
                return jsonify({'error': 'Category not found'}), 404

            category['title'] = title.strip()
            rebuild_items()
            save_catalog(catalog)
            return jsonify(catalog)
        except Exception as error:
            print(f'Error updating category: {error}')
            return jsonify({'error': f'Failed to update category: {str(error)}'}), 500

    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve_static(path):
        if path and (BASE_DIR / 'static' / path).exists():
            return send_from_directory(str(BASE_DIR / 'static'), path)
        return send_from_directory(str(BASE_DIR / 'static'), 'index.html')

    @app.after_request
    def after_request(response):
        # Гарантированно добавляем CORS заголовки ко всем ответам
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS, HEAD'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, x-admin-token, Authorization, X-Requested-With, Accept, Origin'
        response.headers['Access-Control-Max-Age'] = '3600'
        return response

    return app


app = create_app()


if __name__ == '__main__':
    print(f'Server running on http://0.0.0.0:{PORT}')
    app.run(host='0.0.0.0', port=PORT)
