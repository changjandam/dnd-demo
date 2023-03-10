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
  selectedItem: Item | null;
  setSelectedItem: Dispatch<SetStateAction<Item | null>>;
}>({
  items: [],
  setItems: () => {},
  selectedItem: null,
  setSelectedItem: () => {},
});

const filterItems = (items: Item[], date: Item['date']) => {
  return items.filter((item) => item.date === date);
};

type Item = {
  id: number;
  content: string;
  date: string | null;
};

const constItems: Item[] = [{ id: 1, content: '員工', date: null }];

const ItemTypes = {
  CONTENT: '員工',
};

const Item: FC<{ item: Item }> = ({ item }) => {
  const { setSelectedItem, selectedItem } = useContext(itemsContext);
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

  const showBorder = isDragging || selectedItem?.id === item.id;

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
        border: `3px solid ${showBorder ? 'red' : 'transparent'}`,
        transform: isDragging
          ? `translate(${offset?.x}px, ${offset?.y}px)`
          : '',
      }}
      // ={() => setSelectedItem(item)}
      onPointerDown={() => setSelectedItem(item)}
    >
      {item.content}
    </Box>
  );
};

const Container: FC<PropsWithChildren> = ({ children }) => {
  const { setSelectedItem } = useContext(itemsContext);

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
  const { setItems, selectedItem, setSelectedItem } = useContext(itemsContext);

  const handleItemChange = () => {
    setItems((items) => {
      return items.map((i) => {
        console.log({ i, selectedItem });
        if (i.id === selectedItem?.id) {
          return { ...i, date };
        }
        return i;
      });
    });
    setSelectedItem(null);
  };

  const [{ canDrop, isOver }, drop] = useDrop({
    accept: ItemTypes.CONTENT,
    drop: handleItemChange,
    collect(monitor) {
      return {
        canDrop: monitor.canDrop(),
        isOver: monitor.isOver(),
      };
    },
  });

  const show = canDrop || selectedItem?.content === ItemTypes.CONTENT;

  return (
    <Box
      ref={drop}
      sx={{
        display: show ? 'block' : 'none',
        width: '90%',
        height: '90%',
        position: 'absolute',
        borderRadius: 1,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: isOver ? 'rgba(0, 0, 0, 0.2)' : 'transparent',
        border: '3px dashed blue',
      }}
      onClick={handleItemChange}
    />
  );
};

const Column: FC<{ date: Item['date'] }> = ({ date }) => {
  const { items } = useContext(itemsContext);
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
        <Item item={item} key={item.id} />
      ))}
      {date !== null && <DropZone date='day1' />}
    </Box>
  );
};

const App = () => {
  const [items, setItems] = useState<Item[]>(constItems);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  return (
    <DndProvider
      backend={TouchBackend}
      options={{
        enableMouseEvents: true,
      }}
    >
      <itemsContext.Provider
        value={{ items, setItems, selectedItem, setSelectedItem }}
      >
        <Container>
          <Column date={null} />
          <button
            onClick={() => {
              setItems(constItems);
              setSelectedItem(null);
            }}
          >
            重置
          </button>
          <Column date={'day1'} />
        </Container>
      </itemsContext.Provider>
    </DndProvider>
  );
};

export default App;
