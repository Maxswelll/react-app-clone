import Image from "next/image";
import styles from "../../app/page.module.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <div className="container text-center">
        <div className="row">
          <div className="col">Colum fdgsn</div>
          <div className="col">Column</div>
          <div className="col">Column</div>
        </div>
      </div>
    </div>
  );
}
