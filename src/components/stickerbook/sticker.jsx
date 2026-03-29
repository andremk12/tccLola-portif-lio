import "./sticker.css";
import HTMLFlipBook from "react-pageflip";

import gato1 from "../../assets/stickers/gato1.png";
import gato2 from "../../assets/stickers/gato2.png";
import gato3 from "../../assets/stickers/gato3.png";
import gato4 from "../../assets/stickers/gato4.png";
import gato5 from "../../assets/stickers/gato5.png";
import gato6 from "../../assets/stickers/gato6.png";
import gato7 from "../../assets/stickers/gato7.png";
import gato8 from "../../assets/stickers/gato8.png";
import globo from "../../assets/stickers/globooopronto.png";
import morango from "../../assets/stickers/moranguus.png";
import camarao from "../../assets/stickers/camaraoManeiro.png"
import penguim from "../../assets/stickers/penguim.png"

import { useState, useRef, useEffect } from "react";

function StickerSLot({ sticker, collected, animatingStickers }) {
  const isCollected = collected.includes(sticker.id);

  const isAnimating = animatingStickers.some(s => s.id === sticker.id)

  return (
    <div className={`sticker-wrapper ${sticker.type}`}>
      <div className="sticker-card">
        {(isCollected || isAnimating) ? (
          <img
            src={sticker.img}
            className={`sticker ${sticker.type} ${isAnimating ? "sticker-glue" : ""}`} />
        ) : (
          <div className="empty-slot">
            <span>?</span>
          </div>
        )}
      </div>
    </div>
  );
}

