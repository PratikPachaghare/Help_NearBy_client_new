// pages/About.jsx
import React from 'react';
import './About.css';
// about this page
const About = () => {
  return (
    <div className="about-container">
      <section className="about-hero">
        <h1>About NearKaamWala</h1>
        <p>Your bridge to local skilled workers — fast, reliable, and nearby.</p>
      </section>

      <section className="about-section">
        <h2>Our Mission</h2>
        <p>
          NearKaamWala is dedicated to connecting customers with verified and skilled workers like plumbers,
          electricians, carpenters, and appliance repair professionals. We aim to empower local talent and bring
          services to your doorstep with just a few clicks.
        </p>
      </section>

      <section className="about-section">
        <h2>Key Features</h2>
        <ul className="about-list">
          <li>✅ Easy worker registration with location and category</li>
          <li>✅ Customers can send requests with time and location</li>
          <li>✅ Secure login for both workers and users</li>
          <li>✅ Real-time request and response system</li>
          <li>✅ View worker profiles with ratings and reviews</li>
          <li>✅ Mobile-first design and responsive interface</li>
        </ul>
      </section>

      <section className="about-section">
        <h2>How It Works</h2>
        <ol className="about-list numbered">
          <li>🔧 Workers register and choose their service categories and sub-categories.</li>
          <li>📍 Customers browse nearby workers and send job requests with details.</li>
          <li>✅ Workers accept requests and contact users directly.</li>
          <li>🤝 Service is completed with trust, speed, and satisfaction.</li>
        </ol>
      </section>

      <section className="about-section">
        <h2>Why Choose Us?</h2>
        <p>
          We are not just a platform — we’re a movement to support local talent, reduce unemployment, and ensure
          every home gets trusted help when needed. Whether you're a user or a service provider, NearKaamWala is
          built for **you**.
        </p>
      </section>
    </div>
  );
};

export default About;
