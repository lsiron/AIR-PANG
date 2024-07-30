const [
  challengeCloseBtn,
  challengeMakeBtn,
  challengeForm,
  challengeTitleInput,
  challengeDescriptionInput,
  challengeStartDateInput,
  challengeEndDateInput,
  todoInput,
  addTodoList,
  challengeShowList,
  todoListElement,
] = document.querySelectorAll("[id^=challenge-form]");
let challengeList=[];
let challengeEditingIndex = -1;
let challenge = {};
let canEditAndDelete = false;
const todoList = [];
let isEditing = false;
const alertMessageElement = documnet.getElementById('alertMessage');

document.getElementById('challengeCloseBtn').addEventListener("click", () => {
  document.getElementById('challengeModal').style.display= 'none';
  alertMessageElement.style.display = 'none'
})


document.getElementById('challengeMakeBtn').addEventListener('click', ()=> {
  document.getElementById('challengeModal').style.display = 'block';
})

document.getElementById('addTodoList').addEventListener('click', () => {
  const todo = todoInput.value
  if (todo) {
    todoList.push(todo);
    renderTodoList(true);
    todoInput.value = '';
  }
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

  if(!title||!description||!startDate||!endDate) {
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
      todoList: todoList,
      canEditAndDelete: true,
    };
    const result = await postChallenge(challenge);
    challengeList.push(result);
  } else {
    const challenge = {
      author: window.user._id,
      title: title,
      description: description,
      startDate: startDate,
      endDate: endDate,
      todoList: todoList,
      canEditAndDelete: true,
      challengeId: challengeList[challengeEditingIndex].challengeId
    };
    const result = await putChallenge(challengeEditingIndex, challenge)
    challengeList[challengeEditingIndex] = result;
    challengeEditingIndex = -1;
  }
  renderChallengeList();
  document.getElementById('challengeModal').style.display = 'none';
  alertMessageElement.style.display = 'none';
  isEditing = false;
})

const renderChallengeList = async () => {
  const challengeListDiv = document.getElementById("challengeList");
  challengeListDiv.innerHTML = "";
  challengeList = await getChallenges();
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
        challengeTitleInput.value = challenge.title;
        challengeDescriptionInput.value = challenge.description;
        challengeStartDateInput.value = challenge.startDate;
        challengeEndDateInput.value = challenge.endDate;
        challengeEditingIndex = index;
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
        renderTodoList();
      })
      li.appendChild(deleteButton);
    }
    todoListElement.appendChild(li);
  })
}

const getTodoList = async (challengeId) => {
  try {
    const response = await fetch(`/challenges/${challengeId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error:', error);
  }
}

const getChallenges = async () => {
  try {
      const response = await fetch('/challenges', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
      });
      const result = await response.json();
      return result;
  } catch (error) {
      console.error('Error:', error);
  }
};

const postChallenge = async (challenge) => {
  try {
      const response = await fetch('/challenges', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(challenge)
      });
      const result = await response.json();
      return result;
  } catch (error) {
      console.error('Error:', error);
  }
};


const challengeJoin = async (id, challengeId) => {
  try {
      const response = await fetch(`/challenges/${challengeId}/join`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: id })
      });
      const result = await response.json();
      return result;
  } catch (error) {
      console.error('Error:', error);
  }
};

const putChallenge = async (index, challenge) => {
  try {
    const response = await fetch(`/challenges/${challenge.challengeId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(challenge)
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error:', error);
  }
}

const deleteChallenge = async (challengeId) => {
  try {
    const response = await fetch(`/challenges/${challengeId}`, {
      method: 'DELETE'
    })
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error:", error);
  }
}
const deleteTodoList = async (challengeId, item) => {
  try {
    const response = await fetch(`/challenges/${challengeId}/${item.id}`, {
      method: 'DELETE'
    })
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error:", error);
  }
}