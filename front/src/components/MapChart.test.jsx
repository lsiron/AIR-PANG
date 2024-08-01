import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import highchartsMap from 'highcharts/modules/map';
import proj4 from 'proj4';
import axios from 'axios';
import MapModal from './MapModal';
import mapDataKorea from '../data/kr-all.topo.json';

// 라이브러리 추가: npm install highcharts highcharts-react-official @types/highcharts proj4 axios

// Highcharts 맵 모듈 초기화
if (typeof window !== 'undefined') {
  highchartsMap(Highcharts);
}

// proj4 설정 (좌표계를 활용한 맵 프로젝션에 필요)
if (typeof window !== 'undefined') {
  window.proj4 = proj4;
}

Highcharts.setOptions({
  credits: {
    enabled: false
  }
});

// 날씨 데이터 요청 및 가공
const fetchWeatherData = async (regions) => {
  const API_KEY = 'K%2FZNcLjvnoyL3EcLLkqnWCJ1YA%2BcJz2SUZFC%2BeYY167cLcK5LV0LerMNhhoSI%2FohsNrsSwFz5OisyRPa7Yw%2FZg%3D%3D';
  const BASE_URL = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst';

  const paramsList = regions.map(region => ({
    base_date: '20240731',  // 날짜를 적절히 설정하세요
    base_time: '0600',      // 시간을 적절히 설정하세요
    nx: region.nx,
    ny: region.ny
  }));

  try {
    const weatherData = await Promise.all(paramsList.map(async (params) => {
      const response = await axios.get(BASE_URL, {
        params: {
          serviceKey: API_KEY,
          numOfRows: '10',
          pageNo: '1',
          dataType: 'JSON',
          ...params
        }
      });
      const items = response.data.response.body.items.item;
      return items
        .filter(item => item.category === 'T1H') // 'T1H' 항목만 필터링
        .map(item => ({
          region: mapRegionCodeToHighchartsCode(params.nx, params.ny),
          temperature: parseFloat(item.obsrValue)
        }));
    }));

    const processedData = weatherData.flat().map(item => [
      item.region,
      item.temperature
    ]);

    return processedData;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return [];
  }
};

// 좌표를 Highcharts 코드로 변환
const mapRegionCodeToHighchartsCode = (nx, ny) => {
  const region = mapDataKorea.objects['kr-all'].geometries.find(geo => {
    return geo.properties['hc-middle-lon'] === ny && geo.properties['hc-middle-lat'] === nx;
  });

  if (region) return region.properties['hc-key'];
  return 'kr-4194';  // 기본값
};

const MapChart = () => {
  const [mapOptions, setMapOptions] = useState({
    chart: {
      map: null,
      height: 600
    }
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('');

  const handleRegionClick = (e) => {
    const regionName = e.point.name;
    setSelectedRegion(regionName);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const topology = await import('../data/kr-all.topo.json');

        const regions = topology.objects['kr-all'].geometries.map(geo => ({
          nx: geo.properties['hc-middle-lat'],
          ny: geo.properties['hc-middle-lon']
        }));

        const weatherData = await fetchWeatherData(regions);

        setMapOptions({
          chart: {
            map: topology.default,
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
          series: [{
            data: weatherData,
            name: '기온',
            states: {
              hover: {
                color: '#BADA55'
              }
            },
            dataLabels: {
              enabled: true,
              format: '{point.name}: {point.value}°C'
            },
            point: {
              events: {
                click: handleRegionClick
              }
            }
          }]
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
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
