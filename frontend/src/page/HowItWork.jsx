import React from "react";
import { useTheme } from "@mui/material/styles";
import { FaShoppingBasket, FaCog, FaComments } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import "../css/HowItWork.css";

const HowItWork = () => {
  const { darkMode } = useTheme();

  return (
    <section className={`${darkMode ? "dark" : "light"} how-container`}>
      <h2 className="how-title">HOW IT WORK</h2>
      <p className="how-subtitle">Generate a delicious recipe in few steps</p>

      <div className="how-grid">
        <div className="how-card">
          <FaShoppingBasket className="how-icon" />
          <h3 className="how-card-title">1. ENTER THE INGREDIENTS</h3>
          <p className="how-text">
            Start by typing in the ingredients you have or ingredients of your choice.
          </p>
        </div>

        <div className="how-card">
          <AiOutlineLoading3Quarters className="how-icon" />
          <h3 className="how-card-title">2. API PROCESSING</h3>
          <p className="how-text">
            Hold on tight, your recipe is about to be made thanks to our API.
          </p>
        </div>

        <div className="how-card">
          <FaCog className="how-icon" />
          <h3 className="how-card-title">3. CUSTOM YOUR RECIPE</h3>
          <p className="how-text">
            Choose your cooking style, the ingredients you want to avoid… 
          </p>
        </div>

        <div className="how-card">
          <FaComments className="how-icon" />
          <h3 className="how-card-title">4. COMMENT, FAVORITES</h3>
          <p className="how-text">
            After generating your dish, add it to your favorites and leave a comment.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWork;
