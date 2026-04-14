import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "../pages/styles/home.css";
import TemplateCarousel from "../components/TemplateCarousel";

function Home() {
  const token = localStorage.getItem("token"); 

  return (
    <div className="home">

      {/* HERO */}
      <section className="hero">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1>Create a Blog<br />You’re Proud Of</h1>
          <p>
            Brain Cache gives you the freedom to design, write, and grow your ideas online.
          </p>

          <motion.div whileHover={{ scale: 1.05 }}>
            <Link to={token ? "/write" : "/signup"} className="btn-primary">
              Get Started
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* TEMPLATE PREVIEW */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <TemplateCarousel />
      </motion.div>

      {/* FEATURES */}
      <section className="features">
        {[
          { img: "p1.jpg", title: "Build Your Presence", text: "Create beautiful blogs with ease." },
          { img: "p2.png", title: "Share Your Ideas", text: "Write and publish in minutes." },
          { img: "p3.webp", title: "Grow Your Audience", text: "Reach people who care about your content." }
        ].map((item, index) => (
          <motion.div
            key={index}
            className="feature-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15 }}
            whileHover={{ y: -6 }}
          >
            <img src={item.img} alt={item.title} />
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </motion.div>
        ))}
      </section>

      {/* SPLIT SECTION */}
      <section className="split">
        <motion.div
          className="split-text"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2>Your ideas deserve a platform</h2>
          <p>
            Brain Cache helps you focus on what matters — writing.
            We handle the rest.
          </p>

          <motion.div whileHover={{ scale: 1.05 }}>
            <Link to={token ? "/write" : "/signup"} className="btn-secondary">
              Start Writing
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="split-image"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <img
            src="https://workingnation.com/wp-content/uploads/2021/12/shutterstock_459867970-scaled.jpg"
            alt="Writing workspace"
          />
        </motion.div>
      </section>

      {/* CTA */}
      <motion.section
        className="cta"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <h2>Ready to create your blog?</h2>
        <motion.div whileHover={{ scale: 1.05 }}>
          <Link to={token ? "/write" : "/signup"} className="btn-primary">
            Create Your Blog
          </Link>
        </motion.div>
      </motion.section>

    </div>
  );
}

export default Home;