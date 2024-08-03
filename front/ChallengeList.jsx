import React from 'react';
import { Link } from 'react-router-dom';
const challengeList = () => {
  return (
    <div className = "challenge-list">
      <h2>챌린지</h2>
      {challengeList.map((challenge) => (
        <Link to = {`/challenge/${challenge.id}`} key={challenge.id} className="challenge-card">
          <h4>{challenge.title}</h4>
          <p>{new Date() < new Date(startDate) ? '시작 예정' : new Date(startDate) <= new Date() <= new Date(endDate) ? '진행 중' : '종료'}</p>
        </Link>
      ))}
    </div>
  )
}