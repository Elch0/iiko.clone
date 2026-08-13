#!/usr/bin/env python3
import json
from datetime import datetime

catalog = {
    "categories": [],
    "items": []
}

# Helper to generate IDs
counter = {"cat": 1, "item": 1}

def next_cat_id():
    cid = f"cat-{counter['cat']}"
    counter['cat'] += 1
    return cid

def next_item_id():
    iid = f"item-{counter['item']}"
    counter['item'] += 1
    return iid

# ===== ВКУСНЯШКИ =====
vkusnyashki_id = next_cat_id()
catalog["categories"].append({
    "id": vkusnyashki_id,
    "title": "Вкусняшки",
    "parentId": None,
    "items": []
})

vkusnyashki_items = [
    ("Абрикосовый конфитюр", 1550),
    ("Батончик шокол с карамелью и арахисом", 700),
    ("Батончик шоколадный с кокосом", 700),
    ("Вишневое варенье", 1550),
    ("Драже \"Кешью в шоколаде\"", 2900),
    ("Драже \"Клубника в шоколаде\"", 2900),
    ("Драже \"Миндаль в шоколаде\"", 2900),
    ("Драже \"Фундук в шоколаде\"", 2900),
    ("Леденцы", 600),
    ("Леденцы с игрушками", 800),
    ("Малиновый конфитюр", 1500),
    ("Маршмеллоу Радуга", 750),
    ("Попкорн карамельный", 1900),
    ("Попкорн шоколадный", 1900),
    ("Трубочка со сгущёнкой", 750),
    ("Черничное варенье", 1900),
    ("Шоколад Сафия с карамелью и арахисом", 650),
    ("Шоколад Сафия с кокосом", 650),
    ("Яблочный джем", 1500),
]

for name, price in vkusnyashki_items:
    item_id = next_item_id()
    catalog["categories"][-1]["items"].append({
        "id": item_id,
        "name": name,
        "price": price,
        "modifier": "",
        "modifiers": []
    })

# ===== КЕКС И ПОПС =====
keks_id = next_cat_id()
catalog["categories"].append({
    "id": keks_id,
    "title": "Кекс и Попс",
    "parentId": None,
    "items": []
})

keks_items = [
    ("Апельсиновый кекс new", 4200),
    ("Вишневый кекс", 4200),
    ("Кекс Апельсиновый шт", 550),
    ("Маффин шоколадный с вишней", 950),
    ("Мишка БАРНИ кекс", 450),
    ("Чупа-попс - 15000", 800),
    ("Чупа-попс - 9000", 600),
    ("Яблочный кекс new", 4200),
]

for name, price in keks_items:
    item_id = next_item_id()
    catalog["categories"][-1]["items"].append({
        "id": item_id,
        "name": name,
        "price": price,
        "modifier": "",
        "modifiers": []
    })

# ===== КРУГЛЫЕ ТОРТЫ =====
torty_id = next_cat_id()
catalog["categories"].append({
    "id": torty_id,
    "title": "Круглые торты",
    "parentId": None,
    "items": []
})

# Подкатегория: Круглые торты мини
torty_mini_id = next_cat_id()
catalog["categories"].append({
    "id": torty_mini_id,
    "title": "Круглые торты мини",
    "parentId": torty_id,
    "items": []
})

torty_mini_items = [
    ("Берри кейк мини торт", 9200),
    ("Киевский Рожок мини", 12900),
    ("Кофе тоффи мини торт", 8900),
    ("Лесной орех мини торт", 9500),
    ("Медовый milk slice мини торт", 6500),
    ("Рафаэлло торт мини", 8900),
    ("Тирамису мини торт", 12500),
    ("Шок Банан мини торт", 9900),
]

for name, price in torty_mini_items:
    item_id = next_item_id()
    catalog["categories"][-1]["items"].append({
        "id": item_id,
        "name": name,
        "price": price,
        "modifier": "",
        "modifiers": []
    })

