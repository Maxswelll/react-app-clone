import { Container } from "react-bootstrap";

export default function Footer({ filteredCount, totalCount }) {
  return (
    <Container className="text-center py-4 ">
      <div className="p-4 border rounded-5 shadow-sm">
        <div className="text-success fs-3">✅</div>
        <h5 className="mt-2">All products loaded!</h5>
        <p className="mb-0">
          You’ve seen <strong>{filteredCount}</strong>
          {filteredCount === 1 ? "product" : "products"}
          {filteredCount !== totalCount && <> (out of {totalCount} total)</>}
        </p>
      </div>
    </Container>
  );
}
