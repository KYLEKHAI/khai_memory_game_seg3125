import React, { useEffect } from "react";
import "./MenuScreen.css";
import logo from "../assets/images-gifs/gateway-exe-blue-logo.png";
import greenLogo from "../assets/images-gifs/gateway-exe-green-logo.png";
import musicIcon from "../assets/images-gifs/music.png";

const MenuScreen = ({ onPlayGame, onAbout, musicEnabled, onToggleMusic }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="menu-screen">
      <div className="bubbles-container">
        <div className="bubble bubble-1"></div>
        <div className="bubble bubble-2"></div>
        <div className="bubble bubble-3"></div>
        <div className="bubble bubble-4"></div>
        <div className="bubble bubble-5"></div>
        <div className="bubble bubble-6"></div>
      </div>
      <header className="logo-row">
        <img src={logo} alt="Logo" className="logo-side" />
        <h1 className="gateway-title">Gateway.exe</h1>
        <img src={greenLogo} alt="Green Logo" className="logo-side" />
      </header>
      <div className="glass-menu">
        <button className="glass-btn" onClick={onPlayGame}>
          Play Game
        </button>
        <button className="glass-btn" onClick={onAbout}>
          About
        </button>
      </div>
      <button
        className="music-toggle"
        onClick={onToggleMusic}
        title={musicEnabled ? "Turn Music Off" : "Turn Music On"}
      >
        <img
          src={musicIcon}
          alt="Music Toggle"
          className={`music-icon ${musicEnabled ? "enabled" : "disabled"}`}
        />
      </button>
    </div>
  );
};

export default MenuScreen;
