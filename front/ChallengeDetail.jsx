import React from 'react';
import { useParams } from 'react-router-dom';

const ChallengeDetail = () => {
  const { id } = useParams();
  const challenge = challengeData[id];

  if (!challenge) {
    return <div>챌린지를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="challenge-detail">
      <h2>{challenge.title}</h2>
      <span className='status'>
        {new Date() < new Date(startDate) ? '시작 예정' : new Date(startDate) <= new Date() <= new Date(endDate) ? '진행 중' : '종료'}
      </span>
      <p>{challenge.startDate}~{challenge.endDate}</p>
      <p>{challenge.description}</p>
      challenge.tasks.map((task) => {
        <div>task\n</div>
      })
    </div>)
}