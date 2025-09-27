"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/navigation";
import { IoMdLogOut } from "react-icons/io";
import { Navbar, Container } from "react-bootstrap";
import { LiaBusinessTimeSolid } from "react-icons/lia";


export default function AdminPage() {
  const router = useRouter();

  const handleLogout = () => {
    router.push("/login?logout=success");
  };

  const products = [
    { id: 1, name: "Dress", buyPrice: 5.0, sellPrice: 7.0, stock: 3, status: "In Stock" },
    { id: 2, name: "Shirt", buyPrice: 4.0, sellPrice: 6.0, stock: 0, status: "Out of Stock" },
    { id: 3, name: "Baby Suit", buyPrice: 6.0, sellPrice: 8.0, stock: 5, status: "In Stock" },
  ];

  return (
    <div>
      {/* Top Navbar */}
      <Navbar bg="light" className="shadow-sm mb-4">
        <Container className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <img
              src="https://babyoutfitcambodia.netlify.app/assets/profile_image1.png"
              alt="Logo"
              className="rounded-5 me-3"
              style={{
                width: "48px",
                height: "48px",
                objectFit: "cover",
                border: "2px solid #ddd",
                padding: "5px",
              }}
            />
            <div
            style={{
                background: "linear-gradient(135deg, #667eea, #764ba2)",
                WebkitBackgroundClip:"text",
                WebkitTextFillColor: "transparent",
            }}
            >
              <h4 className="fw-bold mb-0">Baby Outfit Cambodia</h4>
              <small className="text-muted">Premium Baby Clothes</small>
            </div>
          </div>

          <div>
            <button
              className="btn btn-outline-primary me-2"
              onClick={() => router.push("/Main-page")}
            >
                <LiaBusinessTimeSolid />   Products
            </button>
            <button className="btn btn-outline-danger" onClick={handleLogout}>
              <IoMdLogOut /> Logout
            </button>
          </div>
        </Container>
      </Navbar>

      {/* Layout with Sidebar + Main Content */}
      <div className="container-fluid">
        <div className="row">
          {/* Sidebar */}
          <div className="col-md-2 bg-light p-3 min-vh-100">
            <h5>Menu</h5>
            <ul className="nav flex-column">
              <li className="nav-item">
                <a className="nav-link" href="#">Stock Management</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Batch Management</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Expense</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Income</a>
              </li>
            </ul>
          </div>

          {/* Main Content */}
          <div className="col-md-10 p-4">
            {/* Summary Cards */}
            <div className="row mb-4">
              <div className="col-md-3">
                <div className="card text-center">
                  <div className="card-body">
                    <h5>Total Products</h5>
                    <p className="fs-4 fw-bold">20</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card text-center">
                  <div className="card-body">
                    <h5>In Stock</h5>
                    <p className="fs-4 fw-bold text-success">17</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card text-center">
                  <div className="card-body">
                    <h5>Out of Stock</h5>
                    <p className="fs-4 fw-bold text-danger">3</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Table */}
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5>Product List</h5>
                <button className="btn btn-primary">+ Add New Product</button>
              </div>
              <div className="card-body table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Buy Price</th>
                      <th>Sell Price</th>
                      <th>Stock</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id}>
                        <td>{p.id}</td>
                        <td>{p.name}</td>
                        <td>${p.buyPrice.toFixed(2)}</td>
                        <td>${p.sellPrice.toFixed(2)}</td>
                        <td>{p.stock}</td>
                        <td>
                          <span
                            className={`badge ${
                              p.status === "In Stock" ? "bg-success" : "bg-danger"
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td>
                          <button className="btn btn-sm btn-info me-2">Edit</button>
                          <button className="btn btn-sm btn-danger">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
