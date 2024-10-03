export const formatPhoneNumber = (phone: string) => {
  const cleanNumber = phone.replace(/\D/g, ""); // Sadece rakamları alır

  // Eğer numara 10 haneli ise, başına +90 ekleriz
  if (cleanNumber.length === 10) {
    return `+90${cleanNumber}`;
  }
  // Eğer numara zaten +90 ile başlıyorsa olduğu gibi bırak
  else if (cleanNumber.length === 12 && cleanNumber.startsWith("90")) {
    return `+${cleanNumber}`;
  }

  // Eğer format uygun değilse geri bildirim verebiliriz (örneğin: geçersiz numara)
  return "Geçersiz numara";
};
