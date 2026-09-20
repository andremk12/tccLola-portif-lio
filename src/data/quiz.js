import ap from "../assets/apple.jpg";
import fl from "../assets/fluter.jpg";
import tw from "../assets/twilight.jpg";
import rbd from "../assets/rbd.jpg";
import pp from "../assets/pikie.png";
import rar from "../assets/rarity.jpg";


export const poneis = [
  {
    name: "Twilight Sparkle",
    desc: "A princesa da amizade ✨",
    img: tw,
    color: "#a55eea",
  },
  {
    name: "Rainbow Dash",
    desc: "20% mais rápida ⚡",
    img: rbd,
    color: "#00a8ff",
  },
  {
    name: "Pinkie Pie",
    desc: "Caos e festas 🎉",
    img: pp,
    color: "#ff6bcb",
  },
  {
    name: "Fluttershy",
    desc: "Timidez nível máximo 🦋",
    img: fl,
    color: "#feca57",
  },
  {
    name: "Rarity",
    desc: "Elegância absoluta 💎",
    img: rar,
    color: "#dfe6e9",
  },
  {
    name: "Apple Jack",
    desc: "Honestidade acima de tudo 🍎",
    img: ap,
    color: "#e17055",
  },
];

export const questions = [
  {
    question: "Qual sua atividade favorita?",
    options: [
      { text: "Ler livros", pony: "Twilight Sparkle" },
      { text: "Praticar esportes", pony: "Rainbow Dash" },
      { text: "Ir para festas", pony: "Pinkie Pie" },
      { text: "Cuidar de animais", pony: "Fluttershy" },
      { text: "Moda e arte", pony: "Rarity" },
      { text: "Trabalho ao ar livre", pony: "Apple Jack" }
    ]
  },

  {
    question: "Como seus amigos te descrevem?",
    options: [
      { text: "Inteligente", pony: "Twilight Sparkle" },
      { text: "Corajoso", pony: "Rainbow Dash" },
      { text: "Engraçado", pony: "Pinkie Pie" },
      { text: "Gentil", pony: "Fluttershy" },
      { text: "Elegante", pony: "Rarity" },
      { text: "Confiável", pony: "Apple Jack" }
    ]
  },

  {
    question: "Qual defeito combina mais com você?",
    options: [
      { text: "Perfeccionismo", pony: "Twilight Sparkle" },
      { text: "Impulsividade", pony: "Rainbow Dash" },
      { text: "Agitação", pony: "Pinkie Pie" },
      { text: "Timidez", pony: "Fluttershy" },
      { text: "Vaidade", pony: "Rarity" },
      { text: "Teimosia", pony: "Apple Jack" }
    ]
  },

  {
    question: "O que você faria num apocalipse?",
    options: [
      { text: "Montaria um plano", pony: "Twilight Sparkle" },
      { text: "Viraria herói", pony: "Rainbow Dash" },
      { text: "Tentaria animar todos", pony: "Pinkie Pie" },
      { text: "Salvaria os animais", pony: "Fluttershy" },
      { text: "Continuaria fabuloso", pony: "Rarity" },
      { text: "Resolveria na força bruta", pony: "Apple Jack" }
    ]
  },

  {
    question: "Escolha uma comida:",
    options: [
      { text: "Sanduíche", pony: "Twilight Sparkle" },
      { text: "Energético", pony: "Rainbow Dash" },
      { text: "Bolo", pony: "Pinkie Pie" },
      { text: "Salada", pony: "Fluttershy" },
      { text: "Macaron francês", pony: "Rarity" },
      { text: "Torta de maçã", pony: "Apple Jack" }
    ]
  }
]
