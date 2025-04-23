import style from "./Explorer.module.css";

import Files from "./components/Files/Files";

export default function Explorer() {
  return (
    <div className={style.wrapper}>
      <Files />
    </div>
  );
}
