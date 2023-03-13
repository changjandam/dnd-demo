import {
  FC,
  PropsWithChildren,
  useState,
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
  useEffect,
} from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import { Box, Typography } from '@mui/material';
import bg from './assets/bg.jpg';

interface DragItemContextProps {
  selectedId: string | null;
  setSelectedId: Dispatch<SetStateAction<string | null>>;
}

const DragItemContext = createContext<DragItemContextProps>({
  selectedId: null,
  setSelectedId: () => {},
});

const id = '1';

const DragItem = () => {
  const { selectedId, setSelectedId } = useContext(DragItemContext);

  const [{ isDragging, offset }, drag] = useDrag({
    type: 'item',
    collect: (monitor) => ({
      offset: monitor.getDifferenceFromInitialOffset(),
      isDragging: !!monitor.isDragging(),
    }),
  });

  useEffect(() => {
    if (isDragging) {
      setSelectedId(id);
    }
  }, [isDragging]);

  const isSelected = selectedId === id;

  console.log({ isDragging, isSelected });

  return (
    <Box
      ref={drag}
      sx={{
        boxSizing: 'border-box',
        width: '202px',
        height: '68px',
        background: isSelected ? '#EDF4F7' : '#FFFFFF',
        borderRadius: '3px',
        border: `1px solid ${isSelected ? '#006BB5' : '#CACACA'}`,
        opacity: isDragging ? 0.5 : 1,
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'fixed',
        // top: '171px',
        // left: '30px',
        top: `${171 + (offset?.y || 0)}px`,
        left: `${30 + (offset?.x || 0)}px`,
      }}
      onClick={() => setSelectedId(id)}
    >
      <Box
        sx={{
          display: 'flex',
        }}
      >
        <Box
          sx={{
            background: '#0065A5',
            color: '#FFFFFF',
            width: '50px',
            height: '25px',
            borderRadius: '12.5px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: '20px',
          }}
        >
          宅內
        </Box>
        <Typography>陳先生</Typography>
      </Box>
      <Typography
        sx={{
          font: '12px/19px Noto Sans TC',
          color: '#959595',
          letterSpacing: '0.14px',
        }}
      >
        ※ 本月已排班時數159
      </Typography>
    </Box>
  );
};

const App = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  return (
    <DndProvider
      backend={TouchBackend}
      options={{
        enableMouseEvents: true,
      }}
    >
      <DragItemContext.Provider
        value={{
          selectedId,
          setSelectedId,
        }}
      >
        <Box
          sx={{
            width: '1000px',
            height: '625px',
            background: `url(${bg}) no-repeat center center/cover`,
            position: 'fixed',
            top: 0,
            left: 0,
          }}
        >
          <DragItem />
        </Box>
      </DragItemContext.Provider>
    </DndProvider>
  );
};

export default App;
