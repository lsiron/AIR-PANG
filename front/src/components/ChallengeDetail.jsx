import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ChallengeDetail() {
  const { id } = useParams();
  const [challenge, setChallenge] = useState(null);
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:8080/challenges/${id}`, {credentials: 'include'})
      .then(response => response.json())
      .then(data => {
        setChallenge(data.challenge);
        setTasks(data.tasks);
      })
      .catch(error => console.error('Error fetching challenge:', error));
  }, [id]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm('챌린지를 삭제하시겠습니까?');
    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost:8080/challenges/${id}`, {
          method: 'DELETE',
          credentials: 'include'
        });
        if (response.ok) {
          navigate('/challenges');
        } else {
          console.error('Error deleting challenge');
        }
      } catch (error) {
        console.error('Error deleting challenge:', error);
      }
    }
  };

  const handleEdit = () => {
    navigate(`/challenges/edit/${id}`);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('ko-KR', options);
  };

  if (!challenge) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>{challenge.title}</h1>
      <p>{challenge.description}</p>
      <p>시작일: {formatDate(challenge.start_date)}</p>
      <p>종료일: {formatDate(challenge.end_date)}</p>
      <h2>할 일 목록</h2>
      <ul>
        {tasks.map((task, index) => (
          <li key={index}>{task.description} - {task.is_completed ? '완료' : '미완료'}</li>
        ))}
      </ul>
      <button onClick={handleEdit}>수정하기</button>
      <button onClick={handleDelete}>삭제하기</button>
    </div>
  );
}

export default ChallengeDetail;
