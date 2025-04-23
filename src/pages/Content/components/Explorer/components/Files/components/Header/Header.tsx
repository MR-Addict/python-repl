import { Tooltip } from "antd";
import { VscNewFile, VscNewFolder } from "react-icons/vsc";

import style from "./Header.module.css";

export default function Header() {
  const actions = [
    { name: "New File", Icon: VscNewFile },
    { name: "New Folder", Icon: VscNewFolder }
  ];

  return (
    <nav className={style.wrapper}>
      <h1>Files</h1>

      <ul>
        {actions.map(({ name, Icon }) => (
          <li key={name}>
            <button type="button" className={style.btn}>
              <Tooltip title={name}>
                <Icon />
              </Tooltip>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
