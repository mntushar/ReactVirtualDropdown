import { sayHello } from "react-virtual-dropdown";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <h1>Alhadmulilah</h1>
      <h2>{sayHello()}</h2>
    </div>
  );
}
