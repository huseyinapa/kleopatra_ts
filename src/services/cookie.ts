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
  document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=/;`;
}

/**
 * Belirli bir cookie değerini döner.
 *
 * @param name Cookie adı
 * @returns Cookie değeri veya null
 */
export function getCookie(name: string): string | null {
  console.log("name: " + name);

  if (typeof document === "undefined") return null; // Sadece istemci tarafında çalıştır

  // Tüm cookie'leri al
  const allCookies = document.cookie;
  console.log("All Cookies: " + allCookies);

  // Cookie'yi bulmaya çalış
  const match = allCookies.match(new RegExp(`(^|; )${name}=([^;]*)`));

  if (match !== null) {
    console.log("Cookie Decoded: " + decodeURIComponent(match[2]));
    return decodeURIComponent(match[2]);
  }

  console.warn(`Cookie '${name}' bulunamadı veya erişilemez.`);
  return null;
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
