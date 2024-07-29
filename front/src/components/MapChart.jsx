import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import highchartsMap from 'highcharts/modules/map';
import proj4 from 'proj4';

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

  const handleRegionClick = (e) => {
    const regionName = e.point.name;
    const newWindow = window.open('', '_blank'); //새 창 속성
    newWindow.document.write(`<h2>${regionName}</h2>`); //새 창에서 보여질 내용
    newWindow.document.title = `${regionName}`; //새 창의 타이틀 
  };

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
            name: '지역명',
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
    </div>
  );
};

export default MapChart;