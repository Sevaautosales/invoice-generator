"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isLoginPage = pathname === "/login";

    if (isLoginPage) {
        return (
            <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                {children}
            </main>
        );
    }

    return (
        <div className="flex h-screen overflow-hidden print:h-auto print:overflow-visible">
            <div className="print:hidden">
                <Sidebar />
            </div>
            <main className="flex-1 overflow-y-auto print:overflow-visible print:p-0 print:m-0">
                <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8 print:p-0 print:m-0 print:max-w-none">
                    {children}
                </div>
            </main>
        </div>
    );
}
