import { createContext, FC, useState, useContext, useEffect } from 'react';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import bg from './assets/bg.jpg';

import { Box, Typography } from '@mui/material';

interface StateContextProps {
  isDragFinished: boolean;
  setIsDragFinished: (isDragFinished: boolean) => void;
}

const StateContext = createContext<StateContextProps>({
  isDragFinished: false,
  setIsDragFinished: () => {},
});

const dragItemStyle = {
  selected: {
    bg: '#EDF4F7',
    border: '#006BB5',
  },
  unselected: {
    bg: '#FFFFFF',
    border: '#CACACA',
  },
};

const DragItem = () => {
  const [selected, setSelected] = useState(false);
  const { isDragFinished, setIsDragFinished } = useContext(StateContext);

  const [{ isDragging, offset, didDrop }, drag] = useDrag({
    type: 'item',
    collect(monitor) {
      return {
        isDragging: monitor.isDragging(),
        offset: monitor.getDifferenceFromInitialOffset(),
        didDrop: monitor.didDrop(),
      };
    },
  });

  useEffect(() => {
    if (isDragging) {
      setSelected(true);
    }
  }, [isDragging]);

  useEffect(() => {
    if (didDrop) {
      setSelected(false);
    }
  }, [didDrop]);

  const style = selected ? dragItemStyle.selected : dragItemStyle.unselected;

  return (
    <Box
      ref={drag}
      sx={{
        boxSizing: 'border-box',
        width: '202px',
        height: '68px',
        background: style.bg,
        borderRadius: '3px',
        border: `1px solid ${style.border}`,
        opacity: isDragging ? 0.5 : 1,
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'fixed',
        top: `${171 + (offset?.y || 0)}px`,
        left: `${30 + (offset?.x || 0)}px`,
        zIndex: 2,
      }}
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

const DropZone = () => {
  return <Box></Box>;
};

const Demo = () => {
  const [isDragFinished, setIsDragFinished] = useState(false);

  return (
    <StateContext.Provider value={{ isDragFinished, setIsDragFinished }}>
      <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
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
          <DropZone />
        </Box>
      </DndProvider>
    </StateContext.Provider>
  );
};

export default Demo;
