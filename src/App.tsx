import { FC, PropsWithChildren, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Box } from '@mui/material';

type Item = {
  id: number;
  content: string;
  date: string | null;
};

const items: Item[] = [
  { id: 1, content: '時段1', date: null },
  { id: 2, content: '時段2', date: null },
  { id: 3, content: '時段1~2', date: null },
];

const ItemTypes = {
  CONTENT: 'content',
};

const Item: FC<{ item: Item }> = ({ item }) => {
  return (
    <Box
      sx={{
        width: 100,
        height: 50,
        bgcolor: 'grey.300',
        borderRadius: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {item.content}
    </Box>
  );
};

const Container: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Box
      sx={{
        width: '100mvw',
        height: '100mvh',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      {children}
    </Box>
  );
};

const Column: FC<{ items: Item[] }> = ({ items }) => {
  return (
    <Box
      sx={{
        width: 120,
        border: '1px solid grey',
        borderRadius: 1,
        minHeight: 200,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
      }}
    >
      {items.map((item) => (
        <Item item={item} />
      ))}
    </Box>
  );
};

const filterItems = (items: Item[], date: Item['date']) => {
  return items.filter((item) => item.date === date);
};

const App = () => {


  return (
    <DndProvider backend={HTML5Backend}>
      <Container>
        <Column items={filterItems(items, null)} />
        <Column items={filterItems(items, 'day1')} />
      </Container>
    </DndProvider>
  );
};

export default App;
