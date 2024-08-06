<<<<<<< HEAD
import React from "react";
import { Route, Routes } from 'react-router-dom';
import ChallengeList from "../components/Challenges/ChallengeList";
import ChallengeCreate from "../components/Challenges/ChallengeCreate";
import ChallengeDetail from "../components/Challenges/ChallengeDetail";
import ChallengeEdit from "../components/Challenges/ChallengeEdit";


function Challenges() {
=======
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ChallengeDetail from '../components/Challenges/ChallengeDetail';
import ChallengeCreate from '../components/Challenges/ChallengeCreate';
import ChallengeEdit from '../components/Challenges/ChallengeEdit';
import ChallengeList from '../components/Challenges/ChallengeList';

const Challenges = () => {
>>>>>>> 124c619ac73743e5ffd182bc9693d1cdd2a113f7
  return (
    <div>
      <Routes>
        <Route path="/" element={<ChallengeList />} />
        <Route path="create" element={<ChallengeCreate />} />
        <Route path=":id" element={<ChallengeDetail />} />
        <Route path="edit/:id" element={<ChallengeEdit />} />
      </Routes>
    </div>
  );
<<<<<<< HEAD
}

export default Challenges;
=======
};

export default Challenges;
>>>>>>> 124c619ac73743e5ffd182bc9693d1cdd2a113f7
