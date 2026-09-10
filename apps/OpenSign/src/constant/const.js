export const contactCls = "contracts_Contactbook";
export const templateCls = "contracts_Template";
export const documentCls = "contracts_Document";
export const themeColor = "#1F1E5B"; // swurv.tax --primary (was a stale teal)
export const iconColor = "#4B5563"; // swurv.tax --gray-600
export const SCALE_STEPS = [
  0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0, 2.25, 2.5, 2.75, 3.0
];
// Dynamic icon color function for better dark mode visibility
export const getThemeIconColor = () => {
  const theme = document.documentElement.getAttribute("data-theme");
  return theme === "opensigndark" ? "#E0E0E0" : "#4B5563";
};
export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const maxTitleLength = 250; // 250 characters
export const maxNoteLength = 200; // 200 characters
export const maxDescriptionLength = 500; // 500 characters
export const maxFileSize = 80; // for cloud 10MB / 80MB for self-hosted

// SWURV: the app ships two logo marks -- logo-dark.png is the light-coloured mark
// meant for dark surfaces, and appInfo.applogo is the dark mark for light ones.
// Header.jsx already switched between them; every other logo site rendered
// applogo unconditionally, which is invisible against the dark default theme.
export const DARK_LOGO_PATH = "/static/js/assets/images/logo-dark.png";
export const getThemedLogo = (lightLogo) =>
  document.documentElement.getAttribute("data-theme") === "opensigndark"
    ? DARK_LOGO_PATH
    : lightLogo;
