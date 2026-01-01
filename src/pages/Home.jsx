import { Link } from "react-router-dom";
import "../pages/styles/home.css";
import TemplateCarousel from "../components/TemplateCarousel";

function Home() {
  return (
    <div className="home">

      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <h1>Create a Blog<br />You’re Proud Of</h1>
          <p>
            Brain Cache gives you the freedom to design, write, and grow your ideas online.
          </p>

          <Link to="/signup" className="btn-primary">
            Get Started
          </Link>
        </div>
      </section>

      {/* TEMPLATE PREVIEW */}
      <TemplateCarousel />

      {/* FEATURES */}
      <section className="features">
        <div className="feature-card">
          <img
            src="p1.jpg"
            alt="Build your presence"
          />
          <h3>Build Your Presence</h3>
          <p>Create beautiful blogs with ease.</p>
        </div>

        <div className="feature-card">
          <img
            src="p2.png"
            alt="Share your ideas"
          />
          <h3>Share Your Ideas</h3>
          <p>Write and publish in minutes.</p>
        </div>

        <div className="feature-card">
          <img
            src="p3.webp"
            alt="Grow your audience"
          />
          <h3>Grow Your Audience</h3>
          <p>Reach people who care about your content.</p>
        </div>
      </section>

      {/* SPLIT SECTION */}
      <section className="split">
        <div className="split-text">
          <h2>Your ideas deserve a platform</h2>
          <p>
            Brain Cache helps you focus on what matters — writing.
            We handle the rest.
          </p>

          <Link to="/signup" className="btn-secondary">
            Start Writing
          </Link>
        </div>

        <div className="split-image">
          <img
            src="https://workingnation.com/wp-content/uploads/2021/12/shutterstock_459867970-scaled.jpg"
            alt="Writing workspace"
          />
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <h2>Ready to create your blog?</h2>
        <Link to="/signup" className="btn-primary">
          Create Your Site
        </Link>
      </section>

    </div>
  );
}

export default Home;
