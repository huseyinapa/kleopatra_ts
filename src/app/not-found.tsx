import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="h-screen w-full lg:px-24 lg:py-24 md:py-20 md:px-44 px-4 py-24 items-center flex justify-center flex-col-reverse lg:flex-row md:gap-28 gap-16">
      <div className="xl:pt-24 w-full xl:w-1/2 relative pb-12 lg:pb-0">
        <div className="relative">
          <div className="absolute">
            <div>
              <h1 className="my-2 text-gray-800 font-bold text-2xl">
                Görünüşe göre büyük hiçliğe giden kapıyı buldunuz
              </h1>
              <p className="my-2 text-gray-800">
                Bunun için üzgünüz! İhtiyacınız olan yere gitmek için lütfen ana
                sayfamızı ziyaret edin.
              </p>
              <Link href="/">
                <button className="btn sm:w-full lg:w-auto my-2 border rounded md:py-4 px-8 text-center bg-rose-600 text-white hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-700 focus:ring-opacity-50">
                  Beni oraya götür!
                </button>
              </Link>
            </div>
          </div>
          <div>
            <Image
              src="https://i.ibb.co/G9DC8S0/404-2.png"
              alt="Gonen Kleopatra 404"
              width={500}
              height={500}
              priority
            />
          </div>
        </div>
      </div>
      <div>
        <Image
          src="https://i.ibb.co/ck1SGFJ/Group.png"
          alt="Gonen Kleopatra Bağlantı Kopması"
          width={500}
          height={500}
          priority
        />
      </div>
    </div>
  );
}
