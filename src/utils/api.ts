export const api_url =
  process.env.NODE_ENV === "development"
    ? "http://3.124.99.216"
    : "https://www.gonenkleopatra.com"; //! api subdomaini eklencek

export const pay_url =
  process.env.NODE_ENV === "development"
    ? "http://pay.huseyinapa.com"
    : "https://pay.gonenkleopatra.com"; //! api subdomaini eklencek
