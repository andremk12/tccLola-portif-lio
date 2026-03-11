import { useEffect, useRef } from "react"
import p5 from "p5"
import "./alienGame.css"

function AlienGame({ onClose }) {

    const containerRef = useRef(null)
    const p5Instance = useRef(null)

    useEffect(() => {

        if (!containerRef.current) return

        const sketch = (p) => {

            const base = import.meta.env.BASE_URL

            let bgFrames = []
            let shipImg
            let alienImg
            let coverImg
            let loseImg
            let winImg

            let gameState = "cover"

            let ship
            let bullets = []
            let aliens = []

            let alienSpeed = 1
            let bulletSpeed = 6

            let currentFrame = 0
            let frameDelay = 10
            let frameCounter = 0

            p.preload = () => {

                for (let i = 0; i < 20; i++) {
                    bgFrames.push(
                        p.loadImage(`${base}gameAssets/q${i}.png`)
                    )
                }

                shipImg = p.loadImage(`${base}gameAssets/menina.png`)
                alienImg = p.loadImage(`${base}gameAssets/homi.png`)
                coverImg = p.loadImage(`${base}gameAssets/inicio.png`)
                loseImg = p.loadImage(`${base}gameAssets/perdeu.png`)
                winImg = p.loadImage(`${base}gameAssets/venceu2.png`)

            }

            p.setup = () => {

                const w = containerRef.current.offsetWidth
                const h = containerRef.current.offsetHeight

                p.createCanvas(w, h)

                p.imageMode(p.CENTER)

                startGame()
                gameState = "cover"

            }

            function startGame() {

                ship = new Ship()
                bullets = []
                createAliens()

                gameState = "game"

            }

            function createAliens() {

                aliens = []

                let rows = 3
                let cols = 5

                for (let i = 0; i < rows; i++) {

                    for (let j = 0; j < cols; j++) {

                        let x = j * 120 + 120
                        let y = i * 100 + 80

                        aliens.push(new Alien(x, y))

                    }

                }

            }

            p.draw = () => {

                if (gameState === "cover") {

                    p.image(coverImg, p.width / 2, p.height / 2, p.width, p.height)

                }

                else if (gameState === "game") {

                    frameCounter++

                    if (frameCounter >= frameDelay) {
                        currentFrame = (currentFrame + 1) % bgFrames.length
                        frameCounter = 0
                    }

                    p.image(bgFrames[currentFrame], p.width / 2, p.height / 2, p.width, p.height)

                    ship.show()
                    ship.move()

                    bullets.forEach((b, i) => {

                        b.show()
                        b.move()

                        if (b.offscreen()) {
                            bullets.splice(i, 1)
                        }

                    })

                    aliens.forEach((a) => {

                        a.show()
                        a.move()

                        if (a.y > p.height) {
                            gameState = "lose"
                        }

                    })

                    bullets.forEach((b, i) => {

                        aliens.forEach((a, j) => {

                            if (b.hits(a)) {

                                bullets.splice(i, 1)
                                aliens.splice(j, 1)

                            }

                        })

                    })

                    if (aliens.length === 0) {
                        gameState = "win"
                    }

                }

                else if (gameState === "lose") {

                    p.image(loseImg, p.width / 2, p.height / 2, p.width, p.height)

                }

                else if (gameState === "win") {

                    p.image(winImg, p.width / 2, p.height / 2, p.width, p.height)

                }

            }

            p.keyPressed = () => {

                if (p.key === " ") {

                    if (gameState === "cover") {
                        startGame()
                    }

                    else if (gameState === "game") {
                        bullets.push(new Bullet(ship.x, ship.y - 40))
                    }

                    else if (gameState === "win" || gameState === "lose") {
                        startGame()
                    }

                }

            }

            class Ship {

                constructor() {

                    this.x = p.width / 2
                    this.y = p.height - 80

                }

                show() {

                    p.image(shipImg, this.x, this.y, 120, 120)

                }

                move() {

                    if (p.keyIsDown(p.LEFT_ARROW)) this.x -= 6
                    if (p.keyIsDown(p.RIGHT_ARROW)) this.x += 6

                    this.x = p.constrain(this.x, 60, p.width - 60)

                }

            }

            class Bullet {

                constructor(x, y) {

                    this.x = x
                    this.y = y

                }

                show() {

                    p.fill(255, 50, 50)
                    p.noStroke()
                    p.rect(this.x - 3, this.y, 6, 20)

                }

                move() {

                    this.y -= bulletSpeed

                }

                offscreen() {

                    return this.y < 0

                }

                hits(alien) {

                    return p.dist(this.x, this.y, alien.x, alien.y) < 60

                }

            }

            class Alien {

                constructor(x, y) {

                    this.x = x
                    this.y = y

                }

                show() {

                    p.image(alienImg, this.x, this.y, 120, 120)

                }

                move() {

                    this.y += alienSpeed

                }

            }

        }

        p5Instance.current = new p5(sketch, containerRef.current)

        return () => {
            if (p5Instance.current) {
                p5Instance.current.remove()
            }
        }

    }, [])

    return (

        <div className="alien-game-screen">

            <div className="alien-game-header">
                <span>AlienShooter.exe</span>
                <button onClick={onClose}>X</button>
            </div>

            <div
                ref={containerRef}
                className="alien-game-canvas"
            ></div>

        </div>

    )

}

export default AlienGame