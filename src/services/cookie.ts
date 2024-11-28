/**
 * Tarayıcıya cookie ekler.
 *
 * @param name Cookie'nin adı
 * @param value Cookie değeri
 * @param days Cookie'nin geçerlilik süresi (gün cinsinden)
 * @example setCookie("token", "123456", 7); // 7 gün boyunca token cookie'si oluşturur
 * @access client
 */
export function setCookie(name: string, value: string, days: number) {
  if (typeof document === "undefined") return; // Sadece istemci tarafında çalıştır
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}${expires}; path=/; Secure; SameSite=Strict`;
}

/**
 * Tarayıcıdaki belirli bir cookie değerini döner.
 *
 * @param name Cookie'nin adı
 * @returns Cookie değeri veya null
 * @example getCookie("token"); // "123
 * @access client
 */
export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null; // Sadece istemci tarafında çalıştır
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  console.log("Cookie: " + match);

  return match ? decodeURIComponent(match[2]) : null;
}

/**
 * Tarayıcıdaki belirli bir cookie'yi siler.
 *
 * @param name Silinecek cookie'nin adı
 * @example deleteCookie("token");
 * @access client
 */
export function deleteCookie(name: string) {
  if (typeof document === "undefined") return; // Sadece istemci tarafında çalıştır
  document.cookie = `${name}=; Max-Age=0; path=/;`;
}
