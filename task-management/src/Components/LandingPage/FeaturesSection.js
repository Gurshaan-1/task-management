import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
const FeaturesSection = () => {
    return (
      <section className="features-section">
        <div className="container">
          <h2 className="text-center">Features</h2>
          <hr/>
          <div className="row">
            <div className="col-lg-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">Task Management</h5>
                  <hr/>
                  <p className="card-text text-center">
                    Easily create, assign tasks for efficient team
                    collaboration.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 ">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">Notification System</h5>
                  <hr/>
                  <p className="card-text text-center">
                    Notify team members about change in deadline,File upload etc.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">File Sharing</h5>
                  <hr/>
                  <p className="card-text text-center">
                    Share files and documents seamlessly to streamline
                    collaboration and access important resources.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };
  
  export default FeaturesSection;
  