import axios from 'axios';
const [isEditing, setIsEditing] = useState(false);
export const renderTodoList= async(isEditing) => {
  let todoListElement = document.createElement('ul')
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
export const getTodoList = async (challengeId) => {
  try {
    const response = await axios.get(`/challenges/${challengeId}`);
    return response.data;
  } catch (error) {
    console.error('Error:', error);
  }
};
export const deleteTodoList = async (challengeId, item) => {
  try {
    const response = await axios.delete(`/challenges/${challengeId}/${item.id}`);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
  }
};
