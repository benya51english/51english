/* Уроки 51 English. Чтобы добавить урок, допишите объект в конец массива.
   Типы упражнений: choice (options + answer), text (answer: строка или список допустимых), order (words + answer).
   reviewed:false = материал ещё не проверен преподавателем, на странице урока показывается пометка. */
window.LESSONS = [
  {
    id: "a0-01", level: "A0", module: 1, title: "Первый контакт", xp: 50, reviewed: false,
    goal: "Научись поздороваться, назвать своё имя и поддержать самый первый короткий разговор на английском. Не пытайся выучить всё сразу — проходи по шагам.",
    explain: "Чтобы познакомиться, говорят “My name is…” («Меня зовут…») и называют своё имя. Чтобы спросить имя собеседника, говорят “What’s your name?”. На вопрос “How are you?” отвечают, например, “I’m fine, thank you.”",
    summary: "Ты познакомился с базовыми приветствиями и фразами для первого разговора. Повтори их вслух, чтобы лучше запомнить.",
    vocab: [
      { en: "Hello! / Hi!", ru: "Привет! Здравствуйте!", say: "Hello! Hi!" },
      { en: "Good morning!", ru: "Доброе утро!" },
      { en: "My name is Alex.", ru: "Меня зовут Алекс." },
      { en: "What's your name?", ru: "Как тебя зовут?" },
      { en: "How are you?", ru: "Как дела?" },
      { en: "I'm fine, thank you.", ru: "У меня всё хорошо, спасибо." },
      { en: "Nice to meet you!", ru: "Приятно познакомиться!" }
    ],
    exercises: [
      { type: "choice", q: "Что означает “Hello”?", options: ["Пока!", "Привет!", "Спасибо!"], answer: "Привет!",
        explain: "“Hello” — универсальное приветствие. Его можно использовать и при встрече, и в более официальной ситуации." },
      { type: "choice", q: "Какое приветствие обычно используют утром?", options: ["Good morning!", "Good night!", "Goodbye!"], answer: "Good morning!",
        explain: "“Good morning” означает «Доброе утро». “Good night” обычно говорят перед сном." },
      { type: "text", q: "Введи по-английски: «Как тебя зовут?»", answer: ["What's your name", "What is your name"], show: "What's your name?",
        explain: "“What’s your name?” — вопрос о том, как зовут собеседника." },
      { type: "choice", q: "My name ___ Alex.", options: ["am", "is", "are"], answer: "is",
        explain: "“My name is…” — устойчивая конструкция «Меня зовут…». Здесь используется is." },
      { type: "text", q: "Переведи на английский: «Меня зовут Алекс».", answer: "My name is Alex", show: "My name is Alex.",
        explain: "Начни с “My name is…”, затем добавь имя." },
      { type: "order", q: "Собери фразу: «Приятно познакомиться!»", words: ["meet", "Nice", "you", "to"], answer: "Nice to meet you", show: "Nice to meet you!",
        explain: "Фраза строится так: Nice + to + meet + you." },
      { type: "choice", q: "Тебя спросили “How are you?”. Как можно ответить?", options: ["I'm fine, thank you.", "My name is Alex.", "Good morning!"], answer: "I'm fine, thank you.",
        explain: "“How are you?” — «Как дела?». Один из простых ответов: “I’m fine, thank you.”" },
      { type: "text", q: "Введи фразу: «Приятно познакомиться!»", answer: "Nice to meet you", show: "Nice to meet you!",
        explain: "Запомни фразу целиком: “Nice to meet you!” — «Приятно познакомиться!»" }
    ]
  }
];
