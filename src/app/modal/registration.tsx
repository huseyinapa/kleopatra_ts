"use client";

import React, { useState, FormEvent } from "react";
import toast from "react-hot-toast";

import Functions from "@/utils/functions";
import User from "@/services/user";
import { trackGAEvent } from "@/utils/google-analytics";

import { userIdentifier } from "@/actions/idCreator";
import { loginUser } from "@/services/auth";
import { NodeEnv } from "@/utils/api";

const Registration: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      alert("E-posta ve parola alanları boş bırakılamaz!");
      return;
    }

    try {
      const userData = await User.get(email);

      if (userData) {
        alert("Bir sorun oluştu. Girilen e-postaya sahip bir hesap zaten var!");
        return;
      } else {
        const id = await userIdentifier();
        const date = Functions.DateTime();

        const formData = new FormData();
        formData.append("id", id);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("permission", "0");
        formData.append("last_login", date);
        formData.append("date", date);

        const response = await User.register(formData);

        if (response !== null) {
          const token = await loginUser({
            id: id,
            email,
            permission: response.data?.permission!.toString() || "0",
          });

          localStorage.setItem("id", id);
          localStorage.setItem("email", email);
          localStorage.setItem("session-token", token);
          localStorage.setItem("permission", "0");
          localStorage.setItem("last_login", date);
          localStorage.setItem("date", date);

          trackGAEvent("Kullanıcı girişi", "Kayıt Butonu", "Kayıt yapıldı");

          // await logoutUser();

          window.location.reload();
          toast.success(`${email} başarıyla kayıt olundu ve giriş yapıldı!`);
        }
        //  else {
        //   toast.error("Kayıtlı hesap bulunamadı!");
        // }
      }
    } catch (error) {
      toast.error("Beklenmedik bir sorun oluştu.");
      if (NodeEnv === "development") console.error(error);
    }
  };

  return (
    <dialog
      id="register_modal"
      className="modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div className="modal-box">
        <h3 className="font-bold text-lg text-center ">KAYIT OL</h3>
        <form method="dialog" className="modal-middle" onSubmit={handleSubmit}>
          <div className="form-control w-full max-w-xs mb-4">
            <label className="label" autoCorrect="email" htmlFor="email">
              <span className="label-text">E-posta Adresi</span>
            </label>
            <input
              type="email"
              id="reg_email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered rounded-md w-full"
            />
          </div>
          <div className="form-control w-full max-w-xs mb-4">
            <label className="label" autoCorrect="password" htmlFor="password">
              <span className="label-text">Şifre</span>
            </label>
            <input
              type="password"
              id="reg_password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered rounded-md w-full"
            />
          </div>
        </form>
        <div className="modal-action justify-between">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-sm">Hesabın var mı?</span>
            <button
              className="btn-link"
              onClick={() => {
                (
                  document.getElementById("register_modal") as HTMLDialogElement
                )?.close();
                (
                  document.getElementById("login_modal") as HTMLDialogElement
                )?.showModal();
              }}
            >
              Giriş Yap
            </button>
          </div>
          <div className="btn-group-horizontal flex justify-end space-x-2">
            <button
              className="btn"
              onClick={() =>
                (
                  document.getElementById("register_modal") as HTMLDialogElement
                )?.close()
              }
            >
              İptal
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="btn glass p-2 bg-[#c21546] hover:bg-[#8f0f33] text-white transition-colors duration-300 ease-in-out"
            >
              Kayıt Ol
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default Registration;
