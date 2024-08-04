import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../../styles/ChallengeList.css';

axios.defaults.withCredentials = true;

function ChallengeList() {
  const [challenges, setChallenges] = useState([]);
  const [search, setSearch] = useState('');

  //원본
  //const fetchChallenges = (searchQuery = '') => {
  //  fetch(`http://localhost:8080/challenges?search=${searchQuery}`)
  //    .then(response => response.json())
  //    .then(data => setChallenges(data.challenges))
  //    .catch(error => console.error('Error fetching challenges:', error));
  //};

  // //Axios 사용
  // const fetchChallenges = async (searchQuery = '') => {
  //  try {
  //    const response = await axios.get(`http://localhost:8080/challenges?search=${searchQuery}`);
  //    setChallenges(response.data.challenges);
  //  } catch (error) {
  //    console.error('Error fetching challenges:', error);
  //  }
  // };

  //로컬스토리지 사용
  const fetchChallenges = async () => {
    try {
      // 로컬 스토리지에서 데이터 가져오기
      const cachedData = JSON.parse(localStorage.getItem('challenges'));
      setChallenges(cachedData);
    } catch (error) {
      console.error('Error fetching challenges:', error);
    }
  };
  
  useEffect(() => {
    if (!localStorage.getItem('challenges')) {
      localStorage.setItem("challenges", JSON.stringify([{
        "id": 1,
        "challenge_id": 1,
        "title": "친환경 생활 실천",
        "description": "일주일 동안 플라스틱 사용 줄이기",
        "start_date": "2024-07-01",
        "end_date": "2024-08-01",
        "tasks": [
          {
            "description": "분리수거 하기",
            "is_completed": true
          },
          {
            "description": "포장하기",
            "is_completed": false
          }
        ]
      }, {
        "id": 2,
        "challenge_id": 1,
        "title": "대중교통 이용",
        "description": "자가 대신 대중교통 이용하기",
        "start_date": "2024-08-01",
        "end_date": "2024-09-01",
        "tasks": [
          {
            "description": "버스 타기",
            "is_completed": true
          },
          {
            "description": "지하철 타기",
            "is_completed": false
          },
          {
            "description": "자전거 타기",
            "is_completed": false
          }
        ]
      }]));
   } //중요!! 로컬스토리지에 챌린지 하나 만들어두기
   fetchChallenges(); // 페이지 로드 시 모든 챌린지 불러오기
  }, []);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchChallenges(search); // 검색어에 맞는 챌린지 리스트 불러오기
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

  return (
    <div className="ChallengeList">
      <h1>챌린지</h1>
      <form className="search" onSubmit={handleSearchSubmit}>
        <input
          type="text"
          placeholder="챌린지를 검색해보세요."
          value={search}
          onChange={handleSearchChange}
        />
        <button type="submit">찾기</button>
      </form>
      <button className="createChallenge">
        <Link to="/challenges/create">챌린지 만들기</Link>
      </button>
      <ul className="Challenges">
        {challenges.map(challenge => (
          <li key={challenge.id}>
            <Link to={`/challenges/${challenge.id}`}>
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
              <h3>{challenge.title}</h3>
              <p>{formatDate(challenge.start_date)} ~ {formatDate(challenge.end_date)}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ChallengeList;
