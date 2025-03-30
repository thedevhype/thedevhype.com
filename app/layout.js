import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "O Essencial sobre tecnologia e inteligência artificial para quem só tem 5 minutos.",
  description: "Mantenha-se atualizado com as principais tendências em inteligência artificial, machine learning e tecnologia em apenas 5 minutos por semana. Nosso resumo especializado cobre inovações em IA generativa, LLMs, automação e transformação digital para executivos, gestores e profissionais de tecnologia com agendas lotadas. Acompanhe o futuro da tecnologia sem precisar gastar horas pesquisando - conteúdo essencial entregue diretamente na sua caixa de entrada todos os dias",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
