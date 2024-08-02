import React from 'react';

// import Locations from '../components/Location/Locations'
// import LocationPage from '../components/Location/LocationPage';
// import LocationDetail from '../components/Location/LocationDetail';
// import LocationSelect from '../components/Location/LocationSelect';
import DataFetcher from '../components/DataFetcher';

function MyPage() {
  return (
    <div
      style={{
        textAlign: "center"
      }}
    >
      <h1>마이 페이지</h1>
      <p>임시 데이터 집하장입니다</p>

      <DataFetcher />
    </div>
  );
}

export default MyPage;
