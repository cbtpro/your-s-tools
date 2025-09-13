import { useEffect, useState } from "react";
import useChromeStorage from "../utils/use-chrome-storage";

const useCountStorage = () : [number, React.Dispatch<React.SetStateAction<number>>] => {
  const storage = useChromeStorage({ area: 'local' });
  const [count, setCount] = useState(0);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initCount = async () => {
      const storeCount = await storage.getItem<number>('count');
      if (storeCount) {
        setCount(storeCount);
      }
      setInitialized(true);
    };
    initCount();
  }, []);

  useEffect(() => {
    if (initialized) {
      storage.setItem('count', count);
    }
  }, [count, initialized, storage]);

  return [count, setCount];
};

export default useCountStorage;