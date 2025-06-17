import React, { useState } from "react";
import MenuScreen from "./components/MenuScreen";
import Select from "./components/Select";
import GameScreen from "./components/GameScreen";

function App() {
  const [currentScreen, setCurrentScreen] = useState("menu");
  const [selectedDifficulty, setSelectedDifficulty] = useState("easy");

  const handlePlayGame = () => {
    setCurrentScreen("select");
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

  return (
    <>
      {currentScreen === "menu" && <MenuScreen onPlayGame={handlePlayGame} />}
      {currentScreen === "select" && (
        <Select onBackToMenu={handleBackToMenu} onStartGame={handleStartGame} />
      )}
      {currentScreen === "game" && (
        <GameScreen
          difficulty={selectedDifficulty}
          onBackToSelect={handleBackToSelect}
        />
      )}
    </>
  );
}

export default App;
