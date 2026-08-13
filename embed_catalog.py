#!/usr/bin/env python3
"""Convert catalog.json to Python embedded constant"""
import json

with open('data/catalog.json', 'r', encoding='utf-8') as f:
    catalog = json.load(f)

# Generate Python code
print("EMBEDDED_CATALOG = " + json.dumps(catalog, ensure_ascii=False, indent=2))
print(f"\n# Total: {len(catalog.get('categories', []))} categories")
