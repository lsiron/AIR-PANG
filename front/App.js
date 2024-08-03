import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ChallengeList from './ChallengeList';
import ChallengeDetail from './ChallengeDetail';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={ChallengeList} />
        <Route path="/challenge/:id" component={ChallengeDetail} />
      </Switch>
    </Router>
  );
};

export default App;