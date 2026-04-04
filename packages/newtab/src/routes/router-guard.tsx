import React, { createContext, useContext, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * 路由守卫函数类型
 * @param from - 当前来源路径
 * @param to - 目标跳转路径
 * @returns 如果返回 true 或 Promise.resolve(true)，则表示阻止跳转（需要用户确认）；false 则允许跳转
 */
type Guard = (from: string, to: string) => boolean | Promise<boolean>;

/**
 * 路由守卫上下文类型
 */
type GuardContextType = {
  /**
   * 注册一个路由守卫
   * @param guard - 守卫函数
   * @returns 取消注册的函数
   */
  registerGuard: (guard: Guard) => () => void;
  /**
   * 安全导航方法，执行所有守卫检查后再进行跳转
   * @param to - 目标路径
   */
  safeNavigate: (to: string) => Promise<void>;
};

const GuardContext = createContext<GuardContextType | null>(null);

/**
 * 路由守卫提供者组件
 * 提供注册守卫和安全导航的功能，并拦截浏览器后退按钮
 */
export const GuardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 存储所有已注册的守卫函数
  const guardsRef = useRef<Guard[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  // 记录当前路径，用于在异步操作中获取最新的路径状态
  const currentPathRef = useRef(location.pathname);

  useEffect(() => {
    currentPathRef.current = location.pathname;
  }, [location.pathname]);

  /**
   * 注册路由守卫
   * @param guard - 要注册的守卫函数
   * @returns 取消注册的清理函数
   */
  const registerGuard = (guard: Guard) => {
    guardsRef.current.push(guard);
    return () => {
      guardsRef.current = guardsRef.current.filter(g => g !== guard);
    };
  };

  /**
   * 依次执行所有注册的守卫
   * 如果任一守卫返回 true，则弹出确认框询问用户是否离开
   * @param from - 来源路径
   * @param to - 目标路径
   * @returns 如果允许跳转返回 true，否则返回 false
   */
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

  /**
   * 安全导航方法
   * 在执行 navigate 之前先运行所有守卫检查
   * @param to - 目标跳转路径
   */
  const safeNavigate = async (to: string) => {
    const from = currentPathRef.current;
    const allow = await runGuards(from, to);
    if (!allow) return;

    navigate(to);
  };

  /**
   * 🔥 关键：拦截浏览器后退（HashRouter 也适用）
   * 监听 popstate 事件，在用户点击浏览器后退/前进按钮时触发守卫检查
   * 如果守卫阻止跳转，则强制导航回当前页面以抵消浏览器的默认行为
   */
  useEffect(() => {
    const handlePopState = async () => {
      const from = currentPathRef.current;
      // 获取目标路径，处理 Hash 模式下的路径提取
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

/**
 * 使用路由守卫的 Hook
 * @returns 包含 registerGuard 和 safeNavigate 的上下文对象
 * @throws 如果在 GuardProvider 外部调用则抛出错误
 */
export const useRouterGuard = () => {
  const ctx = useContext(GuardContext);
  if (!ctx) throw new Error("useRouterGuard must be used inside GuardProvider");
  return ctx;
};
