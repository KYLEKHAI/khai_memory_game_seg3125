import React, { useState, useEffect, useRef } from "react";
import "./Select.css";
import logo from "../assets/images-gifs/gateway-exe-green-logo.png";

const Select = ({ onBackToMenu, onStartGame, musicEnabled }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState("easy");
  const hologramAudioRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (hologramAudioRef.current) {
      if (musicEnabled) {
        hologramAudioRef.current.play().catch((error) => {
          console.log("Hologram music play failed:", error);
        });
      } else {
        hologramAudioRef.current.pause();
        hologramAudioRef.current.currentTime = 0;
      }
    }

    return () => {
      if (hologramAudioRef.current) {
        hologramAudioRef.current.pause();
        hologramAudioRef.current.currentTime = 0;
      }
    };
  }, [musicEnabled]);

  const difficultyOptions = {
    easy: {
      title: "Easy Mode",
      description: "Quicker games and less to memorize",
      specs: {
        keys: 5,
        doors: 2,
      },
    },
    medium: {
      title: "Medium Mode",
      description: "A balanced challenge",
      specs: {
        keys: 6,
        doors: 3,
      },
    },
    hard: {
      title: "Hard Mode",
      description: "Longer games and more to memorize",
      specs: {
        keys: 7,
        doors: 4,
      },
    },
  };

  const handleStartGame = () => {
    onStartGame(selectedDifficulty);
  };

  return (
    <div className="select-screen">
      <div className="cyber-grid"></div>
      <div className="data-streams">
        <div className="stream stream-1"></div>
        <div className="stream stream-2"></div>
        <div className="stream stream-3"></div>
      </div>

      <header className="select-header">
        <img src={logo} alt="Logo" className="header-logo" />
        <div className="speech-bubble" onClick={onBackToMenu}>
          <span>Back to Menu?</span>
          <div className="bubble-tail"></div>
        </div>
      </header>

      <div className="select-container">
        <h1 className="select-title">Select Difficulty</h1>
        <p className="select-subtitle">Customize the difficulty of the game</p>

        <div className="select-content">
          <div className="difficulty-options">
            {Object.keys(difficultyOptions).map((difficulty) => (
              <button
                key={difficulty}
                className={`difficulty-btn ${
                  selectedDifficulty === difficulty ? "active" : ""
                }`}
                onClick={() => setSelectedDifficulty(difficulty)}
              >
                <div className="btn-glow"></div>
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </button>
            ))}
          </div>

          <div className="difficulty-info">
            <div className="info-panel">
              <div className="panel-header">
                <h3>{difficultyOptions[selectedDifficulty].title}</h3>
                <div className="header-line"></div>
              </div>

              <p className="info-description">
                {difficultyOptions[selectedDifficulty].description}
              </p>

              <div className="specs-grid">
                <div className="spec-item">
                  <span className="spec-label">Keys:</span>
                  <span className="spec-value">
                    {difficultyOptions[selectedDifficulty].specs.keys}
                  </span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Doors:</span>
                  <span className="spec-value">
                    {difficultyOptions[selectedDifficulty].specs.doors}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="button-row">
          <button className="start-game-btn" onClick={handleStartGame}>
            <div className="btn-bg"></div>
            <span>Start Game</span>
          </button>
        </div>
      </div>

      <audio
        ref={hologramAudioRef}
        loop
        preload="auto"
        style={{ display: "none" }}
      >
        <source src="/src/assets/music/HOLOGRAM.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default Select;
