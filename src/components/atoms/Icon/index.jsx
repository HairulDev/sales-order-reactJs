import React from "react";
import { useNavigate } from "react-router-dom";

const Icon = ({ onClick, className, children, ...props }) => {
  const navigate = useNavigate();
  const handleClick = (event) => {
    if (props.to) {
      navigate(props.to);
    }
    if (onClick) {
      onClick(onClick);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`rounded-md ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Icon;
