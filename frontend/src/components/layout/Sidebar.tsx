'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Award, 
  Settings, 
  LogOut 
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const menuItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Projects', href: '/dashboard/projects', icon: FolderKanban },
  { name: 'Skills', href: '/dashboard/skills', icon: Award },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    
      
        // Admin Panel
      

      
        // {menuItems.map((item) => {
        //   const Icon = item.icon;
        //   const isActive = pathname === item.href;

        //   return (
            
              
        //       {item.name}
            
        //   );
        // })}

        
          
        //   Logout
        
      
    
  );
}
