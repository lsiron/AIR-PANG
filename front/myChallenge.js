import React, { useState, useEffect} from 'react'20.

todoListElement
const [challenge, setChallenge] = useState({
  title: '',
  description: '',
  startDate: '',
  endDate: '',
  tasks: []
});
const [todoInputs, setTodoInputs] = useState(['', '', '', '', '']);
const [tasks, setTasks] = useState([]);
const [previousValues, setPreviousValues] = useState({});
const [alertMessage, setAlertMessage] = useState('');
alertMessageElement = document.querySelector('#alertMessageElement')

const inputRefs = useRef([]);
useEffect(() => {
  const initialTodoInputs = inputRefs.current.map(ref => ref ? ref.value : '');
  setTodoInputs(initialTodoInputs);
},[]);


const handleAddTodo = () => {
  const cleanedTodoList = todoInputs.filter(item => item.trim() !== '');

  if (cleanedTodoList.length < 2) {
    setAlertMessage('최소 두 개의 할일을 만들어 주세요.')
    return;
  }
  setTodoList([...cleanedTodoList]);
}

const storePreviousValues = () => {
  setPreviousValues({
    title: challenge.title,
    description: challenge.description,
    startDate: challenge.startDate,
    endDate: challenge.endDate,
    tasks: [...challenge.tasks]
  })
}
const restorePreviousValues = () => {
  setChallenge({
    ...challenge,
    title: previousValues.title || '',
    description: previousValues.description || '',
    startDate: previousValues.startDate || '',
    endDate: previousValues.endDate || '',
    tasks: previousValues.tasks || ['', '', '', '', '']
  });
};

const initializeTodoList() {
  tasks=['','','','','']
}

document.getElementById('challengeMakeBtn').addEventListener('click', ()=> {
  document.getElementById('challengeModal').style.display = 'block';
  storePreviousValues();
})


document.getElementById('addTodoList').addEventListener('click', () => {
  for (let index=0; index < 5, index++) {
    const todo = document.getElementById(`todoInput${index}`).value;
    if (todo) {
      tasks.push(todo);
    }
  }
  handleAddTodo();
  renderTodoList(true)
})

document.getElementById('cancelTodoList').addEventListener('click', () => {
  initializeTodoList();
})

document.getElementById('challengeCloseBtn').addEventListener("click", () => {
  document.getElementById('challengeModal').style.display= 'none';
  alertMessageElement.style.display = 'none'
  restorePreviousValues();
})