# Основные круглые торты (без подкатегории)
torty_main_items = [
    ("Адмирал торт круглый", 10900),
    ("Верона стандартный торт", 8900),
    ("Джульетта new", 10900),
    ("Ириска торт", 9500),
    ("Карамельный медовый торт круг", 7500),
    ("Киевский Бантик", 14900),
    ("Киевский оформленный", 15900),
    ("Киевский Розовый", 15900),
    ("Меренговый Рулет Большой", 6900),
    ("Микс торт круглый", 12900),
    ("Мороженко тоорт", 12500),
    ("Орео торт круглый", 14900),
    ("Песочно - Малиновый торт", 7900),
    ("Прага new", 10900),
    ("Птичка торт", 5900),
    ("Радуга торт круглый", 8900),
    ("Рафаелло торт", 14500),
    ("Роше торт", 13500),
    ("Сафия (Бежевый) круглый", 9900),
    ("Сафия (Розовое) круглый", 9900),
    ("Сафия Торт Оформление", 11500),
    ("Сказка Рулет NEW", 6900),
    ("Смородина торт", 7900),
    ("Сникерс торт круглый", 12500),
    ("Торт Барби", 13900),
    ("Торт Блэк Форест", 11900),
    ("Торт Виктория", 11500),
    ("Торт Джульетта оформленный", 10900),
    ("Торт Динозаврик", 13900),
    ("Торт Мишка", 11900),
    ("Торт Молочная девочка", 8200),
    ("Торт Париж", 11900),
    ("Торт Стич", 12900),
    ("Фисташковый Меренговый Рулет", 8900),
    ("Фруктовый торт круглый", 12900),
    ("Черный принц торт круглый", 10900),
    ("Шок банан круг", 15500),
    ("Шок малиновый торт круглый", 9900),
    ("Ягодно - творожный торт NEW", 7900),
]

for name, price in torty_main_items:
    item_id = next_item_id()
    catalog["categories"][catalog["categories"].index(next(c for c in catalog["categories"] if c["id"] == torty_id))]["items"].append({
        "id": item_id,
        "name": name,
        "price": price,
        "modifier": "",
        "modifiers": []
    })

# ===== МЕЛКОШТУЧКА =====
melko_id = next_cat_id()
catalog["categories"].append({
    "id": melko_id,
    "title": "Мелкоштучка",
    "parentId": None,
    "items": []
})

# Имбирные
imbir_id = next_cat_id()
catalog["categories"].append({
    "id": imbir_id,
    "title": "Имбирные",
    "parentId": melko_id,
    "items": []
})

imbir_items = [
    ("Имбирный пряник Балерина", 800),
    ("Имбирный пряник Барселона", 800),
    ("Имбирный пряник Зайка", 800),
    ("Имбирный пряник Капкейк", 1200),
    ("Имбирный пряник Куроми", 800),
    ("Имбирный пряник Панда", 800),
    ("Имбирный пряник Принц", 1200),
    ("Имбирный пряник Принцесса", 1200),
    ("Имбирный пряник Реал Мадрид", 800),
    ("Имбирный пряник Стич", 800),
    ("Имбирный пряник Трансформер", 800),
    ("Имбирный пряник Халк", 800),
    ("Имбирный пряник Человек-паук", 800),
    ("ПП Батончик класический", 850),
    ("ПП Батончик шоколадный", 850),
]

for name, price in imbir_items:
    item_id = next_item_id()
    catalog["categories"][-1]["items"].append({
        "id": item_id,
        "name": name,
        "price": price,
        "modifier": "",
        "modifiers": []
    })

# Картошка
kartosh_id = next_cat_id()
catalog["categories"].append({
    "id": kartosh_id,
    "title": "Картошка",
    "parentId": melko_id,
    "items": []
})

kartosh_items = [
    ("Ёжик картошка", 600),
    ("Картошка мал (ромбик)", 350),
    ("Картошка пирожное", 400),
    ("Картошка шок.батончик", 450),
]

for name, price in kartosh_items:
    item_id = next_item_id()
    catalog["categories"][-1]["items"].append({
        "id": item_id,
        "name": name,
        "price": price,
        "modifier": "",
        "modifiers": []
    })

