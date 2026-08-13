const { debounce, defer, memoize } = (typeof window !== 'undefined' && window.iikoUtils) ? window.iikoUtils : require('./utils');

const paymentTypes = [
  { id: 'kaspi', label: 'Kaspi', color: 'kaspi' },
  { id: 'halyk', label: 'Halyk', color: 'halyk' },
  { id: 'nalichka', label: 'Наличка', color: 'nalichka' },
  { id: 'tab', label: 'TAB', color: 'tab' }
];

const fallbackCatalog = {
  "categories": [
    {
      "id": "cat1784221010347",
      "title": "Круглые торты мини",
      "parentId": "cat4",
      "items": [
        {
          "id": "item1784221041556",
          "name": "Берри кейк мини",
          "price": 9200,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784221042421",
          "name": "Кофе тоффи мини торт",
          "price": 8900,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784221043102",
          "name": "Лесной орех мини торт",
          "price": 9500,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784221044838",
          "name": "Медовый milk slice мини торт",
          "price": 6500,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784221045533",
          "name": "Рафаэлло мини торт",
          "price": 8900,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784221046190",
          "name": "Тирамису мини торт",
          "price": 12500,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784221047247",
          "name": "Шок Банан мини торт",
          "price": 9900,
          "modifier": "",
          "modifiers": []
        }
      ]
    },
    {
      "id": "cat1784213838196",
      "title": "Кофе Альтернатива",
      "parentId": "cat1784213413638",
      "items": [
        {
          "id": "item1784214123857",
          "name": "Двойной Капучино на Ванильном",
          "price": 2200,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784214124795",
          "name": "Капучино на Миндальном",
          "price": 1900,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784214125572",
          "name": "Латте на Соевом",
          "price": 1900,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784214126471",
          "name": "Латте на Миндальном",
          "price": 1900,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784214127193",
          "name": "Латте на Кокосовом",
          "price": 1900,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784214127896",
          "name": "Молоко Стакан Ваниль",
          "price": 1000,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784214128642",
          "name": "Молоко Стакан Миндаль",
          "price": 1000,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784214129413",
          "name": "Молоко Стакан Кокос",
          "price": 1000,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784214130110",
          "name": "Молоко Стакан Соя",
          "price": 1000,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784214130779",
          "name": "Двойной Капучино на Кокосовом",
          "price": 2200,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784214131435",
          "name": "Двойной Капучино на Соевом",
          "price": 2200,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784214132087",
          "name": "Двойной Капучино на Миндальном",
          "price": 2200,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784214132706",
          "name": "Капучино на Ванильном",
          "price": 1900,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784214133445",
          "name": "Капучино на Кокосовом",
          "price": 1900,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784214134216",
          "name": "Капучино на Соевом",
          "price": 1900,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784214279762",
          "name": "Латте на Ванильном",
          "price": 1900,
          "modifier": "",
          "modifiers": []
        }
      ]
    },
    {
      "id": "cat1784213414968",
      "title": "Смузи",
      "parentId": "cat1",
      "items": [
        {
          "id": "item1784215056308",
          "name": "Банановый Смузи",
          "price": 2000,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784215057066",
          "name": "Дыня-Киви Смузи",
          "price": 2000,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784215057800",
          "name": "Ягодный Смузи",
          "price": 2000,
          "modifier": "",
          "modifiers": []
        }
      ]
    },
    {
      "id": "cat1784213414291",
      "title": "Кофе доставка",
      "parentId": "cat1",
      "items": []
    },
    {
      "id": "cat1784213413638",
      "title": "Кофе",
      "parentId": "cat1",
      "items": [
        {
          "id": "item1784213842043",
          "name": "Американо",
          "price": 900,
          "modifier": "Без сахара",
          "modifiers": [
            "Без сахара",
            "Корица",
            "Мало сахара",
            "С сахаром",
            "Сахар заменитель",
            "Сироп",
            "Средний сахар"
          ]
        },
        {
          "id": "item1784213843194",
          "name": "Латте",
          "price": 1200,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213843925",
          "name": "Лонг Блэк",
          "price": 900,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213844616",
          "name": "Раф Кофе",
          "price": 1500,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213845252",
          "name": "Трипл Американо",
          "price": 1300,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213845900",
          "name": "Трипл Капучино",
          "price": 1500,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213846639",
          "name": "Флет Уайт",
          "price": 1250,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213847432",
          "name": "Эспрессо",
          "price": 800,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213848143",
          "name": "Эспрессо Маккиято",
          "price": 900,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213848763",
          "name": "Горячий Шоколад",
          "price": 1500,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213849414",
          "name": "Двойной Американо",
          "price": 1000,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213850091",
          "name": "Двойной Капучино",
          "price": 1300,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213850764",
          "name": "Двойной Латте",
          "price": 1400,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213851355",
          "name": "Двойной Лонг Блэк",
          "price": 1100,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213852116",
          "name": "Двойной Эспрессо",
          "price": 1000,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213852743",
          "name": "Двойной Эспрессо Маккиято",
          "price": 1100,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213853420",
          "name": "Какао",
          "price": 1350,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213854089",
          "name": "Капучино",
          "price": 1100,
          "modifier": "",
          "modifiers": []
        }
      ]
    },
    {
      "id": "cat1784213412947",
      "title": "Айс - ти",
      "parentId": "cat1",
      "items": [
        {
          "id": "item1784214590473",
          "name": "Чёрный Айс - Ти",
          "price": 1300,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784214591261",
          "name": "Фруктовый Айс - Ти",
          "price": 1300,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784214591995",
          "name": "Зелёный Айс - Ти",
          "price": 1300,
          "modifier": "",
          "modifiers": []
        }
      ]
    },
    {
      "id": "cat1784213412262",
      "title": "Авторские чаи Аскарова",
      "parentId": "cat1",
      "items": [
        {
          "id": "item1784214999087",
          "name": "Успокаивающий Авторский Чай",
          "price": 1700,
          "modifier": "Без Мякоти",
          "modifiers": [
            "Без Мякоти",
            "С Мякотью"
          ]
        },
        {
          "id": "item1784214999928",
          "name": "Успокаивающий Чай 0,5",
          "price": 1100,
          "modifier": "Без Мякоти",
          "modifiers": [
            "Без Мякоти",
            "С Мякотью"
          ]
        }
      ]
    },
    {
      "id": "cat1784213411570",
      "title": "Милкшейки",
      "parentId": "cat1",
      "items": [
        {
          "id": "item1784215034840",
          "name": "Банановый Милкшейк",
          "price": 2000,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784215035569",
          "name": "Шоколадный Милкшейк",
          "price": 2000,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784215036303",
          "name": "Клубничный Милкшейк",
          "price": 2000,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784215037023",
          "name": "Ванильный Сыр Милкшейк",
          "price": 2000,
          "modifier": "",
          "modifiers": []
        }
      ]
    },
    {
      "id": "cat1784213410843",
      "title": "Лимонады",
      "parentId": "cat1",
      "items": [
        {
          "id": "item1784215020458",
          "name": "Гранатовый на Активии",
          "price": 1600,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784215021521",
          "name": "Клубника Карамель Лимонад",
          "price": 1500,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784215022567",
          "name": "Ягодный на Активии",
          "price": 1600,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784215023383",
          "name": "Яблоко Ананас Лимонад",
          "price": 1500,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784215025225",
          "name": "Цитрусовый",
          "price": 1500,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784215026096",
          "name": "Тропический",
          "price": 1500,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784215027200",
          "name": "Мохито (Без Алкогольный)",
          "price": 1350,
          "modifier": "",
          "modifiers": []
        }
      ]
    },
    {
      "id": "cat1784213410135",
      "title": "Сезонное Меню",
      "parentId": "cat1",
      "items": [
        {
          "id": "item1784215050188",
          "name": "Айс Кофе \"Солёная Карамель\"",
          "price": 2200,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784215050993",
          "name": "Медовый Айс Американо",
          "price": 1900,
          "modifier": "",
          "modifiers": []
        }
      ]
    },
    {
      "id": "cat1784213409438",
      "title": "Сиропы",
      "parentId": "cat1",
      "items": [
        {
          "id": "item1784214464589",
          "name": "Сироп Ваниль",
          "price": 150,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784214465664",
          "name": "Сироп Ореховый",
          "price": 150,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784214466473",
          "name": "Сироп Солёная Карамель",
          "price": 150,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784214467235",
          "name": "Сироп Шоколад",
          "price": 150,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784214468068",
          "name": "Сироп Карамель",
          "price": 150,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784214469462",
          "name": "Сироп Кокос",
          "price": 150,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784219117594",
          "name": "Сироп Арбуз",
          "price": 150,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784219125892",
          "name": "Сироп Банановый",
          "price": 150,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784219126889",
          "name": "Сироп Гранатовый",
          "price": 150,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784219127773",
          "name": "Сироп Дыня",
          "price": 150,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784219128646",
          "name": "Сироп Зелёное Яблоко",
          "price": 150,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784219129436",
          "name": "Сироп Киви",
          "price": 150,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784219130209",
          "name": "Сироп Клубничный",
          "price": 150,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784219131040",
          "name": "Сироп Манго",
          "price": 150,
          "modifier": "",
          "modifiers": []
        }
      ]
    },
    {
      "id": "cat1784213408788",
      "title": "Свежевыжатые соки",
      "parentId": "cat1",
      "items": [
        {
          "id": "item1784215041344",
          "name": "Апельсиновый fresh",
          "price": 2200,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784215042131",
          "name": "Яблочный fresh",
          "price": 1500,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784215042827",
          "name": "Яблочно Морковный fresh",
          "price": 1400,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784215043569",
          "name": "Морковный fresh",
          "price": 1300,
          "modifier": "",
          "modifiers": []
        }
      ]
    },
    {
      "id": "cat1784213408101",
      "title": "Фраппе",
      "parentId": "cat1",
      "items": [
        {
          "id": "item1784215061616",
          "name": "Арахисовый Фраппе",
          "price": 2000,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784215062395",
          "name": "Шоколадный Фраппе",
          "price": 2000,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784215063129",
          "name": "Классический Фраппе",
          "price": 2000,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784215063900",
          "name": "Карамельный Фраппе",
          "price": 2000,
          "modifier": "",
          "modifiers": []
        }
      ]
    },
    {
      "id": "cat1784213407333",
      "title": "Чай",
      "parentId": "cat1",
      "items": [
        {
          "id": "item1784214671223",
          "name": "Лимон",
          "price": 80,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784214672273",
          "name": "Мёд",
          "price": 110,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784214673159",
          "name": "Молоко Стакан",
          "price": 110,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784214674140",
          "name": "Чай Чёрный",
          "price": 500,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784214675048",
          "name": "Чай Зелёный",
          "price": 500,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784214675818",
          "name": "Чай Чёрный с Лимоном",
          "price": 700,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784214676549",
          "name": "Чай Зелёный с Лимоном",
          "price": 700,
          "modifier": "",
          "modifiers": []
        }
      ]
    },
    {
      "id": "cat1784213406303",
      "title": "Холодный Кофе",
      "parentId": "cat1",
      "items": [
        {
          "id": "item1784215068138",
          "name": "Латте Айс на Миндальном",
          "price": 1700,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784215068887",
          "name": "Испанский Латте",
          "price": 1800,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784215069550",
          "name": "Капучино Айс",
          "price": 1550,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784215070193",
          "name": "Латте Айс",
          "price": 1450,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784215073058",
          "name": "Нутелла Айс с Карамелью",
          "price": 1800,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784215077592",
          "name": "Капучино Айс на Ванильном",
          "price": 2200,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784215078379",
          "name": "Капучино Айс на Миндальном",
          "price": 2200,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784215079069",
          "name": "Капучино Айс на Кокосовом",
          "price": 2200,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784215079781",
          "name": "Капучино Айс на Соевом",
          "price": 2200,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784215080635",
          "name": "Латте Айс на Ванильном",
          "price": 1700,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784215081291",
          "name": "Латте Айс на Кокосовом",
          "price": 1700,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784215081992",
          "name": "Латте Айс на Соевом",
          "price": 1700,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784215082693",
          "name": "Американо Айс",
          "price": 1200,
          "modifier": "",
          "modifiers": []
        }
      ]
    },
    {
      "id": "cat1784213152888",
      "title": "Хлеба Австрии",
      "parentId": "cat19",
      "items": [
        {
          "id": "item1784226143267",
          "name": "Бородинский хлеб",
          "price": 750,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784226144043",
          "name": "Славянский аромат хлеб",
          "price": 600,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784226144761",
          "name": "Спорт Актив хлеб",
          "price": 750,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784226145490",
          "name": "Тартин хлеб",
          "price": 600,
          "modifier": "",
          "modifiers": []
        }
      ]
    },
    {
      "id": "cat1784213134518",
      "title": "Пирожное ПП",
      "parentId": "cat18",
      "items": [
        {
          "id": "item1784225841065",
          "name": "Картошка ПП",
          "price": 800,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784225841951",
          "name": "Медовое пирожное ПП",
          "price": 1800,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784225842748",
          "name": "Наполеон пирожное ПП",
          "price": 1900,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784225843515",
          "name": "ПП Пирожное Птичье молоко",
          "price": 1300,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784225844287",
          "name": "ПП Пирожное Сникерс",
          "price": 1700,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784225845005",
          "name": "ПП Сан-Себастьян чизкейк",
          "price": 1900,
          "modifier": "",
          "modifiers": []
        }
      ]
    },
    {
      "id": "cat1784213003419",
      "title": "Макаронсы",
      "parentId": "cat6",
      "items": [
        {
          "id": "item1784221604036",
          "name": "Макаронс Ванильный",
          "price": 450,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784221604894",
          "name": "Макаронс Фисташковый",
          "price": 450,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784221605677",
          "name": "Макаронс Шоколадный",
          "price": 450,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784221606469",
          "name": "Макаронс Экзотик",
          "price": 450,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784221607198",
          "name": "Макаронс Ягодный",
          "price": 450,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784221607922",
          "name": "Макаронсы в упаковке 10 шт",
          "price": 3900,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784221608667",
          "name": "Макаронсы в упаковке 5 шт",
          "price": 2100,
          "modifier": "",
          "modifiers": []
        }
      ]
    },
    {
      "id": "cat1784213002594",
      "title": "Картошка",
      "parentId": "cat6",
      "items": [
        {
          "id": "item1784221526928",
          "name": "Ёжик картошка",
          "price": 600,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784221527838",
          "name": "Картошка мал (ромбик)",
          "price": 350,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784221528621",
          "name": "Картошка шок.батончик",
          "price": 450,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784221529546",
          "name": "Картошка пирожное",
          "price": 400,
          "modifier": "",
          "modifiers": []
        }
      ]
    },
    {
      "id": "cat1784213001729",
      "title": "Имбирные",
      "parentId": "cat6",
      "items": [
        {
          "id": "item1784221243758",
          "name": "Имбирный пряник Куроми",
          "price": 800,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784221244531",
          "name": "Имбирный пряник Балерина",
          "price": 800,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784221245483",
          "name": "Имбирный пряник Барселона",
          "price": 800,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784221246181",
          "name": "Имбирный пряник Капкейк",
          "price": 1200,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784221246816",
          "name": "Имбирный пряник Панда",
          "price": 800,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784221249378",
          "name": "Имбирный пряник Принц",
          "price": 1200,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784221250173",
          "name": "Имбирный пряник Принцесса",
          "price": 1200,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784221250846",
          "name": "Имбирный пряник Реал Мадрид",
          "price": 800,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784221251527",
          "name": "Имбирный пряник Стич",
          "price": 800,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784221426634",
          "name": "Имбирный пряник Трансформер",
          "price": 800,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784221427566",
          "name": "Имбирный пряник Халк",
          "price": 800,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784221428653",
          "name": "ПП Батончик классический",
          "price": 850,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784221494620",
          "name": "ПП Батончик шоколадный",
          "price": 850,
          "modifier": "",
          "modifiers": []
        }
      ]
    },
    {
      "id": "cat1784212941517",
      "title": "Авторские чаи",
      "parentId": "cat1",
      "items": [
        {
          "id": "item1784214813441",
          "name": "Ташкентский Чай",
          "price": 1700,
          "modifier": "Без Мякоти",
          "modifiers": [
            "Без Мякоти",
            "С Мякотью"
          ]
        },
        {
          "id": "item1784214814364",
          "name": "Ташкентский Чай 0,5",
          "price": 1100,
          "modifier": "Без Мякоти",
          "modifiers": [
            "Без Мякоти",
            "С Мякотью"
          ]
        },
        {
          "id": "item1784214815188",
          "name": "Клюквенный Напиток",
          "price": 1700,
          "modifier": "Без Мякоти",
          "modifiers": [
            "Без Мякоти",
            "С Мякотью"
          ]
        },
        {
          "id": "item1784214815939",
          "name": "Клюквенный Напиток 0,5",
          "price": 1100,
          "modifier": "Без Мякоти",
          "modifiers": [
            "Без Мякоти",
            "С Мякотью"
          ]
        },
        {
          "id": "item1784214816737",
          "name": "Облепиховый Напиток",
          "price": 1700,
          "modifier": "Без Мякоти",
          "modifiers": [
            "Без Мякоти",
            "С Мякотью"
          ]
        },
        {
          "id": "item1784214817447",
          "name": "Облепиховый Напиток 0,5",
          "price": 1100,
          "modifier": "Без Мякоти",
          "modifiers": [
            "Без Мякоти",
            "С Мякотью"
          ]
        },
        {
          "id": "item1784214818194",
          "name": "Ягодный Горячий Напиток",
          "price": 1900,
          "modifier": "Без Мякоти",
          "modifiers": [
            "Без Мякоти",
            "С Мякотью"
          ]
        },
        {
          "id": "item1784214818878",
          "name": "Ягодный Горячий Напиток 0,5",
          "price": 1100,
          "modifier": "Без Мякоти",
          "modifiers": [
            "Без Мякоти",
            "С Мякотю"
          ]
        }
      ]
    },
    {
      "id": "root",
      "title": "Товары без папки",
      "parentId": null,
      "items": [
        {
          "id": "item1784226119236",
          "name": "Пакет",
          "price": 15,
          "modifier": "",
          "modifiers": []
        }
      ]
    },
    {
      "id": "cat1",
      "title": "Safia БАР",
      "parentId": null,
      "items": []
    },
    {
      "id": "cat2",
      "title": "Вкусняшки",
      "parentId": null,
      "items": [
        {
          "id": "item2-1",
          "name": "Абрикосовый конфитюр",
          "price": 1550,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item2-2",
          "name": "Батончик шоколадный с карамелью и арахисом",
          "price": 700,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item2-3",
          "name": "Батончик шоколадный с кокосом",
          "price": 700,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item2-4",
          "name": "Вишнёвое варенье",
          "price": 1550,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item2-5",
          "name": "Драже \"Кешью в шоколаде\"",
          "price": 2900,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item2-6",
          "name": "Драже \"Клубника в шоколаде\"",
          "price": 2900,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784220059924",
          "name": "Драже \"Миндаль в шоколаде\"",
          "price": 2900,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784220062200",
          "name": "Драже \"Фундук в шоколаде\"",
          "price": 2900,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784220063089",
          "name": "Леденцы",
          "price": 600,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784220064039",
          "name": "Леденцы с игрушками",
          "price": 800,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784220064859",
          "name": "Малиновый конфитюр",
          "price": 1500,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784220065808",
          "name": "Маршмеллоу Радуга",
          "price": 750,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784220067808",
          "name": "Попкорн карамельный",
          "price": 1900,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784220219251",
          "name": "Попкорн шоколадный",
          "price": 1900,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784220222987",
          "name": "Трубочка со сгущенкой",
          "price": 750,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784220223839",
          "name": "Черничное варенье",
          "price": 1900,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784220224645",
          "name": "Шоколад Сафия с карамелью и арахисом",
          "price": 650,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784220225664",
          "name": "Шоколад Сафия с кокосом",
          "price": 650,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784220227070",
          "name": "Яблочный джем",
          "price": 1500,
          "modifier": "",
          "modifiers": []
        }
      ]
    },
    {
      "id": "cat3",
      "title": "Кекс и Попс",
      "parentId": null,
      "items": [
        {
          "id": "item3-1",
          "name": "Апельсиновый кекс new",
          "price": 4200,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item3-10",
          "name": "Вишневый кекс",
          "price": 4200,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item3-11",
          "name": "Кекс Апельсиновый шт",
          "price": 550,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item3-13",
          "name": "Маффин шоколадный с вишней",
          "price": 950,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item3-14",
          "name": "Минка БАРНИ кекс",
          "price": 450,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item3-15",
          "name": "Чупа-попс - 15 000",
          "price": 800,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item3-16",
          "name": "Чупа-попс - 9 000",
          "price": 600,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item3-27",
          "name": "Яблочный кекс new",
          "price": 4200,
          "modifier": "",
          "modifiers": []
        }
      ]
    },
    {
      "id": "cat4",
      "title": "Круглые Торты",
      "parentId": null,
      "items": [
        {
          "id": "item4-1",
          "name": "Адмирал торт круглый",
          "price": 10900,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item4-2",
          "name": "Сафия Оформл. торт",
          "price": 11500,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item4-3",
          "name": "Микс торт круглый",
          "price": 12900,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item4-4",
          "name": "Торт Стич",
          "price": 12900,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item4-11",
          "name": "Верона стандартный торт",
          "price": 8900,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item4-12",
          "name": "Джульета new",
          "price": 10900,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item4-13",
          "name": "Ириска торт",
          "price": 9500,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item4-14",
          "name": "Карамельный медовый торт круглый",
          "price": 7500,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item4-16",
          "name": "Торт Барби",
          "price": 13900,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item4-17",
          "name": "Сникерс торт круглый",
          "price": 12500,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item4-18",
          "name": "Смородина торт",
          "price": 7900,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item4-19",
          "name": "Сказка Рулет",
          "price": 6900,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item4-20",
          "name": "Сафия Розовый торт",
          "price": 9900,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item4-21",
          "name": "Сафия Бежевый торт",
          "price": 9900,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item4-22",
          "name": "Роше торт",
          "price": 13500,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item4-23",
          "name": "Рафаелло торт",
          "price": 14500,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item4-24",
          "name": "Радуга торт круглый",
          "price": 8900,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item4-25",
          "name": "Птичка торт",
          "price": 5900,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item4-26",
          "name": "Прага new",
          "price": 10900,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item4-27",
          "name": "Песочно - Малиновый торт",
          "price": 7900,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item4-28",
          "name": "Орео торт круглый",
          "price": 14900,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item4-29",
          "name": "Мороженко торт",
          "price": 12500,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item4-30",
          "name": "Меренговый Рулет большой",
          "price": 6900,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item4-32",
          "name": "Торт Блэк Форест",
          "price": 11900,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item4-34",
          "name": "Торт Виктория",
          "price": 11500,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item4-35",
          "name": "Торт Джульета Оформл.",
          "price": 10900,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item4-36",
          "name": "Торт Мишка",
          "price": 11900,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item4-37",
          "name": "Торт Молочная Девочка",
          "price": 8200,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item4-38",
          "name": "Торт Париж",
          "price": 11900,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item4-40",
          "name": "Фисташковый Меренговый Рулет",
          "price": 8900,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item4-41",
          "name": "Фруктовый торт круглый",
          "price": 12900,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item4-42",
          "name": "Черный принц торт круглый",
          "price": 10900,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item4-43",
          "name": "Шок банан круглый",
          "price": 15500,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item4-44",
          "name": "Шок малиновый торт круглый",
          "price": 9900,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item4-45",
          "name": "Ягодно - творожный торт NEW",
          "price": 7900,
          "modifier": "",
          "modifiers": []
        }
      ]
    },
    {
      "id": "cat6",
      "title": "Мелкоштучка",
      "parentId": null,
      "items": []
    },
    {
      "id": "cat7",
      "title": "Мерчи",
      "parentId": null,
      "items": [
        {
          "id": "item1784213009727",
          "name": "Багет игрушка",
          "price": 3500,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213010755",
          "name": "Магнитик",
          "price": 900,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213011556",
          "name": "Свитшот (для взрослых)",
          "price": 8900,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213012503",
          "name": "Футболка Кофейная М",
          "price": 4000,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213013358",
          "name": "Футболка Кофейная XL",
          "price": 4000,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213014145",
          "name": "Футболка Оливковая L",
          "price": 4000,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213014958",
          "name": "Футболка Оливковая М",
          "price": 4000,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213015742",
          "name": "Футболка Оливковая XL",
          "price": 4000,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213016575",
          "name": "Футболка Синяя L",
          "price": 4000,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213017242",
          "name": "Ежедневник",
          "price": 1100,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213018224",
          "name": "Значок (пин) Гамбургер",
          "price": 1000,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213018955",
          "name": "Значок (пин) Сердечко",
          "price": 1000,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213020067",
          "name": "Значок (пин) Стакан",
          "price": 1000,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213020921",
          "name": "Значок (пин) Сэндвич",
          "price": 1000,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213021672",
          "name": "Кружка Safia",
          "price": 2200,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213022468",
          "name": "Кружка с персиками",
          "price": 3500,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213023314",
          "name": "Кружка с тюльпаном",
          "price": 3500,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213024144",
          "name": "Кружка с цветочками",
          "price": 3500,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213025152",
          "name": "Кружка с яблоками",
          "price": 3500,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213026091",
          "name": "Носки аква единорог",
          "price": 1500,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213026841",
          "name": "Носки бежевые",
          "price": 1500,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213027634",
          "name": "Носки голубые",
          "price": 1500,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213028402",
          "name": "Носки желтые",
          "price": 1500,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213029309",
          "name": "Носки желтые кекс",
          "price": 1500,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213030362",
          "name": "Носки розовые кекс",
          "price": 1500,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213031330",
          "name": "Носки розовые",
          "price": 1500,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213032104",
          "name": "Открытка Q2",
          "price": 0,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213032935",
          "name": "Подушка Safia",
          "price": 4900,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213033642",
          "name": "Ручки Safia",
          "price": 600,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213034410",
          "name": "Свитшот (для детей)",
          "price": 4500,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213035257",
          "name": "Термос с печатью",
          "price": 5900,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213036090",
          "name": "Торт игрушка",
          "price": 3500,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213037107",
          "name": "Футболка Бежевая L",
          "price": 4000,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213037799",
          "name": "Футболка Бежевая М",
          "price": 4000,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213038501",
          "name": "Футболка Бежевая XL",
          "price": 4000,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213039388",
          "name": "Футболка Кофейная L",
          "price": 4000,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784222585483",
          "name": "Футболка Синяя М",
          "price": 4000,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784222586545",
          "name": "Футболка Синяя XL",
          "price": 4000,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784222587466",
          "name": "Шапка бежевая (unisex)",
          "price": 2900,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784222588302",
          "name": "Шоппер",
          "price": 1250,
          "modifier": "",
          "modifiers": []
        }
      ]
    },
    {
      "id": "cat8",
      "title": "Мини Кухня",
      "parentId": null,
      "items": [
        {
          "id": "item8-1",
          "name": "Круассан сэндвич",
          "price": 1600,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item8-2",
          "name": "Куриный сэндвич",
          "price": 1700,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item8-3",
          "name": "Салат \"Цезарь\"",
          "price": 1800,
          "modifier": "",
          "modifiers": []
        }
      ]
    },
    {
      "id": "cat9",
      "title": "Мясная Выпечка",
      "parentId": null,
      "items": [
        {
          "id": "item9-1",
          "name": "Сомса с мясом мини из говядины NEW",
          "price": 6500,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item9-3",
          "name": "Сомса с мясом из говядины NEW",
          "price": 400,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item9-4",
          "name": "Сомса с курицей мини NEW",
          "price": 5300,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item9-5",
          "name": "Сомса с курицей NEW",
          "price": 350,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item9-6",
          "name": "Пицца открытая",
          "price": 750,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213054897",
          "name": "Блинчик пустышка шт",
          "price": 250,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213055676",
          "name": "Блинчик с творогом шт",
          "price": 400,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213056424",
          "name": "Блинчик с мясом шт",
          "price": 600,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213057233",
          "name": "Балиш с пюре и сыром",
          "price": 550,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213057931",
          "name": "Мясная мини лепёшка с мясом",
          "price": 600,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213058657",
          "name": "Пицца закрытая",
          "price": 650,
          "modifier": "",
          "modifiers": []
        }
      ]
    },
    {
      "id": "cat10",
      "title": "Напитки",
      "parentId": null,
      "items": [
        {
          "id": "item10-1",
          "name": "Вода Bonaqua без газа 0,5",
          "price": 300,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item10-2",
          "name": "Вода Bonaqua с газа 0,5",
          "price": 300,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item10-3",
          "name": "Кола 0,5",
          "price": 500,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item10-4",
          "name": "Сок Piko апельсин",
          "price": 350,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item10-5",
          "name": "Спрайт 0,5",
          "price": 500,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item10-6",
          "name": "Фанта 0,5",
          "price": 500,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213063113",
          "name": "Боржоми (Алюм.бан. 0,33)",
          "price": 700,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213063847",
          "name": "Боржоми (Стекло 0,5)",
          "price": 900,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213064614",
          "name": "Боржоми пластик 0,5",
          "price": 750,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213065870",
          "name": "Боржоми стекло 0,33",
          "price": 800,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784223972771",
          "name": "Сок Piko мультифрукт",
          "price": 350,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784223973689",
          "name": "Сок Piko персик",
          "price": 350,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784223974607",
          "name": "Сок Piko яблочный",
          "price": 350,
          "modifier": "",
          "modifiers": []
        }
      ]
    },
    {
      "id": "cat11",
      "title": "Печенье",
      "parentId": null,
      "items": [
        {
          "id": "item11-1",
          "name": "Печенье \"Нутелла\"",
          "price": 1000,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item11-2",
          "name": "Печенье Палочки в упаковке",
          "price": 800,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item11-4",
          "name": "Печенье \"Браун\"",
          "price": 1000,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213072923",
          "name": "Классический бискотти",
          "price": 400,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213074369",
          "name": "Печенье \"Карамельное\"",
          "price": 1000,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213075074",
          "name": "Печенье \"Подушечки\" в мини упаковке",
          "price": 550,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213075762",
          "name": "Печенье \"Подушечки\" в упаковке",
          "price": 800,
          "modifier": "",
          "modifiers": []
        }
      ]
    },
    {
      "id": "cat12",
      "title": "Печенье Сеты в Пакете",
      "parentId": null,
      "items": [
        {
          "id": "item12-1",
          "name": "Шрек сет Б",
          "price": 1400,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item12-2",
          "name": "Сушки сет Б",
          "price": 1100,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item12-3",
          "name": "Печенье Бананчики в упаковке",
          "price": 1850,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item12-4",
          "name": "Овсянка сет Б",
          "price": 1400,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item12-6",
          "name": "Мазурки сет Б 0,2кг",
          "price": 1600,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213078929",
          "name": "Баунти сет Б",
          "price": 2500,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213080227",
          "name": "Бисконти сет Б",
          "price": 1500,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213081012",
          "name": "Кунжут сет Б",
          "price": 1600,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213081798",
          "name": "Лимон сет Б",
          "price": 1650,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213082537",
          "name": "Лочира сет Б",
          "price": 1300,
          "modifier": "",
          "modifiers": []
        }
      ]
    },
    {
      "id": "cat13",
      "title": "Пироги",
      "parentId": null,
      "items": [
        {
          "id": "item13-1",
          "name": "Вишнёво яблочный пирог",
          "price": 12000,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item13-2",
          "name": "Вишнёвый пирог",
          "price": 12800,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item13-3",
          "name": "Лимонная мозайка пирог",
          "price": 12000,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item13-4",
          "name": "Яблочный пирог",
          "price": 11200,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item13-5",
          "name": "Творожник пирог",
          "price": 12000,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item13-6",
          "name": "Творожная мозайка пирог",
          "price": 12000,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213089634",
          "name": "Бакинская пахлава прямоугольный",
          "price": 12800,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213091342",
          "name": "Мишка пирог",
          "price": 13600,
          "modifier": "",
          "modifiers": []
        }
      ]
    },
    {
      "id": "cat15",
      "title": "Пироженое мини",
      "parentId": null,
      "items": [
        {
          "id": "item15-1",
          "name": "Аморе мини пироженое",
          "price": 650,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item15-2",
          "name": "Апельсинка мини пироженое",
          "price": 650,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item15-3",
          "name": "Карамелька мини пироженое",
          "price": 650,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item15-4",
          "name": "Мини пироженое Сникерс",
          "price": 650,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item15-5",
          "name": "Три шоколада мини пироженое",
          "price": 650,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784224883564",
          "name": "Фламинго мини пироженое",
          "price": 650,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784224884364",
          "name": "Шокладный кекс мини",
          "price": 650,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784224885342",
          "name": "Экзот мини пироженое",
          "price": 650,
          "modifier": "",
          "modifiers": []
        }
      ]
    },
    {
      "id": "cat16",
      "title": "Пироженое",
      "parentId": null,
      "items": [
        {
          "id": "item16-1",
          "name": "Пирожное Вафельное",
          "price": 1450,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item16-2",
          "name": "Пирог Малиново - фруктовый",
          "price": 700,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item16-3",
          "name": "Медовый стакан",
          "price": 1650,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213098840",
          "name": "Берри кейк пирожное",
          "price": 1650,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213099616",
          "name": "Пирожное Фисташка - Клубника",
          "price": 1950,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213100666",
          "name": "Пирожное Фисташково - Малиновое",
          "price": 1950,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213101480",
          "name": "Пирожное Фундучно - яблочное",
          "price": 1950,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213102243",
          "name": "Сникерс пирожное",
          "price": 1600,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213103051",
          "name": "Сникерс рулет кусок",
          "price": 1850,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213103743",
          "name": "Тирамису пирожное",
          "price": 1400,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213105074",
          "name": "Ягодная опера пирожное",
          "price": 1600,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213105969",
          "name": "Ягодный лабне пирожное",
          "price": 1450,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213106752",
          "name": "Брауни пирожное",
          "price": 1450,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213108600",
          "name": "Винни детское пирожное",
          "price": 1700,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213109359",
          "name": "Детское пирожное Мишка",
          "price": 1700,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213110088",
          "name": "Джульетта рулет кусок",
          "price": 1800,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213110809",
          "name": "Ириска рулет кусок",
          "price": 1800,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213111795",
          "name": "Пирожное Меренговый",
          "price": 1300,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213112509",
          "name": "Пирожное Меренговый с фисташкой",
          "price": 1550,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213113293",
          "name": "Пирожное Три шоколада",
          "price": 1700,
          "modifier": "",
          "modifiers": []
        }
      ]
    },
    {
      "id": "cat17",
      "title": "Полуфабрикаты",
      "parentId": null,
      "items": [
        {
          "id": "item17-1",
          "name": "Тесто слоёное для самсы",
          "price": 1300,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item17-2",
          "name": "Тесто слоёное для катламы",
          "price": 1300,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item17-3",
          "name": "Сырники",
          "price": 1450,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item17-4",
          "name": "Пельмени цветные с мясом говядины",
          "price": 2800,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item17-5",
          "name": "Пельмени с мясом говядины",
          "price": 2400,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item17-6",
          "name": "Пельмени с мясом баранины",
          "price": 2400,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213119301",
          "name": "Вареники с картошкой",
          "price": 900,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213120097",
          "name": "Голубцы с капустой",
          "price": 2200,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213121240",
          "name": "Долма с говядиной",
          "price": 2700,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213122185",
          "name": "Нагетсы (12 шт) Кз",
          "price": 1500,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213123117",
          "name": "Чебуреки с мясом",
          "price": 1500,
          "modifier": "",
          "modifiers": []
        }
      ]
    },
    {
      "id": "cat18",
      "title": "ПП Новинка",
      "parentId": null,
      "items": [
        {
          "id": "item18-1",
          "name": "Ореховый батончик энергетический",
          "price": 850,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item18-6",
          "name": "ПП Шоколад для Сан-Себастьян",
          "price": 450,
          "modifier": "",
          "modifiers": []
        }
      ]
    },
    {
      "id": "cat19",
      "title": "Прочее",
      "parentId": null,
      "items": [
        {
          "id": "item19-1",
          "name": "Крошка",
          "price": 0,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item19-2",
          "name": "Пакет премиум 0,5",
          "price": 900,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item19-3",
          "name": "Пакет премиум большой",
          "price": 1100,
          "modifier": "",
          "modifiers": []
        }
      ]
    },
    {
      "id": "cat20",
      "title": "Прямоугольные Торты",
      "parentId": null,
      "items": [
        {
          "id": "item20-1",
          "name": "Маркиза Торт",
          "price": 18000,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item20-2",
          "name": "Малинка Торт",
          "price": 14400,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item20-3",
          "name": "Лимонный New Торт",
          "price": 18000,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item20-4",
          "name": "Карамельный медовый прямоуг Торт",
          "price": 15200,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item20-5",
          "name": "Итальяно Торт",
          "price": 14400,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item20-6",
          "name": "Дари Торт",
          "price": 16000,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213157847",
          "name": "Афганка New торт",
          "price": 15200,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213159930",
          "name": "Фруктовый торт прямоуг",
          "price": 17200,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213161367",
          "name": "Черный принц Торт прямоуг",
          "price": 19600,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213162204",
          "name": "Шок банан Торт прямоуг",
          "price": 19200,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213163011",
          "name": "Шок медовый Торт",
          "price": 15200,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213163741",
          "name": "Якобс Торт",
          "price": 19200,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213166135",
          "name": "Махровый прямоуг Торт",
          "price": 11600,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213166851",
          "name": "Микадо Торт прямоуг",
          "price": 18000,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213167642",
          "name": "Милано Торт",
          "price": 18000,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213168454",
          "name": "Наполеон Торт",
          "price": 12800,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213169291",
          "name": "Ореховый медовый New Торт",
          "price": 15200,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213170078",
          "name": "Саксония Торт",
          "price": 16000,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213170786",
          "name": "Сникерс Торт прямоуг",
          "price": 19600,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213172360",
          "name": "Творожно бисквитный Торт",
          "price": 15200,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213175065",
          "name": "Торт Наполеон шоколадный",
          "price": 14800,
          "modifier": "",
          "modifiers": []
        }
      ]
    },
    {
      "id": "cat21",
      "title": "Свечки",
      "parentId": null,
      "items": [
        {
          "id": "item1784213180299",
          "name": "Свечка длинная цветная 6шт",
          "price": 750,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213181067",
          "name": "Фейерверк мал.",
          "price": 160,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213181769",
          "name": "Цифра Грани №4",
          "price": 400,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213182516",
          "name": "Цифра Золотой №5",
          "price": 350,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213183219",
          "name": "Цифра Золотой №9",
          "price": 350,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213183887",
          "name": "Цифра с Короной №0",
          "price": 500,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213185111",
          "name": "Цифра с Короной №1",
          "price": 500,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213185856",
          "name": "Цифра с Короной №2",
          "price": 500,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213186760",
          "name": "Цифра с Короной №3",
          "price": 500,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213187545",
          "name": "Свечи набор 6шт",
          "price": 470,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213188281",
          "name": "Свечи спираль 12шт",
          "price": 680,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213189175",
          "name": "Свечка Радуга",
          "price": 500,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213190062",
          "name": "Свечка Фейерверк",
          "price": 1000,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213190782",
          "name": "Свечки бенто",
          "price": 700,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213191500",
          "name": "Свечки набор 10шт",
          "price": 700,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213192240",
          "name": "Свечки СДР (буквы)",
          "price": 1000,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213192944",
          "name": "Свечки спираль 6шт",
          "price": 750,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213193656",
          "name": "Свечки цветные кручённые 8шт",
          "price": 470,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213194404",
          "name": "Топпер",
          "price": 800,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213195195",
          "name": "Фейерверк сред.",
          "price": 210,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213196119",
          "name": "Фейерверк больш.",
          "price": 260,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213198279",
          "name": "Хлопушка мал.",
          "price": 1310,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213198981",
          "name": "Хлопушки средние",
          "price": 2200,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213199714",
          "name": "Цифра Грани №0",
          "price": 400,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213200425",
          "name": "Цифра Грани №1",
          "price": 400,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213201249",
          "name": "Цифра Грани №2",
          "price": 400,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213202587",
          "name": "Цифра Грани №3",
          "price": 400,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213203540",
          "name": "Цифра Грани №5",
          "price": 400,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213204330",
          "name": "Цифра Грани №6",
          "price": 400,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213205228",
          "name": "Цифра Грани №7",
          "price": 400,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213205903",
          "name": "Цифра Грани №8",
          "price": 400,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213206735",
          "name": "Цифра Грани №9",
          "price": 0,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213207414",
          "name": "Цифра Золотой №0",
          "price": 350,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213208081",
          "name": "Цифра Золотой №1",
          "price": 350,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213208818",
          "name": "Цифра Золотой №2",
          "price": 350,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213210027",
          "name": "Цифра Золотой №3",
          "price": 350,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213210905",
          "name": "Цифра Золотой №4",
          "price": 350,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213211634",
          "name": "Цифра Золотой №6",
          "price": 350,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213212591",
          "name": "Цифра Золотой №7",
          "price": 350,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213213339",
          "name": "Цифра Золотой №8",
          "price": 350,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784227425494",
          "name": "Цифра с Короной №4",
          "price": 500,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784227426321",
          "name": "Цифра Цветная №5",
          "price": 450,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784227427294",
          "name": "Цифра Цветная №4",
          "price": 450,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784227428222",
          "name": "Цифра Цветная №6",
          "price": 450,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784227428999",
          "name": "Цифра Цветная №7",
          "price": 450,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784227429775",
          "name": "Цифра Цветная №8",
          "price": 450,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784227430535",
          "name": "Цифра Цветная №9",
          "price": 450,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784227432987",
          "name": "Цифра с Короной №5",
          "price": 500,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784227433771",
          "name": "Цифра с Короной №6",
          "price": 500,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784227434544",
          "name": "Цифра с Короной №7",
          "price": 500,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784227435318",
          "name": "Цифра с Короной №8",
          "price": 500,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784227436077",
          "name": "Цифра с Короной №9",
          "price": 500,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784227437058",
          "name": "Цифра Цветная №0",
          "price": 450,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784227437884",
          "name": "Цифра Цветная №1",
          "price": 450,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784227438841",
          "name": "Цифра Цветная №2",
          "price": 450,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784227439960",
          "name": "Цифра Цветная №3",
          "price": 450,
          "modifier": "",
          "modifiers": []
        }
      ]
    },
    {
      "id": "cat22",
      "title": "Сдоба",
      "parentId": null,
      "items": [
        {
          "id": "item22-1",
          "name": "Расстегай с яйцом",
          "price": 400,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213217649",
          "name": "Булочка с абрикосом и миндалём",
          "price": 600,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213218284",
          "name": "Булочка с яблоком",
          "price": 450,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213218941",
          "name": "Булочка со сгущенкой",
          "price": 550,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213219613",
          "name": "Булочка творожный банан",
          "price": 600,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213220242",
          "name": "Ватрушки",
          "price": 450,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213220940",
          "name": "Конверт",
          "price": 450,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213221785",
          "name": "Расстегай с капустой",
          "price": 350,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213222460",
          "name": "Расстегай с картошкой",
          "price": 350,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213223126",
          "name": "Расстегай с мясом",
          "price": 550,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213223821",
          "name": "Булочка с вишней",
          "price": 550,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213224501",
          "name": "Булочка с маком",
          "price": 550,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213225367",
          "name": "Булочка с малиной",
          "price": 600,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213226104",
          "name": "Булочка с орехом",
          "price": 600,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213226923",
          "name": "Булочка с сосиской",
          "price": 450,
          "modifier": "",
          "modifiers": []
        }
      ]
    },
    {
      "id": "cat23",
      "title": "Сеты Сафия",
      "parentId": null,
      "items": [
        {
          "id": "item1784213293560",
          "name": "Баунти мини печенье сет",
          "price": 1000,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213294292",
          "name": "Луна печенье Сет 0,5",
          "price": 2200,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213294992",
          "name": "Рогалики с вишней Сет 0,5",
          "price": 2900,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213295678",
          "name": "Шок палочка болльшой сет",
          "price": 2900,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213296361",
          "name": "Шок палочка мини сет",
          "price": 1500,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213299521",
          "name": "Буше Ассорти КЗ",
          "price": 3800,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213300122",
          "name": "Буше молочный мини сет",
          "price": 2000,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213300843",
          "name": "Буше шоколадный мини сет",
          "price": 2000,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213301483",
          "name": "Гречневые хлебцы сет (200гр)",
          "price": 1600,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213302133",
          "name": "Гриссини",
          "price": 600,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213302767",
          "name": "Кета печенье Сет",
          "price": 1900,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213303362",
          "name": "Кукес сет Б",
          "price": 1100,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213303953",
          "name": "Курабье печенье Сет 0,25",
          "price": 1450,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213304673",
          "name": "Лочира мини сет",
          "price": 600,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213305252",
          "name": "Луна печенье Сет 0,25",
          "price": 1200,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213305975",
          "name": "Маленький эклер большой сет",
          "price": 2500,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213306585",
          "name": "Маленький эклер мини сет",
          "price": 1300,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213307239",
          "name": "Мармелад сет",
          "price": 1400,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213308009",
          "name": "Мини трубочка большой сет",
          "price": 2500,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213309130",
          "name": "Мини трубочка мини сет",
          "price": 1300,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213309845",
          "name": "Овсянка мини печенье сет",
          "price": 700,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213310482",
          "name": "Ракушки печенье Сет 0,2",
          "price": 1500,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213311115",
          "name": "Ракушки печенье Сет 0,5",
          "price": 2900,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213311736",
          "name": "Рисовые хлебцы сет (200гр)",
          "price": 1600,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213313532",
          "name": "Рогалики с вишней Сет 0,2",
          "price": 1500,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213314473",
          "name": "Рогалики с орехом Сет",
          "price": 1900,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213315105",
          "name": "Рогалики со сгущенкой Сет 0,2",
          "price": 1350,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213315746",
          "name": "Рогалики со сгущенкой Сет 0,5",
          "price": 2600,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213316371",
          "name": "Сушки мини сет",
          "price": 600,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213317054",
          "name": "Турецкая пахлава мини сет",
          "price": 1750,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213317845",
          "name": "Турецкий чак чак сет",
          "price": 2900,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213318500",
          "name": "Цветной эклер большой сет",
          "price": 3900,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213319110",
          "name": "Цветной эклер мини сет",
          "price": 2000,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213320421",
          "name": "Чак чак коробка туграма",
          "price": 2500,
          "modifier": "",
          "modifiers": []
        }
      ]
    },
    {
      "id": "cat24",
      "title": "Слойка",
      "parentId": null,
      "items": [
        {
          "id": "item24-1",
          "name": "Хачапури с сыром",
          "price": 700,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item24-2",
          "name": "Шоколадный Паин",
          "price": 1200,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item24-5",
          "name": "Хачапури с колбасой",
          "price": 700,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item24-6",
          "name": "Слойка с сосиской",
          "price": 750,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213328589",
          "name": "Косички с маком",
          "price": 600,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213329503",
          "name": "Косички с орехом",
          "price": 600,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213330203",
          "name": "Круассан Классический",
          "price": 900,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213330918",
          "name": "Круассан Миндальный",
          "price": 1350,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213331559",
          "name": "Круассан Фисташковый",
          "price": 1850,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213332808",
          "name": "Круассан Шоколадный",
          "price": 1150,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213333954",
          "name": "Круассан Ягодный",
          "price": 1250,
          "modifier": "",
          "modifiers": []
        }
      ]
    },
    {
      "id": "cat25",
      "title": "Спец. Заказ",
      "parentId": null,
      "items": [
        {
          "id": "item25-1",
          "name": "Мастика №1 спец",
          "price": 2600,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784308947261",
          "name": "Фото Принт 55 спец",
          "price": 3000,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784308949355",
          "name": "Фото Принт 45 спец",
          "price": 2500,
          "modifier": "",
          "modifiers": []
        }
      ]
    },
    {
      "id": "cat26",
      "title": "Тарт",
      "parentId": null,
      "items": [
        {
          "id": "item26-1",
          "name": "Вишенка тарт",
          "price": 5900,
          "modifier": "",
          "modifiers": []
        }
      ]
    },
    {
      "id": "cat27",
      "title": "Тарталетки",
      "parentId": null,
      "items": [
        {
          "id": "item27-1",
          "name": "Блэк форест тарталетка",
          "price": 1300,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item27-3",
          "name": "Шок мини тарталетка",
          "price": 400,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item27-4",
          "name": "Тарталетки большие пирожное",
          "price": 600,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item27-5",
          "name": "Мини тарталетки",
          "price": 400,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item27-6",
          "name": "Вольтер мини",
          "price": 450,
          "modifier": "",
          "modifiers": []
        }
      ]
    },
    {
      "id": "cat28",
      "title": "Чак-Чак и Штучные",
      "parentId": null,
      "items": [
        {
          "id": "item28-1",
          "name": "Муравейник",
          "price": 300,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item28-2",
          "name": "Орешки упаковка",
          "price": 3000,
          "modifier": "",
          "modifiers": []
        }
      ]
    },
    {
      "id": "cat29",
      "title": "Чизкейк",
      "parentId": null,
      "items": [
        {
          "id": "item29-1",
          "name": "Экзотик чизкейк",
          "price": 1750,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item29-2",
          "name": "Шок Сан-Себастьян",
          "price": 350,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item29-3",
          "name": "Сан-Себастьян чизкейк",
          "price": 1750,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item29-4",
          "name": "Сан-Себастьян Тирамису",
          "price": 1750,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item29-5",
          "name": "Сан Себастьян Шоколадный",
          "price": 1750,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item29-6",
          "name": "Орео чизкейк",
          "price": 1750,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213371156",
          "name": "Лотус чизкейк",
          "price": 1750,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213372025",
          "name": "Медовый чизкейк",
          "price": 1750,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item1784213372881",
          "name": "Нью Йорк чизкейк",
          "price": 1750,
          "modifier": "",
          "modifiers": []
        }
      ]
    },
    {
      "id": "cat30",
      "title": "Штучные Эклеры",
      "parentId": null,
      "items": [
        {
          "id": "item30-1",
          "name": "Эклер Ванильный с Малиной",
          "price": 900,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item30-2",
          "name": "Эклер Лотус - Карамель",
          "price": 1100,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item30-3",
          "name": "Эклер Рафаелло",
          "price": 1200,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item30-4",
          "name": "Эклер Тирамису",
          "price": 1100,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item30-5",
          "name": "Эклер Фисташка - вишня",
          "price": 1100,
          "modifier": "",
          "modifiers": []
        },
        {
          "id": "item30-6",
          "name": "Эклер Шоколад - Нутелла",
          "price": 1100,
          "modifier": "",
          "modifiers": []
        }
      ]
    }
  ],
  "items": []
};

