#!/usr/bin/env python3
"""Generate embedded catalog for Render fallback"""
import json

# Read the catalog
with open('data/catalog.json', 'r', encoding='utf-8') as f:
    catalog_text = f.read()

# Write as Python file with embedded JSON
with open('_embedded_catalog.py', 'w', encoding='utf-8') as out:
    out.write('# Auto-generated embedded catalog for Render fallback\n')
    out.write('EMBEDDED_CATALOG_JSON = r"""')
    out.write(catalog_text)
    out.write('"""\n')
