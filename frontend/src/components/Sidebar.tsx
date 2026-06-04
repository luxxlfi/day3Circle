import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch, RootState } from "../app/store";
import { logout } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { UserDropdown } from "./UserDrop";
import { House } from 'lucide-react';

export const ComSidebar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="flex h-full flex-col justify-between">
        <div>
          <SidebarGroup>
            <SidebarGroupLabel className="text-lg font-bold">
              Circle
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => navigate("/Home")}>
                    <span> <House /></span>
                    <span>Home</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>

        <div className="border-t p-3">
          <div className="mb-3 px-2 group-data-[collapsible=icon]:hidden">
            <UserDropdown />
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};
