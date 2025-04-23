import style from "./Sidetabs.module.css";
import { useAppContext } from "@/contexts/App/App";
import { SidetabKeyType, sidetabs } from "@/data/sidetabs";

export default function Sidetabs() {
  const { ui, setUI } = useAppContext();

  function handleClick(key: SidetabKeyType) {
    let open = false;
    let active = key;
    if (!ui.sidetab.open || ui.sidetab.tab !== key) open = true;
    setUI((prev) => ({ ...prev, sidetab: { open: open, tab: active } }));
  }

  return (
    <div className={style.wrapper}>
      <ul>
        {sidetabs.map((tab) => (
          <li key={tab.key}>
            <button
              type="button"
              className={style.tab}
              onClick={() => handleClick(tab.key)}
              data-active={ui.sidetab.tab === tab.key && ui.sidetab.open}
            >
              <tab.Icon size={20} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