# Макаронсы
makaron_id = next_cat_id()
catalog["categories"].append({
    "id": makaron_id,
    "title": "Макаронсы",
    "parentId": melko_id,
    "items": []
})

makaron_items = [
    ("Макаронс Ванильный", 450),
    ("Макаронс Фисташковый", 450),
    ("Макаронс Шоколадный", 450),
    ("Макаронс Экзотик", 450),
    ("Макаронс Ягодный", 450),
    ("Макаронсы в упаковке 10 шт", 3900),
    ("Макаронсы в упаковке 5 шт", 2100),
]

for name, price in makaron_items:
    item_id = next_item_id()
    catalog["categories"][-1]["items"].append({
        "id": item_id,
        "name": name,
        "price": price,
        "modifier": "",
        "modifiers": []
    })

# Мерчи
merchi_id = next_cat_id()
catalog["categories"].append({
    "id": merchi_id,
    "title": "Мерчи",
    "parentId": melko_id,
    "items": []
})

merchi_items = [
    ("Открытка Q2", 400),
    ("Свитшот (для взрослых)", 8900),
    ("Свитшот (для детей)", 4500),
]

for name, price in merchi_items:
    item_id = next_item_id()
    catalog["categories"][-1]["items"].append({
        "id": item_id,
        "name": name,
        "price": price,
        "modifier": "",
        "modifiers": []
    })

# Мини Кухня
minikuh_id = next_cat_id()
catalog["categories"].append({
    "id": minikuh_id,
    "title": "Мини Кухня",
    "parentId": melko_id,
    "items": []
})

minikuh_items = [
    ("Круассан сэндвич", 1600),
    ("Куриный сэндвич", 1700),
    ("Салат \"Цезарь\"", 1800),
]

for name, price in minikuh_items:
    item_id = next_item_id()
    catalog["categories"][-1]["items"].append({
        "id": item_id,
        "name": name,
        "price": price,
        "modifier": "",
        "modifiers": []
    })

# Мясная Выпечка
myasnaya_id = next_cat_id()
catalog["categories"].append({
    "id": myasnaya_id,
    "title": "Мясная Выпечка",
    "parentId": melko_id,
    "items": []
})

myasnaya_items = [
    ("EXP Блинчик пустышка шт", 250),
    ("EXP Блинчик с творогом шт", 400),
    ("EXP Блинчик с мясом шт", 600),
    ("Балиш с пюре и сыром", 550),
    ("Мясная мини лепёшка с мясом говядины", 600),
    ("Пицца закрытая", 650),
    ("Пицца открытая", 750),
    ("Сомса с курицей NEW", 350),
    ("Сомса с курицей мини NEW", 5300),
    ("Сомса с мясом говядины NEW", 400),
    ("Сомса с мясом говядины мини NEW", 6500),
]

for name, price in myasnaya_items:
    item_id = next_item_id()
    catalog["categories"][-1]["items"].append({
        "id": item_id,
        "name": name,
        "price": price,
        "modifier": "",
        "modifiers": []
    })

# Напитки
napitki_id = next_cat_id()
catalog["categories"].append({
    "id": napitki_id,
    "title": "Напитки",
    "parentId": melko_id,
    "items": []
})

napitki_items = [
    ("Боржоми (Алюм.бан.0,33)", 700),
    ("Боржоми (Стекло 0,5)", 900),
    ("Боржоми пластик 0,5", 750),
    ("Боржоми стекло 0,33", 800),
    ("Вода Bonaqua без газа 0,5", 300),
    ("Вода Bonaqua с газом 0,5", 300),
    ("Кола 0,5", 500),
    ("Сок Piko апельсин", 350),
    ("Сок Piko мультифрукт", 350),
    ("Сок Piko персик", 350),
    ("Сок Piko яблочный", 350),
    ("Спрайт 0,5", 500),
    ("Фанта 0,5", 500),
]

