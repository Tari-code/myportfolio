import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BotChat from "@/components/BotChat";

export default function MainLayout({
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