function StickerBook({ onClose, unlockAchievements }) {
 const stickers = [
  { id: 1, img: gato1, name: "Gato Laranja", type: "cat", rarity: "common" },
  { id: 2, img: gato2, name: "Gato Preto e Branco", type: "cat", rarity: "legendary" }, // MAIS RARO
  { id: 3, img: gato3, name: "Gato Preto", type: "cat", rarity: "rare" },
  { id: 4, img: gato4, name: "Gato Branco", type: "cat", rarity: "common" },
  { id: 5, img: gato5, name: "Gato Siamês", type: "cat", rarity: "rare" },
  { id: 6, img: gato6, name: "Gato Cinza", type: "cat", rarity: "common" },
  { id: 7, img: gato7, name: "Gato Rajado", type: "cat", rarity: "rare" },
  { id: 8, img: gato8, name: "Gato Laranja Claro", type: "cat", rarity: "common" },

  { id: 9, img: globo, name: "Disco", type: "disco", rarity: "legendary" },
  { id: 10, img: morango, name: "Morango", type: "morango", rarity: "common" },

  { id: 11, img: camarao, name: "Camarão", type: "camarao", rarity: "rare" },
  { id: 12, img: penguim, name: "Pinguim", type: "penguim", rarity: "common" },
];
  const bookRef = useRef(null);

  const nextPage = () => {
    if (!bookRef.current) return;

    const page = bookRef.current.pageFlip().getCurrentPageIndex();
    bookRef.current.pageFlip().flip(page + 1);
  };

  const prevPage = () => {
    if (!bookRef.current) return;

    const page = bookRef.current.pageFlip().getCurrentPageIndex();
    bookRef.current.pageFlip().flip(page - 1);
  };


  const [packStage, setPackStage] = useState("closed");
  const [showPack, setShowPack] = useState(false);

  const [packStickers, setPackStickers] = useState([]);
  const [collected, setCollected] = useState([]);
  const [animatingStickers, setAnimatingStickers] = useState([])
  const [pendingSticker, setPendingSticker] = useState([])

  const randomFrom = (arr) => 
    arr[Math.floor(Math.random() * arr.length)]
  

  const getRandomSticker = () => {
    const rand = Math.random()

    if (rand < 0.6) {
      return randomFrom(stickers.filter(s => s.rarity === "common"))
    } else if (rand < 0.9) {
      return randomFrom(stickers.filter(s => s.rarity === "rare"))
    } else {
      return randomFrom(stickers.filter(s => s.rarity === "legendary"))
    }
  }

  const generateRandomPack = () => {
  const pack = []

  while (pack.length < 3) {
    const sticker = getRandomSticker()

    if (!pack.find(s => s.id === sticker.id)) {
      pack.push(sticker)
    }
  }

  setPackStickers(pack)
}
  
  const [coins, setCoins] = useState(0)



  useEffect(() => {
    if (collected.length === stickers.length) {
      unlockAchievements("Colecionador 🎉")
    }
  }, [collected])

 useEffect(() => {
  if (pendingSticker.length === 0) return;

  setTimeout(() => {
    setAnimatingStickers(pendingSticker);

    setCollected(prev => {
      const ids = new Set(prev);

      pendingSticker.forEach(s => {
        if (ids.has(s.id)) {
          if (s.rarity === "common") setCoins(c => c + 1);
          if (s.rarity === "rare") setCoins(c => c + 3);
          if (s.rarity === "legendary") setCoins(c => c + 8);
        } else {
          ids.add(s.id);
          setCoins(c => c + 1);
        }
      });

      return [...ids];
    });

    setAnimatingStickers([]);
    setPendingSticker([]);
  }, 1200);
}, [pendingSticker]);

const [showShop, setShowShop] = useState(false)

const getPrice = (rarity) => {
  if (rarity === "common") return 5
  if (rarity === "rare") return 12
  if (rarity === "legendary") return 25
}

const buySticker = (sticker) => {
  const price = getPrice(sticker.rarity)

  if (coins < price) return

  setCoins(c => c - price)

  setCollected(prev => {
    if (prev.includes(sticker.id)) return prev
    return [...prev, sticker.id]
  })
}


return (
  <div className="stickerbook-overlay">
    <button className="nav-left" onClick={prevPage}>
      ◀
    </button>

    <button className="nav-right" onClick={nextPage}>
      ▶
    </button>

    <div className="stickerbook-window">
      <div className="album-header">
        
        <button onClick={() => setShowShop(true)} className="open-pack">
            🛒 Loja
        </button>
        
        <button
          className="open-pack"
          onClick={() => {
            generateRandomPack();
            setShowPack(true);
            setPackStage("closed");
          }}
        >
          🎁 Abrir pacote
        </button>

        <button className="close-book" onClick={onClose}>
          ✖
        </button>
      </div>

      <HTMLFlipBook
        width={420}
        height={550}
        showCover={true}
        drawShadow={true}
        maxShadowOpacity={0.5}
        ref={bookRef}
      >
        <div className="page cover">
          <div className="cover-content">
            <h1>Meus adesivos</h1>
            <p>Geração Zee Collection</p>
            <p>Clique para navegar</p>
          </div>
        </div>

        <div className="page">
          <div className="album-page">
            <h2>Página 1</h2>

            <div className="sticker-grid">
              {stickers.slice(0, 4).map((sticker) => (
                <StickerSLot
                  key={sticker.id}
                  sticker={sticker}
                  collected={collected}
                  animatingStickers={animatingStickers}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="page">
          <div className="album-page">
            <h2>Página 2</h2>

            <div className="sticker-grid">
              {stickers.slice(4, 8).map((sticker) => (
                <StickerSLot
                  key={sticker.id}
                  sticker={sticker}
                  collected={collected}
                  animatingStickers={animatingStickers}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="page">
          <div className="album-page">
            <h2>Página 3</h2>

            <div className="sticker-grid">
              {stickers.slice(8, 12).map((sticker) => (
                <StickerSLot
                  key={sticker.id}
                  sticker={sticker}
                  collected={collected}
                  animatingStickers={animatingStickers}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="page back-cover">
          <div className="cover-content">
            <h1>Fim do Álbum</h1>
            <p>Mais figurinhas em breve...</p>
          </div>
        </div>
      </HTMLFlipBook>
    </div>

    {showPack && (
      <div className="pack-overlay">
        <div className={`pack ${packStage}`}>
          <button
            className="close-pack-top"
            onClick={() => setShowPack(false)}
          >
            ✕
          </button>

          {packStage === "closed" && (
            <button
              className="tear-pack"
              onClick={() => {
                setPackStage("opening");

                setTimeout(() => {
                  setPackStage("opened");
                }, 600);
              }}
            >
              Rasgar pacote
            </button>
          )}
        </div>

        {packStage === "opened" && (
          <div className="revealed-stickers">
            {packStickers.map((s) => (
              <div className="pack-slot" key={s.id}>
                <div className="sticker-wrapper">
                  <div className="sticker-card">
                    <img
                      src={s.img}
                      className={`revealed-sticker ${s.type}`}
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              className="close-pack"
              onClick={() => {
                setPendingSticker(packStickers)
                setShowPack(false)
              }}>
              Guardar
            </button>
          </div>
        )}
      </div>
    )}


    {showShop && (
      <div className="shop-overlay">
        <div className="shop-window">
            <button className="close-shop" onClick={() => setShowShop(false)}>
              ✕
            </button>
            
            <h2>🛒 Loja de Figurinhas (Compra em desenvolvimento)</h2>

            <div className="physical-banner">
                <div className="physical-badge"> Os adesivos são reais! </div>
                <div className="physical-content">
                  <p>Todos os meus adesivos podem ser adiquiridos fisicamente! Entre em contato</p>

                  <button
                    className="btn-contact-s"
                    onClick={onClose}
                  >
                      📲 Entrar em contato
                  </button>
                </div>
            </div>


            <p>💰 Moedas: {coins}</p>

            <div className="shop-grid">
                {stickers.map(s => (
                  <div key= {s.id} className={`shop-item ${s.rarity}`}>
                      <img src={s.img} className={`shop-img ${s.type}`}/>

                      <p>{s.name}</p>
                      <span>{s.rarity}</span>

                      <button disabled={coins < getPrice(s.rarity)} onClick={() => buySticker(s)} className={`btn btn-buy ${s.rarity}`}>
                          Comprar ({getPrice(s.rarity)})
                      </button>

                  </div>
                ))}
            </div>
        </div>
      </div>
    )

    }

  </div>
);
}

export default StickerBook;
