"use client";
import Header from "@/components/Header";
import SideBar from "@/components/SideBar";
import UploadProgressPopup from "@/components/UploadProgressPopup";
import Toast from "@/components/model/Toast";
import { useYoutubecontext } from "@/contextAPI/YoutubeContextAPI";
import { useVideoNotifications } from "@/hooks/useVideoNotifications";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import { createPortal } from "react-dom";

type Props = { children: React.ReactNode };

const App: React.FC<Props> = ({ children }) => {
  const { isSidebarOpen, loginUserDetails } = useYoutubecontext();
  const pathname = usePathname();
  useVideoNotifications(loginUserDetails?._id);

  useEffect(() => {
    const base = "YouTube Clone";
    if (pathname === "/") document.title = base;
    else if (pathname.startsWith("/watch")) document.title = `Watch - ${base}`;
    else if (pathname.startsWith("/channel")) document.title = `Channel - ${base}`;
    else if (pathname.startsWith("/dashboard")) document.title = `Dashboard - ${base}`;
    else if (pathname.startsWith("/subscribers")) document.title = `Subscribers - ${base}`;
    else if (pathname.startsWith("/history")) document.title = `History - ${base}`;
    else if (pathname.startsWith("/playlist")) document.title = `Playlist - ${base}`;
    else document.title = base;
  }, [pathname]);

  return (
    <React.Fragment>
      <Header />
      <UploadProgressPopup />
      {typeof document !== "undefined" && createPortal(Toast(), document.body)}
      <div className="flex ">
        {/* Sidebar */}
        <SideBar />

        {/* Main Content */}
        <main className={`
              flex-1 p-6 transition-all duration-300 mt-10
              ${isSidebarOpen ? 'ml-0 md:ml-60' : 'ml-0 md:ml-[72px]'}
            `}>
          {children}
        </main>
      </div>
    </React.Fragment>
  )
}

export default App
