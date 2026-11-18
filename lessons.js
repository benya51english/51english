window.lessons = [
  {
    id: "a0-lesson-1",
    level: "A0",
    number: 1,
    title: "Первый контакт",
    description: "Учимся здороваться и знакомиться",
    xp: 50,

    vocabulary: [
      { en: "Hello", ru: "Привет" },
      { en: "Good morning", ru: "Доброе утро" },
      { en: "What's your name?", ru: "Как тебя зовут?" },
      { en: "How are you?", ru: "Как дела?" },
      { en: "Nice to meet you", ru: "Приятно познакомиться" }
    ],

    exercises: [
      {
        type: "choice",
        question: "Что означает Hello?",
        options: ["Привет", "Пока", "Спасибо"],
        answer: "Привет",
        explanation: "Hello — универсальное приветствие."
      },
      {
        type: "choice",
        question: "Как сказать «Доброе утро»?",
        options: ["Good night", "Good morning", "Good evening"],
        answer: "Good morning",
        explanation: "Good morning используется утром."
      },
      {
        type: "input",
        question: "Переведи: «Как тебя зовут?»",
        answer: "What's your name?",
        explanation: "What's your name? — Как тебя зовут?"
      }
    ]
  }
]