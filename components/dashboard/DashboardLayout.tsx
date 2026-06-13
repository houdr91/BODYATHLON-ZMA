"use client";

import { useState } from "react";
import { usePathname } from "@/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import {
  DashboardSidebar,
  type SidebarUser,
} from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

interface DashboardLayoutProps {
  user: SidebarUser;
  children: React.ReactNode;
}

export function DashboardLayout({ user, children }: DashboardLayoutProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-dark-300">
      {/* Sidebar fijo: iconos en md, completo en lg */}
      <div className="fixed inset-y-0 left-0 z-40 hidden md:block">
        <DashboardSidebar user={user} />
      </div>

      {/* Drawer móvil */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/70 md:hidden"
              onClick={() => setDrawerOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
              className="fixed inset-y-0 left-0 z-50 w-72 md:hidden"
            >
              <button
                onClick={() => setDrawerOpen(false)}
                className="absolute right-3 top-4 z-10 cursor-pointer rounded-lg p-2 text-slate-400 hover:bg-white/10"
                aria-label="Cerrar menú"
              >
                <X className="h-5 w-5" />
              </button>
              <DashboardSidebar
                user={user}
                inDrawer
                onNavigate={() => setDrawerOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Contenido */}
      <div className="flex min-h-screen w-full flex-col md:pl-16 lg:pl-[260px]">
        <DashboardHeader
          userName={user.name}
          onMenuClick={() => setDrawerOpen(true)}
        />
        <AnimatePresence mode="wait">
          <motion.main
            key={pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="flex-1 px-4 py-8 sm:px-6 lg:px-10"
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
}
