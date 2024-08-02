import React, { useState, useRef } from 'react'20.
const [challenge, setChallenge] = useState({
  title: '',
  description: '',
  startDate: '',
  endDate: '',
  tasks: []
});
const [challengeEditingIndex, setChallengeEditingIndex] = useState(-1);
const [todoInputs, setTodoInputs] = useState(['', '', '', '', '']);
const [previousValues, setPreviousValues] = useState({});
const [alertMessage, setAlertMessage] = useState('');
const MyComponent = () => {
  const [isMainModalOpen, setIsMainModalOpen] = useState(false);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const titleRef = useRef(null); // useRef 훅으로 참조 생성
  const descriptionRef = useRef(null);
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false)
  const openMainModal = () => {
    setIsMainModalOpen(true);
    storePreviousValues();
  }
  const closeMainModal = () => {
    setIsMainModalOpen(false);
    setAlertMessage('')
    restorePreviousValues();
  }
  const openSubModal = () => {
    setIsSubModalOpen(true);
  }
  const closeSubModal = () => {
    setIsSubModalOpen(false);
  }
  const handleInputChange = (index, value) => {
    const newTodoInputs = [...todoInputs];
    newTodoInputs[index] = value; // 입력된 값으로 업데이트
    setTodoInputs(newTodoInputs);
  };


  const handleAddTodo = () => {
    const cleanedTodoList = todoInputs.filter((item) => item.trim() !== '');

    if (cleanedTodoList.length < 2) {
      setAlertMessage('최소 두 개의 할일을 만들어 주세요.');
      return;
    }
    setTodoInputs([...cleanedTodoList]);
    setIsSubModalOpen(false); // 서브 모달 닫기
    renderTodoList(true)

  };
  const handleSubmit = async(e) => {
    e.preventDefault();
    const title = titleRef.current.value.trim();
    const description = descriptionRef.current.value.trim();
    const startDate = startDateRef.current.value;
    const endDate = endDateRef.current.value;
    if (new Date(startDate) > new Date(endDate)) {
      alert('시작 날짜는 끝 날짜보다 이전이어야 합니다.');
      return;
    }
    if(!title||!description||!startDate||!endDate||!todoInputs) {
      alert('모든 필드를 입력해주세요.')
      return;
    }
    if (challengeEditingIndex === -1) {
      const challenge = {
        author: window.user._id,
        title: title,
        description: description,
        startDate: startDate,
        endDate: endDate,
        tasks: todoInputs,
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
        tasks: todoInputs,
      };
      const result = await patchChallenge(challengeEditingIndex, challenge)
      const updatedChallengeList = [...challengeList];
      challengeList[challengeEditingIndex] = result;
      setChallengeList(updatedChallengeList);
      setChallengeEditingIndex(-1);
    }
    storePreviousValues();
    renderChallengeList();
    handleHideElements();
  }
  const handleHideElements = () => {
    setIsMainModalOpen(false);
    setAlertMessage(false);
    restorePreviousValues();
    setIsEditing(false);
  }
 
  return (
    <div>
      <button onClick={openMainModal} id="challengeMakeBtn">
        챌린지 만들기
      </button>
      {isMainModalOpen && (
        <div className="modal">
          <h3>
            챌린지 만들기
          </h3>
          <form id = 'challenge-form' onSubmit={handleSubmit}>
            <input type="text" ref={titleRef} placeholder='챌린지 제목을 입력해주세요.'/>
            <input type="text" ref={descriptionRef} placeholder='챌린지 설명을 입력해주세요.'/>
            <div>
              <input type="date" ref={startDateRef} placeholder='챌린지 시작일'/>
              <input type="date" ref={endDateRef} placeholder='챌린지 종료일'/>
            </div>
            {alertMessage && (
              <div id="alertMessageElement" style={{color:'red'}}>
                {alertMessage}
              </div>)}
            <button id = "addTodoList" onClick={openSubModal}>
              할 일 만들기
            </button>
            {isSubModalOpen && (
            <div>
              <h4> 할 일 만들기</h4>
              <button id = 'cancelTodoInputs' onClick={closeSubModal}>X</button>
            </div>
            <div> 할 일은 최대 5개까지 생성 가능합니다.</div>
            <div id="subModal">
              {todoInputs.map((input, index) => (
                <input
                  key={index} // React의 key 속성은 배열을 렌더링할 때 필요
                  type="text"
                  value={input} // 입력 필드의 값
                  onChange={(e) => handleInputChange(index, e.target.value)} // 값 변경 핸들러
                  placeholder={`할 일 목록 ${index + 1}`}
                />
              ))}
            </div>
            <button type="button" onClick={handleAddTodo}>
              저장하기
            </button>
            )}
          <div>
            <button id = "cancelChallengeBtn" onClick={closeMainModal}>취소하기</button>
            <button id = "challengeForm" onClick={handleSubmit}>만들기</button>
          </div>
        </form>
      </div> 
    )}
    </div>
  )
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