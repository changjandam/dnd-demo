import {
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
  selectedName: string | null;
  setSelectedName: Dispatch<SetStateAction<string | null>>;
}

const DragItemContext = createContext<DragItemContextProps>({
  selectedName: null,
  setSelectedName: () => {},
});

const name = '陳先生';

const DragItem = () => {
  const { selectedName, setSelectedName } = useContext(DragItemContext);

  const [{ isDragging, offset }, drag] = useDrag({
    type: 'item',
    collect: (monitor) => ({
      offset: monitor.getDifferenceFromInitialOffset(),
      isDragging: !!monitor.isDragging(),
    }),
  });

  useEffect(() => {
    if (isDragging) {
      setSelectedName(name);
    }
  }, [isDragging]);

  const isSelected = selectedName === name;

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
        top: `${171 + (offset?.y || 0)}px`,
        left: `${30 + (offset?.x || 0)}px`,
        zIndex: 2,
      }}
      onClick={() => setSelectedName(name)}
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

const initContent = '廚房清潔';

const dropZoneStyles = {
  init: {
    bg: '#EDF4F7',
    border: '#006BB5',
    color: '#006BB5',
  },
  hover: {
    bg: '#FFFFFF',
    border: '#CACACA',
    color: '#383838',
  },
  dropped: {
    bg: '#E57C73',
    border: '#E57C73',
    color: '#FFFFFF',
  },
};

const DropZone = () => {
  const { selectedName, setSelectedName } = useContext(DragItemContext);
  const [currentStyle, setCurrentStyle] = useState(dropZoneStyles.init);
  const [content, setContent] = useState(initContent);

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'item',
    drop: () => {
      setContent(selectedName || initContent);
      setSelectedName(null);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  });

  useEffect(() => {
    if (isOver && canDrop) {
      setCurrentStyle(dropZoneStyles.hover);
    } else if (content !== initContent) {
      setCurrentStyle(dropZoneStyles.dropped);
    } else {
      setCurrentStyle(dropZoneStyles.init);
    }
  }, [isOver, canDrop]);

  console.log(currentStyle);

  return (
    <Box
      ref={drop}
      sx={{
        boxSizing: 'border-box',
        padding: '5px',
        border: `1px solid ${currentStyle.border}`,
        background: currentStyle.bg,
        color: currentStyle.color,
        height: '103px',
        width: '99px',
        borderRadius: '3px',
        position: 'fixed',
        top: '429px',
        left: '867px',
        zIndex: 1,
      }}
    >
      {content}
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
          selectedName: selectedId,
          setSelectedName: setSelectedId,
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
          <DropZone />
        </Box>
      </DragItemContext.Provider>
    </DndProvider>
  );
};

export default App;
