import "./work.css";
import { lazy, Suspense, useState } from "react";

import { works, photos } from "../../data/works";
const PongGame = lazy(() => import("../games/pong/pong"));
const AlienGame = lazy(() => import("../games/alienGame/alienGame"));
const CassinoGame = lazy(() => import("../games/cassino/cassino"));


function Works({ unlockAchievements, theme }) {
  const [category, setCategory] = useState("jogos");
  const [selected, setSelected] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [navyHistory, setNavyHistory] = useState([]);
  const [activeGame, setActiveGame] = useState(null);
  const [selectedArt, setSelectedArt] = useState(null);


  const changeCategory = (cat) => {
    setCategory(cat);
    setSelected(null);
    setSelectedPhoto(null);
    setShowInfo(false);

    setSelectedArt(null);
    const updated = [...navyHistory, cat];
    const target = ["hqs", "fotos", "jogos", "artes"];
    let matchIndex = 0;
    for (const item of updated) {
      if (item === target[matchIndex]) matchIndex++;
    }
    if (matchIndex === target.length) unlockAchievements("Curador da galeria 🖼");
    setNavyHistory(updated.slice(-5));
  };

  return (
    <div className={`explorer-window theme-${theme}`}>
      <div className="explorer-body">
        <div className="explorer-sidebar">
          <button type="button"
            className={`folder ${category === "jogos" ? "active" : ""}`}
            onClick={() => changeCategory("jogos")}
          >
            📁 jogos
          </button>

          <button type="button"
            className={`folder ${category === "fotos" ? "active" : ""}`}
            onClick={() => changeCategory("fotos")}
          >
            📁 Fotografias
          </button>

          <button type="button"
            className={`folder ${category === "artes" ? "active" : ""}`}
            onClick={() => changeCategory("artes")}
          >
            📁 Artes
          </button>

          <button type="button"
            className={`folder ${category === "hqs" ? "active" : ""}`}
            onClick={() => changeCategory("hqs")}
          >
            📁 Quadrinhos
          </button>
        </div>

          <div className="explorer-content">
            <div className="explorer-path">C:\Portifolio\Trabalhos\{category}</div>

            <div className="explorer-files">
              {/* GRID NORMAL */}

              {category !== "fotos" &&
                category !== "artes" &&
                category !== "hqs" && (
                  <div className="works-grid">
                    {works[category].map((item) => (
                      <button type="button"
                        className="work-card"
                        key={item.title}
                        onClick={() => setSelected(item)}
                      >
                        <img src={item.img} alt={item.title} />

                        <div className="work-overlay">
                          <h4>{item.title}</h4>
                          <p>{item.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

              {/* GALERIA DE FOTOS */}

              {category === "fotos" && (
                <div className="photo-gallery">
                  {photos.map((photo) => (
                    <button type="button"
                      key={photo.src}
                      className="photo-card"
                      onClick={() => setSelectedPhoto(photo)}
                    >
                      <img src={photo.src} alt={photo.title} loading="lazy" />
                    </button>
                  ))}
                </div>
              )}

              {/* VISUALIZADOR DE FOTO */}

              {selectedPhoto && (
                <div
                  className="photo-view"
                  onClick={() => setSelectedPhoto(null)}
                >
                  <div className="photo-view-content">
                    <img src={selectedPhoto.src} alt={selectedPhoto.title} />

                    <div className="photo-info">
                      <h3>{selectedPhoto.title}</h3>

                      <p>{selectedPhoto.camera}</p>

                      <p>{selectedPhoto.location}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* {VIZUALIZADOR DE ARTES} */}

              {category === "artes" && (
                <div className="art-gallery">
                  {works.artes.map((art) => (
                    <button type="button"
                      key={art.title}
                      className="art-card"
                      onClick={() => setSelectedArt(art)}
                    >
                      <img src={art.img} alt={art.title} loading="lazy" />

                      <div className="art-overlay">
                        <h4>{art.title}</h4>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* LAUNCHER DOS JOGOS */}

              {selected && category === "jogos" && (
                <div className="launcher-modal">
                  <div className="launcher-window">
                    <div className="launcher-header">
                      <span>{selected.title}.exe</span>
                      <button onClick={() => setSelected(null)}>X</button>
                    </div>

                    <div className="launcher-body">
                      <img src={selected.img} alt={selected.title} />

                      <div className="launcher-info">
                        <h2>{selected.title}</h2>
                        <p>{selected.desc}</p>
                      </div>

                      <div className="launcher-buttons">
                        <button
                          className="play-btn"
                          onClick={() => {
                            setActiveGame(selected.title);
                          }}
                        >
                          ▶ Jogar
                        </button>

                        <button
                          className="info-btn"
                          onClick={() => setShowInfo(true)}
                        >
                          📖 Sobre
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {category === "hqs" && (
                <div className="hq-grid">
                  {works.hqs.map((hq) => (
                    <button type="button"
                      key={hq.title}
                      className="hq-card"
                      onClick={() => setSelected(hq)}
                    >
                      <img src={hq.img} alt={hq.title} loading="lazy" />

                      <div className="hq-badge">NEW</div>

                      <div className="hq-info">
                        <h3>{hq.title}</h3>
                        <p>{hq.year}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* JOGO */}

              <Suspense fallback={<div className="game-loading" role="status">Carregando jogo...</div>}>
                {activeGame === "Ping pong" && <PongGame onClose={() => setActiveGame(null)} />}
                {activeGame === "Matar homis" && <AlienGame onClose={() => setActiveGame(null)} />}
                {activeGame === "Cassino Zee" && <CassinoGame onClose={() => setActiveGame(null)} />}
              </Suspense>

              {/* MODAL SOBRE */}

              {showInfo && selected && (
                <div className="info-modal">
                  <div className="info-window">
                    <div className="info-header">
                      <span>Sobre {selected.title}</span>

                      <button onClick={() => setShowInfo(false)}>X</button>
                    </div>

                    <div className="info-content">
                      <h2>{selected.title}</h2>

                      <p>
                        <b>Versão:</b> {selected.version || "N/A"}
                      </p>
                      <p>
                        <b>Desenvolvedor:</b> {selected.developer || "N/A"}
                      </p>

                      <p>
                        <b>Ideia:</b>
                      </p>

                      <p>{selected.ideia || "Descrição não disponível."}</p>
                    </div>
                  </div>
                </div>
              )}

              {selectedArt && (
                <div className="art-view" onClick={() => setSelectedArt(null)}>
                  <div className="art-view-content">
                    <img src={selectedArt.img} alt={selectedArt.title} />

                    <div className="art-info">
                      <h2>{selectedArt.title}</h2>

                      <p>
                        {selectedArt.tech} • {selectedArt.year}{" "}
                      </p>

                      <p>{selectedArt.desc}</p>
                    </div>
                  </div>
                </div>
              )}

              {selected && category === "hqs" && (
                <div className="hq-modal" onClick={() => setSelected(null)}>
                  <div
                    className="hq-modal-content"
                    onClick={() => setSelected(null)}
                  >
                    <button
                      className="hq-close"
                      onClick={() => setSelected(null)}
                    >
                      X
                    </button>

                    <div className="hq-reader">
                      <img src={selected.pages[0]} alt={selected.title} />
                    </div>

                    <div className="hq-meta">
                      <h2>{selected.title}</h2>
                      <p>{selected.year}</p>
                      <p>{selected.desc}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
      </div>
    </div>
  );
}

export default Works;
