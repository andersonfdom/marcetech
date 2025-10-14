import { useState } from 'react';

export const useSidebar = () => {
  const [sidebarActive, setSidebarActive] = useState(false);

  const toggleSidebar = () => {
    setSidebarActive(!sidebarActive);
  };

  const closeSidebar = () => {
    setSidebarActive(false);
  };

  return {
    sidebarActive,
    toggleSidebar,
    closeSidebar
  };
};