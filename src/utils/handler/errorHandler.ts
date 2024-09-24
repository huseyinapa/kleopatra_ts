// utils/errorHandler.ts

export const getErrorMessage = (code: number): string => {
  let errorMessage = "";

  switch (code) {
    case 10051:
      errorMessage = "Kart limiti yetersiz, yetersiz bakiye";
      break;
    case 10005:
      errorMessage = "İşlem onaylanmadı";
      break;
    case 10012:
      errorMessage = "Geçersiz işlem";
      break;
    case 10041:
      errorMessage = "Kayıp kart, karta el koyunuz";
      break;
    case 10043:
      errorMessage = "Çalıntı kart, karta el koyunuz";
      break;
    case 10054:
      errorMessage = "Vadesi dolmuş kart";
      break;
    case 10084:
      errorMessage = "CVC2 bilgisi hatalı";
      break;
    case 10057:
      errorMessage = "Kart sahibi bu işlemi yapamaz";
      break;
    case 10058:
      errorMessage = "Terminalin bu işlemi yapmaya yetkisi yok";
      break;
    case 10034:
      errorMessage = "Dolandırıcılık şüphesi";
      break;
    case 10093:
      errorMessage =
        "Kartınız e-ticaret işlemlerine kapalıdır. Bankanızı arayınız.";
      break;
    case 10201:
      errorMessage = "Kart, işleme izin vermedi";
      break;
    case 10204:
      errorMessage = "Ödeme işlemi esnasında genel bir hata oluştu";
      break;
    case 10206:
      errorMessage = "CVC uzunluğu geçersiz";
      break;
    case 10207:
      errorMessage = "Bankanızdan onay alınız";
      break;
    case 10208:
      errorMessage = "Üye işyeri kategori kodu hatalı";
      break;
    case 10209:
      errorMessage = "Bloke statülü kart";
      break;
    case 10210:
      errorMessage = "Hatalı CAVV bilgisi";
      break;
    case 10211:
      errorMessage = "Hatalı ECI bilgisi";
      break;
    case 10213:
      errorMessage = "BIN bulunamadı";
      break;
    case 10214:
      errorMessage = "İletişim veya sistem hatası";
      break;
    case 10215:
      errorMessage = "Geçersiz kart numarası";
      break;
    case 10216:
      errorMessage = "Bankası bulunamadı";
      break;
    case 10217:
      errorMessage = "Banka kartları sadece 3D Secure işleminde kullanılabilir";
      break;
    case 10219:
      errorMessage = "Bankaya gönderilen istek zaman aşımına uğradı";
      break;
    case 10222:
      errorMessage = "Terminal taksitli işleme kapalı";
      break;
    case 10223:
      errorMessage = "Gün sonu yapılmalı";
      break;
    case 10225:
      errorMessage = "Kısıtlı kart";
      break;
    case 10226:
      errorMessage = "İzin verilen PIN giriş sayısı aşılmış";
      break;
    case 10227:
      errorMessage = "Geçersiz PIN";
      break;
    case 10228:
      errorMessage = "Banka veya terminal işlem yapamıyor";
      break;
    case 10229:
      errorMessage = "Son kullanma tarihi geçersiz";
      break;
    case 10232:
      errorMessage = "Geçersiz tutar";
      break;
    default:
      errorMessage = "Bilinmeyen hata, başkabir kart ile yeniden deneyin";
      break;
  }

  return errorMessage;
};
