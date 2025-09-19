import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { TopHeader } from "./TopHeader";
import { Outlet } from "react-router-dom";
import { ClientModal } from "@/components/crm/ClientModal";

export function MainLayout() {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <main className="flex-1 flex flex-col">
          <TopHeader />
          
          <div className="flex-1 overflow-auto">
            <div className="container-erp py-8">
              <Outlet />
            </div>
          </div>
        </main>

        <ClientModal />
      </div>
    </SidebarProvider>
  );
}