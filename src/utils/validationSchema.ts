import * as Yup from "yup";

export const addressValidationSchema = Yup.object().shape({
  name: Yup.string().required("İsim gerekli"),
  surname: Yup.string().required("Soyisim gerekli"),
  phone: Yup.string()
    .matches(/^\+90\d{10}$/, "Geçerli bir telefon numarası giriniz")
    .required("Telefon numarası gerekli"),
  identityNumber: Yup.string()
    .matches(/^\d{11}$/, "Geçerli bir T.C. Kimlik Numarası giriniz")
    .required("T.C. Kimlik Numarası gerekli"),
  city: Yup.string().required("İl seçimi gerekli"),
  district: Yup.string().required("İlçe seçimi gerekli"),
  address: Yup.string().required("Adres gerekli"),
  zipCode: Yup.string()
    .matches(/^\d{5}$/, "Geçerli bir posta kodu giriniz")
    .required("Posta kodu gerekli"),
});
