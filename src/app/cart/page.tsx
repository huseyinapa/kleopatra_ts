/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

import Header from "@/app/_components/nav";
import StepIndicator from "./_components/indicator";
import BottomPayDetails from "./_components/bottomPayDetails";
import CartProduct from "./_components/cartProduct";
import Address from "./_components/address";
import Payment from "./_components/payment";
import Completed from "./_components/completed";
import Footer from "@/app/_components/footer";

import CartManager from "@/services/cart";
import ProductManager from "@/services/product";

import { CartItem } from "@/types/cart";
import { PaymentData } from "@/types/payment";
import { AddressData } from "@/types/address";
import NotFound from "./not-found";

const steps = ["Sepetim", "Adres", "Ödeme", "Sipariş Tamamlandı"];

export interface CompletedState {
  product: boolean;
  address: boolean;
  payment: boolean;
}

function Cart(): JSX.Element {
  const [currentStep, setCurrentStep] = useState<number>(0);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const [addressData, setAddressData] = useState<AddressData | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);

  const [loading, setLoading] = useState<boolean>(true);

  const [completed, setCompleted] = useState<CompletedState>({
    product: false,
    address: false,
    payment: false,
  });

  function isStockAvailable(): boolean {
    return cartItems.every((item) => item.stock > 0);
  }

  function isAmountMoreThanStock(): boolean {
    return cartItems.some((item) => (item.amount || 1) > item.stock);
  }

  const handleContinue = (): void => {
    if (!isStockAvailable()) {
      toast.error("Sepetinizdeki ürün stoklarımızda bulunmamaktadır.");
    } else if (isAmountMoreThanStock()) {
      toast.error(
        "Sepetinizdeki ürün miktarı stoktan fazla, tekrar kontrol ediniz!"
      );
    } else if (currentStep === 0 && !completed.product) {
      toast.error("Sepetiniz boş görünüyor.");
    } else if (currentStep === 1 && !completed.address) {
      toast.error(
        "Adres bilgileri eksik görünüyor. Onayla düğmesine tıklamayı deneyin!"
      );
    } else if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleStepClick = (stepIndex: number): void => {
    if (currentStep !== 3 && stepIndex <= currentStep) {
      setCurrentStep(stepIndex);
    }
  };

  const fetchCartItems = async (): Promise<void> => {
    try {
      const id = localStorage.getItem("id");
      if (!id) {
        setCompleted((prevCompleted) => ({
          ...prevCompleted,
          product: false,
        }));
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("id", id);

      const response = await CartManager.fetchCart(formData);

      if (response && Array.isArray(response) && response.length > 0) {
        const products: CartItem[] = await Promise.all(
          response.map(async (item) => {
            const product = (await ProductManager.getProduct(
              item.pid
            )) as CartItem;
            console.log();

            return {
              id: item.pid,
              pid: item.pid,
              name: product?.name,
              description: product?.description,
              price: product?.price,
              stock: product?.stock,
              image: product?.image,
              amount: item.amount,
              stockStatus: product?.stock !== 0,
            };
          })
        );
        console.log("products" + products.length);

        setCartItems(products);
        setCompleted((prevCompleted) => ({
          ...prevCompleted,
          product: true,
        }));
      } else {
        setCompleted((prevCompleted) => ({
          ...prevCompleted,
          product: false,
        }));
      }
    } catch (error) {
      console.log(error);
      toast.error("Bilinmeyen sorun oluştu! Hata kodu: C-FCI");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);
  if (cartItems.length === 0) {
    return <NotFound />;
  }
  return (
    <div className="w-[100%]">
      <Toaster position="bottom-right" reverseOrder={false} />
      <Header />

      {loading ? (
        <div className="mx-auto h-60 justify-center">
          <div className="flex flex-col items-center space-y-2">
            <span className="loading loading-spinner loading-lg"></span>
            <span className="text-center">Yükleniyor..</span>
          </div>
        </div>
      ) : (
        <div className="px-5 justify-center py-8 space-y-4">
          <StepIndicator
            steps={steps}
            currentStep={currentStep}
            onStepClick={handleStepClick}
          />
          <div className={`flex ${currentStep === 3 ? "justify-center" : ""}`}>
            <div>
              {currentStep === 0 && (
                <CartProduct
                  cartItems={cartItems}
                  setCartItems={setCartItems}
                  setCompleted={setCompleted}
                />
              )}
              {currentStep === 1 && (
                <Address
                  addressData={addressData}
                  setAddressData={setAddressData}
                  setCompleted={setCompleted}
                />
              )}
              {currentStep === 2 && (
                <Payment
                  cartItems={cartItems}
                  addressData={addressData}
                  setPaymentData={setPaymentData}
                  handleContinue={handleContinue}
                />
              )}
              {currentStep === 3 && (
                <Completed address={addressData} payment={paymentData} />
              )}
            </div>
            {currentStep !== 3 && (
              <BottomPayDetails
                currentStep={currentStep}
                onStepClick={handleStepClick}
                products={cartItems}
                handleContinue={handleContinue}
              />
            )}
          </div>
        </div>
      )}
      <Footer />

      <dialog id="distance_selling_contract" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Mesafeli Satış Sözleşmesi</h3>
          <div className="py-4 space-y-3">
            <div className="font-semibold">MADDE 1- TARAFLAR</div>
            <div>1.1. SATICI:</div>
            <div className="space-y-1">
              <div>Ünvanı: Merve PEKTAŞ</div>
              <div>
                Adresi: Musalla Mah. Çayardı Sk. No: 10 İç Kapı No: 1
                Gönen/ISPARTA
              </div>
              <div>Telefon: Henüz bulunmamaktadır.</div>
              <div>Fax:Henüz bulunmamaktadır.</div>
              <div>Müşteri Hizmetleri Telefon: Henüz bulunmamaktadır.</div>
              <div>Mersis Numarası: 3122578983800001</div>
            </div>
            <div>1.2. ALICI(&quot;TÜKETİCİ&quot;):</div>
            <div className="space-y-1">
              <div>Adı/Soyadı/Ünvanı: </div>
              <div>Adresi : </div>
              <div>Telefon: </div>
              <div>Email: </div>
              <div>VKN: Vergi Kimlik Numarası Beyan Edilmemiştir</div>
            </div>
            <div>1.3. ARACI HİZMET SAĞLAYICI:</div>
            <div className="space-y-1">
              <div>Unvanı: Merve PEKTAŞ</div>
              <div>Adresi: Musalla Mah. Çayardı Sk. No:10 İç</div>
              <div>Kapı No: 1 Gönen/ISPARTA</div>
              <div>Telefon: Henüz bulunmamaktadır.</div>
              <div>Müşteri Hizmetleri Telefon: Henüz bulunmamaktadır.</div>
              <div>MERSİS Numarası: 3122578983800001</div>
            </div>
            <div>MADDE 2- KONU</div>
            <div>
              İşbu sözleşmenin konusu, TÜKETİCİ&apos;nin www.gonenkleopatra.com
              internet sitesinden elektronik ortamda siparişini yaptığı aşağıda
              nitelikleri ve satış fiyatı belirtilen ürünün satışı ve teslimi
              ile ilgili olarak 6502 sayılı Tüketicinin Korunması Hakkındaki
              Kanun hükümleri gereğince tarafların hak ve yükümlülüklerinin
              saptanmasıdır.
            </div>
            <div>
              MADDE 3- SÖZLEŞME KONUSU ÜRÜN, ÖDEME VE TESLİMATA İLİŞKİN BİLGİLER
            </div>
            <div>
              3.1- Sözleşme konusu mal veya hizmetin adı, adeti, KDV dahil satış
              fiyatı, ödeme şekli ve temel nitelikleri
            </div>
            <div>
              3.2- Ödeme Şekli : Kredi Kartı ile İşlem (Henüz taksit işlemi
              yapılmamaktadır.)
            </div>
            <div>
              <div>
                3.3- Diğer yandan vadeli satışların sadece Bankalara ait kredi
                kartları ile yapılması nedeniyle, TÜKETİCİ, ilgili faiz
                oranlarını ve temerrüt faizi ile ilgili bilgileri bankasından
                ayrıca teyit edeceğini, yürürlükte bulunan mevzuat hükümleri
                gereğince faiz ve temerrüt faizi ile ilgili hükümlerin Banka ve
                TÜKETİCİ arasındaki kredi kartı sözleşmesi kapsamında
                uygulanacağını kabul, beyan ve taahhüt eder.
              </div>
              <div>
                Ayrıca, Kredili satış imkanının Bankalar tarafından sadece Banka
                Müşterisi olan TÜKETİCİ&apos;ye sağlanması nedeniyle, TÜKETİCİ,
                ilgili faiz oranlarını ve temerrüt faizi ile ilgili bilgileri
                bankasından ayrıca teyit edeceğini, yürürlükte bulunan mevzuat
                hükümleri gereğince faiz ve temerrüt faizi ile ilgili hükümlerin
                Banka ve TÜKETİCİ arasındaki Anında/Mesafeli Alışveriş Kredisi
                sözleşmesi kapsamında uygulanacağını kabul, beyan ve taahhüt
                eder. Kredi verme ve detaylı ödeme planınızın oluşturulması
                Bankanız inisiyatifindedir.
              </div>
            </div>
            <div>3.4 - İade Prosedürü:</div>
            <div>
              TÜKETİCİ&apos;nin cayma hakkını kullandığı durumlarda ya da
              siparişe konu olan ürünün çeşitli sebeplerle tedarik edilememesi
              veya hakem heyeti kararları ile TÜKETİCİ&apos;ye bedel iadesine
              karar verilen durumlarda, ödeme seçeneklerine ilişkin iade
              prosedürü aşağıda belirtilmiştir:
            </div>
            <div className="space-y-2">
              <ul>a) Kredi Kartı ile Ödeme Seçeneklerinde İade Prosedürü</ul>
              <div>
                Alışveriş kredi kartı ile ve taksitli olarak yapılmışsa,
                TÜKETİCİ ürünü kaç taksit ile aldıysa Banka TÜKETİCİ&apos;ye
                geri ödemesini taksitle yapmaktadır. SATICI bankaya ürün
                bedelinin tamamını tek seferde ödedikten sonra, Banka
                poslarından yapılan taksitli harcamaların TÜKETİCİ&apos;nin
                kredi kartına iadesi durumunda, konuya müdahil tarafların mağdur
                duruma düşmemesi için talep edilen iade tutarları, yine taksitli
                olarak hamil taraf hesaplarına Banka tarafından aktarılır.
                TÜKETİCİ&apos;nin satış iptaline kadar ödemiş olduğu taksit
                tutarları, eğer iade tarihi ile kartın hesap kesim tarihleri
                çakışmazsa her ay karta 1 (bir) iade yansıyacak ve TÜKETİCİ iade
                öncesinde ödemiş olduğu taksitleri satışın taksitleri bittikten
                sonra, iade öncesinde ödemiş olduğu taksitleri sayısı kadar ay
                daha alacak ve mevcut borçlarından düşmüş olacaktır. Kart ile
                alınmış mal ve hizmetin iadesi durumunda SATICI, Banka ile
                yapmış olduğu sözleşme gereği TÜKETİCİ&apos;ye nakit para ile
                ödeme yapamaz. SATICI, bir iade işlemi söz konusu olduğunda
                ilgili yazılım aracılığı ile iadesini yapacak olup, SATICI
                ilgili tutarı Banka&apos;ya nakden veya mahsuben ödemekle
                yükümlü olduğundan yukarıda anlatmış olduğumuz prosedür
                gereğince TÜKETİCİ&apos;ye nakit olarak ödeme yapılamamaktadır.
                Kredi kartına iade, SATICI&apos;nın Banka&apos;ya bedeli tek
                seferde ödemesinden sonra, Banka tarafından yukarıdaki prosedür
                gereğince yapılacaktır. TÜKETİCİ, bu prosedürü okuduğunu ve
                kabul ettiğini kabul ve taahhüt eder.
              </div>
            </div>
            <div className="space-y-2">
              <ul>b) Havale/EFT Ödeme Seçeneklerinde İade Prosedürü</ul>
              <div>
                İade, TÜKETİCİ&apos;den banka hesap bilgileri istenerek,
                TÜKETİCİ&apos;nin belirttiği hesaba (hesabın fatura adresindeki
                kişinin adına veya kullanıcı üyenin adına olması şarttır) havale
                ve EFT şeklinde yapılacaktır. SATICI bankaya ürün bedelinin
                tamamını tek seferde geri öder. Havale/EFT yoluyla alınmış mal
                ve hizmetin iadesi durumunda SATICI, Banka ile yapmış olduğu
                sözleşme gereği TÜKETİCİ&apos;ye nakit para ile ödeme yapamaz.
                SATICI, bir iade işlemi söz konusu olduğunda ilgili yazılım
                aracılığı ile iadesini yapacak olup, SATICI ilgili tutarı
                Banka&apos;ya nakden veya mahsuben ödemekle yükümlü olduğundan
                yukarıda anlatmış olduğumuz prosedür gereğince TÜKETİCİ&apos;ye
                nakit olarak ödeme yapılamamaktadır. TÜKETİCİ, bu prosedürü
                okuduğunu ve kabul ettiğini kabul ve taahhüt eder.
              </div>
            </div>
            <div className="space-y-2">
              <ul>
                c) Alışveriş Kredisi ile Ödeme Seçeneklerinde İade Prosedürü
              </ul>
              <div>
                İade, TÜKETİCİ&apos;den banka hesap bilgileri
                istenerek,TÜKETİCİ&apos;nin belirttiği hesaba (hesabın fatura
                adresindeki kişinin adına veya kullanıcı üyenin adına olması
                şarttır) havale ve EFT şeklinde yapılacaktır. SATICI bankaya
                ürün bedelinin tamamını tek seferde geri öder. Kredi yoluyla
                alınmış mal ve hizmetin iadesi durumunda SATICI, Banka ile
                yapmış olduğu sözleşme gereği TÜKETİCİ&apos;ye nakit para ile
                ödeme yapamaz. SATICI, bir iade işlemi söz konusu olduğunda
                ilgili yazılım aracılığı ile iadesini yapacak olup, SATICI
                ilgili tutarı Banka&apos;ya nakden veya mahsuben ödemekle
                yükümlü olduğundan yukarıda anlatmış olduğumuz prosedür
                gereğince TÜKETİCİ&apos;ye nakit olarak ödeme yapılamamaktadır.
                TÜKETİCİ, bu prosedürü okuduğunu ve kabul ettiğini kabul ve
                taahhüt eder.
              </div>
            </div>
            <div className="space-y-2">
              <div>3.5- Teslimat Şekli ve Adresi :</div>
              <div>Teslimat Adresi : consumer / Türkiye</div>
              <div>Teslim Edilecek Kişi: consumer</div>
              <div>Fatura Adresi : consumer / Türkiye</div>
              <div className="mt-2">
                Paketleme, kargo ve teslim masrafları TÜKETİCİ tarafından
                karşılanmaktadır.
              </div>
              <div>
                Kargo ücreti (değişkenlik gösterebilir) -TL olup, kargo fiyatı
                sipariş toplam tutarına eklenmemektedir. Ürün bedeline dahil
                değildir.
              </div>
              <div>
                Teslimat, anlaşmalı kargo şirketi aracılığı ile,
                TÜKETİCİ&apos;nin yukarıda belirtilen adresinde elden teslim
                edilecektir.
              </div>
              <div>
                Teslim anında TÜKETİCİ&apos;nin adresinde bulunmaması durumunda
                dahi Firmamız edimini tam ve eksiksiz olarak yerine getirmiş
                olarak kabul edilecektir.
              </div>
              <div>
                Bu nedenle, TÜKETİCİ&apos;nin ürünü geç teslim almasından
                ve/veya hiç teslim almamasından kaynaklanan zararlardan ve
                giderlerden SATICI sorumlu değildir.
              </div>
              <div>
                SATICI, sözleşme konusu ürünün sağlam, eksiksiz, siparişte
                belirtilen niteliklere uygun ve varsa garanti belgeleri ve
                kullanım kılavuzları ile teslim edilmesinden sorumludur.
              </div>
            </div>
            <div>MADDE 4- CAYMA HAKKI</div>
            <div className="space-y-2">
              <div>
                TÜKETİCİ, SATICI ile imzaladığı işbu Mesafeli Satış
                Sözleşmesi&apos;nden 14 (ondört) gün içinde herhangi bir gerekçe
                göstermeksizin ve cezai şart ödemeksizin cayma hakkına sahiptir.
              </div>
              <div>
                TÜKETİCİ, sözleşme konusu malı, cayma hakkını kullandığı
                tarihten itibaren 10 gün içinde satıcıya ya da satıcının
                belirlediği taşıyıcıya iade etmekle yükümlüdür.
              </div>
              <div>
                Cayma hakkı süresi, hizmet ifasına ilişkin sözleşmelerde
                sözleşmenin kurulduğu gün; mal teslimine ilişkin sözleşmelerde
                ise TÜKETİCİ&apos;nin veya TÜKETİCİ tarafından belirlenen üçüncü
                kişinin malı teslim aldığı gün başlar.
              </div>
              <div>
                Ancak TÜKETİCİ, sözleşmenin kurulmasından malın teslimine kadar
                olan süre içinde de cayma hakkını kullanabilir. Cayma hakkı
                süresinin belirlenmesinde;
              </div>
            </div>
            <div className="space-y-3">
              <ul>
                a) Tek sipariş konusu olup ayrı ayrı teslim edilen mallarda,
                TÜKETİCİ&apos;nin veya TÜKETİCİ tarafından belirlenen üçüncü
                kişinin son malı teslim aldığı gün,
              </ul>
              <ul>
                b) Birden fazla parçadan oluşan mallarda, TÜKETİCİ&apos;nin veya
                TÜKETİCİ tarafından belirlenen üçüncü kişinin son parçayı teslim
                aldığı gün,
              </ul>
              <ul>
                c) Belirli bir süre boyunca malın düzenli tesliminin yapıldığı
                sözleşmelerde, TÜKETİCİ&apos;nin veya TÜKETİCİ tarafından
                belirlenen üçüncü kişinin ilk malı teslim aldığı gün esas
                alınır. Cayma bildiriminizi cayma hakkı süresi dolmadan İnternet
                Sitesi&apos;nde yer alan kişisel üyelik sayfanızdaki kolay iade
                seçeneği üzerinden gerçekleştirebilirsiniz. Cayma hakkınız
                kapsamında öngörülen taşıyıcı sipariş edilen ürünün tarafınıza
                teslim edildiği kargo firması olup, İnternet Sitesi&apos;nde yer
                alan kişisel üyelik sayfanızdaki kolay iade seçeneğinde geri
                gönderime ilişkin detaylar açıklanmıştır.
              </ul>
            </div>
            <div className="space-y-3">
              <div>
                Tüketici aşağıdaki sözleşmelerde cayma hakkını kullanamaz:
              </div>
              <ul>
                a) Fiyatı finansal piyasalardaki dalgalanmalara bağlı olarak
                değişen ve SATICI veya sağlayıcının kontrolünde olmayan mal veya
                hizmetlere ilişkin sözleşmeler.
              </ul>
              <ul>
                b) Tüketicinin istekleri veya kişisel ihtiyaçları doğrultusunda
                hazırlanan mallara ilişkin sözleşmeler.
              </ul>
              <ul>
                c) Çabuk bozulabilen veya son kullanma tarihi geçebilecek
                malların teslimine ilişkin sözleşmeler.
              </ul>
              <ul>
                ç) Tesliminden sonra ambalaj, bant, mühür, paket gibi koruyucu
                unsurları açılmış olan mallardan; iadesi sağlık ve hijyen
                açısından uygun olmayanların teslimine ilişkin sözleşmeler.
              </ul>
              <ul>
                d) Tesliminden sonra başka ürünlerle karışan ve doğası gereği
                ayrıştırılması mümkün olmayan mallara ilişkin sözleşmeler.
              </ul>
              <ul>
                e) Malın tesliminden sonra ambalaj, bant, mühür, paket gibi
                koruyucu unsurları açılmış olması halinde maddi ortamda sunulan
                kitap, dijital içerik ve bilgisayar sarf malzemelerine ilişkin
                sözleşmeler.
              </ul>
              <ul>
                f) Abonelik sözleşmesi kapsamında sağlananlar dışında, gazete ve
                dergi gibi süreli yayınların teslimine ilişkin sözleşmeler.
              </ul>
              <ul>
                g) Belirli bir tarihte veya dönemde yapılması gereken,
                konaklama, eşya taşıma, araba kiralama, yiyecek-içecek tedariki
                ve eğlence veya dinlenme amacıyla yapılan boş zamanın
                değerlendirilmesine ilişkin sözleşmeler.
              </ul>
              <ul>
                ğ) Elektronik ortamda anında ifa edilen hizmetler veya
                TÜKETİCİ&apos;ye anında teslim edilen gayrimaddi mallara ilişkin
                sözleşmeler.
              </ul>
              <ul>
                h) Cayma hakkı süresi sona ermeden önce, TÜKETİCİ&apos;nin onayı
                ile ifasına başlanan hizmetlere ilişkin sözleşmeler.
              </ul>
            </div>
            <div>MADDE 5- GENEL HÜKÜMLER</div>
            <div>
              5.1- TÜKETİCİ, www.gonenkleopatra.com internet sitesinde sözleşme
              konusu ürüne ilişkin ön bilgileri okuyup bilgi sahibi olduğunu ve
              elektronik ortamda gerekli teyidi verdiğini beyan eder.
            </div>
            <div>
              5.2- Ürün sözleşme tarihinden itibaren en geç 30 gün içerisinde
              teslim edilecektir. Ürününün teslim edilmesi anına kadar tüm
              sorumluluk SATICI&apos;ya aittir.
            </div>
            <div>
              5.3- Toplu sayılacak siparişlerde SATICI sizinle iletişime geçmesi
              gerekir.
            </div>
            <div>
              5.4- SATICI, sözleşme konusu ürünün sağlam, eksiksiz, siparişte
              belirtilen niteliklere uygun ve varsa garanti belgeleri ve
              kullanım kılavuzları ile teslim edilmesinden sorumludur.
            </div>
            <div>
              5.5- Sözleşme konusu ürünün teslimatı için işbu sözleşmenin
              bedelinin TÜKETİCİ&apos;nin tercih ettiği ödeme şekli ile ödenmiş
              olması şarttır. Herhangi bir nedenle ürün bedeli ödenmez veya
              banka kayıtlarında iptal edilir ise, SATICI ürünün teslimi
              yükümlülüğünden kurtulmuş kabul edilir.
            </div>
            <div>
              5.6- Ürünün tesliminden sonra TÜKETİCİ&apos;ya ait kredi kartının
              TÜKETİCİ&apos;nin kusurundan kaynaklanmayan bir şekilde yetkisiz
              kişilerce haksız veya hukuka aykırı olarak kullanılması nedeni ile
              ilgili banka veya finans kuruluşun ürün bedelini SATICI&apos;ya
              ödememesi halinde, TÜKETİCİ&apos;nin kendisine teslim edilmiş
              olması kaydıyla ürünün SATICI&apos;ya gönderilmesi zorunludur.
            </div>
            <div>
              5.8- 385 sayılı vergi usul kanunu genel tebliği uyarınca iade
              işlemlerinin yapılabilmesi için tarafınıza göndermiş olduğumuz
              iade bölümü bulunan faturada ilgili bölümlerin eksiksiz olarak
              doldurulması ve imzalandıktan sonra tarafımıza ürün ile birlikte
              geri gönderilmesi gerekmektedir.
            </div>
            <div>
              5.9- Satışı ilgili mevzuatlar gereği resmi merciler nezdinde
              gerçekleştirilecek resmi işlemler ile tamamlanması öngörülen
              ürünler için Ön Bilgilendirme Formu ve Mesafeli Satış Sözleşmesi
              bir ön protokol niteliğindedir. Bu ürünlerin toplam bedeline
              satışa ilişkin resmi işlemlerin tamamlanması sırasında ortaya
              çıkacak masraflar dahil değildir. Söz konusu masraflar TÜKETİCİ
              tarafından resmi işlemlerin yerine getirilmesi esnasında
              ödenecektir. Bu satışlar, resmi merciler nezdinde resmi işlemlerin
              yerine getirilmesi ile tamamlanmış sayılacaktır. Bu kapsamda cayma
              hakkı, kargo / teslimat ve benzeri nitelikteki uygulama alanı
              bulunmayan hükümler bu ürünler için geçerli olmayacaktır.
            </div>
            <div>MADDE 6- UYUŞMAZLIK VE YETKİLİ MAHKEME</div>
            <div>
              <div>
                İşbu sözleşme ile ilgili çıkacak ihtilaflarda; Türk Mahkemeleri
                yetkili olup; uygulanacak hukuk Türk Hukuku&apos;dur.
              </div>
              <div>
                Türkiye Cumhuriyeti sınırları içerisinde geçerli olmak üzere her
                yıl Ticaret Bakanlığı tarafından ilan edilen değere kadar olan
                ihtilaflar için TÜKETİCİ işleminin yapıldığı veya TÜKETİCİ
                ikametgahının bulunduğu yerdeki İl veya İlçe Tüketici Hakem
                Heyetleri,söz konusu değerin üzerindeki ihtilaflarda ise
                TÜKETİCİ işleminin yapıldığı veya TÜKETİCİ ikametgahının
                bulunduğu yerdeki Tüketici Mahkemeleri Yetkili olacaktır.
              </div>
              <div>
                Siparişin gerçekleşmesi durumunda TÜKETİCİ işbu sözleşmenin tüm
                koşullarını kabul etmiş sayılır.
              </div>
            </div>
            <div>SATICI : Gönen Kleopatra</div>
            <div>ALICI(&quot;TÜKETİCİ&quot;) : </div>
            <div>Tarih : </div>
          </div>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default Cart;
