export const configs = {
  APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  API_URL: process.env.NEXT_PUBLIC_API_URL,
  SESSION_SECRET: process.env.SESSION_SECRET,
  get STATIC_URL() {
    return `${this.API_URL}/uploads`;
  },
};

export const PUBLIC_ROUTES = [""];

export const UNAUTHORIZED_ROUTES = [
  "/",
  "/signin",
  "/signin/2fa",
  "/reset-password",
  "/forgot-password",
  "/forgot-password/mail-send",
  "/mpay",
  "/mpay/review",

  "/register",
  "/register/agent",
  "/register/merchant",
  "/register/customer",
  "/register/email-verification-message",
  "/register/email-verification-status",
];

export const UNAUTHORIZED_REDIRECTION = "/signin";
export const HOME_REDIRECTION = "/";
