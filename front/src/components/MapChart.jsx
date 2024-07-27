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
        ]; //데이터를 수정하여 보여지는 내용 변경

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
          colorAxis: {
            min: 0
          },
          series: [{ //이곳에 박스안의 내용 표시
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