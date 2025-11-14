import "./landing.css";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="landing-root">
      {/* Animated Background Grid */}
      <div className="landing-bg-grid"></div>

      <div className="landing-hero animate-fade-in">
        <h1 className="landing-title glow-text">Performance Dashboard</h1>

        <p className="landing-subtitle">
          Ultra-smooth real-time data visualization with GPU-powered charts,
          interactive controls, and high-performance streaming.
        </p>

        <div className="landing-buttons">
          <Link href="/dashboard" className="landing-btn landing-btn-primary">
            🚀 Open Dashboard
          </Link>

          <a
            href="https://github.com/ch-ankit679/performance-dashboard"
            target="_blank"
            className="landing-btn landing-btn-secondary"
          >
            📘 View Docs
          </a>
        </div>
      </div>

      {/* Features Section */}
      <div className="landing-features animate-slide-up">
        <div className="feature-box hover-card">
          <div className="feature-title">⚡ Real-time Streaming</div>
          <div className="feature-desc">
            Handles 10k+ datapoints at 60FPS with continuous streaming.
          </div>
        </div>

        <div className="feature-box hover-card">
          <div className="feature-title">🖥 GPU-Optimized Charts</div>
          <div className="feature-desc">
            High-performance line, bar, scatter & heatmap visualizations.
          </div>
        </div>

        <div className="feature-box hover-card">
          <div className="feature-title">🎛 Advanced Controls</div>
          <div className="feature-desc">
            Smooth zoom & pan, filtering, windowing, and pixel-level decimation.
          </div>
        </div>
      </div>

      <div className="landing-footer animate-fade-in">
        © 2025 Performance Dashboard — Built for high-speed visualization
      </div>
    </div>
  );
}
