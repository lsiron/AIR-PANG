import React, { useState, useEffect} from 'react'20.
import axios from 'axios';

const [
  challengeTitleInput,
  challengeDescriptionInput,
  challengeStartDateInput,
  challengeEndDateInput,
  todoListElement,
] = document.querySelectorAll("[id^=challenge-form]");
const [challengeList, setChallengeList] = useState([]);
const [challengeEditingIndex, setChallengeEditingIndex] = useState(-1);
const [challenge, setChallenge] = useState({
  title: '',
  description: '',
  startDate: '',
  endDate: '',
  tasks: []
});
const [todoInputs, setTodoInputs] = useState(['', '', '', '', '']);
const [tasks, setTasks] = useState([]);
const [isEditing, setIsEditing] = useState(false);
const [previousValues, setPreviousValues] = useState({});
const [alertMessage, setAlertMessage] = useState('');
alertMessageElement = document.querySelector('#alertMessageElement')

const handleInputChange = (index, value) => {
  const newTodoInputs = [...todoInputs];
  newTodoInputs[index] = value;
  setTodoInputs(newTodoInputs);
};
let todoInput0 = document.getElementById('todoInput0')
let todoInput1 = document.getElementById('todoInput1')
let todoInput2 = document.getElementById('todoInput2')
let todoInput3 = document.getElementById('todoInput3')
let todoInput4 = document.getElementById('todoInput4')
const handleAddTodo = () => {
  todoInputs= [
    todoInput0.value,
    todoInput1.value,
    todoInput2.value,
    todoInput3.value,
    todoInput4.value
  ]
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


document.getElementById('challengeMakeBtn').addEventListener('click', ()=> {
  document.getElementById('challengeModal').style.display = 'block';
})


document.getElementById('addTodoList').addEventListener('click', () => {
  useEffect (() => {
    const initialTodoInputs = [
      todoInput0.value,
      todoInput1.value,
      todoInput2.value,
      todoInput3.value,
      todoInput4.value,
    ];
    setTodoInputs(initialTodoInputs)
  }, []);
  for (let index=0; index < 5, index++) {
    const todo = document.getElementById(`todoInput${index}`).value;
    if (todo) {
      todoList.push(todo);
    }
  }
  handleAddTodo();
  renderTodoList(true)
})

document.getElementById('challengeCloseBtn').addEventListener("click", () => {
  document.getElementById('challengeModal').style.display= 'none';
  alertMessageElement.style.display = 'none'
  restorePreviousValues();
})

document.getElementById('challengeForm').addEventListener('submit', async(e) => {
  e.preventDefault();
  const title = challengeTitleInput.value;
  const description = challengeDescriptionInput.value;
  const startDate = challengeStartDateInput.value;
  const endDate = challengeEndDateInput.value;
  if (new Date(startDate) > new Date(endDate)) {
      alert('시작 날짜는 끝 날짜보다 이전이어야 합니다.');
      return;
  }

  if (!title||!description||!startDate||!endDate) {
    alert("모두 입력해주세요");
    return;
  }
  if (challengeEditingIndex === -1) {
    const challenge = {
      author: window.user._id,
      title: title,
      description: description,
      startDate: startDate,
      endDate: endDate,
      tasks: todoList,
    };
    const result = await postChallenge(challenge);
    setChallengeList([...challengeList, result]);
  } else {
    const challenge = {
      author: window.user._id,
      title: title,
      description: description,
      startDate: startDate,
      endDate: endDate,
      tasks: todoList,
    };
    const result = await patchChallenge(challengeEditingIndex, challenge)
    const updatedChallengeList = [...challengeList];
    challengeList[challengeEditingIndex] = result;
    setChallengeList(updatedChallengeList);
    setChallengeEditingIndex(-1);
  }
  storePreviousValues();
  renderChallengeList();
  document.getElementById('challengeModal').style.display = 'none';
  alertMessageElement.style.display = 'none';
  restorePreviousValues();
  setIsEditing(false);
})

const renderChallengeList = async () => {
  const challengeListDiv = document.getElementById("challengeList");
  challengeListDiv.innerHTML = "";
  challengeList = await getChallenges();
  setChallengeList(challenges);
  const fragment = document.createDocumentFragment();
  challengeList.forEach((item, index) => {
    const challengeItemDiv = document.createElement("div");
    challengeItemDiv.className = "challenge-item";
    const statusSpan = document.createElement("span");
    if (new Date() < new Date(item.startDate)) {
      statusSpan.innerText = `${Math.ceil((new Date(item.startDate) - new Date()) / (1000 * 60 * 60 * 24))}일 후 시작`;
    } else if (new Date(item.startDate) <= new Date() && new Date() <= new Date(item.endDate)) {
      statusSpan.innerText = '진행중';
    } else {
      statusSpan.innerText = '종료';
    }
    const challengeText = document.createElement("span");
    challengeText.innerText = `${item.title}\n${item.startDate} ~ ${item.endDate}`;

    challengeItemDiv.appendChild(statusSpan);
    challengeItemDiv.appendChild(challengeText);
    challengeItemDiv.addEventListener('click', () => {
      openChallengeModal(item, index);
    });
    fragment.appendChild(challengeItemDiv);
  });
  challengeListDiv.appendChild(fragment);
};
const openChallengeModal = async (challenge, index) => {
    document.getElementById('challengeModal').style.display = 'block';
    if (new Date() > challenge.endDate) {
      alertMessageElement.innerText = '종료된 챌린지는 수정이나 삭제가 불가합니다'
      alertMessageElement.style.display = 'block';
      return;
    }
    if (challenge.author === window.user._id) {
      const editButton = document.createElement("button");
      editButton.innerText = "수정하기";
      editButton.addEventListener("click", () => {
        setChallenge({
          title: challenge.title,
          description: challenge.description,
          startDate: challenge.startDate,
          endDate: challenge.endDate,
          tasks : challenge.setTasks
        })
        setChallengeEditingIndex(index);
        renderTodoList(true);
      });
      const deleteButton2 = document.createElement("button");
      deleteButton2.innerText = "삭제하기";
      deleteButton2.addEventListener("click", async () => {
        document.getElementById('challengeModal').style.display = 'none';
        await deleteChallenge(challenge.challengeId)
        challengeList.splice(index, 1);
        renderChallengeList();
      })
    }
    else {
      renderTodoList(false);
    }
}
const renderTodoList= async(isEditing) => {
  todoListElement.innerText = '';
  todoList = await getTodoList(challenge.challengeId);
  todoList.forEach((todo, index) => {
    const li = document.createElement('li');
    li.innerText = todo;
    if (isEditing) {
      const deleteButton = document.createElement('button');
      deleteButton.innerText = 'X';
      deleteButton.addEventListener('click', async ()=> {
        await deleteTodoList(challenge.challengeId, todo);
        todoList.splice(index, 1);
        setTasks(todoList);
        renderTodoList(true);
      })
      li.appendChild(deleteButton);
    }
    todoListElement.appendChild(li);
  })
}

const getTodoList = async (challengeId) => {
  try {
    const response = await axios.get(`/challenges/${challengeId}`);
    return response.data;
  } catch (error) {
    console.error('Error:', error);
  }
};

const getChallenges = async () => {
  try {
    const response = await axios.get('/challenges');
    return response.data;
  } catch (error) {
    console.error('Error:', error);
  }
};

const postChallenge = async (challenge) => {
  try {
    const response = await axios.post('/challenges', challenge, {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  } catch (error) {
    console.error('Error:', error);
  }
};


const patchChallenge = async (index, challenge) => {
  try {
    const response = await axios.patch(`/challenges/${challenge.challengeId}`, challenge, {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  } catch (error) {
    console.error('Error:', error);
  }
};

const deleteChallenge = async (challengeId) => {
  try {
    const response = await axios.delete(`/challenges/${challengeId}`);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
  }
};

const deleteTodoList = async (challengeId, item) => {
  try {
    const response = await axios.delete(`/challenges/${challengeId}/${item.id}`);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
  }
};