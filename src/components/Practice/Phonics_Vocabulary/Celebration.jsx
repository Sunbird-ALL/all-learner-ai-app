import React, { useEffect, useRef } from "react";

const Celebration = ({ onReset }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const confettiCount = 300;
    const gravity = 0.5;
    const terminalVelocity = 5;
    const drag = 0.075;
    const colors = [
      { front: "#ff6b6b", back: "#e55050" },
      { front: "#4ecdc4", back: "#3dbbb3" },
      { front: "#ffe66d", back: "#e6cf62" },
      { front: "#ffcc5c", back: "#e6b853" },
      { front: "#a1c4fd", back: "#91b0e3" },
      { front: "#f7a8b8", back: "#dec9e8" },
    ];

    let confetti = [];

    const randomRange = (min, max) => Math.random() * (max - min) + min;

    const initConfetti = () => {
      for (let i = 0; i < confettiCount; i++) {
        confetti.push({
          color: colors[Math.floor(randomRange(0, colors.length))],
          dimensions: {
            x: randomRange(10, 20),
            y: randomRange(10, 30),
          },
          position: {
            x: randomRange(0, canvas.width),
            y: canvas.height - 1,
          },
          rotation: randomRange(0, 2 * Math.PI),
          scale: {
            x: 1,
            y: 1,
          },
          velocity: {
            x: randomRange(-25, 25),
            y: randomRange(0, -50),
          },
        });
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      confetti.forEach((confetto, index) => {
        confetto.velocity.x -= confetto.velocity.x * drag;
        confetto.velocity.y = Math.min(
          confetto.velocity.y + gravity,
          terminalVelocity
        );
        confetto.velocity.x +=
          Math.random() > 0.5 ? Math.random() : -Math.random();

        confetto.position.x += confetto.velocity.x;
        confetto.position.y += confetto.velocity.y;

        if (confetto.position.y >= canvas.height) confetti.splice(index, 1);

        if (confetto.position.x > canvas.width) confetto.position.x = 0;
        if (confetto.position.x < 0) confetto.position.x = canvas.width;

        confetto.scale.y = Math.cos(confetto.position.y * 0.1);
        ctx.fillStyle =
          confetto.scale.y > 0 ? confetto.color.front : confetto.color.back;

        ctx.save();
        ctx.translate(confetto.position.x, confetto.position.y);
        ctx.rotate(confetto.rotation);
        ctx.fillRect(
          -confetto.dimensions.x / 2,
          -confetto.dimensions.y / 2,
          confetto.dimensions.x,
          confetto.dimensions.y
        );
        ctx.restore();
      });

      if (confetti.length > 0) window.requestAnimationFrame(render);
    };

    initConfetti();
    render();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div style={styles.overlay}>
      <canvas ref={canvasRef} style={styles.canvas} />
      <div style={styles.content}>
        <h1 style={styles.title}>Congratulations!</h1>
        <p style={styles.subtitle}>You learned all the letters!</p>
        <button onClick={onReset} style={styles.button}>
          Play Again
        </button>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  canvas: {
    position: "absolute",
    top: 0,
    left: 0,
    pointerEvents: "none",
  },
  content: {
    backgroundColor: "white",
    padding: "3rem",
    borderRadius: "20px",
    textAlign: "center",
    zIndex: 1001,
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    animation: "popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  },
  title: {
    fontSize: "4rem",
    color: "#ff6b6b",
    fontFamily: "var(--font-secondary)",
    marginBottom: "1rem",
  },
  subtitle: {
    fontSize: "2rem",
    color: "#2c3e50",
    marginBottom: "2rem",
  },
  button: {
    backgroundColor: "#4ecdc4",
    color: "white",
    fontSize: "2rem",
    padding: "15px 40px",
    borderRadius: "40px",
    border: "none",
    cursor: "pointer",
    fontFamily: "var(--font-secondary)",
    boxShadow: "0 5px 0 #3dbbb3",
    transition: "transform 0.1s",
  },
};

// Add popIn animation keyframes globally or assume normal CSS handling
// Just in case, simplistic approach for now.

export default Celebration;
