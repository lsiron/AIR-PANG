import axios from 'axios';
import cron from 'node-cron';
import connection from '@_config/db.config';
import loadLocations from './loadLocations';
import type { AirQualityItem } from '@_types/location';

if (!process.env.LOCATION_API_KEY) {
  throw new Error('LOCATION_API_KEY is not defined');
}

const API_KEY = encodeURIComponent(process.env.LOCATION_API_KEY)

const fetchAndStoreData = async () => {
  const connectionPromise = connection.promise();

  try {
    const locations = await loadLocations();
    const provinces = Array.from(new Set(locations.map(loc => loc.address_a_name))); 

    for (const province of provinces) {
      console.log(`Fetching data for: ${province}`); // 도/광역시/자치시/자치도 이름 출력
      const url = `http://apis.data.go.kr/B552584/ArpltnStatsSvc/getCtprvnMesureSidoLIst?sidoName=${encodeURIComponent(province)}&searchCondition=DAILY&pageNo=1&numOfRows=100&returnType=json&serviceKey=${API_KEY}`;

      try {
        const response = await axios.get(url);

        if (!response.data || !response.data.response || !response.data.response.body || !response.data.response.body.items) {
          console.error(`Unexpected response structure for ${province}:`, response.data);
          continue; // 다음 시/도로 넘어감
        }

        const items = response.data.response.body.items || [];

        // 트랜잭션 시작
        await connectionPromise.beginTransaction();

        for (const loc of locations.filter(loc => loc.address_a_name === province)) {
          const item = items.find((it: AirQualityItem) => it.cityName === loc.address_b_name) || {
            pm10Value: 0,
            pm25Value: 0,
            o3Value: 0,
            no2Value: 0,
            coValue: 0,
            so2Value: 0,
            dataTime: new Date().toISOString()
          };

          // 각 오염 물질 값이 비어 있는 경우 기본 값 0으로 설정
          const pm10Value = item.pm10Value || 0;
          const pm25Value = item.pm25Value || 0;
          const o3Value = item.o3Value || 0;
          const no2Value = item.no2Value || 0;
          const coValue = item.coValue || 0;
          const so2Value = item.so2Value || 0;
          const dataTime = item.dataTime || new Date().toISOString();

          const query = `
            INSERT INTO Realtime_Air_Quality (location_id, pm10, pm25, o3, no2, co, so2, timestamp)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
              pm10 = VALUES(pm10),
              pm25 = VALUES(pm25),
              o3 = VALUES(o3),
              no2 = VALUES(no2),
              co = VALUES(co),
              so2 = VALUES(so2),
              timestamp = VALUES(timestamp)
          `;

          await connectionPromise.query(query, [
            loc.id,
            pm10Value,
            pm25Value,
            o3Value,
            no2Value,
            coValue,
            so2Value,
            dataTime
          ]);
        }

        // 트랜잭션 커밋(성공하면 db에 저장)
        await connectionPromise.commit();
        console.log(`Data for ${province} updated successfully.`);
      } catch (error) {
        // 트랜잭션 롤백(에러나면 이전 작업 취소)
        await connectionPromise.rollback();
        console.error(`Error fetching data for ${province}:`, error);
      }

      // 각 API 호출 간에 1초 대기
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    console.log('Data fetched and stored successfully for all cities.'); // 전체 데이터가 성공적으로 가져와지고 저장되었을 때 메시지 출력
  } catch (error) {
    console.error('Error fetching locations:', error);
  } finally {
    await connectionPromise.end();
  }
};

const startCronJob = () => {
  // 24시간마다 실행
  cron.schedule('0 */24 * * *', fetchAndStoreData);

  // 처음 시작할 때도 실행(테스트 할 땐 주석처리)
  // fetchAndStoreData();
};

export default startCronJob;
