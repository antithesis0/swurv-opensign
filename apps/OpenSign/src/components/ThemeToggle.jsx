import { useEffect, useState } from "react";

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // SWURV: dark is the brand default (swurv.tax is dark-only), so an absent
    // preference means dark. Only an explicit "light" choice opts out.
    const storedTheme = localStorage.getItem("theme");
    const dark = storedTheme !== "light";
    setIsDark(dark);
    document.documentElement.setAttribute(
      "data-theme",
      dark ? "opensigndark" : "opensigncss"
    );
  }, []);

  const handleChange = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (newTheme) {
      document.documentElement.setAttribute("data-theme", "opensigndark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "opensigncss");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <>
      <input
        id="dark-mode-toggle"
        type="checkbox"
        className="op-toggle checked:[--tglbg:#F0790C] transition-all checked:bg-white"
        checked={isDark}
        onChange={handleChange}
      />
    </>
  );
};

export default ThemeToggle;
