import { useState, useRef, useCallback } from 'react';
import ToDoEdit from './components/ToDoEdit';
import ToDoInsert from './components/ToDoInsert';
import TodoList from './components/TodoList';
import TodoTemplate from './components/ToDoTemplate';

function App() {
  const [todos, setTodos] = useState([
    {
      id: 1,
      text: '일회용품 사용 줄이기',
      checked: true,
    },
    {
      id: 2,
      text: '친환경 세제 사용',
      checked: true,
    },
    {
      id: 3,
      text: '자전거 점검하기',
      checked: false,
    },
  ]);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [insertToggle, setInsertToggle] = useState(false);

  const nextId = useRef(4);
  const onInsertToggle = useCallback(() => {
    if (selectedTodo) {
      setSelectedTodo((selectedTodo) => null);
    }
    setInsertToggle((prev) => !prev);
  }, [selectedTodo]);

  const onChangeSelectedTodo = (todo) => {
    setSelectedTodo((selectedTodo) => todo);
  };

  const onInsert = useCallback((text) => {
    const todo = {
      id: nextId.current,
      text,
      checked: false,
    };
    setTodos((todos) => todos.concat(todo));
    nextId.current++;
  }, []);

  const onRemove = useCallback((id) => {
    setTodos((todos) => todos.filter((todo) => todo.id !== id));
  }, []);
  const onUpdate = useCallback(
    (id, text) => {
      onInsertToggle();

      setTodos((todos) =>
        todos.map((todo) => (todo.id === id ? { ...todo, text } : todo)),
      );
    },
    [onInsertToggle],
  );
  const onToggle = useCallback((id) => {
    setTodos((todos) =>
      todos.map((todo) =>
        todo.id === id ? { ...todo, checked: !todo.checked } : todo,
      ),
    );
  }, []);
  return (
    <TodoTemplate>
      
      <TodoList
        todos={todos}
        onToggle={onToggle}
        onRemove={onRemove}
        onChangeSelectedTodo={onChangeSelectedTodo}
        onInsertToggle={onInsertToggle}
      />
      {insertToggle && (
        <ToDoEdit
          onInsert={onInsert}
          selectedTodo={selectedTodo}
          onInsertToggle={onInsertToggle}
          onUpdate={onUpdate}
          insertToggle={insertToggle}
        />
      )}
      <ToDoInsert onInsert={onInsert} />
    </TodoTemplate>
  );
}

export default App;
