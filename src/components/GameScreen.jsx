import React, { useState, useEffect } from "react";
import "./GameScreen.css";
import gateImage from "../assets/images-gifs/gate.png";
import logo from "../assets/images-gifs/gateway-exe-blue-logo.png";
import frutigerIcon from "../assets/images-gifs/frutiger-aero-exe.png";
import keyYellow from "../assets/images-gifs/key-yellow.png";
import keyGreen from "../assets/images-gifs/key-green.png";
import keyRed from "../assets/images-gifs/key-red.png";
import keyBlue from "../assets/images-gifs/key-blue.png";
import keyPurple from "../assets/images-gifs/key-purple.png";
import keyPink from "../assets/images-gifs/key-pink.png";
import keyCyan from "../assets/images-gifs/key-cyan.png";

const GameScreen = ({ difficulty, onBackToSelect }) => {
  const [keys, setKeys] = useState([]);
  const [gates, setGates] = useState([]);
  const [draggedKey, setDraggedKey] = useState(null);
  const [correctKeyIndex, setCorrectKeyIndex] = useState(0);
  const [correctGateIndex, setCorrectGateIndex] = useState(0);
  const [message, setMessage] = useState("");
  const [gameData, setGameData] = useState(null);
  const [messageTimer, setMessageTimer] = useState(null);
  const [gameWon, setGameWon] = useState(false);
  const [showFrutigerIcon, setShowFrutigerIcon] = useState(false);
  const [showFrutigerApp, setShowFrutigerApp] = useState(false);
  const [showSlideshow, setShowSlideshow] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [shuffledImages, setShuffledImages] = useState([]);

  const keyImages = [
    keyYellow,
    keyGreen,
    keyRed,
    keyBlue,
    keyPurple,
    keyPink,
    keyCyan,
  ];

  const keyColors = [
    "yellow",
    "green",
    "red",
    "blue",
    "purple",
    "pink",
    "cyan",
  ];

  // frutiger_aero.exe image slideshow
  const frutigerImages = [];
  for (let i = 89; i <= 188; i++) {
    frutigerImages.push(
      `/src/assets/images-gifs/frutiger-aero-exe/asadal_stock_${i}.jpg`
    );
  }

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Game configurations
  const getGameConfig = (difficulty) => {
    const configs = {
      easy: { keys: 5, doors: 2 },
      medium: { keys: 6, doors: 3 },
      hard: { keys: 7, doors: 4 },
    };
    return configs[difficulty] || configs.easy;
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      if (messageTimer) {
        clearTimeout(messageTimer);
      }
    };
  }, [messageTimer]);

  useEffect(() => {
    const config = getGameConfig(difficulty);
    setGameData(config);
    initializeGame(config);
  }, [difficulty]);

  // Slideshow effect
  useEffect(() => {
    if (showSlideshow) {
      // Shuffle images when slideshow starts
      if (shuffledImages.length === 0) {
        setShuffledImages(shuffleArray(frutigerImages));
        setCurrentImageIndex(0);
      }

      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % shuffledImages.length);
      }, 2500);

      return () => clearInterval(interval);
    }
  }, [showSlideshow, shuffledImages.length, frutigerImages, shuffleArray]);

  // Create and initialize game (gates and keys)
  const initializeGame = (config) => {
    const selectedKeyIndices = [];
    const gameKeys = [];

    for (let i = 0; i < config.keys; i++) {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * keyImages.length);
      } while (selectedKeyIndices.includes(randomIndex));

      selectedKeyIndices.push(randomIndex);
      gameKeys.push({
        id: i,
        image: keyImages[randomIndex],
        color: keyColors[randomIndex],
        originalPosition: i,
      });
    }

    const gameGates = [];
    for (let i = 0; i < config.doors; i++) {
      gameGates.push({
        id: i,
        occupied: false,
      });
    }
    const correctKey = Math.floor(Math.random() * config.keys);
    const correctGate = Math.floor(Math.random() * config.doors);

    setKeys(gameKeys);
    setGates(gameGates);
    setCorrectKeyIndex(correctKey);
    setCorrectGateIndex(correctGate);
    setMessage("");
    setGameWon(false);
    setShowFrutigerIcon(false);
    setShowFrutigerApp(false);
    setShowSlideshow(false);
    setCurrentImageIndex(0);
    setShuffledImages([]);
  };

  // Drag and drop function
  const handleDragStart = (e, keyIndex) => {
    if (gameWon) {
      e.preventDefault();
      return;
    }
    setDraggedKey(keyIndex);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, gateIndex) => {
    e.preventDefault();

    if (draggedKey === null) return;

    // Check for game winner (matching key and gate)
    if (draggedKey === correctKeyIndex && gateIndex === correctGateIndex) {
      setMessage("Gate Opened!\nA new application has been added to desktop!");
      setGameWon(true);
      setGates((prev) =>
        prev.map((gate, index) =>
          index === gateIndex ? { ...gate, occupied: true } : gate
        )
      );

      // Show frutiger_aero.exe application
    } else {
      setMessage("Gate Closed");
    }

    setDraggedKey(null);
  };

  // Game reset
  const resetGame = () => {
    if (gameData) {
      initializeGame(gameData);
    }
  };

  if (!gameData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="game-screen">
      <div className="game-header">
        <button className="back-btn" onClick={onBackToSelect}>
          Back to Select
        </button>
        <button className="reset-btn" onClick={resetGame}>
          Reset Game
        </button>
      </div>

      <div className="game-content">
        <div className="message-display">
          {message && (
            <div className="game-message">
              <div className="message-header">
                <div className="message-title">
                  <img
                    src={logo}
                    alt="Gateway.exe"
                    className="message-app-icon"
                  />
                  Gateway.exe
                </div>
                <button
                  className="message-close-btn"
                  onClick={() => {
                    if (message.startsWith("Gate Opened!")) {
                      setShowFrutigerIcon(true);
                    }
                    setMessage("");
                  }}
                >
                  ×
                </button>
              </div>
              <div className="message-content">
                <div className="message-text">{message}</div>
              </div>
              <div className="message-buttons">
                <button
                  className="message-ok-btn"
                  onClick={() => {
                    if (message.startsWith("Gate Opened!")) {
                      setShowFrutigerIcon(true);
                    }
                    setMessage("");
                  }}
                >
                  OK
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="gates-row">
          {gates.map((gate, index) => (
            <div
              key={`gate-${index}`}
              className={`gate ${gate.occupied ? "occupied" : ""}`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
            >
              <img src={gateImage} alt={`Gate ${index + 1}`} />
            </div>
          ))}
        </div>

        <div className="keys-row">
          {keys.map((key, index) => (
            <div
              key={`key-${index}`}
              className={`key ${gameWon ? "disabled" : ""}`}
              draggable={!gameWon}
              onDragStart={(e) => handleDragStart(e, index)}
            >
              <img src={key.image} alt={`${key.color} key`} />
            </div>
          ))}
        </div>
      </div>

      {showFrutigerIcon && (
        <div
          className="desktop-icon"
          onDoubleClick={() => setShowFrutigerApp(true)}
        >
          <img
            src={frutigerIcon}
            alt="Frutiger Aero"
            className="desktop-icon-image"
          />
          <span className="desktop-icon-label">frutiger_aero.exe</span>
        </div>
      )}

      {showFrutigerApp && (
        <div className="frutiger-app-overlay">
          <div className="frutiger-app-window">
            <div className="frutiger-app-titlebar">
              <div className="frutiger-app-title">
                <img
                  src={frutigerIcon}
                  alt="Frutiger Aero"
                  className="frutiger-app-icon"
                />
                frutiger_aero.exe
              </div>
              <div className="frutiger-app-controls">
                <button className="frutiger-minimize-btn">_</button>
                <button className="frutiger-maximize-btn">□</button>
                <button
                  className="frutiger-close-btn"
                  onClick={() => setShowFrutigerApp(false)}
                >
                  ×
                </button>
              </div>
            </div>
            <div className="frutiger-app-menubar">
              <span>File</span>
              <span>Edit</span>
              <span>View</span>
              <span>Tools</span>
              <span>Help</span>
            </div>
            <div className="frutiger-app-content">
              {!showSlideshow ? (
                <div className="frutiger-welcome">
                  <h2>Welcome to Frutiger Aero</h2>
                  <p>
                    Congratulations! You have successfully opened the gateway.
                  </p>
                  <p>
                    You are now connected to the <em>Frutiger Aero Network</em>.
                  </p>
                  <div className="frutiger-decoration">
                    <div className="bubble bubble-1"></div>
                    <div className="bubble bubble-2"></div>
                    <div className="bubble bubble-3"></div>
                  </div>
                  <button
                    className="frutiger-ok-btn"
                    onClick={() => {
                      setShuffledImages(shuffleArray(frutigerImages));
                      setCurrentImageIndex(0);
                      setShowSlideshow(true);
                    }}
                  >
                    Enter
                  </button>
                </div>
              ) : (
                <div className="frutiger-slideshow">
                  <img
                    src={shuffledImages[currentImageIndex]}
                    alt={`Frutiger Aero ${currentImageIndex + 1}`}
                    className="slideshow-image"
                  />
                </div>
              )}
            </div>
            <div className="frutiger-app-statusbar">Status: Connected</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameScreen;
