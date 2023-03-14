import { useMemo } from 'react';
import { useDrop } from 'react-dnd';
import { Box, IconButton } from '@mui/material';

import { useEventState } from './Demo';

const dropZoneStyles = {
  init: {
    bg: '#939393',
    border: '#939393',
    color: '#FFFFFF',
  },
  selected: {
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
  const {
    dragItemSelected,
    selectDropZone,
    initState,
    dropZoneSelected,
    isDragFinished,
    finishState,
  } = useEventState();

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'item',
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
    drop: finishState,
  });

  const getStyle = () => {
    if (isDragFinished) {
      return dropZoneStyles.dropped;
    }
    if (isOver) {
      return dropZoneStyles.hover;
    }
    if (dropZoneSelected) {
      return dropZoneStyles.selected;
    }
    return dropZoneStyles.init;
  };

  const style = useMemo(getStyle, [isDragFinished, isOver, dropZoneSelected]);

  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          top: '429px',
          left: '867px',
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            boxSizing: 'border-box',
            padding: '5px',
            border: `1px solid ${style.border}`,
            background: style.bg,
            color: style.color,
            height: '103px',
            width: '99px',
            borderRadius: '3px',
            font: '12px/19px Noto Sans TC',
            letterSpacing: '0.14px',
          }}
          onClick={() => {
            if (dragItemSelected) {
              return finishState();
            }
            return selectDropZone();
          }}
        >
          {isDragFinished ? '陳先生' : '廚房清潔'}
        </Box>
        {isDragFinished && (
          <IconButton
            sx={{
              position: 'absolute',
              top: '5px',
              right: '5px',
              width: '20px',
              height: '20px',
              fontSize: '1rem',
            }}
            onClick={initState}
          >
            x
          </IconButton>
        )}
      </Box>
      {canDrop && (
        <Box
          ref={drop}
          sx={{
            position: 'absolute',
            top: '429px',
            left: '867px',
            width: '99px',
            height: '103px',
            background: 'transparent',
            zIndex: 999,
          }}
        />
      )}
    </>
  );
};

export default DropZone;