const catalogStorageKey = 'iikoCloneCatalog';
const adminModeStorageKey = 'iikoAdminMode';
const adminTokenStorageKey = 'iikoAdminToken';
const adminPassword = '8956';
const receiptStorageKey = 'iikoCloneReceipts';
const adminToken = 'iiko-admin-token';

let categories = [];
let itemsCatalog = [];
const isAndroidCapacitor = typeof window !== 'undefined' && /Android/i.test(window.navigator?.userAgent || '');
// GitHub raw URL is intentionally excluded here: browser CORS blocks it on Render,
// and the app API is the canonical source for catalog editing.
const githubCatalogUrl = '';
const locationOrigin = (typeof window !== 'undefined' && window.location && window.location.origin && window.location.origin !== 'null')
  ? window.location.origin
  : '';
const defaultRemoteCatalogUrl = locationOrigin
  ? `${locationOrigin}/api/catalog`
  : 'http://localhost:3000/api/catalog';
const androidFallbackCatalogUrl = 'http://10.0.2.2:3000/api/catalog';
const configuredRemoteCatalogUrl = (typeof window !== 'undefined' && window.__REMOTE_CATALOG_URL__) ? String(window.__REMOTE_CATALOG_URL__).trim() : '';
const remoteCatalogUrl = configuredRemoteCatalogUrl && !/(your-render-app|your-server|your-user|example\.com)/i.test(configuredRemoteCatalogUrl)
  ? configuredRemoteCatalogUrl
  : (isAndroidCapacitor ? androidFallbackCatalogUrl : defaultRemoteCatalogUrl);
