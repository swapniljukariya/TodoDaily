import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const SignUp = () => {
  const { register } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, username, email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-red-200">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 border-2 border-red-500">
        <h2 className="text-4xl font-extrabold text-red-600 text-center mb-4 font-mono">
          Join <span className="text-yellow-500">BuzzSocial</span>
        </h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="Full Name" 
            required 
            className="p-3 border-2 border-yellow-500 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            placeholder="Username" 
            required 
            className="p-3 border-2 border-yellow-500 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
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
            Register
          </button>
        </form>
        <p className="mt-4 text-center text-gray-700">
          Already have an account?{" "}
          <Link to="/signin" className="text-red-600 font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
