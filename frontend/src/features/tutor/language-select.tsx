import { Check, ChevronDown, Code2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { examples, languageOrder, type Language } from "./examples";

export function LanguageSelect({
  id,
  value,
  onChange,
}: {
  id: string;
  value: Language;
  onChange: (value: Language) => void;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const selected = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    selected.current?.focus();
    function dismiss(event: PointerEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [open]);

  function close() {
    setOpen(false);
    trigger.current?.focus();
  }

  return (
    <div
      className="example-language"
      ref={root}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.preventDefault();
          close();
        }
        if (event.key === "Tab" && open) setOpen(false);
      }}
    >
      <div className="language-control">
        <button
          ref={trigger}
          id={id}
          type="button"
          className="language-trigger"
          aria-label={"Langage de l’exemple : " + examples[value].label}
          aria-expanded={open}
          aria-controls={id + "-menu"}
          aria-haspopup="true"
          onClick={() => setOpen(!open)}
        >
          <Code2 size={16} aria-hidden="true" />
          <span>{examples[value].label}</span>
          <ChevronDown
            size={16}
            className="language-arrow"
            aria-hidden="true"
          />
        </button>
        {open && (
          <fieldset id={id + "-menu"} className="language-menu">
            <legend className="sr-only">Langage de l’exemple</legend>
            <p className="language-menu-title" aria-hidden="true">
              Choisir un langage
            </p>
            <div className="language-menu-list">
              {languageOrder.map((key) => (
                <label
                  key={key}
                  className={
                    "language-option" + (key === value ? " is-selected" : "")
                  }
                >
                  <input
                    ref={key === value ? selected : undefined}
                    type="radio"
                    name={id + "-language"}
                    value={key}
                    checked={value === key}
                    onChange={() => {
                      onChange(key);
                      close();
                    }}
                  />
                  <span>{examples[key].label}</span>
                  {key === value && <Check size={16} aria-hidden="true" />}
                </label>
              ))}
            </div>
          </fieldset>
        )}
      </div>
    </div>
  );
}
