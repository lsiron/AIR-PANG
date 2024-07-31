//customize-cra 패키지를 사용하여 Create React App의 개발 서버 설정을 커스터마이징하는 설정 파일입니다. customize-cra는 Create React App의 설정을 쉽게 변경할 수 있도록 도와주는 라이브러리

const { overrideDevServer } = require('customize-cra');

module.exports = {
  devServer: overrideDevServer((config) => {
    config.setupMiddlewares = (middlewares, devServer) => {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }

      // 기존 onBeforeSetupMiddleware 및 onAfterSetupMiddleware 로직을 여기에 추가

      return middlewares;
    };

    return config;
  }),
};
