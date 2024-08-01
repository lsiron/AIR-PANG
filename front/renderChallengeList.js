import axios from 'axios';
const [challengeList, setChallengeList] = useState([]);
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
          tasks : challenge.tasks
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

const getChallenges = async () => {
  try {
    const response = await axios.get('/challenges');
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
module.exports = {
  renderChallengeList,
  openChallengeModal,
  getChallenges,
  deleteChallenge,
}