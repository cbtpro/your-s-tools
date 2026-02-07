import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { STORAGE_KEY, StorageAreaEnum, useGeneralStorage } from '@your-s-tools/shared';
import { RootEdit } from '@/components/main-layout';

function Home() {
  const [layoutEdit, _setLayoutEdit] = useGeneralStorage(StorageAreaEnum.LOCAL, STORAGE_KEY.EDITING_LAYOUT);
  if (layoutEdit) {
    return (
      <>
        <DndProvider backend={HTML5Backend}>
          <RootEdit />
        </DndProvider>
      </>
    );
  }
}

export default Home;
