import { Tooltip } from "antd";

import style from "./Sidetabs.module.css";
import { sidetabs } from "@/data/sidetabs";

export default function Sidetabs() {
  return (
    <div className={style.wrapper}>
      <ul>
        {sidetabs.map((tab) => (
          <li key={tab.key}>
            <button type="button" className={style.tab}>
              <Tooltip title={tab.name} placement="right">
                <tab.Icon size={20} />
              </Tooltip>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