const configuredApiBaseUrl = (typeof window !== 'undefined' && window.__API_BASE_URL__) ? String(window.__API_BASE_URL__).replace(/\/$/, '') : '';
const apiBaseUrl = configuredApiBaseUrl && !/(your-render-app|your-server|your-user|example\.com)/i.test(configuredApiBaseUrl)
  ? configuredApiBaseUrl
  : (typeof window !== 'undefined' && locationOrigin ? locationOrigin.replace(/\/$/, '') : 'https://iiko-clone-1.onrender.com');
const adminModeFlag = (typeof window !== 'undefined' && window.location) ? new URLSearchParams(window.location.search).get('admin') === '1' : false;
const storedAdminMode = (typeof window !== 'undefined' && window.localStorage) ? window.localStorage.getItem(adminModeStorageKey) === 'true' : false;
let isAdminMode = adminModeFlag || storedAdminMode;
if (isAdminMode && typeof window !== 'undefined' && window.localStorage) {
  window.localStorage.setItem(adminModeStorageKey, 'true');
  window.localStorage.setItem(adminTokenStorageKey, adminToken);
}
let catalogSyncing = false;
let pendingCatalogSave = false;
let pendingSearchRender = false;
let pendingRenderFrame = false;
const menuDataCache = new Map();

function persistCatalogLocally() {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    window.localStorage.setItem(catalogStorageKey, JSON.stringify({ categories }));
  } catch (error) {
    console.warn('Failed to persist catalog locally', error);
  }
}

