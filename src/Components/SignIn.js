import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const SignIn = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-red-200">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 border-2 border-red-500">
        <h2 className="text-4xl font-extrabold text-red-600 text-center mb-4 font-mono">
          Welcome to <span className="text-yellow-500">BuzzSocial</span>
        </h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="Email" 
            required 
            className="p-3 border-2 border-yellow-500 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Password" 
            required 
            className="p-3 border-2 border-yellow-500 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button 
            type="submit" 
            className="bg-red-500 text-white py-2 rounded-md transition duration-300 transform hover:scale-105 hover:bg-yellow-600 font-bold">
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-gray-700">
          Don't have an account?{" "}
          <Link to="/signup" className="text-red-600 font-semibold hover:underline">
            Sign Up
          </Link>
        </p>
        <p className="mt-6 text-center bg-yellow-500 text-red-800 p-2 rounded-md font-bold shadow-md">
          To see the demo: <br />
          <span className="text-black">Email: sagar@gmail.com</span> <br />
          <span className="text-black">Password: 123456789</span>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
