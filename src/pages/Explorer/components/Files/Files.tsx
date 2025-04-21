import style from "./Files.module.css";

import Header from "./components/Header/Header";
import Nodetree from "./components/Nodetree/Nodetree";

export default function Files() {
  return (
    <section className={style.wrapper}>
      <Header />
      <Nodetree />
    </section>
  );
}
