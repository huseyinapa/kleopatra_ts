const api_url =
  process.env.NODE_ENV === "development"
    ? "http://3.124.99.216"
    : "https://www.gonenkleopatra.com"; //! api subdomaini eklencek

export default api_url;
