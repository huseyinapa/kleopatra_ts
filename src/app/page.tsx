import Nav from "@/app/_components/nav";
import Store from "@/app/_components/store";
import Products from "@/app/_components/products";
import Footer from "@/app/_components/footer";

export default function Home(): JSX.Element {
  //bg-[#f3e1dd]

  return (
    <main>
      <Nav />
      <Store />
      <div className="divider mx-10"></div>
      <Products />
      <Footer />
    </main>
  );
}