function clearCatalogLocalCache() {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    window.localStorage.removeItem(catalogStorageKey);
  } catch (error) {
    console.warn('Failed to clear catalog cache', error);
  }
}

function hasMeaningfulCatalogCategories(catalogCategories) {
  if (!Array.isArray(catalogCategories) || !catalogCategories.length) {
    return false;
  }

  return catalogCategories.some(category => {
    const title = String(category?.title || '').trim();
    const hasItems = Array.isArray(category?.items) && category.items.length > 0;
    const isRootFallback = /^(root|товары без папки)$/i.test(title);
    return hasItems || (!isRootFallback && title);
  });
}

async function initializeCatalog() {
  console.log('>>> initializeCatalog() starting');
  clearCatalogLocalCache();
  categories = fallbackCatalog.categories.map(category => ({ ...category, items: [...(category.items || [])] }));
  console.log('Loaded fallback catalog with', categories.length, 'categories');
  rebuildItemsCatalog();
  await loadCatalogFromServer();
  console.log('initializeCatalog() completed, categories now:', categories.length);
}

function rebuildItemsCatalog() {
  itemsCatalog = categories.flatMap(category => category.items.map(item => ({
    ...item,
    categoryId: category.id,
    categoryTitle: category.title
  })));
  menuDataCache.clear();
}

function isUsableCatalogPayload(payload) {
  if (!payload || !Array.isArray(payload.categories) || !payload.categories.length) {
    return false;
  }

  return payload.categories.some(category => {
    const title = String(category?.title || '').trim();
    const hasItems = Array.isArray(category?.items) && category.items.length > 0;
    const isRootFallback = /^(root|товары без папки)$/i.test(title);
    return hasItems || (!isRootFallback && title);
  });
}

async function loadCatalogFromServer() {
  console.log('>>> loadCatalogFromServer() starting');
  const catalogSources = [];
  if (remoteCatalogUrl) {
    catalogSources.push(remoteCatalogUrl);
  }
  if (apiBaseUrl) {
    catalogSources.push(`${apiBaseUrl}/api/catalog`);
  }
  // GitHub raw fetch is intentionally disabled to avoid blocked cross-origin requests.
  // The app server provides the same catalog data through /api/catalog.
  if (!catalogSources.length) {
    console.log('No catalog sources configured');
    return;
  }

  console.log('Trying catalog sources:', catalogSources);
  for (const sourceUrl of catalogSources) {
    try {
      const response = await fetch(sourceUrl, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      if (!response.ok) {
        console.log('Source returned status:', response.status, 'skipping', sourceUrl);
        continue;
      }
      const payload = await response.json();
      console.log('Fetched from', sourceUrl, '- received', payload.categories?.length, 'categories');
      if (isUsableCatalogPayload(payload)) {
        categories = payload.categories.map(category => ({ ...category, items: [...(category.items || [])] }));
        console.log('Catalog from', sourceUrl, 'is usable - loaded', categories.length, 'categories');
        rebuildItemsCatalog();
        persistCatalogLocally();
        renderAfterStateChange();
        return;
      }
    } catch (error) {
      console.warn('Failed to load catalog from', sourceUrl, error);
    }
  }

  if (!hasMeaningfulCatalogCategories(categories)) {
    console.log('Using fallback catalog');
    categories = fallbackCatalog.categories.map(category => ({ ...category, items: [...(category.items || [])] }));
  }
  rebuildItemsCatalog();
  persistCatalogLocally();
  renderAfterStateChange();
}

async function saveCatalogToServer() {
  if (catalogSyncing) {
    pendingCatalogSave = true;
    return;
  }
  catalogSyncing = true;
  try {
    const response = await fetch(`${apiBaseUrl}/api/catalog`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': localStorage.getItem('iikoAdminToken') || 'iiko-admin-token'
      },
      body: JSON.stringify({ categories })
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMsg = errorData.error || `Failed to save catalog (${response.status})`;
      throw new Error(errorMsg);
    }
    persistCatalogLocally();
    if (pendingCatalogSave) {
      pendingCatalogSave = false;
      await saveCatalogToServer();
    }
  } catch (error) {
    console.error('Failed to sync catalog to server', error);
    alert(`Ошибка сохранения меню: ${error.message}`);
  } finally {
    catalogSyncing = false;
  }
}

async function syncItemToServer(item) {
  if (!isAdminMode) return;
  try {
    const response = await fetch(`${apiBaseUrl}/api/items/${item.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': localStorage.getItem('iikoAdminToken') || 'iiko-admin-token'
      },
      body: JSON.stringify(item)
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMsg = errorData.error || `Failed to save item (${response.status})`;
      throw new Error(errorMsg);
    }
    persistCatalogLocally();
  } catch (error) {
    console.error('Failed to sync item to server', error);
    alert(`Ошибка сохранения товара: ${error.message}`);
  }
}

async function syncCategoryToServer(category) {
  if (!isAdminMode) return;
  try {
    const response = await fetch(`${apiBaseUrl}/api/categories/${category.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': localStorage.getItem('iikoAdminToken') || 'iiko-admin-token'
      },
      body: JSON.stringify({ title: category.title })
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMsg = errorData.error || `Failed to save category (${response.status})`;
      throw new Error(errorMsg);
    }
    persistCatalogLocally();
  } catch (error) {
    console.error('Failed to sync category to server', error);
    alert(`Ошибка сохранения категории: ${error.message}`);
  }
}

initializeCatalog();

const storageKey = receiptStorageKey;
let currentCategoryId = categories[0].id;
let activePage = 'create';
let selectedPayment = '';
let selectedItems = {};
let activeSelectedItemId = null;
let paymentDraft = [];
let activePaymentTypeId = paymentTypes[0]?.id || '';
let savedReceipts = [];
let historyFilter = 'all';
let isMenuEditing = false;

// Multiple receipts management
let receipts = [{ id: 1, items: {}, payments: [] }];
let activeReceiptId = 1;
let receiptCounter = 1;

let menuState = {
  view: 'folders',
  categoryId: null,
  searchQuery: '',
  history: []
};

const elements = {
  tabCreate: document.getElementById('tab-create'),
  tabHistory: document.getElementById('tab-history'),
  brandToggle: document.getElementById('brand-toggle'),
  pageCreate: document.getElementById('page-create'),
  pageHistory: document.getElementById('page-history'),
  folderList: document.getElementById('folder-list'),
  paymentType: document.getElementById('payment-type'),
  selectedList: document.getElementById('selected-list'),
  totalPrice: document.getElementById('total-price'),
  selectedActions: document.getElementById('selected-actions'),
  safiaToolbarActions: document.getElementById('safia-toolbar-actions'),
  quantityModal: document.getElementById('quantity-modal'),
  saveButton: document.getElementById('save-button'),
  receiptTabs: document.getElementById('receipt-tabs'),
  prevReceipt: document.getElementById('prev-receipt'),
  nextReceipt: document.getElementById('next-receipt'),
  addReceipt: document.getElementById('add-receipt'),
  deleteReceipt: document.getElementById('delete-receipt'),
  receiptNumber: document.getElementById('receipt-number'),
  receiptCount: document.getElementById('receipt-count'),
  backButton: document.getElementById('back-button'),
  searchButton: document.getElementById('search-button'),
  homeButton: document.getElementById('home-button'),
  menuEditToggle: document.getElementById('menu-edit-toggle'),
  menuEditAddButton: document.getElementById('menu-edit-add-button'),
  menuEditSaveButton: document.getElementById('menu-edit-save-button'),
  menuAddPopover: document.getElementById('menu-add-popover'),
  menuAddFolderButton: document.getElementById('menu-add-folder'),
  menuAddItemButton: document.getElementById('menu-add-item'),
  menuTitle: document.getElementById('menu-title'),
  menuPaginationZone: document.getElementById('menu-pagination-zone'),
  menuSearchPanel: document.getElementById('menu-search-panel'),
  menuSearchInput: document.getElementById('menu-search-input'),
  receiptList: document.getElementById('receipt-list'),
  clearReceiptsButton: document.getElementById('clear-receipts-button'),
  filterButtons: Array.from(document.querySelectorAll('.filter-button')),
  sumKaspi: document.getElementById('sum-kaspi'),
  sumHalyk: document.getElementById('sum-halyk'),
  sumNalichka: document.getElementById('sum-nalichka'),
  sumTotal: document.getElementById('sum-total')
};

function formatPrice(value) {
  return `${value.toLocaleString('ru-RU')} ₸`;
}

function compareByName(a, b) {
  const aValue = String(a.name || a.title || '');
  const bValue = String(b.name || b.title || '');
  const aGroup = /^[A-Za-z]/.test(aValue) ? 0 : 1;
  const bGroup = /^[A-Za-z]/.test(bValue) ? 0 : 1;
  if (aGroup !== bGroup) {
    return aGroup - bGroup;
  }
  return aValue.localeCompare(bValue, 'ru', { sensitivity: 'base' });
}

function toggleItemPriceVisibility() {
  const isVisible = document.body.classList.toggle('show-item-prices');
  if (elements.brandToggle) {
    elements.brandToggle.setAttribute('aria-pressed', String(isVisible));
    elements.brandToggle.title = isVisible ? 'Скрыть цены' : 'Показать цены';
  }
}

function isSafiaBarContext(category, item) {
  // Resolve starting category: prefer provided, fall back to item's categoryId
  let cat = category || null;
  if (!cat && item?.categoryId) {
    cat = categories.find(c => c.id === item.categoryId) || null;
  }

  // Walk up the parent chain to see if any ancestor has title 'Safia БАР'
  while (cat) {
    if (String(cat.title).trim() === 'Safia БАР') return true;
    cat = categories.find(c => c.id === cat.parentId) || null;
  }

  // As a last resort, check item's categoryTitle if present
  if (String(item?.categoryTitle || '').trim() === 'Safia БАР') return true;
  return false;
}

function getItemModifiers(item, category) {
  if (!isSafiaBarContext(category, item)) {
    return [];
  }
  if (Array.isArray(item?.modifiers)) {
    return item.modifiers.filter(Boolean);
  }
  if (typeof item?.modifier === 'string' && item.modifier.trim()) {
    return [item.modifier.trim()];
  }
  return [];
}

function sortModifiers(modifiers) {
  return [...modifiers]
    .filter(value => typeof value === 'string' && value.trim())
    .map(value => value.trim())
    .sort((a, b) => a.localeCompare(b, 'ru', { sensitivity: 'base' }));
}

