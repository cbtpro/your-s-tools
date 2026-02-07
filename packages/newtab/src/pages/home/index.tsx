import React from 'react';
import { Root } from '@/components/main-layout';
const Dock = React.lazy(() => import('@/components/dock'));
import Demo from '../demo';

function Home() {
  return (
    <>
      <Demo />
      <Root />
      <Dock />
    </>
  )
}

export default Home;
