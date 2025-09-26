import React from "react";
import Header from "./Header.jsx";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
      <Header />
      <Outlet /> {/* rendra la page correspondante */}
    </>
  );
};

export default MainLayout;
