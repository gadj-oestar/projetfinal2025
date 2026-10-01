import React from "react";

const STEPS = [
  {
    title: "Listez vos ingrédients",
    text: "Tapez ce que vous avez dans le frigo, séparé par des virgules.",
  },
  {
    title: "On cherche pour vous",
    text: "Notre API interroge Spoonacular et trouve les recettes qui correspondent.",
  },
  {
    title: "Consultez la fiche",
    text: "Ingrédients, temps de préparation et étapes, tout est au même endroit.",
  },
  {
    title: "Gardez vos préférées",
    text: "Ajoutez une recette aux favoris pour la retrouver plus tard.",
  },
];

const HowItWork = () => {
  return (
    <section className="section">
      <h2 className="section-title">Comment ça marche</h2>
      <div className="steps-grid">
        {STEPS.map((step, i) => (
          <div className="step" key={step.title}>
            <span className="step-num">{i + 1}</span>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWork;
