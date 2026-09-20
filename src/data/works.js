import ap from "../assets/apple.jpg";
import fl from "../assets/fluter.jpg";
import img from "../assets/image.png";
import tw from "../assets/twilight.jpg";
import gameA from "../assets/matarhomis.png";
import cas from "../assets/cassino.png";
import hqa from "../assets/artes/quadrinnhuui.png";

export const works = {
    jogos: [
      {
        title: "Ping pong",
        img: img,
        desc: "Ping pong com estética retro bem legal",
        version: "1.0",
        developer: "André Michalsky",
        ideia:
          "Criar um mini jogo retrô jogável dentro do portfólio para demonstrar interação e criatividade.",
      },
      {
        title: "Cassino Zee",
        img: cas,
        desc: "Cassino Retrô, teste sua sorte.",
        version: "1.0",
        developer: "Geração Zee",
        ideia:
          "Cassino recriado em JavaScript (Java convertido para p5.js) para ser um projeto grafico e interativo",
      },
      {
        title: "Matar homis",
        img: gameA,
        desc: "Jogo de matar homis",
        version: "1.0",
        developer: "Geração Zee",
        ideia:
          "Jogo inspirado no galaga, com objetivo de fazer uma moça chegar em segurança em casa",
      },
    ],

    artes: [
      {
        title: "Floral Study",
        img: fl,
        tech: "Digital painting",
        year: "2024",
        desc: "Estudo de cores e composição inspirado em botânica.",
      },

      {
        title: "Character Sketch",
        img: ap,
        tech: "Digital sketch",
        year: "2023",
        desc: "Exploração de personagem em estilo estilizado.",
      },

      {
        title: "Light Composition",
        img: tw,
        tech: "Digital illustration",
        year: "2024",
        desc: "Experimento com iluminação e atmosfera.",
      },
    ],

    hqs: [
      {
        title: "Uma curiosa mancha no chão",
        img: hqa,
        desc: "Descrição do quadrinho (avaliar se é necessário)",
        year: "2025",
        pages: [hqa],
      },
    ],
  };

export const photos = [
    {
      src: "https://picsum.photos/800/500?random=1",
      title: "Aurora no campo",
      camera: "ISO 200 • f/2.8 • 1/500",
      location: "São Paulo — 2024",
    },

    {
      src: "https://picsum.photos/800/500?random=2",
      title: "Luz da manhã",
      camera: "ISO 100 • f/4 • 1/320",
      location: "Curitiba — 2023",
    },

    {
      src: "https://picsum.photos/800/500?random=3",
      title: "Reflexos urbanos",
      camera: "ISO 400 • f/5.6 • 1/125",
      location: "Rio de Janeiro — 2024",
    },

    {
      src: "https://picsum.photos/800/500?random=4",
      title: "Foto teste 1",
      camera: "ISO 200 • f/8 • 1/250",
      location: "Florianópolis — 2023",
    },
    {
      src: "https://picsum.photos/800/500?random=5",
      title: "Foto teste 2",
      camera: "ISO 200 • f/8 • 1/250",
      location: "Florianópolis — 2023",
    },
    {
      src: "https://picsum.photos/800/500?random=6",
      title: "Foto teste 2",
      camera: "ISO 200 • f/8 • 1/250",
      location: "Florianópolis — 2023",
    },
  ];
