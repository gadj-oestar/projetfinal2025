import React from "react";
import Header from "./Header.jsx";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet /> {/* rendra la page correspondante */}
      </main>
    </>
  );
};

export default MainLayout;
