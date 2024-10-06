/* eslint-disable @typescript-eslint/no-explicit-any */
// LocalStorage Fonksiyonları
export const setLocalStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getLocalStorage = (key: string) => {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
};

export const removeLocalStorage = (key: string) => {
  localStorage.removeItem(key);
};

export const clearLocalStorage = () => {
  localStorage.clear();
};

// SessionStorage Fonksiyonları
export const setSessionStorage = (key: string, value: any) => {
  sessionStorage.setItem(key, JSON.stringify(value));
};

export const getSessionStorage = (key: string) => {
  const value = sessionStorage.getItem(key);
  return value ? JSON.parse(value) : null;
};

export const removeSessionStorage = (key: string) => {
  sessionStorage.removeItem(key);
};

export const clearSessionStorage = () => {
  sessionStorage.clear();
};

// Varsayılan Değerlerle Veri Alma
export const getLocalStorageWithDefault = (key: string, defaultValue: any) => {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : defaultValue;
};

// Süreli (Expiration) Depolama
export const setLocalStorageWithExpiry = (
  key: string,
  value: any,
  ttl: number
) => {
  const now = new Date();
  const item = {
    value: value,
    expiry: now.getTime() + ttl,
  };
  localStorage.setItem(key, JSON.stringify(item));
};

export const getLocalStorageWithExpiry = (key: string) => {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) return null;

  const item = JSON.parse(itemStr);
  const now = new Date();

  if (now.getTime() > item.expiry) {
    localStorage.removeItem(key);
    return null;
  }
  return item.value;
};

// Depolama Alanı Kontrolü
export const isStorageFull = () => {
  try {
    localStorage.setItem("test", "test");
    localStorage.removeItem("test");
    return false;
  } catch (e) {
    console.log(e);
    return true;
  }
};
