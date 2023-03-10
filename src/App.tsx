import {
  FC,
  PropsWithChildren,
  useState,
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
} from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import { Box } from '@mui/material';

const itemsContext = createContext<{
  items: Item[];
  setItems: Dispatch<SetStateAction<Item[]>>;
}>({ items: [], setItems: () => {} });

const filterItems = (items: Item[], date: Item['date']) => {
  return items.filter((item) => item.date === date);
};

type Item = {
  id: number;
  content: string;
  date: string | null;
};

const constItems: Item[] = [
  { id: 1, content: '時段1', date: null },
  { id: 2, content: '時段2', date: null },
  { id: 3, content: '時段1~2', date: null },
];

const ItemTypes = {
  CONTENT: 'content',
};

const Item: FC<{ item: Item }> = ({ item }) => {
  const [{ offset, isDragging }, drag] = useDrag({
    item,
    type: ItemTypes.CONTENT,
    collect: (monitor) => {
      return {
        offset: monitor.getDifferenceFromInitialOffset(),
        isDragging: !!monitor.isDragging(),
      };
    },
  });

  return (
    <Box
      ref={drag}
      sx={{
        width: 100,
        height: 50,
        bgcolor: 'grey.300',
        borderRadius: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: isDragging ? 0.5 : 1,
        border: `3px solid ${isDragging ? 'red' : 'transparent'}`,
        transform: isDragging
          ? `translate(${offset?.x}px, ${offset?.y}px)`
          : '',
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

const DropZone: FC<{ date: string }> = ({ date }) => {
  const { setItems } = useContext(itemsContext);
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: ItemTypes.CONTENT,
    drop: (item: Item) => {
      setItems((items) => {
        return items.map((i) => {
          if (i.id === item.id) {
            return { ...i, date };
          }
          return i;
        });
      });
    },
    collect(monitor) {
      return {
        canDrop: monitor.canDrop(),
        isOver: monitor.isOver(),
      };
    },
  });

  return (
    <Box
      ref={drop}
      sx={{
        width: '90%',
        height: '90%',
        position: 'absolute',
        borderRadius: 1,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: isOver ? 'rgba(0, 0, 0, 0.2)' : 'transparent',
        border: `3px dashed ${canDrop ? 'blue' : 'transparent'}`,
      }}
    />
  );
};

const Column: FC<{ items: Item[]; date: Item['date'] }> = ({ items, date }) => {
  const filteredItems = date === null ? items : filterItems(items, date);

  return (
    <Box
      sx={{
        position: 'relative',
        width: 120,
        border: '1px solid grey',
        borderRadius: 1,
        minHeight: 200,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-around',
      }}
    >
      {filteredItems.map((item) => (
        <Item item={item} />
      ))}
      {date !== null && <DropZone date='day1' />}
    </Box>
  );
};

const App = () => {
  const [items, setItems] = useState<Item[]>(constItems);
  return (
    <DndProvider
      backend={TouchBackend}
      options={{
        enableMouseEvents: true,
      }}
    >
      <itemsContext.Provider value={{ items, setItems }}>
        <Container>
          <Column items={items} date={null} />
          <Column items={items} date={'day1'} />
        </Container>
      </itemsContext.Provider>
    </DndProvider>
  );
};

export default App;
