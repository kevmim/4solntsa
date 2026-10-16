/* Четыре Солнца — логика сайта: прайс, смета, запись, заявка в Telegram */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const fmt = n => new Intl.NumberFormat('ru-RU').format(Math.round(n));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hm = m => `${Math.floor(m / 60)}:${String(Math.round(m % 60)).padStart(2, '0')}`;
  const plural = (n, a, b, c) => { const m10 = n % 10, m100 = n % 100; return m10 === 1 && m100 !== 11 ? a : (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) ? b : c; };

  /* ================= ПРАЙС: МОЙКА (прейскурант «Четыре Солнца») ================= */
  const CATS = [
    { n: 1, name: 'Компактные', ex: 'Audi A1 · Mini Cooper · Fiat 500', wheels: [50, 176], r: 13,
      body: 'M12 62 L12 48 Q16 40 36 38 L62 36 L82 18 Q88 14 100 14 L148 14 Q160 14 168 24 L184 40 L200 42 Q214 46 214 54 L214 62 Z', glass: 'M70 36 L88 20 L148 20 L166 36 Z' },
    { n: 2, name: 'Седаны и универсалы', ex: 'Toyota Camry · Audi A4 · Audi Q3 · Mercedes E', wheels: [52, 190], r: 13,
      body: 'M6 62 L6 50 Q12 43 40 41 L70 39 L94 24 Q122 20 160 22 L186 37 L220 41 Q234 45 234 54 L234 62 Z', glass: 'M78 39 L98 27 Q124 23 156 25 L176 38 Z' },
    { n: 3, name: 'Представительские, спорткары, крупные кроссоверы', ex: 'Mercedes S · BMW X5 · Audi RS 6', wheels: [56, 186], r: 12,
      body: 'M8 62 L12 52 Q40 44 80 40 L108 28 Q140 22 170 32 L208 44 Q228 48 232 56 L232 62 Z', glass: 'M96 38 L112 30 Q140 25 160 32 L168 38 Z' },
    { n: 4, name: 'Внедорожники, минивэны, пикапы', ex: 'Toyota Land Cruiser 200 · VW Multivan · Aurus', wheels: [54, 188], r: 15,
      body: 'M8 62 L8 44 Q10 37 30 35 L52 33 L66 14 Q70 10 80 10 L178 10 Q188 10 194 17 L210 33 L224 35 Q234 39 234 50 L234 62 Z', glass: 'M60 33 L72 16 L186 16 L200 33 Z' }
  ];
  // Фото категорий: Unsplash (бесплатная лицензия), обрезаны 16:9 и затемнены под стиль сайта
  const CAT_PHOTOS = { 1: 'assets/img/categories/kat1.webp', 2: 'assets/img/categories/kat2.webp', 3: 'assets/img/categories/kat3.webp', 4: 'assets/img/categories/kat4.webp' };
  // Галерея: фото Unsplash (бесплатная лицензия). Перед запуском лучше заменить на фото реальных работ.
  const GALLERY = [{"k": "p1", "t": "Porsche 911", "s": "Категория 3 · спорткар", "w": 1200, "h": 763, "src": "assets/img/gallery/p1.webp"}, {"k": "w5", "t": "Nissan GT-R", "s": "Смывка после пены", "w": 1200, "h": 675, "src": "assets/img/gallery/w5.webp"}, {"k": "r1", "t": "Rolls-Royce Ghost", "s": "Категория 3 · представительский", "w": 1200, "h": 800, "src": "assets/img/gallery/r1.webp"}, {"k": "u1", "t": "Lamborghini Urus", "s": "Категория 3 · крупный кроссовер", "w": 1200, "h": 600, "src": "assets/img/gallery/u1.webp"}, {"k": "w2", "t": "Porsche Taycan", "s": "Ручная мойка", "w": 1200, "h": 800, "src": "assets/img/gallery/w2.webp"}, {"k": "g2", "t": "Mercedes-AMG G 63", "s": "Категория 4 · внедорожник", "w": 1200, "h": 800, "src": "assets/img/gallery/g2.webp"}, {"k": "w6", "t": "Ручная фаза", "s": "Нано-шампунь и мягкая варежка", "w": 1200, "h": 800, "src": "assets/img/gallery/w6.webp"}, {"k": "d2", "t": "Nissan GT-R", "s": "Категория 3 · спорткар", "w": 1200, "h": 800, "src": "assets/img/gallery/d2.webp"}, {"k": "r2", "t": "Rolls-Royce Wraith", "s": "Категория 3 · представительский", "w": 1200, "h": 801, "src": "assets/img/gallery/r2.webp"}];

  // Карточки направлений на первом экране (фото Unsplash, бесплатная лицензия)
  const SERVICE_CARDS = [{"k": "wash", "t": "Трёхфазная мойка", "s": "Пена, ручная мойка, защита", "p": "от 1 600 ₽", "go": "main", "src": "assets/img/services/wash.webp"}, {"k": "chem", "t": "Химчистка салона", "s": "Кожа, ткань, потолок, багажник", "p": "от 12 000 ₽", "go": "chem", "src": "assets/img/services/chem.webp"}, {"k": "polish", "t": "Полировка кузова", "s": "Блеск без царапин и паутинки", "p": "цена после осмотра", "go": "protect", "src": "assets/img/services/polish.webp"}, {"k": "ceramic", "t": "Нанесение керамики", "s": "Защита и глубокий глянец", "p": "цена после осмотра", "go": "protect", "src": "assets/img/services/ceramic.webp"}, {"k": "tyre", "t": "Шиномонтаж", "s": "R13–R24, RunFlat, хранение", "p": "от 700 ₽ за колесо", "go": "tyre", "src": "assets/img/services/tyre.webp"}];

  // p: число (одна цена) или массив [кат1..кат4]; from: «от»; master: «определяется мастером»; q: макс. количество; t: минуты (ориентир)
  const WASH = {
    main: [
      { id: 'w1', name: 'НАНО мойка кузова', p: [1600, 1700, 1800, 2000], t: 40, tag: '3 фазы' },
      { id: 'w2', name: 'НАНО комплекс', p: [2600, 2900, 3200, 3400], t: 70, tag: '3 фазы' },
      { id: 'w3', name: 'Нанесение твёрдого воска', p: [2500, 2800, 3200, 3500], t: 30 },
      { id: 'w4', name: 'Нанесение кварца', p: [1000, 1000, 1000, 1200], t: 20 },
      { id: 'w5', name: 'Мойка мотоцикла', p: 1500, t: 30, fixed: true },
      { id: 'w6', name: 'Мойка двигателя', p: 5000, t: 40 },
      { id: 'w7', name: 'Мойка стёкол', p: [350, 400, 450, 500], t: 10 },
      { id: 'w8', name: 'Уборка салона пылесосом', p: [300, 350, 400, 450], t: 15 },
      { id: 'w9', name: 'Влажная уборка пластиковых и кожаных поверхностей', p: [300, 350, 400, 450], t: 15 },
      { id: 'w10', name: 'Мойка ковриков (ворс или резина, 4 шт.)', p: 300, t: 10 },
      { id: 'w11', name: 'Протирка передней панели', p: 150, t: 5 }
    ],
    extra: [
      { id: 'e1', name: 'Удаление битумных пятен, следов тополиных почек и мошек', master: true, t: 20, d: 'Цена зависит от степени загрязнения' },
      { id: 'e2', name: 'Удаление реагента или обезжиривание всего кузова', p: [1250, 1350, 1500, 1650], t: 20 },
      { id: 'e3', name: 'Антидождь', p: 2500, t: 20 },
      { id: 'e4', name: 'Профессиональная чистка руля', p: 500, t: 10 },
      { id: 'e5', name: 'Очистка кузова глиной', p: 2000, from: true, t: 60 },
      { id: 'e6', name: 'Очистка дисков', p: 250, q: 4, unit: 'диск', t: 5 },
      { id: 'e7', name: 'Очистка хрома', p: 500, from: true, t: 20 },
      { id: 'e8', name: 'Обработка 4 сидений кондиционером', p: 1500, t: 20 },
      { id: 'e9', name: 'Мойка колеса шампунем', p: 250, q: 4, unit: 'колесо', t: 4 },
      { id: 'e10', name: 'Обработка проёмов дверей силиконом', p: 200, t: 5 },
      { id: 'e11', name: 'Подкачка колёс', p: 200, t: 5 },
      { id: 'e12', name: 'Химчистка насадок выхлопных труб', p: 300, t: 10 },
      { id: 'e13', name: 'Заправка бачка стеклоомывателя, 5 л', p: 300, t: 3 }
    ],
    chem: [
      { id: 'c1', name: 'Полная химчистка (включая комплексную мойку)', p: [12000, 14000, 16000, 18000], from: true, t: 360 },
      { id: 'c2', name: 'Пол', p: [2800, 3300, 3800, 4300], t: 90 },
      { id: 'c3', name: 'Потолок', p: [2700, 3200, 3700, 4200], t: 90 },
      { id: 'c4', name: 'Багажник', p: [1300, 1400, 1650, 1900], t: 40 },
      { id: 'c5', name: 'Сиденье', p: [1100, 1300, 1400, 1500], q: 9, unit: 'шт.', t: 25 },
      { id: 'c6', name: 'Дверная карта', p: [1000, 1100, 1200, 1200], q: 5, unit: 'шт.', t: 15 },
      { id: 'c7', name: 'Химчистка ворсового коврика', p: 200, q: 6, unit: 'шт.', t: 10 },
      { id: 'c8', name: 'Химчистка пятна', p: 200, q: 10, unit: 'шт.', t: 10 }
    ],
    protect: [
      { id: 'pl1', name: 'Полировка кузова', master: true, t: 0, d: 'Многоэтапная абразивная полировка: убирает мелкие царапины, паутинку и голограммы, возвращает глубину цвета' },
      { id: 'pl2', name: 'Нанесение керамики', master: true, t: 0, d: 'Твёрдое защитное покрытие на лак: глубокий глянец, грязь и вода держатся хуже, машину проще мыть' }
    ]
  };

  /* ================= ПРАЙС: ШИНОМОНТАЖ ================= */
  // [радиус, монтаж-демонтаж, балансировка, снятие-установка, цена 1 шт, цена 4 шт]
  const TYRE = {
    car: { name: 'Легковой', short: 'Легковой', sub: 'R13 – R24', rows: [[13,275,275,200,700,3000],[14,300,300,200,750,3200],[15,350,350,200,900,3600],[16,400,400,200,1000,4000],[17,450,450,200,1100,4400],[18,500,500,200,1200,4800],[19,600,600,250,1450,5800],[20,700,700,250,1650,6600],[21,800,800,250,1850,7400],[22,900,900,250,2050,8200],['23–24',1100,1100,300,2500,10000]] },
    suv: { name: 'Внедорожник, кроссовер, минивэн', short: 'Джип / минивэн', sub: 'R15 – R24', rows: [[15,550,550,200,1300,5200],[16,650,650,250,1550,6200],[17,750,750,250,1750,7000],[18,800,800,250,1850,7400],[19,900,900,250,2050,8200],[20,1000,1000,250,2250,9000],[21,1200,1200,300,2700,10800],[22,1300,1300,300,2900,11600],['23–24',1500,1500,350,3350,13400]] },
    truck: { name: 'Грузовой', short: 'Грузовой', sub: 'R14 – R18', rows: [[14,550,550,200,1300,5200],[15,650,650,200,1500,6000],[16,800,800,250,1850,7400],['215/75/16',900,900,250,2050,8200],['17–18',1200,1200,300,2700,10800]] }
  };
  const TFIX = [
    { id: 'f1', name: 'Установка жгута', p: 700, q: 4, unit: 'шт.', t: 15 },
    { id: 'f2', name: 'Установка заплатки', p: 500, q: 4, unit: 'шт.', t: 25 },
    { id: 'f3', name: 'Установка кордовой заплатки', p: 800, q: 4, unit: 'шт.', t: 35 },
    { id: 'f4', name: 'Ремонт боковых порезов', p: 1500, from: true, d: 'От 1 500 до 3 000 ₽', t: 45 },
    { id: 'f5', name: 'Ремонт камеры легковой', p: 250, q: 4, unit: 'шт.', t: 15 },
    { id: 'f6', name: 'Ремонт камеры грузовой', p: 400, q: 4, unit: 'шт.', t: 20 },
    { id: 'f7', name: 'Подкачка колеса', p: 50, q: 4, unit: 'колесо', t: 2 },
    { id: 'f8', name: 'Утилизация покрышек', p: 250, q: 8, unit: 'шт.', t: 2 },
    { id: 'f9', name: 'Чистка и смазка ступицы', p: 250, q: 4, unit: 'шт.', t: 5 },
    { id: 'f10', name: 'Промазка диска герметиком', p: 250, q: 4, unit: 'шт.', t: 5 },
    { id: 'f11', name: 'Установка датчиков давления', p: 250, q: 4, unit: 'шт.', t: 5 },
    { id: 'f12', name: 'Пакет для колеса', p: 50, q: 8, unit: 'шт.', t: 0 },
    { id: 'f13', name: 'Вентиль резиновый', p: 50, q: 4, unit: 'шт.', t: 2 },
    { id: 'f14', name: 'Удаление скотча от грузиков', p: 300, t: 10 }
  ];
  const CAST = [[13,1000],[14,1200],[15,1400],[16,1600],[17,2000],[18,2200],[19,2500],[20,3000],[21,3500],[22,4000]]
    .map(([r, p]) => ({ id: 'd' + r, name: `Правка литого диска R${r}`, p, from: true, q: 4, unit: 'диск', t: 40 }));
  const STEEL = [['R13–14', 500], ['R15', 700], ['R16', 900], ['Газель', 1000]]
    .map(([r, p], i) => ({ id: 's' + i, name: `Прокатка штампованного диска ${r}`, p, q: 4, unit: 'диск', t: 30 }));
  const STORAGE = 1500;

  const ALL = Object.fromEntries([...WASH.main, ...WASH.extra, ...WASH.chem, ...WASH.protect, ...TFIX, ...CAST, ...STEEL].map(x => [x.id, x]));
  const MAIN_IDS = new Set(WASH.main.map(x => x.id));

  /* ================= СОСТОЯНИЕ ================= */
  const state = {
    cat: 3, dirty: false,
    cart: new Map([['w2', 1]]),              // id → количество
    tyre: { type: 'car', r: 19, n: 4, mode: 'complex', ops: { mount: true, bal: true, rem: true }, runflat: false, low: false },
    tyreInCart: null,                         // снимок строки шиномонтажа
    storage: { on: false, months: 6 },
    day: 0, slot: null
  };

  const unitPrice = it => it.master ? 0 : Array.isArray(it.p) ? it.p[state.cat - 1] : it.p;
  const priceLabel = it => it.master ? 'по оценке мастера' : (it.from ? 'от ' : '') + fmt(unitPrice(it)) + ' ₽' + (it.q ? ` / ${it.unit}` : '');

  /* ================= СТРОКИ ПРАЙСА ================= */
  function mountList(el, items) {
    items.forEach(it => {
      const row = document.createElement('div');
      row.className = 'row'; row.dataset.id = it.id;
      const sub = [it.d, it.fixed ? 'Цена не зависит от категории' : null].filter(Boolean).join(' · ');
      row.innerHTML = `
        <button class="row-btn" type="button" aria-pressed="false">
          <span class="tick" aria-hidden="true"></span>
          <span class="min-w-0"><span class="block font-medium">${it.name}${it.tag ? `<span class="tag red">${it.tag}</span>` : ''}${it.from ? '<span class="tag">от</span>' : ''}</span>${sub ? `<span class="block text-[13px] text-smoke mt-1">${sub}</span>` : ''}</span>
        </button>
        <div class="row-right">
          ${it.q ? `<span class="stepper" data-stepper hidden><button type="button" data-d="-1" aria-label="Меньше">−</button><span data-q>1</span><button type="button" data-d="1" aria-label="Больше">+</button></span>` : ''}
          <span class="price" data-p></span>
        </div>`;
      row.querySelector('.row-btn').addEventListener('click', () => {
        state.cart.has(it.id) ? state.cart.delete(it.id) : state.cart.set(it.id, 1);
        if (state.cart.has(it.id)) toast(`Добавлено: ${it.name}`);
        renderAll();
      });
      row.querySelectorAll('[data-d]').forEach(b => b.addEventListener('click', () => {
        const q = Math.max(1, Math.min(it.q, (state.cart.get(it.id) || 1) + +b.dataset.d));
        state.cart.set(it.id, q); renderAll();
      }));
      el.appendChild(row);
    });
  }
  mountList($('#list-main'), WASH.main);
  mountList($('#list-extra'), WASH.extra);
  mountList($('#list-chem'), WASH.chem);
  mountList($('#list-protect'), WASH.protect);
  mountList($('#list-tfix'), TFIX);
  mountList($('#list-cast'), CAST);
  mountList($('#list-steel'), STEEL);

  function renderRows() {
    $$('.row[data-id]').forEach(row => {
      const it = ALL[row.dataset.id], on = state.cart.has(it.id), q = state.cart.get(it.id) || 1;
      row.classList.toggle('on', on);
      row.querySelector('.row-btn').setAttribute('aria-pressed', on);
      const st = row.querySelector('[data-stepper]');
      if (st) { st.hidden = !on; st.querySelector('[data-q]').textContent = q; }
      const dirtyK = state.dirty && MAIN_IDS.has(it.id) && !it.master ? 1.25 : 1;
      row.querySelector('[data-p]').textContent = it.master ? 'по оценке мастера' : (it.from ? 'от ' : '') + fmt(unitPrice(it) * dirtyK * (on && it.q ? q : 1)) + ' ₽' + (it.q && !(on && q > 1) ? ` / ${it.unit}` : '');
    });
  }

  /* ================= КАТЕГОРИИ ================= */
  const catGrid = $('#catGrid');
  CATS.forEach(c => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'class-card'; b.setAttribute('role', 'radio'); b.dataset.id = c.n;
    const [w1, w2] = c.wheels;
    b.innerHTML = `
      <span class="scan" aria-hidden="true"></span>
      <span class="cat-photo"><img src="${CAT_PHOTOS[c.n]}" alt="" width="720" height="405"></span>
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0"><p class="font-semibold text-[13px] sm:text-[16px] leading-snug">${c.name}</p><p class="text-[12px] text-smoke mt-1 leading-snug hide-sm">${c.ex}</p></div>
        <span class="cat-no">КАТ.&nbsp;${c.n}</span>
      </div>`;
    b.addEventListener('click', () => { state.cat = c.n; renderAll(); });
    catGrid.appendChild(b);
  });
  radioKeys(catGrid, '.class-card', id => { state.cat = +id; renderAll(); });
  $('#dirty').addEventListener('click', () => { state.dirty = !state.dirty; renderAll(); });

  /* ================= ШИНОМОНТАЖ ================= */
  const segFill = (el, opts, key, onPick) => {
    el.innerHTML = '';
    opts.forEach(o => {
      const b = document.createElement('button');
      b.type = 'button'; b.setAttribute('role', 'radio'); b.dataset.id = o.id;
      b.innerHTML = `<span class="block font-semibold text-[13px] sm:text-[14px] truncate">${o.short ? `<span class="sm:hidden">${o.short}</span><span class="hidden sm:inline">${o.name}</span>` : o.name}</span>${o.sub ? `<span class="block mono text-[10px] tracking-widest mt-1 uppercase truncate">${o.sub}</span>` : ''}`;
      b.addEventListener('click', () => onPick(o.id));
      el.appendChild(b);
    });
    radioKeys(el, 'button', onPick);
  };
  segFill($('#tyType'), Object.entries(TYRE).map(([id, v]) => ({ id, name: v.name, short: v.short, sub: v.sub })), 'type', id => {
    const t = state.tyre; t.type = id;
    const rows = TYRE[id].rows;
    if (!rows.some(r => String(r[0]) === String(t.r))) t.r = rows[Math.min(3, rows.length - 1)][0];
    renderAll();
  });
  segFill($('#tyN'), [1, 2, 3, 4].map(n => ({ id: n, name: String(n) })), 'n', id => { state.tyre.n = +id; renderAll(); });
  segFill($('#tyMode'), [{ id: 'complex', name: 'Комплекс' }, { id: 'ops', name: 'Отдельно' }], 'mode', id => { state.tyre.mode = id; renderAll(); });
  const OPS = [['mount', 'Монтаж-демонтаж', 1], ['bal', 'Балансировка', 2], ['rem', 'Снятие-установка', 3]];
  const opsEl = $('#tyOps');
  OPS.forEach(([k, name]) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'opt !border !border-line !px-3 !py-3'; b.setAttribute('role', 'switch'); b.dataset.k = k;
    b.innerHTML = `<span class="min-w-0"><span class="block text-sm font-medium">${name}</span><span class="block num text-[11px] text-smoke mt-1" data-op-price></span></span><span class="switch" aria-hidden="true"></span>`;
    b.addEventListener('click', () => { state.tyre.ops[k] = !state.tyre.ops[k]; renderAll(); });
    opsEl.appendChild(b);
  });
  $('#tyRunflat').addEventListener('click', () => { state.tyre.runflat = !state.tyre.runflat; renderAll(); });
  $('#tyLow').addEventListener('click', () => { state.tyre.low = !state.tyre.low; renderAll(); });

  function tyreRow() { const t = state.tyre; return TYRE[t.type].rows.find(r => String(r[0]) === String(t.r)); }
  const rLabel = r => /^\d+$/.test(String(r)) ? 'R' + r : (String(r).includes('/') ? r : 'R' + r);
  function calcTyre() {
    const t = state.tyre, row = tyreRow();
    let base, parts = [];
    if (t.mode === 'complex') {
      base = t.n === 4 ? row[5] : row[4] * t.n;
      parts.push(t.n === 4 ? `комплект 4 колеса — ${fmt(row[5])} ₽` : `${t.n} × ${fmt(row[4])} ₽`);
    } else {
      const per = OPS.reduce((a, [k, , i]) => a + (t.ops[k] ? row[i] : 0), 0);
      base = per * t.n;
      parts.push(`${t.n} × ${fmt(per)} ₽`);
    }
    const add = t.n * ((t.runflat ? 250 : 0) + (t.low ? 150 : 0));
    if (t.runflat) parts.push(`RunFlat ${t.n} × 250 ₽`);
    if (t.low) parts.push(`низкий профиль ${t.n} × 150 ₽`);
    const ops = t.mode === 'complex' ? ['mount', 'bal', 'rem'] : OPS.filter(([k]) => t.ops[k]).map(([k]) => k);
    const mins = t.n * ((ops.includes('mount') ? 8 : 0) + (ops.includes('bal') ? 5 : 0) + (ops.includes('rem') ? 4 : 0)) + (t.runflat ? t.n * 4 : 0);
    const title = `Шиномонтаж ${rLabel(t.r)} · ${TYRE[t.type].name.toLowerCase()} · ${t.n} ${plural(t.n, 'колесо', 'колеса', 'колёс')}${t.mode === 'complex' ? ' · комплекс' : ''}${t.runflat ? ' · RunFlat' : ''}${t.low ? ' · низкий профиль' : ''}`;
    return { price: base + add, mins, title, parts, empty: base === 0 };
  }
  $('#tyAdd').addEventListener('click', () => {
    const c = calcTyre(); if (c.empty) return;
    state.tyreInCart = { name: c.title, price: c.price, mins: c.mins };
    toast('Шиномонтаж добавлен в смету'); renderAll();
  });
  $('#storageBtn').addEventListener('click', () => { state.storage.on = !state.storage.on; if (state.storage.on) toast('Хранение добавлено в смету'); renderAll(); });
  $$('[data-st]').forEach(b => b.addEventListener('click', () => { state.storage.months = Math.max(1, Math.min(12, state.storage.months + +b.dataset.st)); renderAll(); }));

  function renderTyre() {
    const t = state.tyre, row = tyreRow(), c = calcTyre();
    $$('#tyType button').forEach(b => { const on = b.dataset.id === t.type; b.setAttribute('aria-checked', on); b.tabIndex = on ? 0 : -1; });
    $$('#tyN button').forEach(b => { const on = +b.dataset.id === t.n; b.setAttribute('aria-checked', on); b.tabIndex = on ? 0 : -1; });
    $$('#tyMode button').forEach(b => { const on = b.dataset.id === t.mode; b.setAttribute('aria-checked', on); b.tabIndex = on ? 0 : -1; });
    opsEl.hidden = t.mode !== 'ops';
    $$('#tyOps [data-k]').forEach(b => { const i = OPS.find(o => o[0] === b.dataset.k)[2]; b.setAttribute('aria-checked', t.ops[b.dataset.k]); b.querySelector('[data-op-price]').textContent = fmt(row[i]) + ' ₽ / колесо'; });
    $('#tyRunflat').setAttribute('aria-checked', t.runflat);
    $('#tyLow').setAttribute('aria-checked', t.low);

    const chips = $('#tyR'); chips.innerHTML = '';
    TYRE[t.type].rows.forEach(r => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'chip'; b.setAttribute('role', 'radio'); b.dataset.id = r[0];
      const on = String(r[0]) === String(t.r);
      b.setAttribute('aria-checked', on); b.tabIndex = on ? 0 : -1;
      b.textContent = rLabel(r[0]);
      b.addEventListener('click', () => { t.r = r[0]; renderAll(); });
      chips.appendChild(b);
    });

    $('#tyTitle').textContent = c.title.replace('Шиномонтаж ', '').toUpperCase();
    tween($('#tyPrice'), c.price, v => fmt(v));
    $('#tyBreak').textContent = c.empty ? 'Выберите хотя бы одну операцию.' : c.parts.join(' · ') + ` · ≈ ${hm(c.mins)} ч`;
    const inCart = state.tyreInCart && state.tyreInCart.name === c.title && state.tyreInCart.price === c.price;
    $('#tyAddLabel').textContent = inCart ? 'Уже в смете' : state.tyreInCart ? 'Обновить в смете' : 'Добавить в смету';
    $('#tyAdd').disabled = c.empty || inCart;

    const tbl = $('#tyTable');
    tbl.innerHTML = `<thead><tr><th>Радиус</th><th>Монтаж-демонтаж</th><th>Балансировка</th><th>Снятие-установка</th><th>Комплекс, 1 шт.</th><th>Комплекс, 4 шт.</th></tr></thead><tbody>${
      TYRE[t.type].rows.map(r => `<tr data-r="${r[0]}" class="${String(r[0]) === String(t.r) ? 'sel' : ''}"><td>${rLabel(r[0])}</td>${r.slice(1).map(v => `<td>${fmt(v)}</td>`).join('')}</tr>`).join('')}</tbody>`;
    $$('#tyTable tbody tr').forEach(tr => tr.addEventListener('click', () => { const v = tr.dataset.r; t.r = /^\d+$/.test(v) ? +v : v; renderAll(); }));
    $('#tyTableNote').textContent = `${TYRE[t.type].name}. Цены в рублях. Нажмите на строку, чтобы выбрать радиус.`;

    $('#storageRow').classList.toggle('on', state.storage.on);
    $('#stMonths').textContent = state.storage.months;
    $('#stPrice').textContent = fmt(STORAGE * state.storage.months) + ' ₽';
  }

  /* ================= ДАТЫ ================= */
  const DOW = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];
  const MON = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const dates = Array.from({ length: 14 }, (_, i) => { const d = new Date(today); d.setDate(d.getDate() + i + 1); return d; });
  // График: будни 09:00–21:00, выходные 10:00–20:00
  const isWeekend = d => d.getDay() === 0 || d.getDay() === 6;
  const hoursFor = di => isWeekend(dates[di]) ? [10, 20] : [9, 21];
  state.time = '';

  const daysEl = $('#days');
  dates.forEach((d, i) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'day'; b.setAttribute('role', 'radio'); b.dataset.id = i;
    b.innerHTML = `<span class="dw block">${DOW[d.getDay()]}</span><span class="dn block mt-1">${String(d.getDate()).padStart(2, '0')}</span><span class="dw block mt-1">${MON[d.getMonth()].slice(0, 3)}</span>`;
    b.addEventListener('click', () => { state.day = i; renderAll(); });
    daysEl.appendChild(b);
  });
  radioKeys(daysEl, '.day', id => { state.day = +id; renderAll(); });
  // подсветка активного дня (сетки слотов больше нет — время вводит клиент)
  function renderSlots() {
    $$('.day', daysEl).forEach(b => { const on = +b.dataset.id === state.day; b.setAttribute('aria-checked', on); b.tabIndex = on ? 0 : -1; });
  }
  // Разбор введённого времени: «1630», «16.30», «16 30», «9» → «16:30» / «09:00»
  function parseTime(raw) {
    const s = (raw || '').trim();
    if (!s) return null;
    const m = s.match(/^(\d{1,2})\s*[:.\s-]\s*(\d{2})$/) || s.match(/^(\d{1,2})(\d{2})$/) || s.match(/^(\d{1,2})$/);
    if (!m) return null;
    const h = +m[1], mi = m[2] ? +m[2] : 0;
    if (h > 23 || mi > 59) return null;
    const [o, c] = hoursFor(state.day);
    return { hhmm: `${String(h).padStart(2, '0')}:${String(mi).padStart(2, '0')}`, inHours: (h + mi / 60) >= o && (h + mi / 60) <= c };
  }
  const whenText = () => { const d = dates[state.day], t = parseTime(state.time); return t ? `${d.getDate()} ${MON[d.getMonth()]} (${DOW[d.getDay()]}), ${t.hhmm}` : null; };
  const timeField = $('#fTime');
  timeField.addEventListener('input', () => { state.time = timeField.value; timeField.removeAttribute('aria-invalid'); renderSummary(); });

  /* ================= СМЕТА ================= */
  function cartLines() {
    const lines = [];
    for (const [id, q] of state.cart) {
      const it = ALL[id];
      const k = state.dirty && MAIN_IDS.has(id) ? 1.25 : 1;
      lines.push({ key: id, name: it.name + (it.q && q > 1 ? ` × ${q}` : ''), price: unitPrice(it) * q * k, mins: (it.t || 0) * (it.q ? q : 1) * k, from: !!it.from, master: !!it.master, wash: id[0] === 'w' || id[0] === 'e' || id[0] === 'c' });
    }
    if (state.dirty && [...state.cart.keys()].some(id => MAIN_IDS.has(id))) lines.push({ key: '_dirty', name: 'Очень грязная машина: +25% учтено', info: true });
    if (state.tyreInCart) lines.push({ key: '_tyre', name: state.tyreInCart.name, price: state.tyreInCart.price, mins: state.tyreInCart.mins });
    if (state.storage.on) lines.push({ key: '_storage', name: `Хранение комплекта, ${state.storage.months} мес.`, price: STORAGE * state.storage.months, mins: 0 });
    return lines;
  }
  function calc() {
    const lines = cartLines().filter(l => !l.info);
    return {
      lines: cartLines(),
      total: lines.reduce((a, l) => a + (l.price || 0), 0),
      mins: Math.round(lines.reduce((a, l) => a + (l.mins || 0), 0)),
      from: lines.some(l => l.from || l.master),
      master: lines.some(l => l.master),
      count: lines.length,
      hasWash: lines.some(l => l.wash)
    };
  }
  const removeLine = key => {
    if (key === '_tyre') state.tyreInCart = null;
    else if (key === '_storage') state.storage.on = false;
    else if (key === '_dirty') state.dirty = false;
    else state.cart.delete(key);
    renderAll();
  };

  const anim = {};
  function tween(el, to, f = v => v) {
    const key = el.id; const from = anim[key] ?? 0; anim[key] = to;
    if (reduce || from === to) { el.textContent = f(to); return; }
    const t0 = performance.now(), dur = 650; cancelAnimationFrame(el._raf);
    const step = now => { const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 4); el.textContent = f(from + (to - from) * e); if (k < 1) el._raf = requestAnimationFrame(step); };
    el._raf = requestAnimationFrame(step);
  }
  const ticks = $('#ticks');
  for (let i = 0; i < 48; i++) {
    const a = i / 48 * Math.PI * 2, r1 = 55, r2 = i % 6 === 0 ? 51 : 53;
    const l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    l.setAttribute('x1', 60 + Math.cos(a) * r1); l.setAttribute('y1', 60 + Math.sin(a) * r1);
    l.setAttribute('x2', 60 + Math.cos(a) * r2); l.setAttribute('y2', 60 + Math.sin(a) * r2);
    l.setAttribute('class', 'ring-tick'); l.setAttribute('stroke-width', '1'); ticks.appendChild(l);
  }
  const ring = $('#ring'), C = 2 * Math.PI * 48; ring.style.strokeDasharray = C;

  let prevKeys = new Set();
  function renderSummary() {
    const r = calc();
    $('#sumCat').textContent = r.hasWash ? `КАТЕГОРИЯ ${state.cat}` : '';
    tween($('#total'), r.total, v => fmt(v));
    $('#totalFrom').hidden = !r.from;
    tween($('#dur'), r.mins, v => hm(v));
    ring.style.strokeDashoffset = C * (1 - Math.min(1, r.mins / 240));
    $('#masterNote').hidden = !r.master;
    const L = $('#lines'); L.innerHTML = r.lines.length ? '' : '<p class="text-[13px] text-smoke py-2">Смета пуста. Отметьте услуги мойки или посчитайте шиномонтаж.</p>';
    const now = new Set();
    r.lines.forEach(l => {
      now.add(l.key);
      const d = document.createElement('div');
      d.className = 'line-item' + (prevKeys.has(l.key) ? '' : ' li-enter');
      d.innerHTML = `<span>${l.name}</span><span class="lp">${l.info ? '' : l.master ? 'мастер' : (l.from ? 'от ' : '') + fmt(l.price) + ' ₽'}</span><button class="rm" type="button" aria-label="Убрать: ${l.name}">×</button>`;
      d.querySelector('.rm').addEventListener('click', () => removeLine(l.key));
      L.appendChild(d);
    });
    prevKeys = now;
    $('#sumDate').textContent = whenText() || 'выберите время';
    $('#mTotal').textContent = fmt(r.total); $('#mFrom').hidden = !r.from;
    $('#mCount').textContent = `${r.count} ${plural(r.count, 'услуга', 'услуги', 'услуг')}`;
    $('#mDur').textContent = hm(r.mins);
    $$('[data-count]').forEach(b => { b.hidden = !r.count; b.textContent = r.count; });
    const onZapis = route === 'zapis';
    if (!submitting) $('#ctaLabel').textContent = onZapis ? 'Отправить заявку в Telegram' : 'Перейти к записи';
    $('#mGoLabel').textContent = onZapis ? 'Отправить' : 'К записи';
    $('#cta').disabled = !r.count;
  }

  function renderAll() {
    $$('.class-card', catGrid).forEach(b => { const on = +b.dataset.id === state.cat; b.setAttribute('aria-checked', on); b.tabIndex = on ? 0 : -1; });
    $('#dirty').setAttribute('aria-checked', state.dirty);
    renderRows(); renderTyre(); renderSlots(); renderSummary(); renderSecCounts();
  }

  /* ================= НАВИГАЦИЯ ================= */
  let route = 'moyka';
  const capsule = $('#summary');
  function go() {
    if (!sheet.hidden) { sheet.classList.remove('open'); sheet.hidden = true; document.body.style.overflow = ''; $('#mOpen').setAttribute('aria-expanded', 'false'); }
    const h = location.hash.replace('#', '');
    route = ['moyka', 'shinomontazh', 'zapis'].includes(h) ? h : 'moyka';
    $$('[data-page]').forEach(p => p.hidden = p.dataset.page !== route);
    $('#common').hidden = route === 'zapis';
    $$('[data-route]').forEach(a => a.dataset.route === route ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current'));
    const slot = $(`[data-page="${route}"] [data-capsule-slot]`); slot.appendChild(capsule);
    const page = $(`[data-page="${route}"]`); page.classList.remove('page'); void page.offsetWidth; page.classList.add('page');
    window.scrollTo({ top: 0, behavior: 'auto' });
    renderSummary();
  }
  window.addEventListener('hashchange', go);

  /* ================= ЗАЯВКА ================= */
  const modal = $('#modal'); let lastReq = '';
  let submitting = false;
  async function submit() {
    if (route !== 'zapis') { location.hash = 'zapis'; return; }
    if (submitting) return;
    if (!sheet.hidden) closeSheet(true);
    const name = $('#fName'), phone = $('#fPhone'), err = $('#formErr');
    const plateEl = $('#fPlate'), pl = parsePlate(plateEl.value);
    const okN = name.value.trim().length > 1, okP = phone.value.replace(/\D/g, '').length >= 10 || /^@\w{4,}/.test(phone.value.trim());
    const okPl = pl.valid;
    const t = parseTime(state.time);
    name.setAttribute('aria-invalid', !okN); phone.setAttribute('aria-invalid', !okP); plateEl.setAttribute('aria-invalid', !okPl);
    timeField.setAttribute('aria-invalid', !t || !t.inHours);
    if (!t || !t.inHours || !okN || !okP || !okPl) {
      const [o, c] = hoursFor(state.day);
      let msg;
      if (!t) msg = 'Впишите удобное время, например 16:30.';
      else if (!t.inHours) msg = `В этот день мойка работает с ${String(o).padStart(2, '0')}:00 до ${String(c).padStart(2, '0')}:00 — укажите время в этом промежутке.`;
      else { const miss = [!okN && 'имя', !okP && 'телефон (или @ник в Telegram)', !okPl && 'госномер для пропуска'].filter(Boolean); msg = `Укажите ${miss.join(', ')}.`; }
      err.textContent = msg; err.hidden = false;
      const target = (!t || !t.inHours) ? timeField : (!okN ? name : !okP ? phone : plateEl);
      target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
      setTimeout(() => target.focus({ preventScroll: true }), 400);
      return;
    }
    err.hidden = true;
    const r = calc(), d = dates[state.day];
    const code = `4S-${String(d.getDate()).padStart(2, '0')}${String(d.getMonth() + 1).padStart(2, '0')}-${String(r.total % 997).padStart(3, '0')}`;
    lastReq = [
      `Заявка ${code} · Автомойка «Четыре Солнца»`,
      `Имя: ${name.value.trim()}`,
      `Контакт: ${phone.value.trim()}`,
      `Госномер: ${pl.pretty}`,
      `Автомобиль: ${$('#fCar').value.trim() || '—'}${r.hasWash ? ` (категория ${state.cat})` : ''}`,
      `Приезд: ${whenText()}`,
      `Услуги:`,
      ...r.lines.map(l => `• ${l.name}${l.info ? '' : ' — ' + (l.master ? 'по оценке мастера' : (l.from ? 'от ' : '') + fmt(l.price) + ' ₽')}`),
      `Итого: ${r.from ? 'от ' : ''}${fmt(r.total)} ₽`,
      `Время работы: ≈ ${hm(r.mins)} ч`,
      $('#fNote').value.trim() ? `Комментарий: ${$('#fNote').value.trim()}` : null,
      ``,
      `ПРОПУСК: ${pl.compact}${$('#fCar').value.trim() ? ', ' + $('#fCar').value.trim() : ''} · ${d.getDate()} ${MON[d.getMonth()]} к ${t.hhmm}`
    ].filter(v => v !== null).join('\n');
    const slotLabel = whenText();
    $('#mBooked').innerHTML = `<span class="inline-block w-1.5 h-1.5 mt-2 rounded-full bg-[#666] shrink-0" aria-hidden="true"></span><span>Вы выбрали <b class="font-semibold">${slotLabel}</b>. Менеджер подтвердит время ответным сообщением в Telegram.</span>`;
    $('#mCode').textContent = code;
    $('#mName').textContent = name.value.trim().split(' ')[0];
    $('#reqText').textContent = lastReq;
    // Ссылка Telegram с готовым текстом: t.me/<username>?text=<текст>
    $('#tgSend').href = 'https://t.me/IM4SUN?text=' + encodeURIComponent(lastReq);
    $('#tgNote').textContent = 'Если текст не появился в чате, он уже скопирован: просто вставьте его. Или напишите вручную: t.me/IM4SUN';
    modal.hidden = false; requestAnimationFrame(() => modal.classList.add('open'));
    $('#tgSend').focus();
  }
  $('#cta').addEventListener('click', submit);
  $('#mGo').addEventListener('click', submit);
  $('#tgSend').addEventListener('click', () => {
    const note = $('#tgNote');
    const fallback = () => {
      const range = document.createRange(); range.selectNodeContents($('#reqText'));
      const sel = getSelection(); sel.removeAllRanges(); sel.addRange(range);
      note.textContent = 'Если текст не появился в чате, он выделен выше: скопируйте его (Ctrl+C) и вставьте в чат @IM4SUN.';
    };
    try { navigator.clipboard.writeText(lastReq).then(() => { note.textContent = 'Чат открыт. Если текста нет в поле сообщения, вставьте его: он уже скопирован.'; }).catch(fallback); }
    catch (e) { fallback(); }
  });
  const closeModal = () => { modal.classList.remove('open'); setTimeout(() => { modal.hidden = true; $('#cta').focus(); }, reduce ? 0 : 350); };
  $('#mClose').addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) closeModal(); });
  ['#fName', '#fPhone', '#fPlate'].forEach(s => $(s).addEventListener('input', e => e.target.removeAttribute('aria-invalid')));

  /* ================= ГОСНОМЕР ================= */
  // Латинские буквы-двойники переводим в кириллицу: на номерах РФ только А В Е К М Н О Р С Т У Х
  const LAT = { A: 'А', B: 'В', E: 'Е', K: 'К', M: 'М', H: 'Н', O: 'О', P: 'Р', C: 'С', T: 'Т', Y: 'У', X: 'Х' };
  function parsePlate(raw) {
    const clean = raw.toUpperCase().replace(/[\s\-_.]/g, '');
    const cyr = clean.replace(/[ABEKMHOPCTYX]/g, ch => LAT[ch]).replace(/Ё/g, 'Е');
    const m = cyr.match(/^([АВЕКМНОРСТУХ])(\d{3})([АВЕКМНОРСТУХ]{2})(\d{2,3})$/);
    if (m) return { valid: true, std: true, parts: m.slice(1), compact: cyr, pretty: `${m[1]} ${m[2]} ${m[3]} ${m[4]}` };
    const ok = clean.length >= 4 && /\d/.test(clean) && /^[0-9A-ZА-Я]+$/.test(clean);
    return { valid: ok, std: false, compact: clean, pretty: clean };
  }
  function renderPlate() {
    const el = $('#platePrev'), v = $('#fPlate').value, pl = parsePlate(v);
    if (pl.std) {
      const [a, n, b, reg] = pl.parts;
      el.className = 'plate';
      el.innerHTML = `<span class="main"><small>${a}</small>${n}<small>${b}</small></span><span class="reg"><b>${reg}</b><span>RUS <i></i></span></span>`;
      $('#plateHint').textContent = 'Номер распознан. Проверьте, что всё верно.';
    } else if (v.trim()) {
      el.className = 'plate free';
      el.innerHTML = `<span class="main">${pl.compact.replace(/[<>&]/g, '') || '—'}</span>`;
      $('#plateHint').textContent = pl.valid ? 'Нестандартный или иностранный номер. Если всё верно, оставьте так.' : 'Проверьте номер: например, А123ВС777.';
    } else {
      el.className = 'plate empty';
      el.innerHTML = '<span class="main"><small>А</small>000<small>АА</small></span><span class="reg"><b>00</b><span>RUS <i></i></span></span>';
      $('#plateHint').textContent = 'Русские или латинские буквы, без пробелов. Иностранный номер тоже подойдёт.';
    }
  }
  $('#fPlate').addEventListener('input', renderPlate);
  renderPlate();

  /* ================= УТИЛИТЫ ================= */
  let tt;
  function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('show'), 1600); }
  function radioKeys(group, sel, pick) {
    group.addEventListener('keydown', e => {
      if (!['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(e.key)) return;
      const items = $$(sel, group); const i = items.indexOf(document.activeElement); if (i < 0) return;
      e.preventDefault();
      const n = items[(i + (e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length];
      pick(n.dataset.id); setTimeout(() => { const again = $$(sel, group).find(x => x.dataset.id === n.dataset.id); again && again.focus(); });
    });
  }
  (function openStatus() {
    const p = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Moscow', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date()).map(x => [x.type, x.value]));
    const h = (+p.hour % 24) + (+p.minute) / 60, we = p.weekday === 'Sat' || p.weekday === 'Sun';
    const [o, c] = we ? [10, 20] : [9, 21];
    const isOpen = h >= o && h < c;
    const nextOpen = h < o ? (we ? '10:00' : '09:00') : (p.weekday === 'Fri' || p.weekday === 'Sat' ? '10:00' : '09:00');
    $('#openStatus').textContent = isOpen ? `ОТКРЫТО ДО ${we ? '20:00' : '21:00'}` : `ЗАКРЫТО · ОТКРОЕМСЯ В ${nextOpen}`;
    $('#openDot').style.background = isOpen ? '' : '#4a4a4a';
    $('#openDot').style.boxShadow = isOpen ? '' : 'none';
    setTimeout(openStatus, 60000);
  })();

  /* ================= КАРТОЧКИ УСЛУГ ================= */
  const strip = $('#svcStrip');
  SERVICE_CARDS.forEach(c => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'svc-card'; b.setAttribute('role', 'listitem');
    b.innerHTML = `<img src="${c.src}" alt="" width="720" height="540" loading="lazy" decoding="async"><span class="svc-body"><b>${c.t}</b><span class="svc-sub">${c.s}</span><span class="svc-price">${c.p}<i aria-hidden="true">→</i></span></span>`;
    b.addEventListener('click', () => {
      if (c.go === 'tyre') { location.hash = 'shinomontazh'; return; }
      const sec = document.getElementById('sec-' + c.go);
      if (sec.classList.contains('collapsed')) { sec.classList.remove('collapsed'); sec.querySelector('.step-head').setAttribute('aria-expanded', 'true'); }
      sec.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      sec.classList.remove('flash'); void sec.offsetWidth; sec.classList.add('flash');
    });
    strip.appendChild(b);
  });

  /* ================= ГАЛЕРЕЯ ================= */
  const LAYOUT = ['big', 'wide', '', '', 'wide', '', '', 'wide', 'wide'];
  const galEl = $('#gal');
  GALLERY.forEach((g, i) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'tile ' + (LAYOUT[i] || ''); b.setAttribute('role', 'listitem');
    b.setAttribute('aria-label', `Открыть фото: ${g.t}`);
    b.innerHTML = `<img src="${g.src}" alt="${g.t}" width="${g.w}" height="${g.h}" loading="lazy" decoding="async"><span class="cap"><b>${g.t}</b><span>${g.s}</span></span>`;
    b.addEventListener('click', () => openLb(i));
    galEl.appendChild(b);
  });
  const lb = $('#lb'); let lbI = 0, lbFrom = null;
  function showLb(i) {
    lbI = (i + GALLERY.length) % GALLERY.length; const g = GALLERY[lbI];
    $('#lbImg').src = g.src; $('#lbImg').alt = g.t; $('#lbT').textContent = g.t; $('#lbS').textContent = g.s;
    $('#lbN').textContent = `${String(lbI + 1).padStart(2, '0')} / ${String(GALLERY.length).padStart(2, '0')}`;
  }
  function openLb(i) { lbFrom = document.activeElement; showLb(i); lb.hidden = false; document.body.style.overflow = 'hidden'; requestAnimationFrame(() => lb.classList.add('open')); $('#lbClose').focus(); }
  function closeLb() { lb.classList.remove('open'); document.body.style.overflow = ''; setTimeout(() => { lb.hidden = true; lbFrom && lbFrom.focus(); }, reduce ? 0 : 300); }
  $('#lbClose').addEventListener('click', closeLb);
  $('#lbPrev').addEventListener('click', () => showLb(lbI - 1));
  $('#lbNext').addEventListener('click', () => showLb(lbI + 1));
  lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', e => {
    if (lb.hidden) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') showLb(lbI - 1);
    if (e.key === 'ArrowRight') showLb(lbI + 1);
  });
  let sx = null;
  lb.addEventListener('pointerdown', e => { sx = e.clientX; });
  lb.addEventListener('pointerup', e => { if (sx == null) return; const dx = e.clientX - sx; sx = null; if (Math.abs(dx) > 50) showLb(lbI + (dx < 0 ? 1 : -1)); });

  // переходы к галерее и вопросам из шапки
  document.querySelectorAll('[data-jump]').forEach(b => b.addEventListener('click', () => {
    const go2 = () => document.getElementById(b.dataset.jump).scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    if (route === 'zapis') { location.hash = 'moyka'; setTimeout(go2, 80); } else go2();
  }));

  /* Сворачиваемые разделы на телефоне */
  const mq = matchMedia('(max-width: 1023px)');
  $$('[data-collapse]').forEach(sec => {
    const head = sec.querySelector('.step-head');
    const cnt = document.createElement('span'); cnt.className = 'badge'; cnt.hidden = true; cnt.dataset.secCount = '';
    const chev = document.createElement('span'); chev.className = 'chev'; chev.setAttribute('aria-hidden', 'true');
    head.append(cnt, chev);
    const toggle = () => { if (!mq.matches) return; sec.classList.toggle('collapsed'); head.setAttribute('aria-expanded', !sec.classList.contains('collapsed')); };
    head.addEventListener('click', toggle);
    head.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
  });
  function applyMq() {
    $$('[data-collapse]').forEach(sec => {
      const h = sec.querySelector('.step-head');
      if (mq.matches) { sec.classList.toggle('collapsed', sec.dataset.collapse === 'closed'); h.setAttribute('role', 'button'); h.tabIndex = 0; h.setAttribute('aria-expanded', !sec.classList.contains('collapsed')); }
      else { sec.classList.remove('collapsed'); h.removeAttribute('role'); h.removeAttribute('tabindex'); h.removeAttribute('aria-expanded'); }
    });
    if (!mq.matches) closeSheet(true);
  }
  mq.addEventListener ? mq.addEventListener('change', applyMq) : mq.addListener(applyMq);
  function renderSecCounts() {
    $$('[data-collapse]').forEach(sec => {
      const n = $$('.row.on', sec).length;
      const b = sec.querySelector('[data-sec-count]'); b.hidden = !n; b.textContent = n;
    });
  }

  /* Шторка сметы на телефоне */
  const sheet = $('#sheet');
  function openSheet() {
    $('#sheetSlot').appendChild(capsule);
    sheet.hidden = false; requestAnimationFrame(() => sheet.classList.add('open'));
    $('#mOpen').setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeSheet(instant) {
    if (sheet.hidden) return;
    sheet.classList.remove('open');
    $('#mOpen').setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    setTimeout(() => { sheet.hidden = true; $(`[data-page="${route}"] [data-capsule-slot]`).appendChild(capsule); }, instant || reduce ? 0 : 400);
  }
  $('#mOpen').addEventListener('click', () => sheet.hidden ? openSheet() : closeSheet());
  $('#sheetClose').addEventListener('click', () => closeSheet());
  sheet.addEventListener('click', e => { if (e.target === sheet) closeSheet(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !sheet.hidden) closeSheet(); });

  applyMq();
  renderAll();
  go();
  document.fonts && document.fonts.ready.then(renderSummary);
})();
