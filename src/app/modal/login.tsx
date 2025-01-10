/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
"maymun hilal";
import { useState, FormEvent } from "react";
import toast from "react-hot-toast";

import { trackGAEvent } from "@/utils/google-analytics";

import Functions from "@/utils/functions";
import User from "@/services/user";
import { loginUser } from "@/services/auth";
import { setCookie } from "@/services/cookie";
import { NodeEnv } from "@/utils/api";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("E-posta ve parola alanları boş bırakılamaz!");
      return;
    }

    try {
      const date = Functions.DateTime();

      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);

      const userData = await User.get(email);
      if (!userData) {
        alert("Kayıtlı hesap bulunamadı!");
        return;
      }

      const response = (await User.login(formData)) || null;

      if (response !== null) {
        const token = await loginUser({
          id: response.data?.id || "",
          email,
          permission: response.data?.permission!.toString() || "0",
        });

        localStorage.setItem("session-token", token);
        localStorage.setItem("id", response.data?.id || "");
        localStorage.setItem("email", email);
        localStorage.setItem(
          "permission",
          response.data?.permission!.toString() || "0"
        );
        localStorage.setItem("last_login", date);
        localStorage.setItem("date", date);

        trackGAEvent("Kullanıcı girişi", "Giriş Butonu", "Giriş yapıldı");

        window.location.reload();

        toast.success(`${email} başarıyla giriş yapıldı!`);
      } else {
        alert("Hesap bilgileri yanlış!");
        return;
      }
    } catch (error) {
      toast.error("Beklenmedik bir sorun oluştu. Hata: LN-50");
      if (NodeEnv === "development") console.error(error);
    }
  };

  return (
    <dialog
      id="login_modal"
      className="modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div className="modal-box">
        <h3 className="font-bold text-lg text-center">GİRİŞ YAP</h3>
        <form className="modal-middle" onSubmit={handleSubmit}>
          <div className="form-control w-full max-w-xs mb-4">
            <label className="label" htmlFor="email">
              <span className="label-text">E-posta Adresi</span>
            </label>
            <input
              type="email"
              id="login_email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered rounded-md w-full"
              autoComplete="off"
              required
            />
          </div>
          <div className="form-control w-full max-w-xs mb-4">
            <label className="label" htmlFor="password">
              <span className="label-text">Şifre</span>
            </label>
            <input
              type="password"
              id="login_password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered rounded-md w-full"
              autoComplete="off"
              required
            />
          </div>
          <div className="modal-action justify-between">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-sm">Hesabın yok mu?</span>
              <button
                type="button"
                className="btn-link"
                onClick={() => {
                  (
                    document.getElementById("login_modal") as HTMLDialogElement
                  )?.close();
                  (
                    document.getElementById(
                      "register_modal"
                    ) as HTMLDialogElement
                  )?.showModal();
                }}
              >
                Kayıt Ol
              </button>
            </div>
            <div className="btn-group-horizontal flex justify-end space-x-2">
              <button
                type="button"
                className="btn"
                onClick={() =>
                  (
                    document.getElementById("login_modal") as HTMLDialogElement
                  )?.close()
                }
              >
                İptal
              </button>
              <button
                type="submit"
                className="btn glass p-2 bg-[#c21546] hover:bg-[#8f0f33] text-white transition-colors duration-300 ease-in-out"
              >
                Giriş Yap
              </button>
            </div>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default Login;
