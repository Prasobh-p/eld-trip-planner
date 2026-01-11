import { useEffect, useRef } from "react";

export default function ELDLog({ log }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    // Canvas size
    const WIDTH = 1200;
    const HEIGHT = 220;
    const HOUR_WIDTH = WIDTH / 24;

    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    // Clear canvas
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    // ===== DRAW GRID =====
    ctx.strokeStyle = "#d1d5db";

    // Vertical hour lines
    for (let i = 0; i <= 24; i++) {
      ctx.beginPath();
      ctx.moveTo(i * HOUR_WIDTH, 0);
      ctx.lineTo(i * HOUR_WIDTH, HEIGHT);
      ctx.stroke();
    }

    // Horizontal rows
    ctx.beginPath();
    ctx.moveTo(0, 20);
    ctx.lineTo(WIDTH, 20);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, 60);
    ctx.lineTo(WIDTH, 60);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, 100);
    ctx.lineTo(WIDTH, 100);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, 140);
    ctx.lineTo(WIDTH, 140);
    ctx.stroke();

    // ===== HOUR LABELS =====
    ctx.fillStyle = "#000";
    ctx.font = "12px Arial";

    for (let i = 0; i < 24; i++) {
      ctx.fillText(i, i * HOUR_WIDTH + 2, 14);
    }

    // ===== DRAW DUTY BLOCKS =====
    let x = 0;

    // OFF DUTY (Row 1)
    ctx.fillStyle = "#e5e7eb";
    ctx.fillRect(
      x,
      20,
      log.off_duty_hours * HOUR_WIDTH,
      40
    );
    x += log.off_duty_hours * HOUR_WIDTH;

    // ON DUTY (Row 3)
    ctx.fillStyle = "#facc15";
    ctx.fillRect(
      x,
      100,
      log.on_duty_hours * HOUR_WIDTH,
      40
    );
    x += log.on_duty_hours * HOUR_WIDTH;

    // DRIVING (Row 2)
    ctx.fillStyle = "#22c55e";
    ctx.fillRect(
      x,
      60,
      log.driving_hours * HOUR_WIDTH,
      40
    );

  }, [log]);

  return (
    <div style={{ marginBottom: "32px" }}>
      <h4 style={{ marginBottom: "8px" }}>
        Day {log.day} – ELD Log
      </h4>

      <canvas
        ref={canvasRef}
        style={{
          border: "1px solid #e5e7eb",
          width: "100%",
          maxWidth: "1200px"
        }}
      />

      {/* Labels */}
      <div style={{ fontSize: "12px", marginTop: "6px" }}>
        <span style={{ marginRight: "12px" }}>⬜ Off Duty</span>
        <span style={{ marginRight: "12px" }}>🟨 On Duty</span>
        <span>🟩 Driving</span>
      </div>
    </div>
  );
}
