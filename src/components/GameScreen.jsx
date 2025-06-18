import React, { useState, useEffect, useRef } from "react";
import "./GameScreen.css";
import gateImage from "../assets/images-gifs/gate.png";
import logo from "../assets/images-gifs/gateway-exe-blue-logo.png";
import greenLogo from "../assets/images-gifs/gateway-exe-green-logo.png";
import frutigerIcon from "../assets/images-gifs/frutiger-aero-exe.png";
import keyYellow from "../assets/images-gifs/key-yellow.png";
import keyGreen from "../assets/images-gifs/key-green.png";
import keyRed from "../assets/images-gifs/key-red.png";
import keyBlue from "../assets/images-gifs/key-blue.png";
import keyPurple from "../assets/images-gifs/key-purple.png";
import keyPink from "../assets/images-gifs/key-pink.png";
import keyCyan from "../assets/images-gifs/key-cyan.png";
import commandPromptIcon from "../assets/images-gifs/command-prompt.png";

const GameScreen = ({
  difficulty,
  onBackToSelect,
  onLeaseMusicStart,
  onLeaseMusicStop,
  musicEnabled,
}) => {
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
  const [musicStarted, setMusicStarted] = useState(false);
  const [typewriterText, setTypewriterText] = useState("");
  const [typewriterComplete, setTypewriterComplete] = useState(false);
  const [typewriterTrigger, setTypewriterTrigger] = useState(0);
  const audioRef = useRef(null);
  const stichingAudioRef = useRef(null);

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
    frutigerImages.push(`/images-gifs/frutiger-aero-exe/asadal_stock_${i}.jpg`);
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
    console.log("GameScreen mounted with musicEnabled:", musicEnabled);

    return () => {
      document.body.style.overflow = "";
      if (messageTimer) {
        clearTimeout(messageTimer);
      }
    };
  }, [messageTimer]);

  const [audioLoaded, setAudioLoaded] = useState(false);

  useEffect(() => {
    console.log("GameScreen music effect:", {
      musicEnabled,
      showFrutigerApp,
      audioRefExists: !!stichingAudioRef.current,
      audioLoaded,
    });

    if (stichingAudioRef.current && audioLoaded) {
      if (musicEnabled && !showFrutigerApp) {
        console.log("Trying to play STICHING music");
        const audio = stichingAudioRef.current;

        audio
          .play()
          .then(() => {
            console.log("STICHING music started successfully");
            audio.currentTime = 1;
          })
          .catch((error) => {
            console.log("Stiching music play failed:", error);
          });
      } else {
        console.log("Pausing STICHING music");
        stichingAudioRef.current.pause();
        if (!musicEnabled) {
          stichingAudioRef.current.currentTime = 0;
        }
      }
    } else {
      console.log("STICHING audio ref is null or not loaded yet");
    }

    return () => {
      if (stichingAudioRef.current) {
        stichingAudioRef.current.pause();
        stichingAudioRef.current.currentTime = 0;
      }
    };
  }, [musicEnabled, showFrutigerApp, audioLoaded]);

  useEffect(() => {
    const config = getGameConfig(difficulty);
    setGameData(config);
    initializeGame(config);
  }, [difficulty]);
  useEffect(() => {
    const fullText =
      "Win the game by dragging and dropping the only working key into the only working gate!";
    let currentIndex = 0;
    setTypewriterText("");
    setTypewriterComplete(false);

    const typeInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setTypewriterText(fullText.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setTypewriterComplete(true);
        clearInterval(typeInterval);
      }
    }, 50);

    return () => clearInterval(typeInterval);
  }, [gameData, typewriterTrigger]);

  useEffect(() => {
    if (showSlideshow) {
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

    if (draggedKey === correctKeyIndex && gateIndex === correctGateIndex) {
      setMessage("Gate Opened!\nA new application has been added to desktop!");
      setGameWon(true);
      setGates((prev) =>
        prev.map((gate, index) =>
          index === gateIndex ? { ...gate, occupied: true } : gate
        )
      );
    } else {
      setMessage("Gate Closed");
    }

    setDraggedKey(null);
  };

  const resetGame = () => {
    if (gameData) {
      initializeGame(gameData);
      setTypewriterTrigger((prev) => prev + 1);
    }
  };

  if (!gameData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="game-screen">
      <div className="game-header">
        <div className="header-logo-container">
          <img src={greenLogo} alt="Green Logo" className="header-logo" />
          <div className="speech-bubble" onClick={onBackToSelect}>
            Back To Select
            <div className="bubble-tail"></div>
          </div>
        </div>
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

      <div className="command-prompt">
        <div className="command-prompt-header">
          <div className="command-prompt-title">
            <img
              src={commandPromptIcon}
              alt="Command Prompt"
              className="command-prompt-header-icon"
            />
            <span className="command-prompt-icon">C:\&gt;</span>
            Command Prompt
          </div>
        </div>
        <div className="command-prompt-content">
          <div className="command-line">
            <span className="command-prompt-path">C:\WINDOWS\system32&gt;</span>
            <span className="command-text">
              {typewriterText}
              {!typewriterComplete && <span className="cursor">|</span>}
            </span>
          </div>
        </div>
      </div>

      {showFrutigerIcon && (
        <div
          className="desktop-icon"
          onDoubleClick={() => {
            if (!musicStarted && audioRef.current && musicEnabled) {
              if (stichingAudioRef.current) {
                stichingAudioRef.current.pause();
              }

              audioRef.current.play().catch((error) => {
                console.log("Audio play failed:", error);
              });
              setMusicStarted(true);
              if (onLeaseMusicStart) {
                onLeaseMusicStart();
              }
            }

            setShuffledImages(shuffleArray(frutigerImages));
            setCurrentImageIndex(0);
            setShowSlideshow(true);
            setShowFrutigerApp(true);
          }}
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
                  onClick={() => {
                    if (audioRef.current) {
                      audioRef.current.pause();
                      audioRef.current.currentTime = 0;
                    }
                    setMusicStarted(false);
                    setShowFrutigerApp(false);
                    setShowSlideshow(false);
                    setShuffledImages([]);
                    setCurrentImageIndex(0);

                    if (stichingAudioRef.current && musicEnabled) {
                      const audio = stichingAudioRef.current;
                      audio
                        .play()
                        .then(() => {
                          audio.currentTime = 1;
                        })
                        .catch((error) => {
                          console.log("Stiching music resume failed:", error);
                        });
                    }

                    if (onLeaseMusicStop) {
                      onLeaseMusicStop();
                    }
                  }}
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
              <div className="frutiger-slideshow">
                {shuffledImages.length > 0 ? (
                  <img
                    src={shuffledImages[currentImageIndex]}
                    alt={`Frutiger Aero ${currentImageIndex + 1}`}
                    className="slideshow-image"
                    onError={(e) => {
                      console.log("Image failed to load:", e.target.src);
                    }}
                  />
                ) : (
                  <div>Loading images...</div>
                )}
              </div>
            </div>
            <div className="frutiger-app-statusbar">Status: Connected</div>
          </div>
        </div>
      )}

      <audio ref={audioRef} loop preload="auto" style={{ display: "none" }}>
        <source src="/src/assets/music/LEASE.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      <audio
        ref={stichingAudioRef}
        loop
        preload="auto"
        style={{ display: "none" }}
        onLoadedData={() => {
          console.log("STICHING audio loaded");
          setAudioLoaded(true);
        }}
        onError={(e) => console.log("STICHING audio error:", e)}
      >
        <source src="/src/assets/music/STICHING.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default GameScreen;
