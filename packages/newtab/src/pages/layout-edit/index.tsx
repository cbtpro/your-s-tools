import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { RootEdit } from '@/components/main-layout';

function Home() {
  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <RootEdit />
      </DndProvider>
    </>
  );
}

export default Home;
