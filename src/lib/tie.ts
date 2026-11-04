const shortWords = new Set([
  "в",
  "во",
  "без",
  "до",
  "для",
  "за",
  "из",
  "изо",
  "к",
  "ко",
  "на",
  "над",
  "о",
  "об",
  "обо",
  "от",
  "по",
  "под",
  "при",
  "про",
  "с",
  "со",
  "у",
  "через",
  "и",
  "а",
  "но",
  "да",
  "или",
  "либо",
  "не",
  "ни",
  "же",
  "бы",
  "ли",
  "один",
]);

export function tie(text: string) {
  const parts = text.split(" ");
  const out: string[] = [];
  for (let i = 0; i < parts.length; i++) {
    const bare = parts[i].replace(/^[«"(\[]+|[»".,:;!?)\]]+$/g, "").toLowerCase();
    if ((bare === "—" || bare === "–") && out.length && parts[i + 1]) {
      const prev = out.pop();
      out.push(`${prev}\u00A0${parts[i]}\u00A0${parts[i + 1]}`);
      i += 1;
      continue;
    }
    if (shortWords.has(bare) && parts[i + 1]) {
      out.push(`${parts[i]}\u00A0${parts[i + 1]}`);
      i += 1;
    } else {
      out.push(parts[i]);
    }
  }
  return out.join(" ");
}
