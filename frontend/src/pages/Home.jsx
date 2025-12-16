import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";

const Home = () => {
  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="logo">ChatAW</div>
        <div className="nav-links">
          <Link to="/login" className="nav-btn btn-secondary">
            Log in
          </Link>
          <Link to="/register" className="nav-btn btn-primary">
            Sign up
          </Link>
        </div>
      </nav>

      <main className="hero-section">
        <h1 className="hero-title">
          Connect with anyone,
          <span>anywhere, instantly.</span>
        </h1>
        <p className="hero-subtitle">
          Experience seamless communication with crystal clear audio and video.
          Designed for teams, built for connections.
        </p>

        <div className="hero-actions">
          <Link to="/register" className="cta-button">
            Get Started
          </Link>
        </div>

        <div className="dashboard-preview">
          {/* Placeholder for dashboard screenshot/demo */}
          <p>Dashboard Preview Placeholder</p>
        </div>
      </main>
    </div>
  );
};

export default Home;
