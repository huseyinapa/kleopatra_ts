/**
 *
 * @param name Cookie name
 * @returns Cookie value
 * @example getCookie("session-token")
 * @async false
 */
export function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
}
