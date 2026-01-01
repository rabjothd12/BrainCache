import { useRef } from "react";
import "../pages/styles/home.css";

function TemplateCarousel() {
  const carouselRef = useRef(null);

  const scrollLeft = () => {
    carouselRef.current.scrollBy({
      left: -300,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    carouselRef.current.scrollBy({
      left: 300,
      behavior: "smooth",
    });
  };

  return (
    <section className="templates">
      <h2>Choose a template you’ll love</h2>

      <div className="carousel-wrapper">
        <button className="carousel-btn left" onClick={scrollLeft}>
          ‹
        </button>

        <div className="carousel" ref={carouselRef}>
  <img src="/temp1.webp" alt="Template 1" />
  <img src="/temp2.webp" alt="Template 2" />
  <img src="/temp3.webp" alt="Template 3" />
  <img src="/temp4.webp" alt="Template 4" />
  <img src="/temp5.webp" alt="Template 5" />
  <img src="/temp6.webp" alt="Template 6" />
  <img src="/temp7.webp" alt="Template 7" />
</div>
        <button className="carousel-btn right" onClick={scrollRight}>
          ›
        </button>
      </div>
    </section>
  );
}

export default TemplateCarousel;