function openModifierSelectionModal(item, category) {
  const modifiers = sortModifiers(getItemModifiers(item, category));
  if (!modifiers.length) {
    addItem(item, category, '');
    return;
  }

  elements.quantityModal.innerHTML = '';
  const content = document.createElement('div');
  content.className = 'qty-modal-content comment-modal-content';

  const title = document.createElement('h3');
  title.textContent = 'Выберите модификатор';
  content.appendChild(title);

  const list = document.createElement('div');
  list.className = 'modifier-picker-list';
  modifiers.forEach(modifier => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'modifier-picker-button';
    button.textContent = modifier;
    button.addEventListener('click', () => {
      addItem(item, category, modifier);
      elements.quantityModal.classList.add('hidden');
    });
    list.appendChild(button);
  });

  const actions = document.createElement('div');
  actions.className = 'qty-modal-actions';

  const cancelButton = document.createElement('button');
  cancelButton.type = 'button';
  cancelButton.textContent = 'Отмена';
  cancelButton.addEventListener('click', () => {
    elements.quantityModal.classList.add('hidden');
  });
  actions.appendChild(cancelButton);

  content.appendChild(list);
  content.appendChild(actions);
  elements.quantityModal.appendChild(content);
  elements.quantityModal.classList.remove('hidden');
}

function applyColumnLayout(container, count) {
  let columns = 1;
  if (count >= 5 && count <= 8) {
    columns = 2;
  } else if (count > 8) {
    columns = Math.max(1, Math.min(4, Math.ceil(count / 8)));
  }

  container.style.gridTemplateColumns = `repeat(${columns}, minmax(0, 1fr))`;
  container.style.gridTemplateRows = count >= 5 && count <= 8 ? 'repeat(4, auto)' : 'repeat(8, auto)';
  container.style.gridAutoFlow = 'column';
}

function getActiveReceipt() {
  return receipts.find(r => r.id === activeReceiptId) || receipts[0];
}

function createNewReceipt() {
  receiptCounter += 1;
  const newReceipt = { id: receiptCounter, items: {}, payments: [] };
  receipts.push(newReceipt);
  switchReceipt(receiptCounter);
}

function switchReceipt(receiptId) {
  const receipt = receipts.find(r => r.id === receiptId);
  if (!receipt) return;
  
  // Save current receipt state
  const currentReceipt = getActiveReceipt();
  currentReceipt.items = selectedItems;
  currentReceipt.payments = paymentDraft;
  
  // Switch to new receipt
  activeReceiptId = receiptId;
  selectedItems = receipt.items;
  paymentDraft = receipt.payments;
  activePaymentTypeId = paymentTypes[0]?.id || '';
  activeSelectedItemId = null;
  
  renderReceiptTabs();
  renderSelectedItems();
  renderPaymentActions();
}

function renderReceiptTabs() {
  const currentIndex = receipts.findIndex(r => r.id === activeReceiptId);
  const totalCount = receipts.length;
  
  // Update display
  elements.receiptNumber.textContent = currentIndex + 1;
  elements.receiptCount.textContent = totalCount;
  
  // Disable/enable navigation buttons
  elements.prevReceipt.disabled = currentIndex === 0 || totalCount === 1;
  elements.nextReceipt.disabled = currentIndex === totalCount - 1 || totalCount === 1;
  
  // Hide nav buttons if only one receipt
  elements.prevReceipt.style.display = totalCount > 1 ? 'flex' : 'none';
  elements.nextReceipt.style.display = totalCount > 1 ? 'flex' : 'none';
}

function prevReceipt() {
  const currentIndex = receipts.findIndex(r => r.id === activeReceiptId);
  if (currentIndex > 0) {
    switchReceipt(receipts[currentIndex - 1].id);
  }
}

function nextReceipt() {
  const currentIndex = receipts.findIndex(r => r.id === activeReceiptId);
  if (currentIndex < receipts.length - 1) {
    switchReceipt(receipts[currentIndex + 1].id);
  }
}

function loadReceipts() {
  const stored = localStorage.getItem(storageKey);
  savedReceipts = stored ? JSON.parse(stored) : [];
}

function saveReceipts() {
  localStorage.setItem(storageKey, JSON.stringify(savedReceipts));
}

function getCurrentCategory() {
  return categories.find(category => category.id === menuState.categoryId) || null;
}

function setMenuEditing(value) {
  isMenuEditing = value;
  if (!value) {
    elements.menuAddPopover.classList.add('hidden');
  }
  if (elements.menuEditToggle) {
    elements.menuEditToggle.classList.toggle('active', value);
  }
  if (elements.menuEditAddButton) {
    elements.menuEditAddButton.classList.toggle('hidden', !value);
  }
  if (elements.menuEditSaveButton) {
    elements.menuEditSaveButton.classList.toggle('hidden', !value);
  }
  renderAfterStateChange();
}

function toggleMenuEditing() {
  setMenuEditing(!isMenuEditing);
}

async function saveMenuChanges() {
  if (!isAdminMode) return;
  await saveCatalogToServer();
  if (typeof window !== 'undefined') {
    window.alert('Изменения сохранены');
  }
}

function activateAdminMode() {
  if (!isAdminMode) {
    const enteredPassword = typeof window !== 'undefined' ? window.prompt('Введите пароль администратора') : null;
    if (enteredPassword !== adminPassword) {
      if (typeof window !== 'undefined') {
        window.alert('Неверный пароль администратора');
      }
      return false;
    }
  }

  isAdminMode = true;
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.setItem(adminModeStorageKey, 'true');
    window.localStorage.setItem(adminTokenStorageKey, adminToken);
  }
  if (elements.menuEditToggle) {
    elements.menuEditToggle.classList.add('active');
  }
  if (elements.menuEditAddButton) {
    elements.menuEditAddButton.classList.remove('hidden');
  }
  if (elements.menuEditSaveButton) {
    elements.menuEditSaveButton.classList.remove('hidden');
  }
  setMenuEditing(true);
  return true;
}

function getNextCategoryTitle(parentId = null) {
  const existingTitles = categories.filter(category => category.parentId === parentId).map(category => category.title);
  let index = 1;
  let title = `New Папка ${index}`;
  while (existingTitles.includes(title)) {
    index += 1;
    title = `New Папка ${index}`;
  }
  return title;
}

function getNextItemName(category) {
  const existingNames = (category?.items || []).map(item => item.name);
  let index = 1;
  let title = `New Товар ${index}`;
  while (existingNames.includes(title)) {
    index += 1;
    title = `New Товар ${index}`;
  }
  return title;
}

function addMenuEntry(type) {
  if (!isAdminMode) return;
  elements.menuAddPopover.classList.add('hidden');

  if (type === 'folder') {
    const parentCategory = getCurrentCategory();
    const newCategory = {
      id: `cat${Date.now()}`,
      title: getNextCategoryTitle(parentCategory?.id || null),
      parentId: parentCategory?.id || null,
      items: []
    };
    categories.unshift(newCategory);
    persistCatalogLocally();
    saveCatalogToServer();
    if (parentCategory) {
      menuState = {
        view: 'items',
        categoryId: parentCategory.id,
        searchQuery: '',
        history: []
      };
    } else {
      menuState = {
        view: 'folders',
        categoryId: null,
        searchQuery: '',
        history: []
      };
    }
    rebuildItemsCatalog();
    renderAfterStateChange();
    return;
  }

  if (type === 'item') {
    const currentCategory = getCurrentCategory();
    if (currentCategory?.id === 'root' || (menuState.view === 'folders' && !currentCategory)) {
      const rootCategory = categories.find(cat => cat.id === 'root');
      if (rootCategory) {
        rootCategory.items.push({
          id: `item${Date.now()}`,
          name: getNextItemName(rootCategory),
          price: 0,
          modifier: ''
        });
      }
      menuState = { view: 'folders', categoryId: null, searchQuery: '', history: [] };
    } else {
      const targetCategory = currentCategory || categories[1];
      if (!targetCategory) return;
      targetCategory.items.push({
        id: `item${Date.now()}`,
        name: getNextItemName(targetCategory),
        price: 0,
        modifier: ''
      });
      persistCatalogLocally();
      saveCatalogToServer();
      menuState = { view: 'items', categoryId: targetCategory.id, searchQuery: '', history: [] };
    }
    rebuildItemsCatalog();
    renderAfterStateChange();
  }
}

function openFolderEditModal(category) {
  elements.quantityModal.innerHTML = '';
  const content = document.createElement('div');
  content.className = 'qty-modal-content comment-modal-content';

  const title = document.createElement('h3');
  title.textContent = 'Изменить папку';
  content.appendChild(title);

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'menu-search-input qty-modal-input';
  input.value = category.title;
  input.placeholder = 'Название папки';
  content.appendChild(input);

  const actions = document.createElement('div');
  actions.className = 'qty-modal-actions';
  const saveButton = document.createElement('button');
  saveButton.type = 'button';
  saveButton.textContent = 'Сохранить';
  saveButton.addEventListener('click', () => {
    const trimmed = input.value.trim();
    if (trimmed) {
      category.title = trimmed;
      persistCatalogLocally();
      rebuildItemsCatalog();
      renderAfterStateChange();
      syncCategoryToServer(category);
    }
    elements.quantityModal.classList.add('hidden');
  });
  actions.appendChild(saveButton);

  const cancelButton = document.createElement('button');
  cancelButton.type = 'button';
  cancelButton.textContent = 'Отмена';
  cancelButton.addEventListener('click', () => {
    elements.quantityModal.classList.add('hidden');
  });
  actions.appendChild(cancelButton);
  content.appendChild(actions);

  elements.quantityModal.appendChild(content);
  elements.quantityModal.classList.remove('hidden');
  input.focus();
  input.select();
}

function openItemEditModal(item, category) {
  elements.quantityModal.innerHTML = '';
  const content = document.createElement('div');
  content.className = 'qty-modal-content comment-modal-content';

  const title = document.createElement('h3');
  title.textContent = 'Изменить позицию';
  content.appendChild(title);

  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.className = 'menu-search-input qty-modal-input';
  nameInput.value = item.name;
  nameInput.placeholder = 'Название';
  content.appendChild(nameInput);

  const priceInput = document.createElement('input');
  priceInput.type = 'number';
  priceInput.min = '0';
  priceInput.step = '1';
  priceInput.className = 'menu-search-input qty-modal-input';
  priceInput.value = item.price ?? 0;
  priceInput.placeholder = 'Сумма';
  content.appendChild(priceInput);

  const modifierSection = document.createElement('div');
  modifierSection.className = 'modifier-editor';
  const modifierLabel = document.createElement('div');
  modifierLabel.className = 'modifier-editor-label';
  modifierLabel.textContent = 'Модификаторы (до 16)';
  modifierSection.appendChild(modifierLabel);

  const modifierList = document.createElement('div');
  modifierList.className = 'modifier-input-list';
  const modifierFields = [];

  const addModifierField = (value = '') => {
    const row = document.createElement('div');
    row.className = 'modifier-input-row';
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'menu-search-input qty-modal-input';
    input.value = value;
    input.placeholder = 'Название модификатора';
    row.appendChild(input);
    modifierFields.push(input);
    modifierList.appendChild(row);
    return input;
  };

  const existingModifiers = sortModifiers(Array.isArray(item.modifiers) ? item.modifiers : []);
  existingModifiers.forEach(value => addModifierField(value));
  if (modifierFields.length === 0) {
    addModifierField('');
  }

  const addButton = document.createElement('button');
  addButton.type = 'button';
  addButton.className = 'modifier-add-button';
  addButton.textContent = 'Добавить модификатор';
  addButton.addEventListener('click', () => {
    if (modifierFields.length >= 16) return;
    addModifierField('');
  });

  modifierSection.appendChild(modifierList);
  modifierSection.appendChild(addButton);
  content.appendChild(modifierSection);

  const actions = document.createElement('div');
  actions.className = 'qty-modal-actions';
  const saveButton = document.createElement('button');
  saveButton.type = 'button';
  saveButton.textContent = 'Сохранить';
  saveButton.addEventListener('click', () => {
    const trimmedName = nameInput.value.trim();
    const parsedPrice = Number(priceInput.value);
    if (trimmedName) {
      item.name = trimmedName;
    }
    item.price = Number.isFinite(parsedPrice) ? parsedPrice : 0;
    item.modifiers = sortModifiers(modifierFields.map(field => field.value));
    persistCatalogLocally();
    if (item.modifiers.length) {
      item.modifier = item.modifiers[0];
    } else {
      item.modifier = '';
    }
    rebuildItemsCatalog();
    renderAfterStateChange();
    syncItemToServer(item);
    elements.quantityModal.classList.add('hidden');
  });
  actions.appendChild(saveButton);

  const cancelButton = document.createElement('button');
  cancelButton.type = 'button';
  cancelButton.textContent = 'Отмена';
  cancelButton.addEventListener('click', () => {
    elements.quantityModal.classList.add('hidden');
  });
  actions.appendChild(cancelButton);
  content.appendChild(actions);

  elements.quantityModal.appendChild(content);
  elements.quantityModal.classList.remove('hidden');
  nameInput.focus();
  nameInput.select();
}

function renameCategory(category) {
  openFolderEditModal(category);
}

function deleteCategory(category) {
  if (!isAdminMode) return;
  const ok = window.confirm(`Удалить папку «${category.title}»?`);
  if (!ok) return;
  const index = categories.findIndex(item => item.id === category.id);
  if (index >= 0) {
    categories.splice(index, 1);
  }
  if (menuState.view === 'items' && menuState.categoryId === category.id) {
    menuState = { view: 'folders', categoryId: null, searchQuery: '', history: [] };
  }
  rebuildItemsCatalog();
  renderAfterStateChange();
  saveCatalogToServer();
}

function renameItem(item, category) {
  openItemEditModal(item, category);
}

function deleteItem(item, category) {
  if (!isAdminMode) return;
  const ok = window.confirm(`Удалить позицию «${item.name}»?`);
  if (!ok) return;
  const index = category.items.findIndex(entry => entry.id === item.id);
  if (index >= 0) {
    category.items.splice(index, 1);
  }
  persistCatalogLocally();
  rebuildItemsCatalog();
  renderAfterStateChange();
  saveCatalogToServer();
}

function setActivePage(page) {
  activePage = page;
  elements.pageCreate.classList.toggle('active', page === 'create');
  elements.pageHistory.classList.toggle('active', page === 'history');
  elements.tabCreate.classList.toggle('active', page === 'create');
  elements.tabHistory.classList.toggle('active', page === 'history');
  if (page === 'history') {
    renderReceipts();
  }
}

function pushMenuState(view, categoryId = null, searchQuery = '') {
  menuState.history.push({
    view: menuState.view,
    categoryId: menuState.categoryId,
    searchQuery: menuState.searchQuery
  });
  menuState.view = view;
  menuState.categoryId = categoryId;
  menuState.searchQuery = searchQuery;
}

function goBack() {
  const previous = menuState.history.pop();
  if (!previous) {
    menuState = { view: 'folders', categoryId: null, searchQuery: '', history: [] };
  } else {
    menuState.view = previous.view;
    menuState.categoryId = previous.categoryId;
    menuState.searchQuery = previous.searchQuery;
  }
  renderAfterStateChange();
}

function goHome() {
  menuState = { view: 'folders', categoryId: null, searchQuery: '', history: [] };
  renderAfterStateChange();
}

function openCategory(id) {
  pushMenuState('items', id, '');
  renderMenu();
}

function openSearch() {
  if (menuState.view === 'search') {
    elements.menuSearchInput.focus();
    return;
  }
  pushMenuState('search', menuState.categoryId, '');
  renderAfterStateChange();
  elements.menuSearchInput.focus();
}

const debouncedSearchRender = debounce(() => {
  pendingSearchRender = false;
  renderMenu();
}, 120);

function handleSearchInput(value) {
  menuState.searchQuery = value.trim().toLowerCase();
  pendingSearchRender = true;
  debouncedSearchRender();
}

function renderAfterStateChange() {
  queueMenuRender();
}

function selectPayment(type) {
  selectedPayment = type;
  activePaymentTypeId = type;
  if (!elements.quantityModal.classList.contains('hidden')) {
    renderPaymentModal();
  }
}

