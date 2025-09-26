import React from "react";
import { useTheme } from "../context/ThemeContext";
import { FaShoppingBasket, FaCog, FaComments } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const HowItWork = () => {
  const { darkMode } = useTheme();

  const styles = {
    container: {
      textAlign: "center",
      padding: "40px 20px",
      backgroundColor: darkMode ? "#121212" : "#fdf5e6",
      color: darkMode ? "#fff" : "#000",
    },
    title: {
      fontSize: "24px",
      fontWeight: "bold",
      marginBottom: "5px",
    },
    subtitle: {
      fontSize: "14px",
      marginBottom: "30px",
      color: darkMode ? "#ccc" : "#555",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "20px",
    },
    card: {
      backgroundColor: darkMode ? "#2e2e2e" : "#c5fb7d",
      padding: "20px",
      borderRadius: "12px",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      textAlign: "center",
    },
    icon: {
      fontSize: "40px",
      marginBottom: "15px",
    },
    cardTitle: {
      fontSize: "18px",
      fontWeight: "bold",
      marginBottom: "10px",
    },
    text: {
      fontSize: "14px",
      lineHeight: "1.5",
    },
  };

  return (
    <section style={styles.container}>
      <h2 style={styles.title}>HOW IT WORK</h2>
      <p style={styles.subtitle}>Generate a delicious recipe in few steps</p>

      <div style={styles.grid}>
        <div style={styles.card}>
          <FaShoppingBasket style={styles.icon} />
          <h3 style={styles.cardTitle}>1. ENTER THE INGREDIENTS</h3>
          <p style={styles.text}>
            Start by typing in the ingredients you have or ingredients of your choice.
          </p>
        </div>

        <div style={styles.card}>
          <AiOutlineLoading3Quarters style={styles.icon} />
          <h3 style={styles.cardTitle}>2. API PROCESSING</h3>
          <p style={styles.text}>
            Hold on tight, your recipe is about to be made thanks to our API which will
            find you a delicious dish.
          </p>
        </div>

        <div style={styles.card}>
          <FaCog style={styles.icon} />
          <h3 style={styles.cardTitle}>3. CUSTOM YOUR RECIPE</h3>
          <p style={styles.text}>
            Choose your cooking style, the ingredients you want to avoid, make vegan
            dishes… I can create the dish that suits you best.
          </p>
        </div>

        <div style={styles.card}>
          <FaComments style={styles.icon} />
          <h3 style={styles.cardTitle}>4. COMMENT, FAVORITES</h3>
          <p style={styles.text}>
            After generating your dish, add it to your favorites and leave a comment
            about it.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWork;
