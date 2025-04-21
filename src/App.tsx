import { Splitter } from "antd";

import style from "./App.module.css";

import Navbar from "@/pages/Navbar/Navbar";
import Editor from "@/pages/Editor/Editor";
import Explorer from "@/pages/Explorer/Explorer";
import Sidetabs from "@/pages/Sidetabs/Sidetabs";

export default function App() {
  return (
    <main className={style.wrapper}>
      <Navbar />

      <div className={style.content}>
        <Sidetabs />
        <Splitter>
          <Splitter.Panel min={200} defaultSize={300} max={600}>
            <Explorer />
          </Splitter.Panel>
          <Splitter.Panel>
            <Editor />
          </Splitter.Panel>
        </Splitter>
      </div>
    </main>
  );
}
