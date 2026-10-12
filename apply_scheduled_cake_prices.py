#!/usr/bin/env python3
"""Apply the scheduled cake price change on 2026-10-13 at 00:01 UTC+5."""
import json
from datetime import datetime, timezone
from pathlib import Path

TARGET_UTC = datetime(2026, 10, 12, 19, 1, tzinfo=timezone.utc)
now = datetime.now(timezone.utc)
if now < TARGET_UTC:
    print('Scheduled price change is not due yet.')
    raise SystemExit(0)
if now.date() != TARGET_UTC.date():
    print('Scheduled price change date has passed; no changes applied.')
    raise SystemExit(0)

catalog_path = Path('data/catalog.json')
catalog = json.loads(catalog_path.read_text(encoding='utf-8'))
updates = {
    't-17': ('Рафаелло торт', 15500),
    'tm-6': ('Рафаэлло торт мини', 9200),
}
found = set()
for category in catalog.get('categories', []):
    for item in category.get('items', []):
        item_id = item.get('id')
        if item_id in updates:
            expected_name, price = updates[item_id]
            if item.get('name') != expected_name:
                raise ValueError(f'Unexpected product for {item_id}: {item.get("name")!r}')
            item['price'] = price
            found.add(item_id)

missing = set(updates) - found
if missing:
    raise ValueError(f'Missing expected product IDs: {sorted(missing)}')

catalog_path.write_text(json.dumps(catalog, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print('Applied scheduled prices:', ', '.join(f'{name}={price}' for name, price in updates.values()))
