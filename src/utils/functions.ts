const Functions = {
  DateTime: (): string => {
    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const day = currentDate.getDate().toString().padStart(2, "0");
    const hours = currentDate.getHours().toString().padStart(2, "0");
    const minutes = currentDate.getMinutes().toString().padStart(2, "0");
    const seconds = currentDate.getSeconds().toString().padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  },

  shortenText: (text: string, size: number = 13): string => {
    return text.length <= size ? text : `${text.substring(0, size)}..`;
  },

  slugify: (text: string): string => {
    const turkishMap: { [key: string]: string } = {
      ç: "c",
      Ç: "C",
      ğ: "g",
      Ğ: "G",
      ı: "i",
      İ: "I",
      ö: "o",
      Ö: "O",
      ş: "s",
      Ş: "S",
      ü: "u",
      Ü: "U",
    };

    return text
      .toLowerCase()
      .replace(/[çÇğĞıİöÖşŞüÜ]/g, (match) => turkishMap[match] || match)
      .replace(/[^a-z0-9\-]/g, "-") // Non-alphanumeric to '-'
      .replace(/-+/g, "-") // Replace multiple dashes
      .replace(/^-|-$/g, ""); // Remove leading/trailing dashes
  },
};

export default Functions;
