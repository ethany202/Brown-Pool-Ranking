import React from "react";
import SiteHeader from "../../components/header/SiteHeader";
import { Outlet } from "react-router-dom";
import Footer from "../../components/footer/Footer";

export default function Layout() {
    return (
        <div className="page-content">
            <SiteHeader />
            <Outlet />
            <Footer />
        </div>
    )
}