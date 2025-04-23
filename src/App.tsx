import style from "./App.module.css";

import Navbar from "@/pages/Navbar/Navbar";
import Sidetabs from "@/pages/Sidetabs/Sidetabs";
import Content from "@/pages/Content/Content";

export default function App() {
  return (
    <main className={style.wrapper}>
      <Navbar />

      <div className="flex-1 flex flex-row">
        <Sidetabs />
        <Content />
      </div>
    </main>
  );
}
