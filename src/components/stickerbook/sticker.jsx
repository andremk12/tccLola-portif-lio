import { useDialog } from "../../hooks/useDialog"
import "./sticker.css";
import HTMLFlipBook from "react-pageflip";

import { useState, useRef, useEffect } from "react";
import { stickers } from "../../data/stickers";
import { collectPack, purchaseSticker, stickerPrices } from "../../utils/stickers";
import { useTimeouts } from "../../hooks/useTimeouts";

function StickerSlot({ sticker, collected, animatingStickers }) {
  const isCollected = collected.includes(sticker.id);

  const isAnimating = animatingStickers.some(s => s.id === sticker.id)

  return (
    <div className={`sticker-wrapper ${sticker.type}`}>
      <div className="sticker-card">
        {(isCollected || isAnimating) ? (
          <img
            src={sticker.img}
            alt={sticker.name}
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

function StickerBook({ onClose, onContact, unlockAchievements }) {
  const dialogRef = useDialog(onClose)
  const bookRef = useRef(null);
  const flipInstance = useRef(null);
  const { schedule, cancel } = useTimeouts();
  useEffect(() => () => {
    flipInstance.current?.destroy();
    flipInstance.current = null;
  }, []);


  const nextPage = () => {
    bookRef.current?.pageFlip()?.flipNext();
  };

  const prevPage = () => {
    bookRef.current?.pageFlip()?.flipPrev();
  };


  const [packStage, setPackStage] = useState("closed");
  const [showPack, setShowPack] = useState(false);

  const [packStickers, setPackStickers] = useState([]);
  const [collection, setCollection] = useState({ collected: [], coins: 0 });
  const collectionRef = useRef(collection);
  const { collected, coins } = collection;
  const updateCollection = next => {
    collectionRef.current = next;
    setCollection(next);
    if (next.collected.length === stickers.length) unlockAchievements("Colecionador 🎉");
  };
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

  const [showShop, setShowShop] = useState(false)
  const getPrice = rarity => stickerPrices[rarity]
  const buySticker = sticker => updateCollection(purchaseSticker(collectionRef.current, sticker))
  const savePack = () => {
    if (pendingSticker.length) return
    const pack = packStickers
    setPendingSticker(pack)
    setShowPack(false)
    schedule("collect", () => {
      updateCollection(collectPack(collectionRef.current, pack))
      setAnimatingStickers(pack)
      setPendingSticker([])
      schedule("glue", () => setAnimatingStickers([]), 800)
    }, 1200)
  }


return (
  <div ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-label="Álbum de figurinhas" className="stickerbook-overlay">
    <button className="nav-left" aria-label="Página anterior" onClick={prevPage}>
      ◀
    </button>

    <button className="nav-right" aria-label="Próxima página" onClick={nextPage}>
      ▶
    </button>

    <div className="stickerbook-window">
      <div className="album-header">

        <button onClick={() => setShowShop(true)} className="open-pack">
            🛒 Loja
        </button>

        <button
          className="open-pack"
          disabled={pendingSticker.length > 0}
          onClick={() => {
            generateRandomPack();
            setShowPack(true);
            setPackStage("closed");
          }}
        >
          🎁 Abrir pacote
        </button>

        <button className="close-book" aria-label="Fechar álbum" onClick={onClose}>
          ✖
        </button>
      </div>

      <HTMLFlipBook
        onInit={event => { flipInstance.current = event.object }}
        size="stretch"
        minWidth={240}
        maxWidth={420}
        minHeight={314}
        maxHeight={550}
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
                <StickerSlot
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
                <StickerSlot
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
                <StickerSlot
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
            className="close-pack-top" aria-label="Fechar pacote"
            onClick={() => { cancel("tear"); setShowPack(false) }}
          >
            ✕
          </button>

          {packStage === "closed" && (
            <button
              className="tear-pack"
              onClick={() => {
                setPackStage("opening");

                schedule("tear", () => {
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
                      src={s.img} alt={s.name}
                      className={`revealed-sticker ${s.type}`}
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              className="close-pack"
              onClick={savePack}>
              Guardar
            </button>
          </div>
        )}
      </div>
    )}


    {showShop && (
      <div className="shop-overlay">
        <div className="shop-window">
            <button className="close-shop" aria-label="Fechar loja" onClick={() => setShowShop(false)}>
              ✕
            </button>

            <h2>🛒 Loja de Figurinhas (Compra em desenvolvimento)</h2>

            <div className="physical-banner">
                <div className="physical-badge"> Os adesivos são reais! </div>
                <div className="physical-content">
                  <p>Todos os meus adesivos podem ser adiquiridos fisicamente! Entre em contato</p>

                  <button
                    className="btn-contact-s"
                    onClick={onContact}
                  >
                      📲 Entrar em contato
                  </button>
                </div>
            </div>


            <p>💰 Moedas: {coins}</p>

            <div className="shop-grid">
                {stickers.map(s => (
                  <div key= {s.id} className={`shop-item ${s.rarity}`}>
                      <img src={s.img} alt={s.name} className={`shop-img ${s.type}`}/>

                      <p>{s.name}</p>
                      <span>{s.rarity}</span>

                      <button disabled={collected.includes(s.id) || coins < getPrice(s.rarity)} onClick={() => buySticker(s)} className={`btn btn-buy ${s.rarity}`}>
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
