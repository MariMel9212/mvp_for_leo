/** Пустой на локальном сервере. На GitHub Pages это имя репозитория, например `/svoi-tsentr`. */
export function asset(path: string) {
  if (!path || /^(?:data:|https?:|blob:)/.test(path)) return path;
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return path.startsWith("/") ? `${base}${path}` : path;
}
