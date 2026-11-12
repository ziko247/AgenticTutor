import { ChevronDown, Code2 } from "lucide-react";
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
  return (
    <div className="example-language">
      <label className="sr-only" htmlFor={id}>
        Langage de l’exemple
      </label>
      <div className="language-control">
        <Code2 size={16} aria-hidden="true" />
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value as Language)}
        >
          {languageOrder.map((key) => (
            <option value={key} key={key}>
              {examples[key].label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="language-chevron"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
