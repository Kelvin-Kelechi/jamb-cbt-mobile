export type Question = {
  instruction?: string;
  question?: string;
  options?: string[];
  answer?: string;
  correction?: string;
};

const base: Question[] = [
  {
    instruction: "Choose the option that best completes the gap(s)... [Read More]",
    question: "You'd rather not attend the meeting ——",
    options: ["would you", "wouldn't you", "did you", "didn't you"],
    answer: "wouldn't you",
    correction: "The correct tag for a negative preference uses 'wouldn't you'.",
  },
  {
    question: "'To have a chip on one's shoulder' suggests that someone",
    options: [
      "is carrying a heavy load",
      "has an injury",
      "is resentful about something",
      "is feeling triumphant",
    ],
    answer: "is resentful about something",
    correction: "The idiom means bearing a grudge or resentment.",
  },
];

const banks: Question[] = [
  {
    question: "Which organelle is responsible for energy production in cells?",
    options: ["Golgi apparatus", "Mitochondria", "Nucleus", "Ribosome"],
    answer: "Mitochondria",
    correction: "Mitochondria carry out cellular respiration producing ATP.",
  },
  {
    question: "Simplify: 2x + 3x − x",
    options: ["4x", "3x", "2x", "5x"],
    answer: "4x",
    correction: "2x + 3x − x = (2 + 3 − 1)x = 4x.",
  },
  {
    question: "Which is a chemical property of matter?",
    options: ["Density", "Boiling point", "Reactivity", "Color"],
    answer: "Reactivity",
    correction: "Reactivity describes how a substance interacts chemically.",
  },
  {
    question: "The past participle of 'go' is",
    options: ["went", "gone", "go", "going"],
    answer: "gone",
    correction: "Go → went → gone.",
  },
  {
    question: "Nigeria's capital city is",
    options: ["Lagos", "Abuja", "Ibadan", "Kano"],
    answer: "Abuja",
    correction: "Abuja became the capital in 1991.",
  },
  {
    question: "Which law states that current is directly proportional to voltage?",
    options: ["Boyle's law", "Ohm's law", "Newton's first law", "Hooke's law"],
    answer: "Ohm's law",
    correction: "V = IR.",
  },
  {
    instruction: "Read the sentence and choose the correct synonym.",
    question: "Select the synonym of 'benevolent'",
    options: ["kind", "hostile", "stingy", "rude"],
    answer: "kind",
    correction: "Benevolent means kind or charitable.",
  },
  {
    question: "Which gas is most abundant in Earth's atmosphere?",
    options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Argon"],
    answer: "Nitrogen",
    correction: "Nitrogen is about 78% of the atmosphere.",
  },
  {
    question: "Find the value: 7² − 5²",
    options: ["24", "12", "49", "25"],
    answer: "24",
    correction: "49 − 25 = 24.",
  },
  {
    question: "Which layer of the plant is responsible for photosynthesis?",
    options: ["Xylem", "Phloem", "Mesophyll", "Epidermis"],
    answer: "Mesophyll",
    correction: "Chloroplasts are abundant in mesophyll cells.",
  },
];

export function sampleQuestions(): Question[] {
  const arr: Question[] = [];
  const all = [...base, ...banks];
  for (let i = 0; i < 50; i++) {
    const b = all[i % all.length];
    arr.push({
      instruction: b.instruction,
      question: b.question ? `${b.question} (${i + 1})` : undefined,
      options: b.options,
      answer: b.answer,
      correction: b.correction,
    });
  }
  return arr;
}