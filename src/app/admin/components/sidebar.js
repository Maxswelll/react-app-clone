import React from "react";
import { IoBagHandleOutline } from "react-icons/io5";
import { AiOutlineShoppingCart, AiOutlineDollar } from "react-icons/ai";

const Sidebar = ({ activeMenu, setActiveMenu }) => {
  const menuItems = [
    { key: "stock", label: "Stock Management", icon: IoBagHandleOutline },
    { key: "batch", label: "Batch Management", icon: IoBagHandleOutline },
    { key: "expense", label: "Expense", icon: AiOutlineShoppingCart },
    { key: "income", label: "Income", icon: AiOutlineDollar },
  ];

  return (
    <div
      className="sidebar"
      style={{
        width: "280px",
        minWidth: "280px",
        background: "#fff",
        borderRadius: "16px",
        boxShadow: "0 4px 20px #00000014",
        padding: "1.5rem 0",
        height: "fit-content",
        position: "sticky",
        top: "2rem",
      }}
    >
      {/* Sidebar Items */}
      <div className="d-flex flex-column gap-2">
        {menuItems.map(({ key, label, icon: Icon }) => (
          <div
            key={key}
            onClick={() => setActiveMenu(key)}
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
            onMouseEnter={(e) => {
              if (activeMenu !== key) {
                e.currentTarget.style.background = "#f3f4f6";
              }
              e.currentTarget.style.transform = "translateX(6px)";
              e.currentTarget.style.boxShadow = "0 6px 20px #667eea66";
            }}
            onMouseLeave={(e) => {
              if (activeMenu !== key) {
                e.currentTarget.style.background = "#f9fafb";
              }
              e.currentTarget.style.transform = "translateX(0)";
              e.currentTarget.style.boxShadow =
                activeMenu === key
                  ? "0 4px 15px #667eea4d"
                  : "0 0 0 transparent";
            }}
          >
            <Icon size={25} /> {label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
