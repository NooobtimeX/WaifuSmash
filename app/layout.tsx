import Header from "@/components/section/Header";
import Footer from "@/components/section/Footer";
import { createClient } from "@/utils/supabase/server";
import "./globals.css";
interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  const user = data?.user || null;
  return (
    <html lang="en">
      <body>
        <Header user={user} />
        <main className="mx-auto max-w-screen-xl">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
