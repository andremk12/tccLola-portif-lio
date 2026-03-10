import "./sticker.css"
import HTMLFlipBook from "react-pageflip"

function StickerBook({ onClose }) {
    return (
        <div className="stickerbook-overlay"> 
            <div className="stickerbook-window">

                <button className="close-book" onClick={onClose}> 
                    ✖ 
                </button>

                <HTMLFlipBook
                    width={420}
                    height={550}
                    showCover = {true}
                    drawShadow = {true}
                    maxShadowOpacity={0.5}
                >

                    <div className="page cover">
                        <div class = "cover-content">
                            <h1>Meus adesivos</h1>
                            <p>Geração Zee Collection</p>
                            <p>Clique para navegar</p>
                        </div>
                    </div>

                    <div className="page">
                        <div className="album-page">
                            <h2>Página 1</h2>

                                <span className="floating-sticker float1">🌈</span>
                                <span className="floating-sticker float2">🚀</span>
                                <span className="floating-sticker float3">⭐</span>
                                <span className="floating-sticker float4">🎨</span>
                                            

                            <div className="sticker-grid">

                            
                                <div className="sticker-slot"></div>
                                <div className="sticker-slot"></div>
                                <div className="sticker-slot"></div>
                                <div className="sticker-slot"></div>
                            </div>
                        </div>
                    </div>

                    <div className="page">
                        <div className="album-page">
                            <h2>Página 2</h2>

                                <span className="floating-sticker float1">✏️</span>
                                <span className="floating-sticker float2">💎</span>
                                <span className="floating-sticker float3">💥</span>
                                <span className="floating-sticker float4">👑</span>

                            <div className="sticker-grid">

                                <div className="sticker-slot"></div>
                                <div className="sticker-slot"></div>
                                <div className="sticker-slot"></div>
                                <div className="sticker-slot"></div>
                            </div>
                        </div>
                    </div>

                    <div className="page back-cover">
                        <div class = "cover-content">
                            <h1>Fim do Álbum</h1>
                            <p>Mais figurinhas em breve...</p>
                        </div>
                    </div>
                    
                
                </HTMLFlipBook>
                

            </div>
        </div>
    )
}

export default StickerBook