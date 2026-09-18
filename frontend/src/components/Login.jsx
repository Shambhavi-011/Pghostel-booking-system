import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [role, setRole] = useState('tenant');
  const [isLogin, setIsLogin] = useState(true);
  
  // Form Data States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); // Page refresh roko
    
    // API Endpoints (Tumhare Thunder Client data ke hisaab se)
    const apiUrl = isLogin 
      ? 'http://localhost:8080/api/users/login' // Assume kar raha hu login ka path ye hoga
      : 'http://localhost:8080/api/users/signup';

    const payload = isLogin 
      ? { email, password, role } 
      : { name, email, password, role };

    try {
      const response = await axios.post(apiUrl, payload);
      alert(isLogin ? "Login Successful! 🎉" : "Registration Successful! 🎉");
      console.log("Backend Response:", response.data);
    } catch (error) {
      console.error(error);
      alert("Error: " + (error.response?.data?.message || "Something went wrong connecting to Backend!"));
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "60px auto", padding: "30px", background: "rgba(255, 255, 255, 0.9)", backdropFilter: "blur(10px)", border: "1px solid #e6d9ef", borderRadius: "15px", boxShadow: "0 10px 25px rgba(128, 96, 143, 0.1)" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#786d84" }}>
        {isLogin ? "Welcome to CampusNest" : "Create an Account"}
      </h2>

      {/* Profile Toggle */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "25px", background: "#f4eff7", borderRadius: "8px", padding: "5px" }}>
        <button type="button" onClick={() => setRole('tenant')} style={{ flex: 1, padding: "10px", backgroundColor: role === 'tenant' ? "#af87c8" : "transparent", color: role === 'tenant' ? "white" : "#80608f", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold", transition: "0.3s" }}>👨‍🎓 Student</button>
        <button type="button" onClick={() => setRole('owner')} style={{ flex: 1, padding: "10px", backgroundColor: role === 'owner' ? "#af87c8" : "transparent", color: role === 'owner' ? "white" : "#80608f", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold", transition: "0.3s" }}>🏠 PG Owner</button>
      </div>

      {/* Form with API Submit */}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        {!isLogin && (
          <input type="text" placeholder="Full Name" required value={name} onChange={(e) => setName(e.target.value)} style={{ padding: "12px", borderRadius: "8px", border: "1px solid #d5c8de", outline: "none" }} />
        )}
        <input type="email" placeholder="Email Address" required value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: "12px", borderRadius: "8px", border: "1px solid #d5c8de", outline: "none" }} />
        <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} style={{ padding: "12px", borderRadius: "8px", border: "1px solid #d5c8de", outline: "none" }} />
        
        <button type="submit" style={{ padding: "12px", backgroundColor: "#80608f", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "16px", fontWeight: "bold", marginTop: "10px" }}>
          {isLogin ? 'Login' : 'Register'} as {role === 'tenant' ? 'Student' : 'Owner'}
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: "20px", color: "#786d84", fontSize: "14px" }}>
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <span onClick={() => setIsLogin(!isLogin)} style={{ color: "#af87c8", fontWeight: "bold", cursor: "pointer", textDecoration: "underline" }}>
          {isLogin ? "Register here" : "Login here"}
        </span>
      </p>
    </div>
  );
};

export default Login;