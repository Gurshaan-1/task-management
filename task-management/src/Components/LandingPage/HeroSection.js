import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import task from './task.png'
const HeroSection = () => {
    return (
      <section className="hero-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 d-flex flex-column justify-content-center">
              <h1>Welcome to Task-Manage</h1>
              <p>
                Boost your team's productivity and collaboration with our
                powerful task management application.
              </p>
              
            </div>
            <div className="col-lg-6">
              <img
                src={task}
                alt="Task Management App"
                className="img-fluid rounded-5"
              />
            </div>
          </div>
        </div>
      </section>
    );
  };
  
  
  export default HeroSection;
  