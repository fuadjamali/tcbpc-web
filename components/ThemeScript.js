const THEME_SCRIPT = `
(function () {
  // Follow the device's light/dark setting (light when it can't tell). The theme toggle was removed,
  // so any old saved choice is ignored.
  var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (prefersDark) document.documentElement.classList.add("dark");

  var storedColor = localStorage.getItem("falcon-color-theme") || "ocean";
  document.documentElement.setAttribute("data-theme", storedColor);
})();
`;

export default function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />;
}
