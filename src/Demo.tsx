import { createContext, useState, useContext } from 'react';
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import bg from './assets/bg.jpg';

import DropZone from './DropZone';
import DragItem from './DragItem';

import { Box, Typography } from '@mui/material';

interface StateContextProps {
  isDragFinished: boolean;
  setIsDragFinished: (isDragFinished: boolean) => void;
  dragItemSelected: boolean;
  setDragItemSelected: (dropItemSelected: boolean) => void;
  dropZoneSelected: boolean;
  setDropZoneSelected: (dropZoneSelected: boolean) => void;
  coverItems: boolean;
  setCoverItems: (coverItems: boolean) => void;
}

export const StateContext = createContext<StateContextProps>({
  isDragFinished: false,
  setIsDragFinished: () => {},
  dragItemSelected: false,
  setDragItemSelected: () => {},
  dropZoneSelected: false,
  setDropZoneSelected: () => {},
  coverItems: false,
  setCoverItems: () => {},
});

export const useEventState = () => {
  const {
    isDragFinished,
    setIsDragFinished,
    dragItemSelected,
    setDragItemSelected,
    dropZoneSelected,
    setDropZoneSelected,
    coverItems,
    setCoverItems,
  } = useContext(StateContext);

  const initState = () => {
    console.log('initState');
    setIsDragFinished(false);
    setDragItemSelected(false);
    setDropZoneSelected(false);
    setCoverItems(true);
  };

  const selectDropZone = () => {
    console.log('selectDropZone');
    setDropZoneSelected(true);
    setCoverItems(false);
  };

  const selectDragItem = () => {
    console.log('selectDragItem');
    setDragItemSelected(true);
  };

  const finishState = () => {
    console.log('finishState');
    setIsDragFinished(true);
    setDragItemSelected(false);
    setDropZoneSelected(false);
    setCoverItems(true);
  };

  return {
    initState,
    selectDropZone,
    selectDragItem,
    finishState,
    isDragFinished,
    dragItemSelected,
    dropZoneSelected,
    coverItems,
  };
};

const Demo = () => {
  const [isDragFinished, setIsDragFinished] = useState(false);
  const [dragItemSelected, setDragItemSelected] = useState(false);
  const [dropZoneSelected, setDropZoneSelected] = useState(false);
  const [coverItems, setCoverItems] = useState(true);

  console.log({
    isDragFinished,
    dragItemSelected,
    dropZoneSelected,
    coverItems,
  });

  return (
    <StateContext.Provider
      value={{
        isDragFinished,
        setIsDragFinished,
        dragItemSelected,
        setDragItemSelected,
        dropZoneSelected,
        setDropZoneSelected,
        coverItems,
        setCoverItems,
      }}
    >
      <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
        <Box
          sx={{
            width: '1000px',
            height: '625px',
            background: `url(${bg}) no-repeat center center/cover`,
            position: 'fixed',
            top: 0,
            left: 0,
            display: 'flex',
          }}
        >
          <DropZone />
          <DragItem />
          {coverItems && (
            <Box
              sx={{
                position: 'fixed',
                top: '171px',
                left: '30px',
                width: '205px',
                height: '300px',
                background: '#FFFFFF',
                zIndex: 999,
              }}
            />
          )}
          <Box
            sx={{
              background: '#FFFFFF',
              position: 'fixed',
              top: '136px',
              left: '30px',
              display: 'flex',
              gap: '10px',
            }}
          >
            <Typography
              sx={{
                fontSize: '18px',
                letterSpacing: '0.32px',
              }}
            >
              可排人員
            </Typography>
            <Box
              sx={{
                fontSize: '15px',
                color: '#FFFFFF',
                background: '#DD6763',
                borderRadius: '50%',
                width: '25px',
                height: '25px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {isDragFinished ? '2' : '3'}
            </Box>
          </Box>
        </Box>
      </DndProvider>
    </StateContext.Provider>
  );
};

export default Demo;
