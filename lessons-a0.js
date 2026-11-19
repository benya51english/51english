/* A0: модули и уроки 2–16 (урок 1 в lessons.js). Все уроки reviewed:false до проверки преподавателем.
   Помощники: C choice, T text, O order, M match, A listen. Словарь: "en|ru". */
(function () {
  var C = function (q, o, a, e) { return { type: 'choice', q: q, options: o, answer: a, explain: e }; };
  var T = function (q, a, e) { return { type: 'text', q: q, answer: a, explain: e }; };
  var O = function (q, w, a, e) { return { type: 'order', q: q, words: w, answer: a, explain: e }; };
  var M = function (q, p, e) { return { type: 'match', q: q, pairs: p, explain: e }; };
  var A = function (s, o, e) { return { type: 'listen', q: 'Послушай и выбери, что ты услышал(а).', say: s, options: o, answer: o[0], explain: e }; };
  var sh = function (a) { return a.slice().sort(function (x, y) { return x < y ? -1 : 1; }); };
  var V = function (a) { return a.map(function (s) { var p = s.split('|'); return { en: p[0], ru: p[1] }; }); };
  var L = function (n, m, title, xp, goal, explain, vocab, ex, summary) {
    return { id: 'a0-' + (n < 10 ? '0' : '') + n, level: 'A0', module: m, title: title, xp: xp, reviewed: false, goal: goal, explain: explain, summary: summary, vocab: V(vocab), exercises: ex };
  };
  // у listen первый вариант всегда верный, порядок в интерфейсе перемешиваем здесь
  var mix = function (ex) { if (ex.type === 'listen') ex.options = sh(ex.options).reverse(); return ex; };

  window.MODULES = { A0: ['Знакомство и приветствия', 'Первые слова и предложения', 'Базовая грамматика', 'Люди, семья и информация о себе', 'Повседневная жизнь', 'Первые разговоры', 'Практика реальных ситуаций', 'Повторение и итоговая проверка'] };

  var lessons = [
    L(2, 1, 'Вежливость и прощание', 60, 'Научись прощаться, благодарить и извиняться.',
      'Слова “please” и “thank you” делают речь вежливой. Просишь о чём-то — добавь “please”. Тебя поблагодарили — ответь “You’re welcome”. Чтобы извиниться, скажи “Sorry”.',
      ['Goodbye!|До свидания!', 'See you!|Увидимся!', 'Please|Пожалуйста (в просьбе)', 'Thank you|Спасибо', "You're welcome.|Не за что.", 'Sorry|Извините', 'Yes|Да', 'No|Нет'],
      [M('Соедини слова и переводы.', [['Goodbye!', 'До свидания!'], ['Thank you', 'Спасибо'], ['Sorry', 'Извините'], ['Yes', 'Да']], 'Эти слова нужны в любом разговоре.'),
       C('Как ответить на “Thank you”?', ["You're welcome.", 'Good morning!', 'Sorry.'], "You're welcome.", 'На “Thank you” отвечают “You’re welcome” — «Не за что».'),
       C('Что означает “See you!”?', ['Увидимся!', 'Извините', 'Пожалуйста'], 'Увидимся!', '“See you!” — дружеское прощание, буквально «Увидимся».'),
       T('Введи по-английски: «Спасибо».', ['Thank you', 'Thanks'], '“Thank you” — «Спасибо». Коротко можно сказать “Thanks”.'),
       O('Собери фразу: «Не за что».', ['welcome', "You're"], "You're welcome", 'Сначала “You’re”, потом “welcome”.'),
       mix(A('Goodbye', ['Goodbye', 'Hello', 'Please'], 'Ты услышал(а) “Goodbye” — «До свидания».'))]),

    L(3, 2, 'Первые слова: вещи вокруг', 60, 'Назови предметы вокруг и скажи, что это такое.',
      'Названия вещей — существительные. Перед одним предметом ставят “a”: a book, a pen. Чтобы назвать предмет, говорят “This is a…” («Это …»).',
      ['a book|книга', 'a pen|ручка', 'a phone|телефон', 'a bag|сумка', 'a table|стол', 'water|вода'],
      [M('Соедини слова и переводы.', [['a book', 'книга'], ['a pen', 'ручка'], ['a phone', 'телефон'], ['a bag', 'сумка']], 'Запоминай слово вместе с “a”.'),
       C('Как будет «ручка»?', ['a pen', 'a book', 'a bag'], 'a pen', '“A pen” — ручка.'),
       T('Введи по-английски: «телефон».', ['a phone', 'phone'], '“A phone” — телефон.'),
       O('Собери фразу: «Это книга».', ['book', 'This', 'a', 'is'], 'This is a book', 'Порядок слов: This + is + a + предмет.'),
       mix(A('a bag', ['a bag', 'a book', 'a table'], 'Ты услышал(а) “a bag” — «сумка».')),
       C('Выбери верное предложение: «Это сумка».', ['This is a bag.', 'This a bag is.', 'Is this bag a.'], 'This is a bag.', 'Порядок слов в английском строгий: This is a bag.')]),

    L(4, 2, 'Числа от 1 до 10', 60, 'Считай от одного до десяти и узнавай числа на слух.',
      'Числа нужны везде: в возрасте, ценах, номерах. Читай их вслух, пока не станет легко.',
      ['one|один', 'two|два', 'three|три', 'four|четыре', 'five|пять', 'six|шесть', 'seven|семь', 'eight|восемь', 'nine|девять', 'ten|десять'],
      [M('Соедини числа и переводы.', [['three', 'три'], ['five', 'пять'], ['seven', 'семь'], ['nine', 'девять'], ['ten', 'десять']], 'Числа до десяти стоит выучить наизусть.'),
       mix(A('seven', ['seven', 'six', 'ten'], 'Ты услышал(а) “seven” — «семь».')),
       T('Напиши числом словами: 4.', ['four'], '4 по-английски — “four”.'),
       C('Какое число между two и four?', ['three', 'one', 'five'], 'three', 'one, two, three, four: между two и four стоит three.'),
       C('Сколько будет two + two?', ['four', 'three', 'five'], 'four', 'Two and two is four.'),
       T('Переведи: «восемь».', ['eight'], '“Eight” — восемь.')]),

    L(5, 3, 'Глагол to be', 60, 'Составляй простые предложения с глаголом to be.',
      'В английском предложении почти всегда есть глагол. Глагол to be («быть») меняется: I am, you are, he / she / it is, we / they are. По-русски мы его не произносим («Я студент»), а по-английски нужно сказать I am a student.',
      ['I am a student.|Я студент.', 'You are a teacher.|Ты учитель.', 'He is a doctor.|Он врач.', 'She is a pilot.|Она пилот.', 'We are friends.|Мы друзья.', 'They are happy.|Они счастливы.'],
      [C('She ___ a pilot.', ['am', 'is', 'are'], 'is', 'После she, he, it ставим is.'),
       C('They ___ happy.', ['am', 'is', 'are'], 'are', 'После they, we, you ставим are.'),
       C('I ___ a student.', ['am', 'is', 'are'], 'am', 'После I всегда am.'),
       T('Переведи: «Он врач».', ['He is a doctor.', "He's a doctor."], 'He is a doctor. Сокращённо: He’s a doctor.'),
       O('Собери: «Мы друзья».', ['friends', 'We', 'are'], 'We are friends', 'We + are + friends.'),
       C('Найди предложение без ошибки.', ['He are a doctor.', 'He is a doctor.', 'He am a doctor.'], 'He is a doctor.', 'После he нужно is.')]),

    L(6, 3, 'Артикли a и an', 60, 'Выбирай правильный артикль перед словом.',
      'Перед словом, которое начинается с гласного звука (a, e, i, o, u), ставят “an”: an apple. Перед согласным звуком ставят “a”: a car. Смотри на звук слова, а не только на первую букву.',
      ['a car|машина', 'a dog|собака', 'an apple|яблоко', 'an orange|апельсин', 'an umbrella|зонт', 'a book|книга'],
      [C('___ apple', ['a', 'an'], 'an', 'Apple начинается с гласного звука, поэтому an.'),
       C('___ dog', ['a', 'an'], 'a', 'Dog начинается с согласного звука, поэтому a.'),
       C('___ umbrella', ['a', 'an'], 'an', 'Umbrella начинается с гласного звука, поэтому an.'),
       T('Введи с артиклем: «апельсин».', ['an orange'], 'An orange: orange начинается с гласного звука.'),
       C('Найди правильный вариант.', ['a orange', 'an orange', 'an car'], 'an orange', 'Перед orange нужен an, перед car нужен a.'),
       C('Выбери верное предложение.', ['This is an apple.', 'This is a apple.', 'This is an dog.'], 'This is an apple.', 'An apple: гласный звук. A dog: согласный.')]),

    L(7, 4, 'Моя семья', 60, 'Назови членов семьи и расскажи, кто есть кто.',
      'Чтобы сказать про свою семью, ставь слово “my” («мой, моя»): my mother, my brother. Предложение строится как раньше: This is my sister.',
      ['mother|мама, мать', 'father|папа, отец', 'brother|брат', 'sister|сестра', 'family|семья', 'my|мой, моя'],
      [M('Соедини слова и переводы.', [['mother', 'мама'], ['father', 'папа'], ['brother', 'брат'], ['sister', 'сестра']], 'Эти слова пригодятся в каждом рассказе о себе.'),
       C('Как будет «моя сестра»?', ['my sister', 'my brother', 'my father'], 'my sister', '“My sister” — моя сестра.'),
       T('Введи по-английски: «мой брат».', ['my brother'], '“My brother” — мой брат.'),
       O('Собери: «Это моя мама».', ['mother', 'This', 'my', 'is'], 'This is my mother', 'This + is + my + mother.'),
       mix(A('family', ['family', 'father', 'sister'], 'Ты услышал(а) “family” — «семья».')),
       C('Выбери верное предложение.', ['This is my father.', 'This my father is.', 'Is this father my.'], 'This is my father.', 'Порядок: This is my father.')]),

    L(8, 4, 'Расскажи о себе', 60, 'Расскажи, откуда ты, сколько тебе лет и где живёшь.',
      'Для рассказа о себе используй готовые модели: “I’m from …” («Я из …»), “I’m … years old” («Мне … лет»), “I live in …” («Я живу в …»). I’m — сокращение от I am.',
      ["I'm from Russia.|Я из России.", "I'm 25 years old.|Мне 25 лет.", "I'm a student.|Я студент.", 'I live in Moscow.|Я живу в Москве.'],
      [C('Как сказать «Я из России»?', ["I'm from Russia.", "I'm Russia from.", 'I from Russia.'], "I'm from Russia.", 'Модель: I’m from + страна.'),
       T('Переведи: «Мне 20 лет».', ["I'm 20 years old.", 'I am 20 years old.'], 'I’m 20 years old: после I’m — число и years old.'),
       C('Закончи: I ___ in Moscow.', ['live', 'lives', 'am live'], 'live', 'После I используем live: I live in Moscow.'),
       O('Собери: «Я студент».', ['student', 'a', "I'm"], "I'm a student", 'I’m + a + student.'),
       T('Напиши по-английски: «Я живу в Москве».', ['I live in Moscow.'], 'I live in + город.'),
       C('Что означает “I’m”?', ['I am', 'I is', 'I are'], 'I am', 'I’m — сокращённая форма I am.')]),

    L(9, 5, 'Еда и напитки', 60, 'Скажи, что ты любишь и чего хочешь.',
      'Чтобы сказать, что тебе нравится, используй “I like …” («Мне нравится …»). Чтобы сказать «Я хочу», используй “I want …”.',
      ['bread|хлеб', 'milk|молоко', 'tea|чай', 'coffee|кофе', 'I like tea.|Мне нравится чай.', 'I want water.|Я хочу воды.'],
      [M('Соедини слова и переводы.', [['bread', 'хлеб'], ['milk', 'молоко'], ['tea', 'чай'], ['coffee', 'кофе']], 'Это самые частые слова в кафе.'),
       C('Как сказать «Мне нравится чай»?', ['I like tea.', 'I am tea.', 'I tea like.'], 'I like tea.', 'I like + что нравится.'),
       T('Введи по-английски: «молоко».', ['milk'], '“Milk” — молоко.'),
       O('Собери: «Я хочу воды».', ['water', 'I', 'want'], 'I want water', 'I + want + water.'),
       mix(A('coffee', ['coffee', 'tea', 'milk'], 'Ты услышал(а) “coffee” — «кофе».')),
       C('Выбери верное: «Я хочу яблоко».', ['I want an apple.', 'I want a apple.', 'I an apple want.'], 'I want an apple.', 'Apple — гласный звук, поэтому an apple.')]),

    L(10, 5, 'Дни недели', 60, 'Назови дни недели и скажи, какой сегодня день.',
      'Дни недели в английском всегда пишутся с большой буквы. Чтобы сказать, какой сегодня день, говорят: Today is Monday.',
      ['Monday|понедельник', 'Tuesday|вторник', 'Wednesday|среда', 'Thursday|четверг', 'Friday|пятница', 'Saturday|суббота', 'Sunday|воскресенье', 'today|сегодня'],
      [M('Соедини дни недели и переводы.', [['Monday', 'понедельник'], ['Wednesday', 'среда'], ['Friday', 'пятница'], ['Sunday', 'воскресенье']], 'Неделя в англоязычных странах часто начинается с воскресенья.'),
       C('Как будет «сегодня»?', ['today', 'Friday', 'please'], 'today', '“Today” — сегодня.'),
       T('Введи по-английски: «Сегодня пятница».', ['Today is Friday.'], 'Today is + день недели.'),
       O('Собери: «Сегодня воскресенье».', ['Sunday', 'Today', 'is'], 'Today is Sunday', 'Today + is + Sunday.'),
       mix(A('Thursday', ['Thursday', 'Tuesday', 'Saturday'], 'Ты услышал(а) “Thursday” — «четверг».')),
       C('Какой день идёт после Monday?', ['Tuesday', 'Sunday', 'Friday'], 'Tuesday', 'После Monday идёт Tuesday.')]),

    L(11, 6, 'Просим о помощи', 60, 'Скажи, что не понял, и попроси помощи.',
      'Если ты не понял собеседника — это нормально. Скажи “I don’t understand” и попроси “Please speak slowly”. Слово “please” делает любую просьбу вежливой.',
      ['Excuse me!|Извините! (чтобы привлечь внимание)', 'Help me, please.|Помогите мне, пожалуйста.', "I don't understand.|Я не понимаю.", 'Please speak slowly.|Говорите медленнее, пожалуйста.', 'Can you repeat, please?|Можете повторить, пожалуйста?', 'Do you speak English?|Вы говорите по-английски?'],
      [M('Соедини фразы и переводы.', [['Excuse me!', 'Извините!'], ["I don't understand.", 'Я не понимаю.'], ['Help me, please.', 'Помогите мне, пожалуйста.'], ['Do you speak English?', 'Вы говорите по-английски?']], 'Выучи эти фразы целиком.'),
       C('Ты не понял собеседника. Что сказать?', ["I don't understand.", "I'm fine.", 'Nice to meet you.'], "I don't understand.", '“I don’t understand” — «Я не понимаю».'),
       T('Введи по-английски: «Извините!»', ['Excuse me!'], '“Excuse me!” — вежливый способ привлечь внимание.'),
       O('Собери просьбу: «Говорите медленнее, пожалуйста».', ['slowly', 'speak', 'Please'], 'Please speak slowly', 'Please + speak + slowly.'),
       mix(A('Do you speak English?', ['Do you speak English?', 'Do you like tea?', 'Do you understand?'], 'Ты услышал(а) вопрос “Do you speak English?”.')),
       C('Что значит “Can you repeat, please?”', ['Можете повторить, пожалуйста?', 'Можете помочь?', 'Как вас зовут?'], 'Можете повторить, пожалуйста?', 'Repeat — «повторить».')]),

    L(12, 6, 'Откуда ты?', 60, 'Задавай простые вопросы собеседнику и отвечай на них.',
      'Вопрос с to be строится перестановкой: вместо You are a student говорим Are you a student? Ответ: Yes, I am. или No, I’m not.',
      ['Where are you from?|Откуда ты?', "I'm from Russia.|Я из России.", 'Are you a student?|Ты студент?', 'Yes, I am.|Да.', "No, I'm not.|Нет."],
      [C('Как задать вопрос «Ты студент?»', ['Are you a student?', 'You are student a?', 'Is you a student?'], 'Are you a student?', 'В вопросе are стоит перед you.'),
       C('Ответь на “Are you from Russia?” — «Да».', ['Yes, I am.', 'Yes, you are.', 'Yes, he is.'], 'Yes, I am.', 'Отвечаешь про себя, поэтому I am.'),
       T('Введи по-английски: «Откуда ты?»', ['Where are you from?'], 'Where + are + you + from?'),
       O('Собери: «Ты студент?»', ['student', 'Are', 'a', 'you'], 'Are you a student', 'Are + you + a + student?'),
       mix(A('Where are you from?', ['Where are you from?', 'Where do you live?', 'What is your name?'], 'Ты услышал(а) “Where are you from?” — «Откуда ты?».')),
       C('Выбери ответ на “Where are you from?”.', ["I'm from Russia.", "I'm 25 years old.", "I'm fine."], "I'm from Russia.", 'Вопрос про место, значит и ответ про место.')]),

    L(13, 7, 'В кафе', 60, 'Закажи напиток, спроси цену и попроси счёт.',
      'Заказывая, говори “I’d like …, please” («Я бы хотел …»): это вежливее, чем “I want”. Чтобы узнать цену, спроси “How much is it?”.',
      ["I'd like a coffee, please.|Я бы хотел(а) кофе, пожалуйста.", 'A tea, please.|Чай, пожалуйста.', 'How much is it?|Сколько это стоит?', 'The bill, please.|Счёт, пожалуйста.', 'Here you are.|Вот, пожалуйста.', 'Thank you very much.|Большое спасибо.'],
      [C('Как вежливо заказать кофе?', ["I'd like a coffee, please.", 'Coffee now.', 'I am coffee.'], "I'd like a coffee, please.", 'I’d like … please — вежливый заказ.'),
       T('Введи по-английски: «Сколько это стоит?»', ['How much is it?'], '“How much is it?” — вопрос о цене.'),
       O('Собери: «Счёт, пожалуйста».', ['please', 'The', 'bill'], 'The bill, please', 'The bill + please.'),
       mix(A('How much is it?', ['How much is it?', 'How are you?', 'Where is it?'], 'Ты услышал(а) “How much is it?” — «Сколько это стоит?».')),
       C('Официант говорит “Here you are.” Что ответить?', ['Thank you.', 'Goodbye.', 'Sorry, no.'], 'Thank you.', '“Here you are” — «Вот, пожалуйста». Благодарим словом thank you.'),
       M('Соедини фразы и переводы.', [['A tea, please.', 'Чай, пожалуйста.'], ['How much is it?', 'Сколько это стоит?'], ['The bill, please.', 'Счёт, пожалуйста.'], ['Here you are.', 'Вот, пожалуйста.']], 'Эти фразы пригодятся в любом кафе.')]),

    L(14, 7, 'В городе: как пройти', 60, 'Спроси дорогу и пойми ответ.',
      'Чтобы спросить дорогу, скажи “Excuse me, where is …?”. В ответе ты услышишь: “Go straight” (идите прямо), “Turn left” (налево), “Turn right” (направо).',
      ['Where is the station?|Где находится вокзал?', 'Turn left.|Поверните налево.', 'Turn right.|Поверните направо.', 'Go straight.|Идите прямо.', "It's near here.|Это рядом.", 'Is it far?|Это далеко?'],
      [M('Соедини фразы и переводы.', [['Turn left.', 'Поверните налево.'], ['Turn right.', 'Поверните направо.'], ['Go straight.', 'Идите прямо.'], ['Is it far?', 'Это далеко?']], 'Выучи направления наизусть.'),
       C('Как спросить, где находится вокзал?', ['Where is the station?', 'Where station is the?', 'What is station where?'], 'Where is the station?', 'Where + is + the station?'),
       T('Введи по-английски: «Поверните налево».', ['Turn left.'], '“Turn left” — поверните налево.'),
       O('Собери: «Идите прямо».', ['straight', 'Go'], 'Go straight', 'Go + straight.'),
       mix(A('Turn right', ['Turn right', 'Turn left', 'Go straight'], 'Ты услышал(а) “Turn right” — «поверните направо».')),
       C('Тебе сказали “Turn right”. Куда идти?', ['Направо', 'Налево', 'Прямо'], 'Направо', 'Right — направо, left — налево.')]),

    L(15, 8, 'Повторение: слова и фразы', 60, 'Повтори главное из модулей 1–7.',
      'Сегодня повторяем главное. Если какое-то задание вызывает трудности, вернись к нужному уроку через «Мой путь».',
      ['Good morning!|Доброе утро!', 'Thank you|Спасибо', 'How are you?|Как дела?', 'Nice to meet you!|Приятно познакомиться!', 'Where are you from?|Откуда ты?', "I don't understand.|Я не понимаю."],
      [M('Соедини фразы и переводы.', [['Good morning!', 'Доброе утро!'], ['Thank you', 'Спасибо'], ['Goodbye!', 'До свидания!'], ['Sorry', 'Извините']], 'Повторение — основа запоминания.'),
       C('She ___ a doctor.', ['am', 'is', 'are'], 'is', 'После she ставим is.'),
       C('___ umbrella', ['a', 'an'], 'an', 'Umbrella начинается с гласного звука.'),
       T('Введи по-английски: «Мне нравится чай».', ['I like tea.'], 'I like + что нравится.'),
       O('Собери: «Меня зовут Алекс».', ['Alex', 'is', 'name', 'My'], 'My name is Alex', 'My name is + имя.'),
       mix(A('Nice to meet you', ['Nice to meet you', 'Goodbye', 'Thank you'], 'Ты услышал(а) “Nice to meet you”.')),
       C('Как спросить «Как дела?»', ['How are you?', 'Where are you?', 'Who are you from?'], 'How are you?', 'How are you? — «Как дела?».')]),

    L(16, 8, 'Итоговая проверка A0', 110, 'Проверь всё, что выучил на уровне A0.',
      'Это итоговая проверка по всему уровню A0. Не спеши: читай задание внимательно. Если ошибёшься, посмотри объяснение и попробуй ещё раз.',
      [],
      [C('Как сказать «Приятно познакомиться»?', ['Nice to meet you!', 'Good night!', 'Goodbye!'], 'Nice to meet you!', '“Nice to meet you” — фраза для знакомства.'),
       C('They ___ friends.', ['am', 'is', 'are'], 'are', 'После they ставим are.'),
       C('___ orange', ['a', 'an'], 'an', 'Orange начинается с гласного звука.'),
       T('Введи по-английски: «Я из России».', ["I'm from Russia.", 'I am from Russia.'], 'I’m from + страна.'),
       O('Собери: «Как тебя зовут?»', ['your', "What's", 'name'], "What's your name", 'What’s + your + name?'),
       T('Введи по-английски: «Сколько это стоит?»', ['How much is it?'], 'How much is it?'),
       mix(A('Turn left', ['Turn left', 'Turn right', 'Go straight'], 'Ты услышал(а) “Turn left” — «поверните налево».')),
       C('Ты не понял собеседника. Что сказать?', ["I don't understand.", "I'm fine.", 'Nice to meet you.'], "I don't understand.", '“I don’t understand” — «Я не понимаю».')],
      'Уровень A0 пройден! Ты готов к уровню A1. Он появится в следующих обновлениях платформы.')
  ];
  window.LESSONS = window.LESSONS.concat(lessons);
})();
