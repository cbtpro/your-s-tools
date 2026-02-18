import React from 'react';
import { Layout } from '@/components/main-layout';
const Dock = React.lazy(() => import('@/components/dock'));
// import Demo from '../demo';

function Home() {
  return (
    <>
      {/* <Demo /> */}
      <Layout />
      <Dock />
    </>
  )
}

export default Home;
