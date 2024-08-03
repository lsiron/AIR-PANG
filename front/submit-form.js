import axios from 'axios';
const [challengeEditingIndex, setChallengeEditingIndex] = useState(-1);
const [
  challengeTitleInput,
  challengeDescriptionInput,
  challengeStartDateInput,
  challengeEndDateInput,
] = document.querySelectorAll("[id^=challenge-form]");
const [isEditing, setIsEditing] = useState(false);
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
    setCrhallengeEditingIndex(-1);
  }
  storePreviousValues();
  renderChallengeList();
  document.getElementById('challengeModal').style.display = 'none';
  alertMessageElement.style.display = 'none';
  restorePreviousValues();
  setIsEditing(false);
})

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