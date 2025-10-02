import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Root } from '@/components/main-layout';
// import Demo from '../demo';

function Home() {
  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <Root />
        {/* <Demo /> */}
      </DndProvider>
    </>
  )
}

export default Home;
