import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function ChallengeList() {
  const [challenges, setChallenges] = useState([]);
  const [search, setSearch] = useState('');

  const fetchChallenges = (searchQuery = '') => {
    fetch(`http://localhost:8080/challenges?search=${searchQuery}`)
      .then(response => response.json())
      .then(data => setChallenges(data.challenges))
      .catch(error => console.error('Error fetching challenges:', error));
  };

  useEffect(() => {
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

  return (
    <div>
      <h1>친환경 챌린지</h1>
      <form onSubmit={handleSearchSubmit}>
        <input
          type="text"
          placeholder="챌린지 검색"
          value={search}
          onChange={handleSearchChange}
        />
        <button type="submit">검색하기</button>
      </form>
      <button>
        <Link to="/challenges/create">챌린지 만들기</Link>
      </button>
      <ul>
        {challenges.map(challenge => (
          <li key={challenge.id}>
            <Link to={`/challenges/${challenge.id}`}>
              {challenge.title} ({formatDate(challenge.start_date)} ~ {formatDate(challenge.end_date)})
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ChallengeList;
