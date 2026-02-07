import { useState } from 'react'
import { Button } from '@arco-design/web-react';
import type { YourToolApp } from '@your-s-tools/types';
import { useStorageState } from '@your-s-tools/shared';

function Demo() {
  const [count, setCount] = useStorageState<YourToolApp.Settings, 'count'>('count', 0, { expired: 60 });

  const [message, setMessage] = useState<string>('');


  return (
    <>
      <div className="card">
        <Button type="primary" onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </Button>
      </div>
      <input value={message} onChange={(e) => setMessage(e.target.value)} type="text" placeholder="input" />
    </>
  )
}

export default Demo;
