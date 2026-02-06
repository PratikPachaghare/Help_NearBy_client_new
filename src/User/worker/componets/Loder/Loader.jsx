import React from "react";
import "./Loader.css";

const Loader = () => {
  return (
    <div className="premium-loader-overlay">
      <div className="dual-ring-spinner"></div>
    </div>
  );
};

export const Loader2 = () => {
  return (
    <div className="premium-loader-overlay2">
      <div className="dual-ring-spinner2"></div>
    </div>
  );
};

export default Loader;
