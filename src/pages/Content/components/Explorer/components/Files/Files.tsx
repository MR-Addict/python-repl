import clsx from "clsx";
import style from "./Files.module.css";

import Header from "./components/Header/Header";
import Nodetree from "./components/Nodetree/Nodetree";
import { useAppContext } from "@/contexts/App/App";

export default function Files() {
  const { ui } = useAppContext();

  return (
    <section className={clsx(style.wrapper, { [style.hide]: ui.sidetab.tab !== "files" })}>
      <Header />
      <Nodetree />
    </section>
  );
}
