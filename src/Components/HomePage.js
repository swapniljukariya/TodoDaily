import React from "react";
import { useNavigate } from "react-router-dom";
import main from './Img/pic.png';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Header Section */}
      <header className="bg-yellow-400 text-black py-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-extrabold">Adobe Express</div>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Sign in
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left Content */}
          <div className="lg:w-1/2 text-center lg:text-left">
            <h1 className="text-5xl font-bold text-gray-800 mb-6">
              Free online photo editor.
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Fix dark images, improve detail, and increase contrast and
              brightness with our free and easy image enhancer.
            </p>
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <button
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 shadow-lg"
                onClick={() => navigate('/photo-editor')}
              >
                Upload your photo
              </button>
              <span className="bg-gray-200 px-4 py-2 rounded-lg text-sm shadow-md">
                Free to use, no credit card required
              </span>
            </div>
          </div>

          {/* Right Image Section */}
          <div className="lg:w-1/2 relative">
            {/* Main Image */}
            <div className="relative w-full lg:w-3/4 mx-auto">
              <img
                src={main}
                alt="Main Display"
                className="rounded-xl shadow-xl border border-gray-300"
              />
            </div>

            {/* Decorative Background Image */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-200 rounded-full blur-lg opacity-50"></div>
          </div>
        </div>
      </main>

      {/* Footer Section */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto text-center">
          <p className="text-sm">&copy; 2024 Adobe Express. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
