import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function ChallengeEdit() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [tasks, setTasks] = useState([]);
  const [modalTasks, setModalTasks] = useState(['', '', '', '', '']);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:8080/challenges/${id}`)
      .then(response => response.json())
      .then(data => {
        setTitle(data.challenge.title);
        setDescription(data.challenge.description);
        setStartDate(data.challenge.start_date.split('T')[0]);
        setEndDate(data.challenge.end_date.split('T')[0]);
        setTasks(data.tasks.map(task => task.description));
      })
      .catch(error => console.error('Error fetching challenge:', error));
  }, [id]);

  const handleTaskChange = (index, value) => {
    const newTasks = [...modalTasks];
    newTasks[index] = value;
    setModalTasks(newTasks);
  };

  const handleSaveTasks = () => {
    setTasks(modalTasks.filter(task => task.trim() !== ''));
    setModalOpen(false);
  };

  const handleOpenModal = () => {
    setModalTasks(tasks.length > 0 ? tasks.concat(Array(5 - tasks.length).fill('')) : ['', '', '', '', '']);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (new Date(endDate) < new Date(startDate)) {
      alert('종료일은 시작일보다 이전 날짜일 수 없습니다.');
      return;
    }

    const filteredTasks = tasks.filter(task => task.trim() !== '');

    if (filteredTasks.length === 0) {
      alert('최소 1개의 할 일을 추가해야 합니다.');
      return;
    }

    const updatedChallenge = {
      title,
      description,
      start_date: startDate,
      end_date: endDate,
      tasks: filteredTasks.map(task => ({ description: task, is_completed: false })),
    };

    try {
      const response = await fetch(`http://localhost:8080/challenges/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedChallenge),
      });

      if (response.ok) {
        navigate('/challenges');
      } else {
        console.error('Error updating challenge');
      }
    } catch (error) {
      console.error('Error updating challenge:', error);
    }
  };

  return (
    <div>
      <h1>챌린지 수정하기</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>제목</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <label>설명</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
        <div>
          <label>시작일</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
        </div>
        <div>
          <label>종료일</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
        </div>
        <div>
          <label>할 일</label>
          <button type="button" onClick={handleOpenModal}>할 일 수정하기</button>
          <ul>
            {tasks.map((task, index) => (
              <li key={index}>{task}</li>
            ))}
          </ul>
        </div>
        <button type="submit">저장하기</button>
      </form>
      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>할 일 수정하기</h2>
            {modalTasks.map((task, index) => (
              <input
                key={index}
                type="text"
                value={task}
                onChange={(e) => handleTaskChange(index, e.target.value)}
                placeholder={`할 일 ${index + 1}`}
              />
            ))}
            <button onClick={handleSaveTasks}>저장하기</button>
            <button onClick={() => setModalOpen(false)}>취소</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChallengeEdit;
