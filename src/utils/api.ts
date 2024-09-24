const api_url =
  process.env.NODE_ENV !== "production"
    ? "https://www.gonenkleopatra.com" //! api subdomaini eklencek
    : "http://3.124.99.216";

export default api_url;
