import { atom } from 'recoil';

export const mapOptionsState = atom({
  key: 'mapOptionsState',
  default: {
    chart: {
      map: null,
      height: 600
    }
  }
});

export const isModalOpenState = atom({
  key: 'isModalOpenState',
  default: false
});

export const selectedRegionState = atom({
  key: 'selectedRegionState',
  default: ''
});