function parseAmountValue(value) {
  const normalized = String(value).replace(/,/g, '.').replace(/[^\d.]/g, '');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function getReceiptTotal() {
  return Object.values(selectedItems).reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function getReceiptPayments(receipt, { excludeTab = false } = {}) {
  if (Array.isArray(receipt.payments) && receipt.payments.length) {
    const payments = receipt.payments.slice();
    return excludeTab ? payments.filter(payment => payment.type !== 'tab') : payments;
  }
  if (receipt.type) {
    const payment = { type: receipt.type, amount: receipt.total };
    return excludeTab && payment.type === 'tab' ? [] : [payment];
  }
  return [];
}

function getAllocatedAmount() {
  return paymentDraft.reduce((sum, payment) => sum + (Number(payment.amount) || 0), 0);
}

function getRemainingAmountForType(type) {
  const total = getReceiptTotal();
  const allocatedOthers = paymentDraft
    .filter(payment => payment.type !== type)
    .reduce((sum, payment) => sum + (Number(payment.amount) || 0), 0);
  return Math.max(0, total - allocatedOthers);
}

function findPaymentDraft(type) {
  return paymentDraft.find(payment => payment.type === type);
}

function activatePaymentType(type) {
  activePaymentTypeId = type;
  let existing = findPaymentDraft(type);
  if (!existing) {
    const newPayment = { type, value: '', amount: 0 };
    paymentDraft.push(newPayment);
    existing = newPayment;
  }
  return existing;
}

function getMaxAmountForType(type) {
  const total = getReceiptTotal();
  if (type !== 'kaspi' && type !== 'halyk') {
    return total;
  }
  const otherCardAmount = paymentDraft
    .filter(payment => payment.type !== type && (payment.type === 'kaspi' || payment.type === 'halyk'))
    .reduce((sum, payment) => sum + (Number(payment.amount) || 0), 0);
  return Math.max(0, total - otherCardAmount);
}

function updatePaymentDraft(type, value) {
  const existing = findPaymentDraft(type);
  if (!existing) {
    return;
  }
  const nextValue = parseAmountValue(value);
  if (type === 'kaspi' || type === 'halyk') {
    const cap = getMaxAmountForType(type);
    existing.amount = Math.min(nextValue, cap);
  } else if (type === 'nalichka') {
    existing.amount = nextValue;
  }
  existing.value = value.replace(/[^\d,]/g, '');
  if (existing.value === '') {
    existing.amount = 0;
  }
}

function removePaymentType(type) {
  paymentDraft = paymentDraft.filter(payment => payment.type !== type);
  if (activePaymentTypeId === type) {
    activePaymentTypeId = paymentDraft.length ? paymentDraft[0].type : paymentTypes[0]?.id || '';
  }
}

function getPaidNonTabAmount() {
  return paymentDraft.reduce((sum, payment) => {
    if (payment.type === 'tab') return sum;
    return sum + (Number(payment.amount) || 0);
  }, 0);
}

function canSavePayments() {
  const total = getReceiptTotal();
  if (total <= 0) return false;
  const hasTab = !!findPaymentDraft('tab');
  const paid = getPaidNonTabAmount();
  if (hasTab && paid > 0) return false;
  if (hasTab) return true;
  return paid >= total;
}

function getNalichkaChange() {
  const nalichka = findPaymentDraft('nalichka');
  if (!nalichka) return 0;
  const total = getReceiptTotal();
  const other = paymentDraft.reduce((sum, payment) => {
    if (payment.type === 'nalichka' || payment.type === 'tab') return sum;
    return sum + (Number(payment.amount) || 0);
  }, 0);
  return Math.max(0, (Number(nalichka.amount) || 0) - Math.max(0, total - other));
}

function renderPaymentBreakdown(container) {
  container.innerHTML = '';
  if (!paymentDraft.length) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.textContent = 'Выберите способ оплаты сверху';
    container.appendChild(empty);
    return;
  }
  paymentDraft.forEach(payment => {
    const paymentType = paymentTypes.find(item => item.id === payment.type);
    if (!paymentType) return;
    const row = document.createElement('div');
    row.className = `payment-breakdown-row${activePaymentTypeId === payment.type ? ' active' : ''}`;
    row.addEventListener('click', () => {
      activatePaymentType(payment.type);
      renderPaymentModal();
    });
    const label = document.createElement('div');
    label.className = 'payment-breakdown-label';
    label.textContent = paymentType.label;
    const amount = document.createElement('div');
    amount.className = 'payment-breakdown-amount';
    amount.textContent = payment.type === 'tab' ? formatPrice(getReceiptTotal()) : formatPrice(payment.amount);
    const actions = document.createElement('div');
    actions.className = 'payment-row-actions';
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'payment-row-button';
    removeBtn.textContent = 'Х';
    removeBtn.addEventListener('click', event => {
      event.stopPropagation();
      removePaymentType(payment.type);
      renderPaymentModal();
    });
    actions.appendChild(removeBtn);
    row.appendChild(label);
    row.appendChild(amount);
    row.appendChild(actions);
    container.appendChild(row);
  });
}

function renderPaymentModal() {
  const total = getReceiptTotal();
  elements.quantityModal.innerHTML = '';

  const content = document.createElement('div');
  content.className = 'qty-modal-content payment-modal-content';

  const title = document.createElement('div');
  title.className = 'payment-modal-title';
  title.innerHTML = `<div></div><div class="item-subtotal">Итого: ${formatPrice(total)}</div>`;
  content.appendChild(title);

  const typeList = document.createElement('div');
  typeList.className = 'payment-type-list payment-type-list-with-tab';
  const paid = getPaidNonTabAmount();
  const hasNonTabPayment = paymentDraft.some(payment => payment.type !== 'tab');
  const completeNonTab = paymentDraft.find(payment => payment.type !== 'tab' && Number(payment.amount) >= total);
  paymentTypes.forEach(type => {
    const button = document.createElement('button');
    button.type = 'button';
    const disabled = (type.id === 'tab' && hasNonTabPayment) || (completeNonTab && type.id !== completeNonTab.type);
    button.disabled = disabled;
    button.className = `payment-type-option${activePaymentTypeId === type.id ? ' active' : ''}${disabled ? ' disabled' : ''}`;
    button.textContent = type.label;
    button.addEventListener('click', () => {
      if (disabled) return;
      activatePaymentType(type.id);
      renderPaymentModal();
    });
    typeList.appendChild(button);
  });
  content.appendChild(typeList);

  const breakdown = document.createElement('div');
  breakdown.className = 'payment-breakdown payment-selected-list';
  renderPaymentBreakdown(breakdown);
  content.appendChild(breakdown);

  const summaryBlock = document.createElement('div');
  summaryBlock.className = 'payment-amount-summary';
  const remaining = paymentDraft.length === 1 && paymentDraft[0].type === 'tab'
    ? 0
    : Math.max(0, total - getPaidNonTabAmount());
  const change = getNalichkaChange();
  summaryBlock.innerHTML = `
    <div class="payment-summary-row"><span>Итого:</span><strong>${formatPrice(total)}</strong></div>
    <div class="payment-summary-row"><span>Внести:</span><strong>${formatPrice(remaining)}</strong></div>
    <div class="payment-summary-row"><span>Сдача:</span><strong>${formatPrice(change)}</strong></div>
  `;
  content.appendChild(summaryBlock);

  const keypad = document.createElement('div');
  keypad.className = 'qty-modal-keypad';
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', ',', '0', 'Х'].forEach(buttonLabel => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = buttonLabel;
    button.addEventListener('click', () => {
      const draft = findPaymentDraft(activePaymentTypeId);
      if (!draft || activePaymentTypeId === 'tab') return;
      if (buttonLabel === 'Х') {
        draft.value = '';
      } else if (buttonLabel === ',') {
        if (!draft.value.includes(',')) {
          draft.value += ',';
        }
      } else {
        draft.value += buttonLabel;
      }
      updatePaymentDraft(activePaymentTypeId, draft.value);
      renderPaymentModal();
    });
    keypad.appendChild(button);
  });
  content.appendChild(keypad);

  const exactButton = document.createElement('button');
  exactButton.type = 'button';
  exactButton.className = 'payment-exact-button';
  exactButton.textContent = 'Точная сумма';
  exactButton.disabled = !activePaymentTypeId || activePaymentTypeId === 'tab';
  exactButton.addEventListener('click', () => {
    if (!activePaymentTypeId || activePaymentTypeId === 'tab') return;
    const amount = getRemainingAmountForType(activePaymentTypeId);
    const draft = activatePaymentType(activePaymentTypeId);
    draft.value = String(amount).replace('.', ',');
    updatePaymentDraft(activePaymentTypeId, draft.value);
    renderPaymentModal();
  });
  content.appendChild(exactButton);

  const isReady = canSavePayments();
  const saveButton = document.createElement('button');
  saveButton.type = 'button';
  saveButton.className = `payment-modal-save${isReady ? ' ready' : ' disabled'}`;
  saveButton.textContent = 'Сохранить';
  saveButton.disabled = !isReady;
  saveButton.addEventListener('click', () => {
    if (!isReady) return;
    saveReceiptWithPayments(paymentDraft);
    closePaymentModal();
  });
  content.appendChild(saveButton);

  elements.quantityModal.appendChild(content);
  elements.quantityModal.classList.remove('hidden');
}

function openPaymentModal() {
  if (Object.values(selectedItems).length === 0) {
    alert('Сначала добавьте хотя бы один товар.');
    return;
  }
  paymentDraft = [];
  activePaymentTypeId = '';
  renderPaymentModal();
}

function showChangeModal(changeAmount) {
  elements.quantityModal.innerHTML = '';
  const content = document.createElement('div');
  content.className = 'qty-modal-content payment-modal-content';
  content.innerHTML = `<div class="payment-modal-title"><div></div><div class="item-subtotal">Сдача: ${formatPrice(changeAmount)}</div></div>`;
  const actions = document.createElement('div');
  actions.className = 'qty-modal-actions';
  const okButton = document.createElement('button');
  okButton.type = 'button';
  okButton.textContent = 'ОК';
  okButton.addEventListener('click', () => {
    elements.quantityModal.classList.add('hidden');
  });
  actions.appendChild(okButton);
  content.appendChild(actions);
  elements.quantityModal.appendChild(content);
  elements.quantityModal.classList.remove('hidden');
}

function closePaymentModal() {
  paymentDraft = [];
  activePaymentTypeId = paymentTypes[0]?.id || '';
  elements.quantityModal.classList.add('hidden');
  elements.quantityModal.innerHTML = '';
}

function saveReceiptWithPayments(payments) {
  const total = getReceiptTotal();
  const validPayments = payments
    .filter(payment => payment.type === 'tab' || Number(payment.amount) > 0)
    .filter(payment => !(payment.type === 'tab' && payments.some(p => p.type !== 'tab' && Number(p.amount) > 0)));
  const receipt = {
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    items: Object.values(selectedItems).map(item => ({
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      comment: item.comment || '',
      modifier: item.selectedModifier || item.modifier || '',
      isTakeaway: Boolean(item.isTakeaway),
      tableNumber: Number.isInteger(item.tableNumber) && item.tableNumber > 0 ? item.tableNumber : null
    })),
    payments: validPayments.map(payment => ({ type: payment.type, amount: payment.type === 'tab' ? total : Number(payment.amount) })),
    total
  };
  savedReceipts.unshift(receipt);
  saveReceipts();
  
  // Clear current receipt and create new one
  const currentReceipt = getActiveReceipt();
  currentReceipt.items = {};
  currentReceipt.payments = [];
  
  selectedItems = {};
  paymentDraft = [];
  selectedPayment = '';
  activePaymentTypeId = paymentTypes[0]?.id || '';
  activeSelectedItemId = null;
  
  renderSelectedItems();
  renderPaymentActions();
  renderReceipts();
  alert('Чек сохранен. Можно перейти на страницу сохраненных чеков.');
  return receipt;
}


function ensureActiveSelectedItem() {
  const ids = Object.keys(selectedItems);
  if (!ids.length) {
    activeSelectedItemId = null;
    return;
  }

  if (!activeSelectedItemId || !selectedItems[activeSelectedItemId]) {
    activeSelectedItemId = ids[0];
  }
}

function selectSelectedItem(itemId) {
  if (!selectedItems[itemId]) return;
  activeSelectedItemId = itemId;
  renderSelectedItems();
}

function addItem(item, category = null, modifier = '') {
  const normalizedModifier = typeof modifier === 'string' ? modifier.trim() : '';
  const key = normalizedModifier ? `${item.id}::${normalizedModifier}` : item.id;
  const categoryTitle = category?.title || item?.categoryTitle || item?.category?.title || '';
  if (!selectedItems[key]) {
    selectedItems[key] = {
      ...item,
      id: key,
      quantity: 0,
      originalId: item.id,
      selectedModifier: normalizedModifier,
      modifier: normalizedModifier,
      categoryTitle,
      categoryId: category?.id || item?.categoryId || null,
      isTakeaway: false,
      tableNumber: null
    };
  }
  selectedItems[key].quantity += 1;
  selectedItems[key].selectedModifier = normalizedModifier;
  selectedItems[key].modifier = normalizedModifier;
  selectedItems[key].categoryTitle = categoryTitle || selectedItems[key].categoryTitle || '';
  selectedItems[key].categoryId = category?.id || item?.categoryId || selectedItems[key].categoryId || null;
  activeSelectedItemId = key;
  renderSelectedItems();
}

function changeQuantity(itemId, delta) {
  const current = selectedItems[itemId];
  if (!current) return;
  current.quantity += delta;
  if (current.quantity <= 0) {
    delete selectedItems[itemId];
    if (activeSelectedItemId === itemId) {
      activeSelectedItemId = null;
    }
  }
  renderSelectedItems();
}

function setQuantity(itemId, value) {
  const current = selectedItems[itemId];
  if (!current) return;
  const next = Number(value);
  if (!Number.isFinite(next) || next <= 0) {
    delete selectedItems[itemId];
    if (activeSelectedItemId === itemId) {
      activeSelectedItemId = null;
    }
  } else {
    current.quantity = next;
  }
  renderSelectedItems();
}

function openCommentModal(itemId) {
  const current = selectedItems[itemId];
  if (!current) return;

  elements.quantityModal.innerHTML = '';
  const content = document.createElement('div');
  content.className = 'qty-modal-content comment-modal-content';

  const input = document.createElement('textarea');
  input.className = 'comment-textarea';
  input.value = current.comment || '';
  input.placeholder = 'Введите комментарий';
  input.addEventListener('blur', () => {
    current.comment = input.value.trim();
    renderSelectedItems();
    elements.quantityModal.classList.add('hidden');
  });
  content.appendChild(input);

  elements.quantityModal.appendChild(content);
  elements.quantityModal.classList.remove('hidden');
  input.focus();
}

function openTableNumberModal(itemId) {
  const current = selectedItems[itemId];
  if (!current) return;

  elements.quantityModal.innerHTML = '';
  const content = document.createElement('div');
  content.className = 'qty-modal-content comment-modal-content';

  const title = document.createElement('h3');
  title.textContent = 'Выберите номер стола';
  content.appendChild(title);

  const grid = document.createElement('div');
  grid.className = 'table-number-grid';
  const numbers = [
    ...Array.from({ length: 20 }, (_, index) => index + 1),
    ...Array.from({ length: 20 }, (_, index) => index + 30)
  ];

  numbers.forEach(number => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'table-number-button';
    button.textContent = `№${number}`;
    if (current.tableNumber === number) {
      button.classList.add('active');
    }
    button.addEventListener('click', () => {
      current.tableNumber = number;
      renderSelectedItems();
      renderSafiaExtraActions();
      elements.quantityModal.classList.add('hidden');
    });
    grid.appendChild(button);
  });

  const actions = document.createElement('div');
  actions.className = 'qty-modal-actions';

  const cancelButton = document.createElement('button');
  cancelButton.type = 'button';
  cancelButton.textContent = 'Отмена';
  cancelButton.addEventListener('click', () => {
    elements.quantityModal.classList.add('hidden');
  });

  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.textContent = 'Удалить';
  deleteButton.addEventListener('click', () => {
    current.tableNumber = null;
    renderSelectedItems();
    renderSafiaExtraActions();
    elements.quantityModal.classList.add('hidden');
  });

  actions.appendChild(cancelButton);
  actions.appendChild(deleteButton);
  content.appendChild(grid);
  content.appendChild(actions);
  elements.quantityModal.appendChild(content);
  elements.quantityModal.classList.remove('hidden');
}

