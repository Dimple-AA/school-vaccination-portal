import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from "../api/students";

export default function AuthForm({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLogin && formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    const endpoint = isLogin ? "/api/users/login" : "/api/users/register";

    try {
      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : {
            username: formData.username,
            email: formData.email,
            password: formData.password,
          };

      const res = await api.post(endpoint, payload);

      if (isLogin) {
        const { accessToken } = res.data;
        localStorage.setItem("authToken", accessToken);
        onLogin();
        setMessage("Success! Redirecting...");
        setTimeout(() => navigate("/dashboard"), 1000);
      } else {
        setMessage("Registered successfully! Please login.");
        setTimeout(() => {
          toggleMode();
        }, 1500);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Something went wrong!";
      setMessage(`${errorMsg}`);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setMessage("");
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>
          {isLogin ? "Login to Your Account" : "Create a New Account"}
        </h2>

        {!isLogin && (
          <>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              required
              onChange={handleChange}
              style={styles.input}
              placeholder="Your username"
            />
          </>
        )}

        <label style={styles.label}>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          required
          onChange={handleChange}
          style={styles.input}
          placeholder="you@example.com"
        />

        <label style={styles.label}>Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          required
          onChange={handleChange}
          style={styles.input}
          placeholder="••••••••"
        />

        {!isLogin && (
          <>
            <label style={styles.label}>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              required
              onChange={handleChange}
              style={styles.input}
              placeholder="••••••••"
            />
          </>
        )}

        <button type="submit" style={styles.button}>
          {isLogin ? "Login" : "Register"}
        </button>

        {message && (
          <div
            style={{
              ...styles.message,
              color: message.includes("") ? "green" : "red",
            }}
          >
            {message}
          </div>
        )}

        <p style={styles.switchText}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span onClick={toggleMode} style={styles.link}>
            {isLogin ? "Register here" : "Login here"}
          </span>
        </p>
      </form>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "linear-gradient(to bottom right, #e0eafc, #cfdef3)",
  },
  form: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "400px",
    display: "flex",
    flexDirection: "column",
  },
  title: {
    marginBottom: "20px",
    textAlign: "center",
    fontSize: "20px",
    fontWeight: "bold",
    color: "#333",
  },
  label: {
    marginBottom: "5px",
    fontSize: "14px",
    color: "#555",
  },
  input: {
    padding: "10px",
    marginBottom: "15px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "14px",
  },
  button: {
    padding: "10px",
    backgroundColor: "#4a90e2",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "16px",
    marginBottom: "10px",
  },
  message: {
    marginTop: "10px",
    textAlign: "center",
    fontSize: "14px",
  },
  switchText: {
    fontSize: "13px",
    textAlign: "center",
    marginTop: "10px",
    color: "#666",
  },
  link: {
    color: "#4a90e2",
    cursor: "pointer",
    textDecoration: "underline",
    marginLeft: "5px",
  },
};
