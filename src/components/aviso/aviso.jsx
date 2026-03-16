import "./aviso.css"

function AvisoPop({ onClose }) {
    return (
        <div className="aviso-overlay">

            <div className="retro-window">

                <div className="retro-titlebar">
                    <span>Aviso do sistema</span>

                    <button className="retro-close" onClick={onClose}>
                        ✕
                    </button>
                </div>

                <div className="retro-content">

                    <div className="retro-icon">
                        ⚠
                    </div>

                    <div className="retro-text">

                        <p>
                            Olá, como estão?!
                        </p>

                        <p>
                            Este sistema ainda está em <b>desenvolvimento</b> e passando por fase de <b>testes</b>.
                        </p>

                        <p>
                            Algumas funcionalidades podem mudar, quebrar ou não funcionar. Precisamos de apoio nisso!
                        </p>

                        <p>
                            Caso encontre algum problema ou tenha alguma sugestão de melhoria, fique à vontade para nos avisar! 
                            Tanto para a Lola quanto para mim (@andre_michalsky no insta).
                        </p>

                    </div>

                </div>

                <div className="retro-footer">
                    <button onClick={onClose}>
                        OK
                    </button>
                </div>

            </div>

        </div>
    )
}

export default AvisoPop