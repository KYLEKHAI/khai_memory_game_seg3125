import React, { useEffect } from "react";
import "./About.css";
import greenLogo from "../assets/images-gifs/gateway-exe-green-logo.png";

const About = ({ onBackToMenu }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="about-screen">
      <div className="bubbles-container">
        <div className="bubble bubble-1"></div>
        <div className="bubble bubble-2"></div>
        <div className="bubble bubble-3"></div>
        <div className="bubble bubble-4"></div>
        <div className="bubble bubble-5"></div>
        <div className="bubble bubble-6"></div>
      </div>

      <div className="about-header">
        <div className="header-logo-container">
          <img src={greenLogo} alt="Green Logo" className="header-logo" />
          <div className="speech-bubble" onClick={onBackToMenu}>
            Back to Menu
            <div className="bubble-tail"></div>
          </div>
        </div>
      </div>

      <div className="glass-about">
        <div className="about-content">
          <h2 className="about-heading">About the Game</h2>
          <p className="about-description">
            You are trying to access the world of{" "}
            <a
              href="https://frutiger-aero.org/frutiger-aero"
              target="_blank"
              rel="noopener noreferrer"
            >
              Frutiger Aero
            </a>{" "}
            and you must enter the computer itself to open the gate which is
            unlocked by a specific key. Doing this would open the gateway into
            the new future of Frutiger Aero!
          </p>
          <div className="credits-section">
            <h3 className="credits-heading">Credits</h3>
            <div className="credits-info">
              <p className="designer-credit">Designed by Kyle Khai Tran 2025</p>
              <div className="github-link">
                <a
                  href="https://github.com/KYLEKHAI/khai_memory_game_seg3125"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="github-btn"
                >
                  View Github
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
