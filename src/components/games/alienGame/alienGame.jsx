import { useDialog } from "../../../hooks/useDialog"
import { useEffect, useRef } from "react";
import p5 from "p5";
import { createAlienSketch } from "./alienSketch";
import "./alienGame.css";

function AlienGame({ onClose }) {
  const dialogRef = useDialog(onClose)
  const containerRef = useRef(null);
  const p5Instance = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    p5Instance.current = new p5(createAlienSketch, containerRef.current);

    return () => {
      if (p5Instance.current) {
        p5Instance.current.remove();
      }
    };
  }, []);

  return (
    <div ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-label="Alien Shooter" className="alien-game-screen">
      <div className="alien-game-header">
        <span>AlienShooter.exe</span>
        <button aria-label="Fechar Alien Shooter" onClick={onClose}>X</button>
      </div>

      <div ref={containerRef} className="alien-game-canvas"></div>
    </div>
  );
}

export default AlienGame;
