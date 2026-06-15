import { createContext, useContext, useState } from "react";

const RouterContext = createContext();

export function RouterProvider({ children }) {
  const [page, setPage] = useState("dashboard");
  return (
    <RouterContext.Provider value={{ page, navigate: setPage }}>
      {children}
    </RouterContext.Provider>
  );
}

export const useRouter = () => useContext(RouterContext);
