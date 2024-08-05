import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProgressBar from "@ramonak/react-progress-bar";
import axios from 'axios';
import '../../styles/ChallengeDetail.css';

axios.defaults.withCredentials = true;

function ChallengeDetail() {
  const { id } = useParams();
  const [challenge, setChallenge] = useState(null);
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  //원본
  //useEffect(() => {
  //  fetch(`http://localhost:8080/challenges/${id}`)
  //    .then(response => response.json())
  //    .then(data => {
  //      setChallenge(data.challenge);
  //      setTasks(data.tasks);
  //    })
  //    .catch(error => console.error('Error fetching challenge:', error));
  //}, [id]);

  //Axios 사용
  // useEffect(() => {
  //  const fetchChallenge = async () => {
  //    try {
  //      const response = await axios.get(`http://localhost:8080/challenges/${id}`);
  //      const data = response.data;
  //      setChallenge(data.challenge);
  //      setTasks(data.tasks);
  //   } catch (error) {
  //      console.error('Error fetching challenge:', error);
  //    }
  //  };
  
  //  fetchChallenge();
  // }, [id]);

  //로컬스토리지
  useEffect(()=> {
    const challenges = JSON.parse(localStorage.getItem('challenges'));
    const selectedChallenge = challenges.find(challenge => challenge.id === parseInt(id));
    const selectedTask = selectedChallenge.tasks;

    if (selectedChallenge) {
      setChallenge(selectedChallenge);
      setTasks(selectedTask);
      console.log(tasks);
    }
  }, [id]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm('챌린지를 삭제하시겠습니까?');
    if (confirmDelete) {
      //원본
      //try {
      //  const response = await fetch(`http://localhost:8080/challenges/${id}`, {
      //    method: 'DELETE',
      //  });
      //  if (response.ok) {
      //    navigate('/challenges');
      //  } else {
      //    console.error('Error deleting challenge');
      //  }
      //} catch (error) {
      //  console.error('Error deleting challenge:', error);
      //}

      //Axios 사용
      // try {
      //  const response = await axios.delete(`http://localhost:8080/challenges/${id}`);
      
      //  if (response.status === 200) {
      //    navigate('/challenges');
      //  } else {
      //    console.error('Error deleting challenge');
      //  }
      // } catch (error) {
      //  console.error('Error deleting challenge:', error);
      // }

      //로컬스토리지 사용
      try {
        // 기존 데이터 가져오기
        const storedChallenges = JSON.parse(localStorage.getItem('challenges')) || [];
        const updatedChallenge = storedChallenges.filter(challenge => challenge.id !== parseInt(id));
        // 업데이트된 데이터를 로컬스토리지에 저장
        localStorage.setItem('challenges', JSON.stringify(updatedChallenge));
        // 챌린지 페이지로 이동
        navigate('/challenges');
      } catch (error) {
        console.error('Error creating challenge:', error);
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

  function calculateDaysLeft(start_date) {
    const today = new Date();
    const startDate = new Date(start_date);
    const timeDiff = startDate - today;
    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return daysLeft;
  }

  if (!challenge) {
    return <p>Loading...</p>;
  }

  const count = tasks.length;
  const completedCount = tasks.filter(task => task.is_completed).length;

  return (
    <div className='detail'>
      <h1>{challenge.title}</h1>
      <span>
                {
                  calculateDaysLeft(challenge.start_date) >= 1
                  ? <div>{calculateDaysLeft(challenge.start_date)}일 후 시작</div>
                  : ( calculateDaysLeft(challenge.end_date) < 0
                      ? <div>종료</div>
                      : <div>진행중</div>
                    )
                }
              </span>
      <p>{formatDate(challenge.start_date)} ~ {formatDate(challenge.end_date)}</p>
      <p className="desc">{challenge.description}</p>
      
      <ul className="to-dos">
        {tasks.map((task, index) => (
          <li key={index}>
            <input
              type="checkbox"
              checked={task.is_completed}
              readOnly
            /> {task.description}
          </li>
        ))}
      </ul>

      <div>
        <button onClick={handleEdit}>수정하기</button>
        <button onClick={handleDelete}>삭제하기</button>
      </div>
      
      <div className="progress">
        <p>달성률</p>
        <ProgressBar
          completed={completedCount}
          maxCompleted={count}
          customLabel={`${Math.round(completedCount/count*100)}%`}
          width="500px"
          height='16px'
          baseBgColor='#EDEDED'
          bgColor='linear-gradient(to right, #CDEDFF, #00A3FF)'
        />
      </div>
    </div>
  );
}

export default ChallengeDetail;
