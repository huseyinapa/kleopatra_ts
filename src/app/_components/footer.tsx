import Image from "next/image";
import { FC } from "react";

const Footer: FC = () => {
  return (
    <footer className="footer p-10 text-base-content bg-[#ebcfe4]">
      <aside>
        <Image
          alt="Kleopatra"
          src="/images/kleopatra-logo.png"
          className="w-[200px] h-auto mb-2"
          width={96}
          height={96}
          priority
        />
        <p>&copy; 2024 Gönen Kleopatra - Tüm hakları saklıdır.</p>
        <a
          href="https://www.instagram.com/apadijital/"
          target="_blank"
          className="flex flex-row mt-4 items-center space-x-1"
          rel="noopener noreferrer"
        >
          <Image
            alt="APA Dijital"
            src="/images/apa.png"
            className="w-[60px] h-[60px] mr-2 rounded-md"
            width={96}
            height={96}
          />
          <h1 className="flex flex-col">
            <span className="font-semibold">APA Dijital</span>
            <span>tarafından geliştirilmiştir.</span>
          </h1>
        </a>
      </aside>
      <nav>
        <header className="footer-title">ÜRÜNLER</header>
        <a className="link link-hover" href="/products">
          Tüm Ürünler
        </a>
        <a className="link link-hover">Kategoriler</a>
      </nav>
      <nav>
        <header className="footer-title">ŞIRKET</header>
        <a className="link link-hover">Hakkımızda</a>
        <a className="link link-hover" href="mailto:gonenkleopatra@gmail.com">
          İletişim
        </a>
      </nav>
      <nav>
        <header className="footer-title">YASAL</header>
        <a className="link link-hover" href="/privacy-policy">
          Gizlilik Politikası
        </a>
        <a className="link link-hover" href="/terms-of-use">
          Kullanım Koşulları
        </a>
      </nav>
      <nav>
        <header className="footer-title">Medya</header>
        <div className="grid grid-flow-col gap-4">
          <a
            href="https://instagram.com/gonenkleopatra32/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 30 30"
              className="fill-current"
            >
              <path d="M 9.9980469 3 C 6.1390469 3 3 6.1419531 3 10.001953 L 3 20.001953 C 3 23.860953 6.1419531 27 10.001953 27 L 20.001953 27 C 23.860953 27 27 23.858047 27 19.998047 L 27 9.9980469 C 27 6.1390469 23.858047 3 19.998047 3 L 9.9980469 3 z M 22 7 C 22.552 7 23 7.448 23 8 C 23 8.552 22.552 9 22 9 C 21.448 9 21 8.552 21 8 C 21 7.448 21.448 7 22 7 z M 15 9 C 18.309 9 21 11.691 21 15 C 21 18.309 18.309 21 15 21 C 11.691 21 9 18.309 9 15 C 9 11.691 11.691 9 15 9 z M 15 11 A 4 4 0 0 0 11 15 A 4 4 0 0 0 15 19 A 4 4 0 0 0 19 15 A 4 4 0 0 0 15 11 z"></path>
            </svg>
          </a>
          <a
            href="https://api.whatsapp.com/send?phone=905439485180"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 448 512"
              className="fill-current"
            >
              <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
            </svg>
          </a>
          <a
            href="https://www.tiktok.com/@gonenkleopatra"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 448 512"
              className="fill-current"
            >
              <path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z" />
            </svg>
          </a>
        </div>
      </nav>
    </footer>
  );
};

export default Footer;
