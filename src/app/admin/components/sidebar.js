"use client";
import React, { useState } from "react";
import { IoBagHandleOutline } from "react-icons/io5";
import { AiOutlineShoppingCart, AiOutlineDollar } from "react-icons/ai";
import { GiHamburgerMenu } from "react-icons/gi";
import { Button } from "react-bootstrap";

const Sidebar = ({ activeMenu, setActiveMenu }) => {
  const [open, setOpen] = useState(false);

  const menuItems = [
    { key: "stock", label: "Stock Management", icon: IoBagHandleOutline },
    { key: "batch", label: "Batch Management", icon: IoBagHandleOutline },
    { key: "expense", label: "Expense", icon: AiOutlineShoppingCart },
    { key: "income", label: "Income", icon: AiOutlineDollar },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="d-md-none p-2">
        <Button
          variant="light"
          onClick={() => setOpen(!open)}
          style={{
            borderRadius: "10px",
            boxShadow: "0 2px 6px #00000022",
          }}
        >
          <GiHamburgerMenu size={22} />
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={`sidebar ${open ? "d-block" : "d-none"} d-md-block`} // always show on md+, toggle on mobile
        style={{
          width: "260px",
          background: "#fff",
          borderRadius: "16px",
          boxShadow: "0 4px 20px #00000014",
          padding: "1.5rem 0",
          height: "fit-content",
          position: "sticky",
          top: "1rem",
          zIndex: 1000,
        }}
      >
        <div className="d-flex flex-column gap-2">
          {menuItems.map(({ key, label, icon: Icon }) => (
            <div
              key={key}
              onClick={() => {
                setActiveMenu(key);
                setOpen(false); // auto close on mobile
              }}
              style={{
                background:
                  activeMenu === key
                    ? "linear-gradient(135deg, #667eea , #764ba2)"
                    : "#f9fafb",
                color: activeMenu === key ? "#fff" : "#374151",
                boxShadow:
                  activeMenu === key
                    ? "0 4px 15px #667eea4d"
                    : "0 0 0 transparent",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "1rem 1.5rem",
                borderRadius: "12px",
                cursor: "pointer",
                transition: "all .3s ease",
                fontWeight: "500",
                margin: "0 15px",
              }}
            >
              <Icon size={22} /> {label}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