function renderSafiaExtraActions() {
  if (!elements.safiaToolbarActions) return;

  const activeItem = selectedItems[activeSelectedItemId];
  if (!activeItem || !isSafiaBarContext(null, activeItem)) {
    elements.safiaToolbarActions.innerHTML = '';
    elements.safiaToolbarActions.classList.add('hidden');
    return;
  }

  elements.safiaToolbarActions.innerHTML = '';
  elements.safiaToolbarActions.classList.remove('hidden');

  const takeawayButton = document.createElement('button');
  takeawayButton.type = 'button';
  takeawayButton.className = `safia-toolbar-button${activeItem.isTakeaway ? ' active' : ''}`;
  takeawayButton.textContent = 'На вынос';
  takeawayButton.addEventListener('click', () => {
    activeItem.isTakeaway = !activeItem.isTakeaway;
    renderSelectedItems();
    renderSafiaExtraActions();
  });

  const tableButton = document.createElement('button');
  tableButton.type = 'button';
  tableButton.className = `safia-toolbar-button${activeItem.tableNumber ? ' active' : ''}`;
  tableButton.textContent = 'Номерок';
  tableButton.addEventListener('click', () => {
    openTableNumberModal(activeItem.id);
  });

  elements.safiaToolbarActions.appendChild(takeawayButton);
  elements.safiaToolbarActions.appendChild(tableButton);
}

function openCustomAmountModal(item, category) {
  elements.quantityModal.innerHTML = '';
  const content = document.createElement('div');
  content.className = 'qty-modal-content comment-modal-content';

  const title = document.createElement('h3');
  title.textContent = 'Введите сумму';
  content.appendChild(title);

  const input = document.createElement('input');
  input.type = 'number';
  input.min = '0';
  input.step = '1';
  input.className = 'menu-search-input qty-modal-input';
  input.placeholder = 'Сумма';
  input.value = item.price ?? 0;
  content.appendChild(input);

  const actions = document.createElement('div');
  actions.className = 'qty-modal-actions';

  const cancelButton = document.createElement('button');
  cancelButton.type = 'button';
  cancelButton.textContent = 'Отмена';
  cancelButton.addEventListener('click', () => {
    elements.quantityModal.classList.add('hidden');
  });
  actions.appendChild(cancelButton);

  const applyButton = document.createElement('button');
  applyButton.type = 'button';
  applyButton.textContent = 'ОК';
  applyButton.addEventListener('click', () => {
    const parsed = Number(input.value);
    if (Number.isFinite(parsed) && parsed >= 0) {
      const customItem = { ...item, price: parsed };
      addItem(customItem, category, '');
    }
    elements.quantityModal.classList.add('hidden');
  });
  actions.appendChild(applyButton);

  content.appendChild(actions);
  elements.quantityModal.appendChild(content);
  elements.quantityModal.classList.remove('hidden');
  input.focus();
}

function openQuantityModal(itemId) {
  const current = selectedItems[itemId];
  if (!current) return;
  const presetValues = ['0,25', '0,5', '0,75', '1,25', '1,5', '1,75', '2,25', '2,5'];
  elements.quantityModal.innerHTML = '';
  const content = document.createElement('div');
  content.className = 'qty-modal-content';
  content.innerHTML = `<h3>Введите количество</h3>`;

  const display = document.createElement('div');
  display.className = 'item-name';
  display.textContent = current.name;
  content.appendChild(display);

  const inputRow = document.createElement('div');
  inputRow.className = 'qty-modal-input-row';
  const input = document.createElement('input');
  input.type = 'text';
  input.value = '';
  input.placeholder = '0';
  input.className = 'menu-search-input qty-modal-input';
  input.setAttribute('inputmode', 'decimal');
  inputRow.appendChild(input);
  content.appendChild(inputRow);

  const body = document.createElement('div');
  body.className = 'qty-modal-body';

  const keypad = document.createElement('div');
  keypad.className = 'qty-modal-keypad';
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', ',', '0', '×'].forEach(buttonLabel => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = buttonLabel;
    button.addEventListener('click', () => {
      if (buttonLabel === '×') {
        input.value = input.value.slice(0, -1);
        return;
      }
      if (buttonLabel === ',') {
        if (!input.value.includes(',')) {
          input.value += ',';
        }
        return;
      }
      input.value += buttonLabel;
    });
    keypad.appendChild(button);
  });
  body.appendChild(keypad);

  const side = document.createElement('div');
  side.className = 'qty-modal-side';
  const presetRow = document.createElement('div');
  presetRow.className = 'qty-modal-grid';
  presetValues.forEach(value => {
    const presetButton = document.createElement('button');
    presetButton.type = 'button';
    presetButton.textContent = value;
    presetButton.addEventListener('click', () => {
      setQuantity(itemId, value.replace(',', '.'));
      elements.quantityModal.classList.add('hidden');
    });
    presetRow.appendChild(presetButton);
  });
  side.appendChild(presetRow);

  const actions = document.createElement('div');
  actions.className = 'qty-modal-actions';
  const applyButton = document.createElement('button');
  applyButton.type = 'button';
  applyButton.textContent = 'ОК';
  applyButton.addEventListener('click', () => {
    const parsed = Number(input.value.replace(',', '.'));
    if (Number.isFinite(parsed) && parsed > 0) {
      setQuantity(itemId, parsed);
    }
    elements.quantityModal.classList.add('hidden');
  });
  actions.appendChild(applyButton);
  const cancelButton = document.createElement('button');
  cancelButton.type = 'button';
  cancelButton.textContent = 'Отмена';
  cancelButton.addEventListener('click', () => {
    elements.quantityModal.classList.add('hidden');
  });
  actions.appendChild(cancelButton);
  side.appendChild(actions);
  body.appendChild(side);
  content.appendChild(body);

  elements.quantityModal.appendChild(content);
  elements.quantityModal.classList.remove('hidden');
}

function renderPaymentTypes() {
  elements.paymentType.innerHTML = '';
}

function createFolderCard(category) {
  const card = document.createElement('div');
  card.className = 'folder-card';

  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = category.title;
  button.className = 'folder-button';
  button.addEventListener('click', event => {
    if (event.target.closest('.menu-edit-action')) return;
    openCategory(category.id);
  });
  card.appendChild(button);

  if (isMenuEditing) {
    const actions = document.createElement('div');
    actions.className = 'menu-edit-actions';

    const renameButton = document.createElement('button');
    renameButton.type = 'button';
    renameButton.className = 'menu-edit-action';
    renameButton.title = 'Переименовать папку';
    renameButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4l10-10-4-4L4 16z"/></svg>';
    renameButton.addEventListener('click', event => {
      event.stopPropagation();
      renameCategory(category);
    });

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'menu-edit-action danger';
    deleteButton.title = 'Удалить папку';
    deleteButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14M9 7V5h6v2m-8 0 1 12h10l1-12"/></svg>';
    deleteButton.addEventListener('click', event => {
      event.stopPropagation();
      deleteCategory(category);
    });

    actions.appendChild(renameButton);
    actions.appendChild(deleteButton);
    card.appendChild(actions);
  }

  return card;
}

function buildMenuEntries() {
  const cacheKey = `${menuState.view}::${menuState.categoryId || 'root'}::${menuState.searchQuery}`;
  if (menuDataCache.has(cacheKey)) {
    return menuDataCache.get(cacheKey);
  }

  const parentCategory = getCurrentCategory();
  console.log('buildMenuEntries: parentCategory:', parentCategory?.title, 'menuState.view:', menuState.view);
  const rootCategory = categories.find(cat => cat.id === 'root');
  const visibleCategories = categories
    .filter(category => category.id !== 'root' && category.parentId === (parentCategory?.id || null))
    .sort(compareByName);
  
  console.log('Found', visibleCategories.length, 'visible subcategories');

  let entries;
  let itemsCategoryForEditing = parentCategory;
  if (menuState.view === 'items' && parentCategory) {
    entries = [
      ...visibleCategories.map(category => ({ type: 'folder', data: category })),
      ...parentCategory.items.slice().sort(compareByName).map(item => ({ type: 'item', data: item }))
    ];
  } else if (menuState.view === 'folders' && !parentCategory) {
    entries = [
      ...visibleCategories.map(category => ({ type: 'folder', data: category })),
      ...(rootCategory?.items || []).slice().sort(compareByName).map(item => ({ type: 'item', data: item }))
    ];
    itemsCategoryForEditing = rootCategory;
  } else {
    entries = visibleCategories.map(category => ({ type: 'folder', data: category }));
  }

  const result = { entries, itemsCategoryForEditing };
  menuDataCache.set(cacheKey, result);
  return result;
}

function renderFolders() {
  console.log('renderFolders() called, categories count:', categories.length, 'folderList element:', !!elements.folderList);
  if (!elements.folderList) {
    console.error('ERROR: folderList element not found!');
    return;
  }
  
  elements.folderList.innerHTML = '';
  const { entries, itemsCategoryForEditing } = buildMenuEntries();
  console.log('buildMenuEntries returned:', entries.length, 'entries');
  const pageSize = 32;
  const totalPages = Math.max(1, Math.ceil(entries.length / pageSize));
  const visibleEntries = entries.slice(0, Math.min(pageSize, entries.length));

  const folderGrid = document.createElement('div');
  folderGrid.className = 'item-grid';
  applyColumnLayout(folderGrid, visibleEntries.length);

  const fragment = document.createDocumentFragment();
  visibleEntries.forEach(entry => {
    if (entry.type === 'folder') {
      fragment.appendChild(createFolderCard(entry.data));
    } else {
      fragment.appendChild(createItemCard(entry.data, itemsCategoryForEditing));
    }
  });
  folderGrid.appendChild(fragment);
  elements.folderList.appendChild(folderGrid);
  console.log('Menu rendered successfully with', visibleEntries.length, 'visible entries');

  if (totalPages > 1) {
    const pager = document.createElement('div');
    pager.className = 'item-pagination';
    for (let index = 1; index <= totalPages; index += 1) {
      const pageButton = document.createElement('button');
      pageButton.type = 'button';
      pageButton.textContent = index;
      pageButton.addEventListener('click', () => {
        const pageEntries = entries.slice((index - 1) * pageSize, index * pageSize);
        const newGrid = document.createElement('div');
        newGrid.className = 'item-grid';
        applyColumnLayout(newGrid, pageEntries.length);
        const pageFragment = document.createDocumentFragment();
        pageEntries.forEach(entry => {
          if (entry.type === 'folder') {
            pageFragment.appendChild(createFolderCard(entry.data));
          } else {
            pageFragment.appendChild(createItemCard(entry.data, itemsCategoryForEditing));
          }
        });
        newGrid.appendChild(pageFragment);
        elements.folderList.innerHTML = '';
        elements.folderList.appendChild(newGrid);
        document.getElementById('menu-header-pagination').innerHTML = '';
        document.getElementById('menu-header-pagination').appendChild(pager);
      });
      pager.appendChild(pageButton);
    }
    document.getElementById('menu-header-pagination').appendChild(pager);
  }
}

function queueMenuRender() {
  if (pendingRenderFrame) return;
  pendingRenderFrame = true;
  defer(() => {
    pendingRenderFrame = false;
    renderMenu();
  });
}

function renderMenu() {
  if (pendingSearchRender && menuState.view === 'search') {
    return;
  }
  elements.folderList.innerHTML = '';
  elements.menuPaginationZone.innerHTML = '';
  document.getElementById('menu-header-pagination').innerHTML = '';
  elements.menuSearchPanel.classList.toggle('hidden', menuState.view !== 'search');
  elements.menuSearchInput.value = menuState.searchQuery;
  if (elements.menuEditAddButton) {
    elements.menuEditAddButton.classList.toggle('hidden', !isMenuEditing);
  }
  if (elements.folderList) {
    elements.folderList.classList.toggle('hidden', false);
  }
  if (elements.menuAddPopover) {
    elements.menuAddPopover.classList.add('hidden');
  }

  if (menuState.view === 'search') {
    elements.menuTitle.textContent = 'Поиск товаров';
    elements.folderList.classList.remove('hidden');
    renderSearchResults();
    return;
  }

  if (menuState.view === 'items') {
    elements.menuTitle.textContent = '';
    renderFolders();
    return;
  }

  elements.menuTitle.textContent = '';
  renderFolders();
}

function createItemCard(item, category) {
  const card = document.createElement('div');
  card.className = `item-card${isMenuEditing ? ' menu-editable-card' : ''}`;
  if (!isMenuEditing) {
    card.addEventListener('click', () => {
      const normalizedName = String(item?.name || '').trim().toLowerCase();
      if (normalizedName === 'крошка') {
        openCustomAmountModal(item, category);
      } else if (isSafiaBarContext(category, item)) {
        openModifierSelectionModal(item, category);
      } else {
        addItem(item, category, '');
      }
    });
  } else {
    card.addEventListener('click', event => {
      event.stopPropagation();
    });
  }

  if (isMenuEditing) {
    const actions = document.createElement('div');
    actions.className = 'menu-edit-actions';

    const renameButton = document.createElement('button');
    renameButton.type = 'button';
    renameButton.className = 'menu-edit-action';
    renameButton.title = 'Переименовать позицию';
    renameButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4l10-10-4-4L4 16z"/></svg>';
    renameButton.addEventListener('click', event => {
      event.stopPropagation();
      renameItem(item, category);
    });

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'menu-edit-action danger';
    deleteButton.title = 'Удалить позицию';
    deleteButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14M9 7V5h6v2m-8 0 1 12h10l1-12"/></svg>';
    deleteButton.addEventListener('click', event => {
      event.stopPropagation();
      deleteItem(item, category);
    });

    actions.appendChild(renameButton);
    actions.appendChild(deleteButton);
    card.appendChild(actions);
  }

  const row = document.createElement('div');
  row.className = 'item-row';

  const info = document.createElement('div');
  info.innerHTML = `<div class="item-name">${item.name}</div><div class="item-price">${formatPrice(item.price)}</div>${item.categoryTitle ? `<div class="item-category">${item.categoryTitle}</div>` : ''}`;

  row.appendChild(info);
  card.appendChild(row);
  return card;
}

function renderCategoryItems() {
  const category = categories.find(cat => cat.id === menuState.categoryId);
  if (!category) return;

  const pageSize = 32;
  const sortedItems = category.items.slice().sort(compareByName);
  const totalItems = sortedItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const visibleItems = sortedItems.slice(0, Math.min(pageSize, totalItems));

  const grid = document.createElement('div');
  grid.className = 'item-grid';
  applyColumnLayout(grid, visibleItems.length);
  visibleItems.forEach(item => {
    grid.appendChild(createItemCard(item, category));
  });

  elements.folderList.appendChild(grid);

  if (totalPages > 1) {
    const pager = document.createElement('div');
    pager.className = 'item-pagination';
    for (let index = 1; index <= totalPages; index += 1) {
      const pageButton = document.createElement('button');
      pageButton.type = 'button';
      pageButton.textContent = index;
      pageButton.addEventListener('click', () => {
        const pageItems = sortedItems.slice((index - 1) * pageSize, index * pageSize);
        const newGrid = document.createElement('div');
        newGrid.className = 'item-grid';
        applyColumnLayout(newGrid, pageItems.length);
        pageItems.forEach(pageItem => {
          newGrid.appendChild(createItemCard(pageItem, category));
        });
        elements.folderList.innerHTML = '';
        elements.folderList.appendChild(newGrid);
        elements.menuPaginationZone.innerHTML = '';
        elements.menuPaginationZone.appendChild(pager);
      });
      pager.appendChild(pageButton);
    }
    elements.menuPaginationZone.appendChild(pager);
  }
}

function renderSearchResults() {
  const query = menuState.searchQuery;
  elements.folderList.innerHTML = '';

  if (!query) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.textContent = 'Введите название товара для поиска';
    elements.folderList.appendChild(empty);
    return;
  }

  const searchCacheKey = `search::${query}`;
  let matches = menuDataCache.get(searchCacheKey);
  if (!matches) {
    matches = itemsCatalog.filter(item => String(item.name || '').toLowerCase().includes(query)).sort(compareByName).slice(0, 20);
    menuDataCache.set(searchCacheKey, matches);
  }

  if (matches.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.textContent = 'Товары не найдены';
    elements.folderList.appendChild(empty);
    return;
  }

  const grid = document.createElement('div');
  grid.className = 'item-grid columns-4 search-results-grid';
  grid.setAttribute('data-search-results', 'true');

  const fragment = document.createDocumentFragment();
  matches.forEach(item => {
    const targetCategory = categories.find(category => category.id === item.categoryId) || categories[0];
    fragment.appendChild(createItemCard(item, targetCategory));
  });
  grid.appendChild(fragment);
  elements.folderList.appendChild(grid);
}

