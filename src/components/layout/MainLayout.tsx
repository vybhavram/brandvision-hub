
import { ReactNode } from "react";
import Navbar from "./Navbar";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 md:px-6 py-6">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
