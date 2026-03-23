import { useEffect, useRef } from "react";
import "./pong.css";

function PongGame({ onClose }) {

  const canvasRef = useRef(null);

  useEffect(() => {

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = 800;
    canvas.height = 400;

    const paddleHeight = 80;
    const paddleWidth = 10;
    const ballRadius = 8;
    const maxScore = 3;

    let playerY = canvas.height / 2 - paddleHeight / 2;
    let aiY = canvas.height / 2 - paddleHeight / 2;

    let ballX = canvas.width / 2;
    let ballY = canvas.height / 2;

    let ballVX = -4;
    let ballVY = 3;

    let playerScore = 0;
    let aiScore = 0;

    let loading = true;
    let loadingProgress = 0;

    let gameOver = false;
    let winner = null;

    // 🎯 IA
    let aiTarget = canvas.height / 2;
    let reactionDelay = 0;

    function resetBall() {
      ballX = canvas.width / 2;
      ballY = canvas.height / 2;

      ballVX = Math.random() > 0.5 ? 4 : -4;
      ballVY = (Math.random() * 4) - 2;
    }

    function draw() {

      ctx.fillStyle = "#020617";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      /* ================= LOADING ================= */

      if (loading) {

        ctx.fillStyle = "#00ffff";
        ctx.font = "28px monospace";
        ctx.textAlign = "center";

        ctx.fillText("Launching NeonPong.exe", canvas.width / 2, 150);

        ctx.strokeRect(canvas.width / 2 - 150, 200, 300, 20);

        ctx.fillRect(
          canvas.width / 2 - 150,
          200,
          loadingProgress * 3,
          20
        );

        loadingProgress += 0.6;

        if (loadingProgress >= 100) {
          loading = false;
        }

        requestAnimationFrame(draw);
        return;
      }

      /* ================= GAME OVER ================= */

      if (gameOver) {

        ctx.fillStyle = "#00ffff";
        ctx.font = "40px monospace";
        ctx.textAlign = "center";

        ctx.fillText(
          winner === "PLAYER" ? "YOU WIN" : "YOU LOSE",
          canvas.width / 2,
          canvas.height / 2
        );

        ctx.font = "18px monospace";
        ctx.fillText(
          "Press R to restart",
          canvas.width / 2,
          canvas.height / 2 + 40
        );

        return;
      }

      /* ================= LINHA CENTRAL ================= */

      ctx.strokeStyle = "#00ffff";
      ctx.setLineDash([10, 10]);

      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.stroke();

      ctx.setLineDash([]);

      /* ================= SCORE ================= */

      ctx.font = "32px monospace";
      ctx.fillStyle = "#00ffff";

      ctx.fillText(playerScore, canvas.width / 2 - 60, 40);
      ctx.fillText(aiScore, canvas.width / 2 + 40, 40);

      /* ================= PLAYER ================= */

      ctx.shadowColor = "#00ffff";
      ctx.shadowBlur = 10;
      ctx.fillRect(20, playerY, paddleWidth, paddleHeight);

      /* ================= AI ================= */

      ctx.fillRect(canvas.width - 30, aiY, paddleWidth, paddleHeight);
      ctx.shadowBlur = 0;

      /* ================= BALL ================= */

      ctx.shadowColor = "#00ffff";
      ctx.shadowBlur = 20;

      ctx.beginPath();
      ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.shadowBlur = 0;

      /* ================= MOVIMENTO ================= */

      ballX += ballVX;
      ballY += ballVY;

      /* ================= COLISÕES ================= */

      if (ballY - ballRadius < 0 || ballY + ballRadius > canvas.height) {
        ballVY *= -1;
      }

      // player
      if (
        ballX - ballRadius < 30 &&
        ballY > playerY &&
        ballY < playerY + paddleHeight
      ) {
        ballVX *= -1.05; // leve aceleração
        ballX = 30 + ballRadius;
      }

      // AI
      if (
        ballX + ballRadius > canvas.width - 30 &&
        ballY > aiY &&
        ballY < aiY + paddleHeight
      ) {
        ballVX *= -1.05;
        ballX = canvas.width - 30 - ballRadius;
      }

      /* ================= SCORE ================= */

      if (ballX < 0) {
        aiScore++;
        if (aiScore >= maxScore) {
          gameOver = true;
          winner = "AI";
        }
        resetBall();
      }

      if (ballX > canvas.width) {
        playerScore++;
        if (playerScore >= maxScore) {
          gameOver = true;
          winner = "PLAYER";
        }
        resetBall();
      }

      /* ================= IA (NERFADA E SUAVE) ================= */

      const aiSpeed = 1.5;

      reactionDelay++;

      if (reactionDelay > 10) {
        const aiOffset = (Math.random() - 0.5) * 60;
        aiTarget = ballY + aiOffset;
        reactionDelay = 0;
      }

      const aiCenter = aiY + paddleHeight / 2;

      if (aiCenter < aiTarget - 10) {
        aiY += aiSpeed;
      } else if (aiCenter > aiTarget + 10) {
        aiY -= aiSpeed;
      }

      requestAnimationFrame(draw);
    }

    draw();

    /* ================= CONTROLE PLAYER ================= */

    function move(e) {
      const rect = canvas.getBoundingClientRect();

      playerY = e.clientY - rect.top - paddleHeight / 2;

      if (playerY < 0) playerY = 0;
      if (playerY > canvas.height - paddleHeight)
        playerY = canvas.height - paddleHeight;
    }

    window.addEventListener("mousemove", move);

    /* ================= RESTART ================= */

    function restart(e) {
      if (e.key.toLowerCase() === "r") {
        playerScore = 0;
        aiScore = 0;
        gameOver = false;
        winner = null;
        resetBall();
        requestAnimationFrame(draw);
      }
    }

    window.addEventListener("keydown", restart);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("keydown", restart);
    };

  }, []);

  return (
    <div className="game-screen">
      <div className="game-header">
        <span>NeonPong.exe</span>
        <button onClick={onClose}>X</button>
      </div>

      <canvas ref={canvasRef}></canvas>
    </div>
  );
}

export default PongGame;