function renderSelectedItems() {
  ensureActiveSelectedItem();
  const items = Object.values(selectedItems);
  renderSafiaExtraActions();
  elements.selectedList.innerHTML = '';
  elements.selectedActions.innerHTML = '';
  if (items.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.textContent = 'Выберите товары в меню справа';
    elements.selectedList.appendChild(empty);
    elements.totalPrice.textContent = formatPrice(0);
    return;
  }

  let total = 0;
  const activeItem = selectedItems[activeSelectedItemId];
  if (activeItem) {
    const plusButton = document.createElement('button');
    plusButton.type = 'button';
    plusButton.className = 'action-button';
    plusButton.textContent = '+';
    plusButton.addEventListener('click', event => {
      event.stopPropagation();
      changeQuantity(activeItem.id, 1);
    });

    const minusButton = document.createElement('button');
    minusButton.type = 'button';
    minusButton.className = 'action-button';
    minusButton.textContent = '-';
    if (activeItem.quantity <= 1) {
      minusButton.disabled = true;
      minusButton.classList.add('disabled');
    }
    minusButton.addEventListener('click', event => {
      event.stopPropagation();
      changeQuantity(activeItem.id, -1);
    });

    const manualButton = document.createElement('button');
    manualButton.type = 'button';
    manualButton.className = 'action-button';
    manualButton.textContent = '123';
    manualButton.addEventListener('click', event => {
      event.stopPropagation();
      openQuantityModal(activeItem.id);
    });

    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.className = 'action-button';
    removeButton.textContent = '×';
    removeButton.addEventListener('click', event => {
      event.stopPropagation();
      delete selectedItems[activeItem.id];
      if (activeSelectedItemId === activeItem.id) {
        activeSelectedItemId = null;
      }
      renderSelectedItems();
    });

    const commentButton = document.createElement('button');
    commentButton.type = 'button';
    commentButton.className = 'action-button comment-action-button';
    commentButton.title = 'Комментарий';
    commentButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 6h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H9l-4 3V7a1 1 0 0 1 1-1Z" /></svg>';
    commentButton.addEventListener('click', event => {
      event.stopPropagation();
      openCommentModal(activeItem.id);
    });

    elements.selectedActions.appendChild(plusButton);
    elements.selectedActions.appendChild(minusButton);
    elements.selectedActions.appendChild(manualButton);
    elements.selectedActions.appendChild(removeButton);
    elements.selectedActions.appendChild(commentButton);
  }

  items.forEach(item => {
    const card = document.createElement('div');
    card.className = `selected-item${item.id === activeSelectedItemId ? ' active' : ''}`;
    card.addEventListener('click', () => selectSelectedItem(item.id));

    const row = document.createElement('div');
    row.className = 'selected-item-row';

    const title = document.createElement('div');
    title.className = 'selected-name';
    title.textContent = item.name;

    const tags = document.createElement('div');
    tags.className = 'selected-tags';

    if (item.isTakeaway) {
      const takeawayTag = document.createElement('div');
      takeawayTag.className = 'selected-tag selected-tag-takeaway';
      takeawayTag.textContent = 'На вынос';
      tags.appendChild(takeawayTag);
    }

    if (Number.isInteger(item.tableNumber) && item.tableNumber > 0) {
      const tableTag = document.createElement('div');
      tableTag.className = 'selected-tag selected-tag-table';
      tableTag.textContent = `№${item.tableNumber}`;
      tags.appendChild(tableTag);
    }

    const modifier = document.createElement('div');
    modifier.className = 'selected-modifier';
    modifier.textContent = item.selectedModifier || item.modifier || '';
    if (!modifier.textContent) {
      modifier.classList.add('hidden');
    }

    const comment = document.createElement('div');
    comment.className = 'item-comment';
    comment.textContent = item.comment || '';
    if (!comment.textContent) {
      comment.classList.add('hidden');
    }

    const footer = document.createElement('div');
    footer.className = 'selected-item-footer';

    const priceInfo = document.createElement('div');
    priceInfo.className = 'item-subtotal';
    priceInfo.textContent = `${formatPrice(item.price)} × ${item.quantity}`;

    const subtotal = document.createElement('div');
    subtotal.className = 'item-subtotal selected-total';
    subtotal.textContent = formatPrice(item.price * item.quantity);

    footer.appendChild(priceInfo);
    footer.appendChild(subtotal);

    row.appendChild(title);
    card.appendChild(row);
    if (tags.childElementCount) {
      card.appendChild(tags);
    }
    if (item.selectedModifier || item.modifier) {
      card.appendChild(modifier);
    }
    if (item.comment) {
      card.appendChild(comment);
    }
    card.appendChild(footer);
    elements.selectedList.appendChild(card);

    total += item.price * item.quantity;
  });

  elements.totalPrice.textContent = formatPrice(total);
}

function clearReceipts() {
  const confirmed = window.confirm('Удалить все сохранённые чеки?');
  if (!confirmed) return;
  savedReceipts = [];
  saveReceipts();
  renderReceipts();
}

function createReceipt() {
  openPaymentModal();
}

function deleteActiveReceipt() {
  if (receipts.length <= 1) {
    return;
  }

  const currentIndex = receipts.findIndex(receipt => receipt.id === activeReceiptId);
  if (currentIndex === -1) {
    return;
  }

  const nextReceipt = receipts[currentIndex + 1] || receipts[currentIndex - 1];
  receipts = receipts.filter(receipt => receipt.id !== activeReceiptId);
  activeReceiptId = nextReceipt?.id || receipts[0]?.id;
  const nextActive = receipts.find(receipt => receipt.id === activeReceiptId);
  if (nextActive) {
    selectedItems = nextActive.items || {};
    paymentDraft = nextActive.payments || [];
  } else {
    selectedItems = {};
    paymentDraft = [];
  }
  activeSelectedItemId = null;
  activePaymentTypeId = paymentTypes[0]?.id || '';
  renderReceiptTabs();
  renderSelectedItems();
  renderPaymentActions();
}

function renderReceipts() {
  elements.receiptList.innerHTML = '';

  if (savedReceipts.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.textContent = 'Еще нет сохраненных чеков.';
    elements.receiptList.appendChild(empty);
    elements.sumKaspi.textContent = formatPrice(0);
    elements.sumHalyk.textContent = formatPrice(0);
    elements.sumNalichka.textContent = formatPrice(0);
    elements.sumTotal.textContent = formatPrice(0);
    return;
  }

  function getHistoryPaymentAmount(receipt, payment) {
    if (payment.type !== 'nalichka') {
      return payment.amount;
    }
    const total = receipt.total;
    const other = receipt.payments.reduce((sum, p) => {
      if (p.type === 'nalichka' || p.type === 'tab') return sum;
      return sum + (Number(p.amount) || 0);
    }, 0);
    return Math.min(payment.amount, Math.max(0, total - other));
  }

  const combinedReceipts = savedReceipts.filter(receipt => getReceiptPayments(receipt, { excludeTab: true }).some(payment => ['kaspi', 'halyk', 'nalichka'].includes(payment.type)));

  const totals = { kaspi: 0, halyk: 0, nalichka: 0 };
  combinedReceipts.forEach(receipt => {
    getReceiptPayments(receipt, { excludeTab: true }).forEach(payment => {
      if (totals[payment.type] !== undefined) {
        totals[payment.type] += getHistoryPaymentAmount(receipt, payment);
      }
    });
  });
  elements.sumKaspi.textContent = formatPrice(totals.kaspi);
  elements.sumHalyk.textContent = formatPrice(totals.halyk);
  elements.sumNalichka.textContent = formatPrice(totals.nalichka);
  elements.sumTotal.textContent = formatPrice(totals.kaspi + totals.halyk + totals.nalichka);

  if (historyFilter === 'combined') {
    if (combinedReceipts.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.textContent = 'Нет чеков для сводного отчета.';
      elements.receiptList.appendChild(empty);
      return;
    }
    renderCombinedReceipt(totals, combinedReceipts);
    return;
  }

  const filteredReceipts = savedReceipts.filter(receipt => historyFilter === 'all' || getReceiptPayments(receipt).some(payment => payment.type === historyFilter));

  if (filteredReceipts.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.textContent = 'Нет чеков для выбранного фильтра.';
    elements.receiptList.appendChild(empty);
    return;
  }

  filteredReceipts.forEach(receipt => {
    const card = document.createElement('div');
    card.className = 'receipt-card';

    const header = document.createElement('div');
    header.className = 'receipt-header';

    const paymentBlock = document.createElement('div');
    paymentBlock.className = 'receipt-payment-block';
    const paymentRows = getReceiptPayments(receipt).map(payment => {
      const type = paymentTypes.find(item => item.id === payment.type);
      const amount = payment.type === 'nalichka' ? (
        (function(){
          const other = receipt.payments.reduce((s,p)=> p.type=== 'nalichka' || p.type==='tab' ? s : s + (Number(p.amount)||0), 0);
          return Math.min(payment.amount, Math.max(0, receipt.total - other));
        })()
      ) : payment.amount;
      const row = document.createElement('div');
      row.className = 'receipt-payment-row';
      const label = document.createElement('span');
      label.className = `receipt-type ${payment.type}`;
      label.textContent = type ? type.label : payment.type;
      const amountValue = document.createElement('span');
      amountValue.className = 'receipt-payment-amount';
      amountValue.textContent = formatPrice(amount);
      row.appendChild(label);
      row.appendChild(amountValue);
      return row;
    });
    paymentRows.forEach(row => paymentBlock.appendChild(row));

    const rightBlock = document.createElement('div');
    rightBlock.className = 'receipt-summary-block';
    const time = document.createElement('div');
    time.className = 'receipt-time';
    time.textContent = new Date(receipt.createdAt).toLocaleString('ru-RU');
    rightBlock.appendChild(time);

    const del = document.createElement('button');
    del.type = 'button';
    del.className = 'receipt-delete-button';
    del.title = 'Удалить чек';
    del.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M7 6l1 14h8l1-14"/><path d="M10 10v7"/><path d="M14 10v7"/></svg>';
    del.addEventListener('click', () => {
      const ok = window.confirm('Удалить этот чек?');
      if (!ok) return;
      savedReceipts = savedReceipts.filter(r => r.id !== receipt.id);
      saveReceipts();
      renderReceipts();
    });
    rightBlock.appendChild(del);

    header.appendChild(paymentBlock);
    header.appendChild(rightBlock);

    const itemList = document.createElement('div');
    itemList.className = 'receipt-items';
    receipt.items.forEach(item => {
      const row = document.createElement('div');
      row.className = 'receipt-item';
      const modifierText = item.modifier || item.selectedModifier || '';
      const tagsMarkup = [
        item.isTakeaway ? '<div class="selected-tag selected-tag-takeaway">На вынос</div>' : '',
        Number.isInteger(item.tableNumber) && item.tableNumber > 0 ? `<div class="selected-tag selected-tag-table">№${item.tableNumber}</div>` : ''
      ].filter(Boolean).join('');
      row.innerHTML = `<div><div>${item.name} × ${item.quantity}</div>${tagsMarkup ? `<div class="selected-tags">${tagsMarkup}</div>` : ''}${modifierText ? `<div class="selected-modifier">${modifierText}</div>` : ''}${item.comment ? `<div class="receipt-comment">${item.comment}</div>` : ''}</div><div>${formatPrice(item.price * item.quantity)}</div>`;
      itemList.appendChild(row);
    });

    card.appendChild(header);
    card.appendChild(itemList);
    elements.receiptList.appendChild(card);
  });
}

function renderCombinedReceipt(totals, receipts = []) {
  elements.receiptList.innerHTML = '';
  const itemsMap = {};
  const sourceReceipts = receipts.length ? receipts : savedReceipts;
  sourceReceipts.forEach(receipt => {
    receipt.items.forEach(item => {
      const key = `${item.name}||${item.price}`;
      if (!itemsMap[key]) itemsMap[key] = { name: item.name, price: item.price, quantity: 0 };
      itemsMap[key].quantity += item.quantity;
    });
  });

  const items = Object.values(itemsMap).sort((a, b) => a.name.localeCompare(b.name, 'ru'));

  const card = document.createElement('div');
  card.className = 'receipt-card';

  const header = document.createElement('div');
  header.className = 'receipt-header';
  header.innerHTML = `
    <div>
      <div class="receipt-type combined">Сводный чек</div>
      <div class="item-subtotal">За все время</div>
    </div>
    <div class="item-name">Итого: ${formatPrice(totals.kaspi + totals.halyk + totals.nalichka)}</div>
  `;

  const itemList = document.createElement('div');
  itemList.className = 'receipt-items';
  items.forEach(item => {
    const row = document.createElement('div');
    row.className = 'receipt-item';
    row.innerHTML = `<span>${item.name} × ${item.quantity}</span><span>${formatPrice(item.price * item.quantity)}</span>`;
    itemList.appendChild(row);
  });

  const footer = document.createElement('div');
  footer.className = 'receipt-footer';
  footer.innerHTML = `<div>Kaspi: ${formatPrice(totals.kaspi)}</div><div>Halyk: ${formatPrice(totals.halyk)}</div><div>Наличка: ${formatPrice(totals.nalichka)}</div>`;

  card.appendChild(header);
  card.appendChild(itemList);
  card.appendChild(footer);
  elements.receiptList.appendChild(card);
}

function setupEvents() {
  elements.tabCreate.addEventListener('click', () => setActivePage('create'));
  elements.tabHistory.addEventListener('click', () => setActivePage('history'));
  if (elements.brandToggle) {
    elements.brandToggle.addEventListener('click', toggleItemPriceVisibility);
  }
  elements.menuEditToggle.addEventListener('click', () => {
    if (!isAdminMode) {
      const unlocked = activateAdminMode();
      if (!unlocked) return;
    }
    toggleMenuEditing();
  });
  elements.menuEditAddButton.addEventListener('click', () => {
    if (!isMenuEditing) {
      setMenuEditing(true);
      return;
    }
    elements.menuAddPopover.classList.toggle('hidden');
  });
  elements.menuAddFolderButton.addEventListener('click', () => {
    addMenuEntry('folder');
  });
  elements.menuAddItemButton.addEventListener('click', () => {
    addMenuEntry('item');
  });
  if (elements.menuEditSaveButton) {
    elements.menuEditSaveButton.addEventListener('click', saveMenuChanges);
  }
  elements.saveButton.addEventListener('click', createReceipt);
  elements.clearReceiptsButton.addEventListener('click', clearReceipts);
  elements.backButton.addEventListener('click', goBack);
  elements.searchButton.addEventListener('click', openSearch);
  elements.homeButton.addEventListener('click', goHome);
  elements.prevReceipt.addEventListener('click', prevReceipt);
  elements.nextReceipt.addEventListener('click', nextReceipt);
  elements.addReceipt.addEventListener('click', createNewReceipt);
  elements.deleteReceipt.addEventListener('click', deleteActiveReceipt);
  elements.menuSearchInput.addEventListener('input', event => handleSearchInput(event.target.value));
  elements.quantityModal.addEventListener('click', event => {
    if (event.target === elements.quantityModal) {
      closePaymentModal();
    }
  });
  elements.filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      historyFilter = button.dataset.filter;
      elements.filterButtons.forEach(btn => btn.classList.toggle('active', btn === button));
      renderReceipts();
    });
  });
}

function init() {
  loadReceipts();
  setupEvents();
  renderPaymentTypes();
  renderReceiptTabs();
  if (elements.menuEditToggle) {
    elements.menuEditToggle.classList.toggle('hidden', false);
  }
  if (elements.menuEditAddButton) {
    elements.menuEditAddButton.classList.toggle('hidden', !isAdminMode);
  }
  loadCatalogFromServer();
  renderAfterStateChange();
  renderSelectedItems();
  renderReceipts();
}

init();
