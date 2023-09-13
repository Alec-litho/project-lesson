import { Link } from "react-router-dom";
import React from "react";

export default function Register() {
  return (
    <section className="container forms">
      <div className="form signup">
        <div className="form-content">
          <header>Signup</header>
          <form action="#">
            <div className="field input-field">
              <input type="email" placeholder="Email" className="input" />
            </div>
            <div className="field input-field">
              <input
                type="password"
                placeholder="Create password"
                className="password"
              />
            </div>
            <div className="field input-field">
              <input
                type="password"
                placeholder="Confirm password"
                className="password"
              />
            </div>
            <div className="field button-field">
              <button type="button">Signup</button>
            </div>
          </form>
          <div className="form-link">
            <span>
              Already have an account?
              <Link to="/login" className="link login-link">
                Log in
              </Link>
            </span>
          </div>
        </div>
        <div className="line" />
        <div className="media-options">
          <a href="/register" className="field facebook">
            <i className="bx bxl-facebook facebook-icon" />
            <span>Login with Facebook</span>
          </a>
        </div>
        <div className="media-options">
          <a href="/register" className="field google">
            <img src="#" alt="" className="google-img" />
            <span>Login with Google</span>
          </a>
        </div>
      </div>
    </section>
  );
}
