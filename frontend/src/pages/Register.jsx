import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Auth.css";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    // console.log(formData);

    axios
      .post(
        "http://localhost:3000/api/auth/register",
        {
          fullName: {
            firstName: formData.firstname,
            lastName: formData.lastname,
          },
          email: formData.email,
          password: formData.password,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Join ChatAW mostly for free (placeholder)</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group half-width">
              <label htmlFor="firstname">First Name</label>
              <input
                type="text"
                id="firstname"
                name="firstname"
                placeholder="John"
                required
                onChange={handleChange}
              />
            </div>
            <div className="form-group half-width">
              <label htmlFor="lastname">Last Name</label>
              <input
                type="text"
                id="lastname"
                name="lastname"
                placeholder="Doe"
                required
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="name@example.com"
              required
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              required
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="auth-button" disabled={submitting}>
            {submitting ? "Creating account..." : "Create Account"}
          </button>
        </form>
        <div className="auth-footer">
          <p>Already have an account?</p>
          <Link to="/login" className="auth-link">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
