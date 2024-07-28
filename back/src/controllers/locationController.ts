import { Request, Response } from 'express';
import { getAnnualData, getRealtimeData, getMaxAQI, getMonthlyData } from '../services/locationService';
import { RealtimeData, AnnualData, MonthlyData } from '../types/types';

// 지역별 AQI 계산기
export const getLocationDataController = async (req: Request, res: Response) => {
  const location = req.params.location;

  try {
    const annualData: AnnualData[] = await getAnnualData(location);
    const realtimeData: RealtimeData[] = await getRealtimeData(location);

    const result = annualData.map(annual => {
      const realtime = realtimeData.find(r => r.location_id === annual.location_id);

      const annualMaxAQI = Math.round(getMaxAQI(annual));
      const realtimeMaxAQI = realtime ? Math.round(getMaxAQI(realtime)) : 0;

      const calculateScore = (annualMaxAQI: number, realtimeMaxAQI: number): number => {
        if (annualMaxAQI >= 500 || annualMaxAQI <= 0) {
          return 0;
        }
        if (realtimeMaxAQI > 500 || realtimeMaxAQI <= 0) {
          return 0;
        }

        // 기준이 되는 50점 설정
        const baseScore = 50;
        
        // 차이값 계산
        const difference = realtimeMaxAQI - annualMaxAQI;
        
        // 점수 계산
        let score;
        if (difference === 0) {
          score = baseScore;
        } else if (difference < 0) {
          // 점수가 50에서 100점 사이
          score = baseScore + ((-difference / annualMaxAQI) * 50);
        } else {
          // 점수가 0에서 50점 사이
          score = baseScore - ((difference / (500 - annualMaxAQI)) * 50);
        }

        // 점수의 범위를 0에서 100으로 제한
        score = Math.max(0, Math.min(100, score));

        return Math.round(score);
      };

      const score = calculateScore(annualMaxAQI, realtimeMaxAQI);

      const getGrade = (aqi: number): string => {
        if (aqi <= 50) return "좋음";
        if (aqi <= 100) return "보통";
        if (aqi <= 150) return "민감군영향";
        if (aqi <= 200) return "나쁨";
        if (aqi <= 300) return "매우나쁨";
        return "위험";
      };

      const grade = getGrade(realtimeMaxAQI); 

      return {
        location: annual.address_b_name,
        annualMaxAQI,
        realtimeMaxAQI,
        score,
        grade
      };
    });

    res.json(result);
  } catch (error) {
    console.error('주요 지역 데이터를 가져오는데 실패했습니다:', error);
    res.status(500).send('서버 에러발생');
  }
};

export const getMonthlyDataController = async (req: Request, res: Response) => {
  const { location, subLocation } = req.params;

  try {
    const detailedData: MonthlyData = await getMonthlyData(location, subLocation);

    res.json(detailedData);
  } catch (error) {
    console.error('세부 지역 데이터를 가져오는데 실패했습니다:', error);
    res.status(500).send('서버 에러발생');
  }
};