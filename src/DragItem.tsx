import React, { useContext, useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { Box, Typography } from '@mui/material';

import { StateContext, useEventState } from './Demo';

const dragItemStyles = {
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
  const { finishState, dragItemSelected } = useEventState();

  const [{ isDragging, offset }, drag] = useDrag({
    type: 'item',
    item: { name: '陳先生' },
    collect(monitor) {
      return {
        isDragging: monitor.isDragging(),
        offset: monitor.getDifferenceFromInitialOffset(),
      };
    },
  });

  const style = dragItemSelected
    ? dragItemStyles.selected
    : dragItemStyles.unselected;

  return (
    <Box
      ref={drag}
      sx={{
        position: 'fixed',
        top: '171px',
        left: '30px',
        zIndex: 1,
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
        transform: `translate(${offset?.x || 0}px, ${offset?.y || 0}px)`,
      }}
      onClick={finishState}
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

export default DragItem;