for name, price in napitki_items:
    item_id = next_item_id()
    catalog["categories"][-1]["items"].append({
        "id": item_id,
        "name": name,
        "price": price,
        "modifier": "",
        "modifiers": []
    })

# Печенье
pechenye_id = next_cat_id()
catalog["categories"].append({
    "id": pechenye_id,
    "title": "Печенье",
    "parentId": melko_id,
    "items": []
})

pechenye_items = [
    ("Классический бискотти", 400),
    ("Печенье \"Карамельное\"", 1000),
    ("Печенье \"Подушечки\" в мини упаковке", 550),
    ("Печенье \"Подушечки\" в упаковке", 800),
    ("Печенье \"Нутелла\"", 1000),
    ("Печенье Палочки в упаковке", 800),
    ("Печенье \"Браун\"", 1000),
]

for name, price in pechenye_items:
    item_id = next_item_id()
    catalog["categories"][-1]["items"].append({
        "id": item_id,
        "name": name,
        "price": price,
        "modifier": "",
        "modifiers": []
    })

# Печенье Сеты в Пакете
pechenye_sety_id = next_cat_id()
catalog["categories"].append({
    "id": pechenye_sety_id,
    "title": "Печенье Сеты в Пакете",
    "parentId": melko_id,
    "items": []
})

pechenye_sety_items = [
    ("Баунти сет Б", 2500),
    ("Бисконти сет Б", 1500),
    ("Кунжут сет Б", 1600),
    ("Лимон сет Б", 1650),
    ("Лочира сет Б", 1300),
    ("Мазурки сет Б 0,2кг", 1600),
    ("Овсянка сет Б", 1400),
    ("Печенье Бананчики в упаковке", 1850),
    ("Сушки сет Б", 1100),
    ("Шрек сет Б", 1400),
]

for name, price in pechenye_sety_items:
    item_id = next_item_id()
    catalog["categories"][-1]["items"].append({
        "id": item_id,
        "name": name,
        "price": price,
        "modifier": "",
        "modifiers": []
    })

# Пироги
pirogi_id = next_cat_id()
catalog["categories"].append({
    "id": pirogi_id,
    "title": "Пироги",
    "parentId": melko_id,
    "items": []
})

pirogi_items = [
    ("Бакинская пахлава прямоугольный", 12800),
    ("Вишнево яблочный пирог", 12000),
    ("Вишневый пирог", 12800),
    ("Лимонная мозайка пирог", 1200),
    ("Мишка пирог", 13600),
    ("Творожная мозайка пирог", 12000),
    ("Творожник пирог", 12000),
    ("Яблочный пирог", 11200),
]

for name, price in pirogi_items:
    item_id = next_item_id()
    catalog["categories"][-1]["items"].append({
        "id": item_id,
        "name": name,
        "price": price,
        "modifier": "",
        "modifiers": []
    })

# Пирожное мини
pirozhoe_id = next_cat_id()
catalog["categories"].append({
    "id": pirozhoe_id,
    "title": "Пирожное мини",
    "parentId": melko_id,
    "items": []
})

pirozhoe_items = [
    ("№1 Аморе мини пирож", 650),
    ("Апельсинка мини пирожное", 650),
    ("Карамелька мини пирожное", 650),
    ("Мини пирожное Сникерс", 650),
    ("Три шоколада мини пирожное", 650),
    ("Фламинго мини пирожное", 650),
    ("Шоколадный кекс мини", 650),
    ("Экзот мини пирожное", 650),
]

for name, price in pirozhoe_items:
    item_id = next_item_id()
    catalog["categories"][-1]["items"].append({
        "id": item_id,
        "name": name,
        "price": price,
        "modifier": "",
        "modifiers": []
    })

# Save to file
output_path = 'data/catalog.json'
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(catalog, f, ensure_ascii=False, indent=2)

print(f"✓ Catalog created: {len(catalog['categories'])} categories")
print(f"✓ Total items: {sum(len(cat['items']) for cat in catalog['categories'])}")
print(f"✓ Saved to {output_path}")
