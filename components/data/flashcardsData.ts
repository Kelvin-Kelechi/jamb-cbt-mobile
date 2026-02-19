export interface Flashcard {
  id: string;
  front: string;
  back: string;
  topic: string;
}

export interface Deck {
  id: string;
  title: string;
  icon: string;
  color: string;
  cards: Flashcard[];
}

export const flashcardsData: Record<string, Deck> = {
  math: {
    id: "math",
    title: "Mathematics",
    icon: "function",
    color: "#4CAF50",
    cards: [
      {
        id: "m1",
        topic: "Algebra",
        front: "What is the formula for the nth term of an Arithmetic Progression (AP)?",
        back: "Tn = a + (n-1)d\n(where a = first term, d = common difference)"
      },
      {
        id: "m2",
        topic: "Algebra",
        front: "What is the quadratic formula?",
        back: "x = [-b ± √(b² - 4ac)] / 2a"
      },
      {
        id: "m3",
        topic: "Calculus",
        front: "What is the derivative of sin(x)?",
        back: "cos(x)"
      },
      {
        id: "m4",
        topic: "Calculus",
        front: "What is the derivative of cos(x)?",
        back: "-sin(x) (Negative sin x)"
      },
      {
        id: "m5",
        topic: "Indices",
        front: "Simplify x⁰ (where x ≠ 0)",
        back: "1"
      },
      {
        id: "m6",
        topic: "Logarithms",
        front: "What is log(a) + log(b)?",
        back: "log(ab)"
      },
      {
        id: "m7",
        topic: "Geometry",
        front: "What is the sum of angles in a triangle?",
        back: "180 degrees"
      },
      {
        id: "m8",
        topic: "Trigonometry",
        front: "In SOHCAHTOA, what does SOH stand for?",
        back: "Sin θ = Opposite / Hypotenuse"
      },
      {
        id: "m9",
        topic: "Statistics",
        front: "How do you calculate the Mean?",
        back: "Sum of all values / Number of values"
      },
      {
        id: "m10",
        topic: "Sets",
        front: "What is the symbol for Intersection?",
        back: "∩ (e.g., A ∩ B)"
      },
      {
        id: "m11",
        topic: "Matrices",
        front: "What is the determinant of a 2x2 matrix [a b; c d]?",
        back: "ad - bc"
      },
      {
        id: "m12",
        topic: "Circle Geometry",
        front: "What is the angle in a semicircle?",
        back: "90 degrees (Right Angle)"
      }
    ]
  },
  eng: {
    id: "eng",
    title: "English",
    icon: "textformat",
    color: "#2196F3",
    cards: [
      {
        id: "e1",
        topic: "Oral English",
        front: "Which word has the same vowel sound as 'Key': (a) Play (b) Quay (c) Eye?",
        back: "Quay (pronounced 'Key')"
      },
      {
        id: "e2",
        topic: "Concord",
        front: "Correct the sentence: 'The list of items are on the table.'",
        back: "'The list of items IS on the table.' (Subject is 'list', singular)"
      },
      {
        id: "e3",
        topic: "Idioms",
        front: "What does 'To let the cat out of the bag' mean?",
        back: "To reveal a secret"
      },
      {
        id: "e4",
        topic: "Fig. of Speech",
        front: "Identify the figure of speech: 'The wind whispered through the trees.'",
        back: "Personification"
      },
      {
        id: "e5",
        topic: "Lexis",
        front: "What is a synonym for 'Obsolete'?",
        back: "Outdated / Old-fashioned"
      },
      {
        id: "e6",
        topic: "Oral English",
        front: "Identify the silent letter in 'Psalm'.",
        back: "P"
      },
      {
        id: "e7",
        topic: "Grammar",
        front: "Choose the correct option: 'He is looking forward to ____ you.' (see/seeing)",
        back: "Seeing ('Looking forward to' is followed by a gerund)"
      },
      {
        id: "e8",
        topic: "Antonyms",
        front: "What is the antonym of 'Arrogant'?",
        back: "Humble"
      },
      {
        id: "e9",
        topic: "Idioms",
        front: "What does 'A piece of cake' mean?",
        back: "Something very easy to do"
      },
      {
        id: "e10",
        topic: "Emphasis",
        front: "In the sentence 'JOHN stole the book', what is emphasized?",
        back: "It was John (not someone else) who stole it."
      }
    ]
  },
  phy: {
    id: "phy",
    title: "Physics",
    icon: "bolt.fill",
    color: "#FF9800",
    cards: [
      {
        id: "p1",
        topic: "Motion",
        front: "What is Newton's First Law of Motion?",
        back: "A body remains at rest or uniform motion unless acted upon by an external force."
      },
      {
        id: "p2",
        topic: "Electricity",
        front: "What is Ohm's Law formula?",
        back: "V = IR (Voltage = Current × Resistance)"
      },
      {
        id: "p3",
        topic: "Waves",
        front: "What type of wave is a sound wave?",
        back: "Longitudinal Wave"
      },
      {
        id: "p4",
        topic: "Optics",
        front: "What type of lens is used to correct Myopia (Short-sightedness)?",
        back: "Concave Lens (Diverging Lens)"
      },
      {
        id: "p5",
        topic: "Heat",
        front: "What is the SI unit of Heat?",
        back: "Joule (J)"
      },
      {
        id: "p6",
        topic: "Mechanics",
        front: "Formula for Potential Energy?",
        back: "P.E. = mgh (mass × gravity × height)"
      },
      {
        id: "p7",
        topic: "Radioactivity",
        front: "Which radiation has the highest penetrating power?",
        back: "Gamma rays"
      },
      {
        id: "p8",
        topic: "Electronics",
        front: "What is a p-n junction diode used for?",
        back: "Rectification (Converting AC to DC)"
      },
      {
        id: "p9",
        topic: "Fields",
        front: "Formula for Gravitational Force between two masses?",
        back: "F = Gm₁m₂ / r²"
      },
      {
        id: "p10",
        topic: "Waves",
        front: "What phenomenon proves light is a transverse wave?",
        back: "Polarization"
      }
    ]
  },
  chem: {
    id: "chem",
    title: "Chemistry",
    icon: "flask.fill",
    color: "#F44336",
    cards: [
      {
        id: "c1",
        topic: "Atomic Structure",
        front: "What are Isotopes?",
        back: "Atoms of the same element with same proton number but different mass number."
      },
      {
        id: "c2",
        topic: "Acids/Bases",
        front: "What is the pH of a neutral solution at 25°C?",
        back: "7"
      },
      {
        id: "c3",
        topic: "Organic Chem",
        front: "General formula for Alkanes?",
        back: "CnH(2n+2)"
      },
      {
        id: "c4",
        topic: "Gas Laws",
        front: "State Boyle's Law formula.",
        back: "P1V1 = P2V2 (at constant temperature)"
      },
      {
        id: "c5",
        topic: "Electrochem",
        front: "Oxidation is the ____ of electrons.",
        back: "Loss (OIL RIG - Oxidation Is Loss)"
      },
      {
        id: "c6",
        topic: "Periodic Table",
        front: "Which group are the Halogens?",
        back: "Group 7 (VII)"
      },
      {
        id: "c7",
        topic: "Organic Chem",
        front: "What is the functional group of Alkanols?",
        back: "-OH (Hydroxyl group)"
      },
      {
        id: "c8",
        topic: "Separation",
        front: "Method to separate oil and water?",
        back: "Separating Funnel (Immiscible liquids)"
      },
      {
        id: "c9",
        topic: "Bonding",
        front: "What type of bond exists in Sodium Chloride (NaCl)?",
        back: "Ionic Bond (Electrovalent)"
      },
      {
        id: "c10",
        topic: "Stoichiometry",
        front: "What is Avogadro's constant?",
        back: "6.02 x 10²³"
      }
    ]
  },
  bio: {
    id: "bio",
    title: "Biology",
    icon: "leaf.fill",
    color: "#4DB6AC",
    cards: [
      {
        id: "b1",
        topic: "Cell Bio",
        front: "Which organelle is the 'Powerhouse' of the cell?",
        back: "Mitochondria"
      },
      {
        id: "b2",
        topic: "Genetics",
        front: "Who is the Father of Genetics?",
        back: "Gregor Mendel"
      },
      {
        id: "b3",
        topic: "Circulatory",
        front: "Which blood cells fight infection?",
        back: "White Blood Cells (Leucocytes)"
      },
      {
        id: "b4",
        topic: "Ecology",
        front: "What is Commensalism?",
        back: "Association where one benefits and the other is neither harmed nor benefited."
      },
      {
        id: "b5",
        topic: "Excretion",
        front: "What is the excretory organ of insects?",
        back: "Malpighian Tubules"
      },
      {
        id: "b6",
        topic: "Photosynthesis",
        front: "What pigment absorbs light energy in plants?",
        back: "Chlorophyll"
      },
      {
        id: "b7",
        topic: "Classification",
        front: "Which Kingdom do bacteria belong to?",
        back: "Monera"
      },
      {
        id: "b8",
        topic: "Skeletal",
        front: "Which bone is the longest in the human body?",
        back: "Femur (Thigh bone)"
      },
      {
        id: "b9",
        topic: "Reproduction",
        front: "Where does fertilization occur in humans?",
        back: "Fallopian Tube (Oviduct)"
      },
      {
        id: "b10",
        topic: "Nutrition",
        front: "Lack of Vitamin C causes which disease?",
        back: "Scurvy"
      }
    ]
  },
  eco: {
    id: "eco",
    title: "Economics",
    icon: "chart.pie.fill",
    color: "#795548",
    cards: [
      {
        id: "ec1",
        topic: "Basic Concepts",
        front: "What is Opportunity Cost?",
        back: "The alternative forgone (the next best option sacrificed)"
      },
      {
        id: "ec2",
        topic: "Demand",
        front: "State the Law of Demand.",
        back: "Higher price, lower quantity demanded (ceteris paribus)."
      },
      {
        id: "ec3",
        topic: "Production",
        front: "What are the factors of production?",
        back: "Land, Labor, Capital, Entrepreneur"
      },
      {
        id: "ec4",
        topic: "Market",
        front: "A market with a single seller is called?",
        back: "Monopoly"
      },
      {
        id: "ec5",
        topic: "Inflation",
        front: "What is Inflation?",
        back: "Persistent rise in the general price level."
      },
      {
        id: "ec6",
        topic: "Money",
        front: "What is the primary function of money?",
        back: "Medium of exchange"
      },
      {
        id: "ec7",
        topic: "Pop.",
        front: "Formula for Population Density?",
        back: "Total Population / Total Land Area"
      },
      {
        id: "ec8",
        topic: "Utility",
        front: "What is Diminishing Marginal Utility?",
        back: "Satisfaction decreases as more units are consumed."
      },
      {
        id: "ec9",
        topic: "Business",
        front: "Who bears the risk in a business?",
        back: "The Entrepreneur"
      },
      {
        id: "ec10",
        topic: "Finance",
        front: "What is a 'Bear' market?",
        back: "A market where prices are falling"
      }
    ]
  }
};
