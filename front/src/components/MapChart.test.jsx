import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import highchartsMap from 'highcharts/modules/map';
import proj4 from 'proj4';
import MapModal from './MapModal';
// import axios from 'axios';  // axios 라이브러리 사용

// 라이브러리 추가: npm install highcharts highcharts-react-official @types/highcharts proj4

// Highcharts 맵 모듈 초기화
if (typeof window !== 'undefined') {
  highchartsMap(Highcharts);
}

// proj4 설정 (맵 프로젝션에 필요)
if (typeof window !== 'undefined') {
  window.proj4 = proj4;
}

Highcharts.setOptions({
  credits: {
    enabled: false
  }
});

const MapChart = () => {
  const [mapOptions, setMapOptions] = useState({
    chart: {
      map: null,
      height: 600
    }
  });

  // const handleRegionClick = (e) => {
  //   const regionName = e.point.name;
  //   const newWindow = window.open('', '_blank'); //새 창 속성
  //   newWindow.document.write(`<h2>${regionName}</h2>`); //새 창에서 보여질 내용
  //   newWindow.document.title = `${regionName}`; //새 창의 타이틀 
  // };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('');

  const handleRegionClick = (e) => {
    const regionName = e.point.name;
    setSelectedRegion(regionName);
    setIsModalOpen(true);
  };

  // const handleRegionClick = async (e) => {
  //   const regionName = e.point.name;
  //   setSelectedRegion(regionName);
    
  //   try {
  //     const { data } = await axios.get(`http://your-backend-url/api/region-detail/${regionName}`);
  //     setRegionData(prevData => ({...prevData, [regionName]: data}));
  //   } catch (error) {
  //     console.error("Error fetching region detail:", error);
  //   }
  
  //   setIsModalOpen(true);
  // };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       // 토폴로지 데이터 가져오기
  //       const topology = await import('../json/kr-all.topo.json');
  
  //       // 서버에서 지역 데이터 가져오기
  //       const { data } = await axios.get('http://your-backend-url/api/region-data'); // 백엔드 주소, 데이터 경로
  
  //       setRegionData(data);

  useEffect(() => {
    const fetchTopology = async () => {
      try {
        // 로컬 파일 import
        const topology = await import('../json/kr-all.topo.json');

        const data = [
          ['kr-4194', 10], ['kr-kg', 11], ['kr-cb', 12], ['kr-kn', 13],
          ['kr-2685', 14], ['kr-pu', 15], ['kr-2688', 16], ['kr-sj', 17],
          ['kr-tj', 18], ['kr-ul', 19], ['kr-in', 20], ['kr-kw', 21],
          ['kr-gn', 22], ['kr-cj', 23], ['kr-gb', 24], ['kr-so', 25],
          ['kr-tg', 26], ['kr-kj', 27]
        ]; 
        //데이터를 수정하여 보여지는 내용 변경 ['id', 값]
        // ['kr-4194', ], ['kr-kg', ], ['kr-cb', ], ['kr-kn', ],
        // ['kr-2685', ], ['kr-pu', ], ['kr-2688', ], ['kr-sj', ],
        // ['kr-tj', ], ['kr-ul', ], ['kr-in', ], ['kr-kw', ],
        // ['kr-gn', ], ['kr-cj', ], ['kr-gb', ], ['kr-so', ],
        // ['kr-tg', ], ['kr-kj', ]

        setMapOptions({
          chart: {
            map: topology.default,  // .default를 사용하여 실제 데이터에 접근
            height: 600
          },
          title: {
            text: undefined
          },
          mapNavigation: {
            enabled: true,
            buttonOptions: {
              verticalAlign: 'bottom'
            }
          },
          // 차트 아래 수치별 색상표 
          // colorAxis: {
          //   min: 0
          // },
          
          //이곳에 박스안의 내용 표시
          series: [{ 
            data: data,
            name: '지역별 기후',
            states: {
              hover: {
                color: '#BADA55'
              }
            },
            dataLabels: {
              enabled: true,
              format: '{point.name}'
            },
            point: {
              events: {
                click: handleRegionClick
              }
            }
          }]
        });
      } catch (error) {
        console.error("Error loading topology:", error);
      }
    };

    fetchTopology();
  }, []);

  return (
    <div>
      <HighchartsReact
        highcharts={Highcharts}
        options={mapOptions}
        constructorType={'mapChart'}
      />
      <MapModal isOpen={isModalOpen} onClose={closeModal}>
        <h2>{selectedRegion}</h2>
        <p>지역별 추가 정보 표시</p>
      </MapModal>
    </div>
  );
};

export default MapChart;