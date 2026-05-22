import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BotChat from "@/components/BotChat";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
      <BotChat />
    </>
  );
}
