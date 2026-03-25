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
    { id: 1, img: gato1, name: "Gato Laranja", type: "cat" },
    { id: 2, img: gato2, name: "Gato Preto e Branco", type: "cat" },
    { id: 3, img: gato3, name: "Gato Preto", type: "cat" },
    { id: 4, img: gato4, name: "Gato Branco", type: "cat" },
    { id: 5, img: gato5, name: "Gato Siamês", type: "cat" },
    { id: 6, img: gato6, name: "Gato Cinza", type: "cat" },
    { id: 7, img: gato7, name: "Gato Rajado", type: "cat" },
    { id: 8, img: gato8, name: "Gato Laranja Claro", type: "cat" },

    { id: 9, img: globo, name: "Disco", type: "disco" },
    { id: 10, img: morango, name: "morango", type: "morango" },
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

  const generateRandomPack = () => {
    const shuffled = [...stickers].sort(() => 0.5 - Math.random());
    const pack = shuffled.slice(0, 3);

    setPackStickers(pack);
  };

  useEffect(() => {
    if (collected.length === stickers.length) {
      unlockAchievements("Colecionador 🎉")
    }
  }, [collected])

  useEffect(() => {
    if (pendingSticker.length === 0) return;
   
    setTimeout(() => {
      setTimeout(() => {
      setAnimatingStickers(pendingSticker)

      setCollected(prev => {
        const ids = new Set(prev)
        pendingSticker.forEach(s => ids.add(s.id))
        return [...ids]
      })

      setAnimatingStickers([])
      setPendingSticker([])
                        
  }, 1400)
}, 300)
}, [pendingSticker])

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
              {stickers.slice(8, 10).map((sticker) => (
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
  </div>
);
}

export default StickerBook;
