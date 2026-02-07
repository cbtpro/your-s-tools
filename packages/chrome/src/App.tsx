import type { YourToolApp } from "@your-s-tools/types";
import { useStorageState, StorageAreaEnum } from '@your-s-tools/shared';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useStorageState<YourToolApp.Settings, 'count'>('count', 0, { area: StorageAreaEnum.LOCAL, expired: -1 });

  return (
    <>
      <div>
        <a href="https://vite.dev" rel="noopener noreferrer" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" rel="noopener noreferrer" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
