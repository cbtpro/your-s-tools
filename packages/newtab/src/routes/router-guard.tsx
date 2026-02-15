import React, { createContext, useContext, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type Guard = (from: string, to: string) => boolean | Promise<boolean>;

type GuardContextType = {
  registerGuard: (guard: Guard) => () => void;
  safeNavigate: (to: string) => Promise<void>;
};

const GuardContext = createContext<GuardContextType | null>(null);

export const GuardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const guardsRef = useRef<Guard[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPathRef = useRef(location.pathname);

  useEffect(() => {
    currentPathRef.current = location.pathname;
  }, [location.pathname]);

  const registerGuard = (guard: Guard) => {
    guardsRef.current.push(guard);
    return () => {
      guardsRef.current = guardsRef.current.filter(g => g !== guard);
    };
  };

  const runGuards = async (from: string, to: string) => {
    for (const guard of guardsRef.current) {
      const shouldBlock = await guard(from, to);
      if (shouldBlock) {
        const confirmLeave = window.confirm("当前有未保存内容，确定离开吗？");
        if (!confirmLeave) return false;
        break;
      }
    }
    return true;
  };

  const safeNavigate = async (to: string) => {
    const from = currentPathRef.current;
    const allow = await runGuards(from, to);
    if (!allow) return;

    navigate(to);
  };

  /**
   * 🔥 关键：拦截浏览器后退（HashRouter 也适用）
   */
  useEffect(() => {
    const handlePopState = async () => {
      const from = currentPathRef.current;
      const to = window.location.hash.replace("#", "") || "/";

      const allow = await runGuards(from, to);

      if (!allow) {
        // 阻止回退 → 再跳回当前页
        navigate(from, { replace: true });
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return (
    <GuardContext.Provider value={{ registerGuard, safeNavigate }}>
      {children}
    </GuardContext.Provider>
  );
};

export const useRouterGuard = () => {
  const ctx = useContext(GuardContext);
  if (!ctx) throw new Error("useRouterGuard must be used inside GuardProvider");
  return ctx;
};
