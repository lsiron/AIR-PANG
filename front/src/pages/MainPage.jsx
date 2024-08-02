import React from "react";
import GoogleLoginButton from "../components/Login/GoogleLoginButton";
// import GoogleCallback from "../components/Login/googlecallback";
import Rip from "../assets/images/rip.jpg";

function MainPage() {
  return (
    <div
      style={{
        textAlign: "center",
      }}
    >
      <h1>오늘 날씨어때요?</h1>
      <p>여기가 메인 페이지입니다.</p>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ flex: 1, textAlign: "center" }}>
          재영님의 로그인 컴포넌트
          <GoogleLoginButton />
          {/* <GoogleCallback /> */}
        </div>
        <div style={{ flex: 1, textAlign: "center" }}>
          민정님의 날씨위젯 컴포넌트
          <div>
            <img
              src={Rip}
              alt="rip"
              className="google-logo"
              style={{
                width: "80px",
                height: "auto",
                borderRadius: "50%",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
