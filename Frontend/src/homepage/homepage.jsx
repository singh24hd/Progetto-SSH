import React, { useState, useEffect } from 'react';
import './HomePage.css';

const HomePage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Fade in elements when component mounts
    setIsVisible(true);
    
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
          }
        });
      },
      { threshold: 0.1 }
    );
    
    const elements = document.querySelectorAll('.scroll-animate');
    elements.forEach((el) => observer.observe(el));
    
    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className={`home-container ${isVisible ? 'visible' : ''}`}>
      <header className="header">
        <div className="logo">
          <h1>Brand<span>Name</span></h1>
        </div>
        <nav className="nav">
          <ul>
            <li><a href="#home" className="active">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#portfolio">Portfolio</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
        <div className="mobile-nav-toggle">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </header>

      <section className="hero">
        <div className="hero-content">
          <h1 className="scroll-animate">Creating Digital <span>Experiences</span></h1>
          <p className="scroll-animate">We build beautiful, responsive websites and applications that engage your audience.</p>
          <div className="cta-buttons scroll-animate">
            <button className="primary-btn">Get Started</button>
            <button className="secondary-btn">Learn More</button>
          </div>
        </div>
        <div className="hero-image scroll-animate">
          {/* Replace with your image */}
          <div className="placeholder-image"></div>
        </div>
      </section>

      <section id="about" className="about-section">
        <h2 className="section-title scroll-animate">About Us</h2>
        <div className="about-content">
          <div className="about-image scroll-animate">
            {/* Replace with your image */}
            <div className="placeholder-image"></div>
          </div>
          <div className="about-text">
            <p className="scroll-animate">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam scelerisque, magna in faucibus vehicula, mi dui efficitur sapien, a congue tellus nisi sit amet ex.</p>
            <p className="scroll-animate">Vivamus hendrerit rhoncus eros, nec ultrices neque finibus eget. Praesent vel tortor sagittis, commodo arcu vel, ultricies velit.</p>
          </div>
        </div>
      </section>

      <section id="services" className="services-section">
        <h2 className="section-title scroll-animate">Our Services</h2>
        <div className="services-grid">
          <div className="service-card scroll-animate">
            <div className="service-icon">✨</div>
            <h3>Web Design</h3>
            <p>Beautiful, modern designs tailored to your brand and business goals.</p>
          </div>
          <div className="service-card scroll-animate">
            <div className="service-icon">💻</div>
            <h3>Development</h3>
            <p>Fast, responsive websites and applications built with the latest technologies.</p>
          </div>
          <div className="service-card scroll-animate">
            <div className="service-icon">📱</div>
            <h3>Mobile Apps</h3>
            <p>Intuitive mobile experiences for iOS and Android platforms.</p>
          </div>
          <div className="service-card scroll-animate">
            <div className="service-icon">📊</div>
            <h3>SEO</h3>
            <p>Optimize your online presence to reach more customers organically.</p>
          </div>
        </div>
      </section>

      <section id="portfolio" className="portfolio-section">
        <h2 className="section-title scroll-animate">Our Work</h2>
        <div className="portfolio-grid">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="portfolio-item scroll-animate">
              <div className="portfolio-image">
                {/* Replace with your image */}
                <div className="placeholder-image"></div>
              </div>
              <div className="portfolio-overlay">
                <h4>Project {item}</h4>
                <p>Web Design</p>
                <a href="#" className="view-project">View Project</a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="contact-section">
        <h2 className="section-title scroll-animate">Get In Touch</h2>
        <div className="contact-container">
          <div className="contact-info scroll-animate">
            <div className="contact-item">
              <div className="contact-icon">📍</div>
              <p>123 Main Street, City, Country</p>
            </div>
            <div className="contact-item">
              <div className="contact-icon">📞</div>
              <p>+1 234 567 890</p>
            </div>
            <div className="contact-item">
              <div className="contact-icon">✉️</div>
              <p>hello@brandname.com</p>
            </div>
          </div>
          <form className="contact-form scroll-animate">
            <div className="form-group">
              <input type="text" placeholder="Your Name" required />
            </div>
            <div className="form-group">
              <input type="email" placeholder="Your Email" required />
            </div>
            <div className="form-group">
              <input type="text" placeholder="Subject" />
            </div>
            <div className="form-group">
              <textarea placeholder="Your Message" rows="5" required></textarea>
            </div>
            <button type="submit" className="primary-btn">Send Message</button>
          </form>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <h2>Penny<span>Advice</span></h2>
            <p>Creating digital experiences that inspire.</p>
          </div>
          <div className="footer-links">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#services">Services</a></li>
              <li><a href="#portfolio">Portfolio</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
          <div className="footer-social">
            <h3>Connect With Us</h3>
            <div className="social-icons">
              <a href="#" aria-label="Facebook">FB</a>
              <a href="#" aria-label="Twitter">TW</a>
              <a href="#" aria-label="Instagram">IG</a>
              <a href="#" aria-label="LinkedIn">LI</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} BrandName. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;