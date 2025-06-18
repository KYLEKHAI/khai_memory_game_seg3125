import React, { useState, useEffect, useRef } from "react";
import MenuScreen from "./components/MenuScreen";
import Select from "./components/Select";
import GameScreen from "./components/GameScreen";
import About from "./components/About";

function App() {
  const [currentScreen, setCurrentScreen] = useState("menu");
  const [selectedDifficulty, setSelectedDifficulty] = useState("easy");
  const [toyotaMusicStarted, setToyotaMusicStarted] = useState(false);
  const [leaseMusicPlaying, setLeaseMusicPlaying] = useState(false);
  const [screenMusicPlaying, setScreenMusicPlaying] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const toyotaAudioRef = useRef(null);

  const handlePlayGame = () => {
    setCurrentScreen("select");
  };

  const handleAbout = () => {
    setCurrentScreen("about");
  };

  const handleBackToMenu = () => {
    setCurrentScreen("menu");
  };

  const handleStartGame = (difficulty) => {
    setSelectedDifficulty(difficulty);
    setCurrentScreen("game");
  };

  const handleBackToSelect = () => {
    setCurrentScreen("select");
  };

  const handleLeaseMusicStart = () => {
    setLeaseMusicPlaying(true);
    if (toyotaAudioRef.current) {
      toyotaAudioRef.current.pause();
    }
  };

  const handleLeaseMusicStop = () => {
    setLeaseMusicPlaying(false);
    if (toyotaAudioRef.current && toyotaMusicStarted) {
      toyotaAudioRef.current.play().catch((error) => {
        console.log("Toyota music resume failed:", error);
      });
    }
  };

  const toggleMusic = () => {
    setMusicEnabled(!musicEnabled);
  };

  useEffect(() => {
    if (toyotaAudioRef.current) {
      if (
        musicEnabled &&
        !leaseMusicPlaying &&
        (currentScreen === "menu" || currentScreen === "about")
      ) {
        toyotaAudioRef.current.play().catch((error) => {
          console.log("Toyota music play failed:", error);
        });
        setToyotaMusicStarted(true);
      } else {
        toyotaAudioRef.current.pause();
      }
    }
  }, [musicEnabled, leaseMusicPlaying, currentScreen]);

  return (
    <>
      {currentScreen === "menu" && (
        <MenuScreen
          onPlayGame={handlePlayGame}
          onAbout={handleAbout}
          musicEnabled={musicEnabled}
          onToggleMusic={toggleMusic}
        />
      )}
      {currentScreen === "select" && (
        <Select
          onBackToMenu={handleBackToMenu}
          onStartGame={handleStartGame}
          musicEnabled={musicEnabled}
        />
      )}
      {currentScreen === "game" && (
        <GameScreen
          difficulty={selectedDifficulty}
          onBackToSelect={handleBackToSelect}
          onLeaseMusicStart={handleLeaseMusicStart}
          onLeaseMusicStop={handleLeaseMusicStop}
          musicEnabled={musicEnabled}
        />
      )}
      {currentScreen === "about" && <About onBackToMenu={handleBackToMenu} />}

      <audio
        ref={toyotaAudioRef}
        loop
        preload="auto"
        style={{ display: "none" }}
      >
        <source src="/music/TOYOTA.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </>
  );
}

export default App;
