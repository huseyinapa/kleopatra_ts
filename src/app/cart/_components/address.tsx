/* eslint-disable @typescript-eslint/no-unused-vars */
// components/address.tsx

"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  FC,
  Dispatch,
  SetStateAction,
} from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import AddressAPI, { City, District } from "@/actions/address";
import { addressValidationSchema } from "@/utils/validationSchema";
import axios from "axios";
import { handleFormErrors } from "@/utils/handlers/errorHandler"; // Hata işleyici fonksiyon
import { AddressData } from "@/types/address";
import { CompletedState } from "../page";

interface AddressProps {
  addressData?: AddressData | null; // Opsiyonel hale getiriyoruz
  setAddressData: Dispatch<SetStateAction<AddressData | null>>;
  setCompleted: Dispatch<SetStateAction<CompletedState>>; // setCompleted'ı React.Dispatch olarak tanımlıyoruz
}

const Address: FC<AddressProps> = ({
  addressData,
  setAddressData,
  setCompleted,
}) => {
  const [cities, setCities] = useState<City[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [userIp, setUserIp] = useState<string>("");

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<AddressData>({
    resolver: yupResolver(addressValidationSchema),
    mode: "onChange",
  });

  // Watch all form fields
  const watchedFields = watch();

  // Kullanıcı IP'sini almak için fonksiyon
  const getIP = useCallback(async () => {
    try {
      const res = await axios.get("https://api.ipify.org/?format=json");
      setUserIp(res.data.ip);
    } catch (error) {
      console.error(error);
      toast.error("Bir hata oluştu. Sayfayı yenileyiniz!");
    }
  }, []);

  // API'den şehir ve ilçe verilerini almak için fonksiyon
  const fetchCities = useCallback(async () => {
    try {
      const api_cities = await AddressAPI();
      const storedCity = localStorage.getItem("city");

      // Şehirleri alfabetik olarak sırala
      const sortedCities = api_cities
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name));

      setCities(sortedCities);

      // Depolanmış şehri bul ve ilçeleri ayarla
      if (storedCity) {
        const selectedCity = sortedCities.find(
          (city) => city.name === storedCity
        );
        if (selectedCity) {
          setDistricts(selectedCity.districts || []);
          setValue("city", selectedCity.name);
          setValue("district", localStorage.getItem("district") || "");
        }
      }
    } catch (error) {
      console.error("Şehir ve ilçe verileri alınamadı:", error);
      toast.error("Adres verileri alınırken bir hata oluştu!");
    }
  }, [setValue]);

  // Depolanmış adres bilgilerini ayarlamak için fonksiyon
  const setAddressFromLocalStorage = useCallback(() => {
    const storedName = localStorage.getItem("name") || "";
    const storedSurname = localStorage.getItem("surname") || "";
    const storedPhone = localStorage.getItem("phone") || "";
    const storedIdentityNumber = localStorage.getItem("identityNumber") || "";
    const storedCity = localStorage.getItem("city") || "";
    const storedDistrict = localStorage.getItem("district") || "";
    const storedAddress = localStorage.getItem("address") || "";
    const storedZipCode = localStorage.getItem("zipCode") || "";

    setValue("name", storedName);
    setValue("surname", storedSurname);
    setValue("phone", storedPhone);
    setValue("identityNumber", storedIdentityNumber);
    setValue("city", storedCity);
    setValue("district", storedDistrict);
    setValue("address", storedAddress);
    setValue("zipCode", storedZipCode);

    setAddressData({
      ip: userIp || "",
      name: storedName,
      surname: storedSurname,
      phone: storedPhone,
      identityNumber: storedIdentityNumber,
      city: storedCity || "",
      district: storedDistrict || "",
      address: storedAddress,
      zipCode: storedZipCode,
    });
  }, [setValue, setAddressData, userIp]);

  // Formun gönderilmesi
  const onSubmit: SubmitHandler<AddressData> = () => {
    setCompleted((prevState) => ({
      ...prevState,
      address: true, // Sadece address alanını güncelliyoruz
    }));
    toast.success("Adresiniz onaylandı! Bir sonraki adıma geçebilirsiniz.");
  };

  // Şehir seçimi değiştiğinde çalışacak fonksiyon
  const handleCitySelect = useCallback(
    async (city: string) => {
      try {
        const selectedCity = cities.find((c) => c.name === city);
        if (selectedCity) {
          setDistricts(selectedCity.districts || []);
          setValue("city", city);
          setValue("district", "");
          localStorage.setItem("city", city);
          localStorage.removeItem("district");
        }
      } catch (error) {
        console.error("İl seçimi sırasında hata oluştu:", error);
        toast.error("İl seçimi sırasında bir hata oluştu!");
      }
    },
    [cities, setValue]
  );

  // İlçe seçimi değiştiğinde çalışacak fonksiyon
  const handleDistrictSelect = useCallback(
    (district: string) => {
      setValue("district", district);
      localStorage.setItem("district", district);
    },
    [setValue]
  );

  // Formu temizleyen fonksiyon
  const handleClearForm = useCallback(() => {
    reset();
    const fields: (keyof AddressData)[] = [
      "name",
      "surname",
      "phone",
      "identityNumber",
      "city",
      "district",
      "address",
      "zipCode",
    ];

    fields.forEach((field) => {
      localStorage.removeItem(field);
    });

    setCompleted((prevState) => ({
      ...prevState,
      address: false, // Sadece address alanını güncelliyoruz
    }));
  }, [reset, setCompleted]);

  // Kullanıcı bilgileri değiştiğinde localStorage güncellemeleri
  useEffect(() => {
    setAddressData({
      ip: userIp || "",
      ...watchedFields,
    });

    const isComplete =
      watchedFields.name.trim() !== "" &&
      watchedFields.surname.trim() !== "" &&
      watchedFields.phone.trim() !== "" &&
      watchedFields.identityNumber.trim() !== "" &&
      watchedFields.city !== null &&
      watchedFields.district !== null &&
      watchedFields.address.trim() !== "" &&
      watchedFields.zipCode.trim() !== "";

    setCompleted((prevState) => ({
      ...prevState,
      address: isComplete, // Sadece address alanını güncelliyoruz
    }));
  }, [watchedFields, userIp, addressData, setCompleted, setAddressData]);

  // Hata mesajlarını merkezi handler üzerinden yönet
  useEffect(() => {
    handleFormErrors(errors);
  }, [errors]);

  // İlk yüklemede IP al ve API verilerini çek
  useEffect(() => {
    getIP();
  }, [getIP]);

  // IP alındıktan sonra API ve adres bilgilerini ayarla
  useEffect(() => {
    if (userIp) {
      fetchCities();
      setAddressFromLocalStorage();
    }
  }, [userIp, fetchCities, setAddressFromLocalStorage]);

  const {
    name,
    surname,
    phone,
    identityNumber,
    city,
    district,
    address,
    zipCode,
  } = watchedFields;

  return (
    <div className="">
      <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold mb-4">
        Adres
      </h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols gap-3 lg:gap-4 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3">
          {/* İsim */}
          <div className="w-[300px]">
            <label htmlFor="name" className="text-gray-600 mb-1">
              İsim
            </label>
            <input
              type="text"
              id="name"
              className={`border p-2 rounded-md w-full ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              {...register("name")}
            />
          </div>

          {/* Soyisim */}
          <div className="w-[300px]">
            <label htmlFor="surname" className="text-gray-600 mb-1">
              Soyisim
            </label>
            <input
              type="text"
              id="surname"
              className={`border p-2 rounded-md w-full ${
                errors.surname ? "border-red-500" : "border-gray-300"
              }`}
              {...register("surname")}
            />
          </div>

          {/* Telefon Numarası */}
          <div className="w-[300px]">
            <label htmlFor="phone" className="text-gray-600 mb-1">
              Telefon Numarası
            </label>
            <input
              type="text"
              id="phone"
              placeholder="+90..."
              className={`border p-2 rounded-md w-full ${
                errors.phone ? "border-red-500" : "border-gray-300"
              }`}
              {...register("phone")}
            />
          </div>

          {/* T.C. Kimlik Numarası */}
          <div className="w-[300px]">
            <label htmlFor="identityNumber" className="text-gray-600 mb-1">
              T.C. Kimlik Numarası
            </label>
            <input
              id="identityNumber"
              type="text"
              className={`border p-2 rounded-md w-full ${
                errors.identityNumber ? "border-red-500" : "border-gray-300"
              }`}
              {...register("identityNumber")}
            />
          </div>

          {/* İl Seçimi */}
          <div className="w-[300px]">
            <label htmlFor="city" className="text-gray-600 mb-1">
              İl Seçiniz
            </label>
            <select
              id="city"
              className={`border p-2 rounded-md w-full ${
                errors.city ? "border-red-500" : "border-gray-300"
              }`}
              {...register("city")}
              onChange={(e) => handleCitySelect(e.target.value)}
            >
              <option value="" disabled>
                İl Seçiniz
              </option>
              {cities.map((cityItem) => (
                <option key={cityItem.id} value={cityItem.name}>
                  {cityItem.name}
                </option>
              ))}
            </select>
          </div>

          {/* İlçe Seçimi */}
          {districts.length > 0 && (
            <div className="w-[300px]">
              <label htmlFor="district" className="text-gray-600 mb-1">
                İlçe Seçiniz
              </label>
              <select
                id="district"
                className={`border p-2 rounded-md w-full ${
                  errors.district ? "border-red-500" : "border-gray-300"
                }`}
                {...register("district")}
                onChange={(e) => handleDistrictSelect(e.target.value)}
              >
                <option value="" disabled>
                  İlçe Seçiniz
                </option>
                {districts.map((districtItem) => (
                  <option key={districtItem.id} value={districtItem.name}>
                    {districtItem.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Adres */}
          <div className="w-[300px]">
            <label htmlFor="address" className="text-gray-600 mb-1">
              Adresiniz
            </label>
            <input
              type="text"
              id="address"
              className={`border p-2 rounded-md w-full ${
                errors.address ? "border-red-500" : "border-gray-300"
              }`}
              {...register("address")}
            />
          </div>

          {/* Posta Kodu */}
          <div className="w-[300px]">
            <label htmlFor="zipCode" className="text-gray-600 mb-1">
              Posta Kodu
            </label>
            <input
              id="zipCode"
              type="number"
              className={`border p-2 rounded-md w-full ${
                errors.zipCode ? "border-red-500" : "border-gray-300"
              }`}
              {...register("zipCode")}
            />
          </div>

          {/* Form Butonları */}
          <div className="mt-6 space-x-2 col-span-full">
            <button
              type="button"
              className="bg-blue-500 text-white w-[142px] px-4 py-2 rounded-md"
              onClick={handleClearForm}
            >
              Temizle
            </button>
            <button
              type="submit"
              className={`${
                isValid ? "bg-neutral" : "bg-gray-400"
              } text-white w-[150px] px-4 py-2 rounded-md`}
              disabled={!isValid}
            >
              Onayla
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Address;
