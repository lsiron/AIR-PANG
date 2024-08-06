import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/My.css";

const MyPage = () => {
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
  }, []);

  const handleViewWeather = (location) => {
    navigate("/weather", {
      state: {
        locationName: location.address_a_name,
        subLocationName: location.address_b_name,
      },
    });
  };

  const handleDelete = (id) => {
    const updatedFavorites = favorites.filter((fav) => fav.id !== id);
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const onAccountDeletion = async () => {
    try {
      await axios.delete('https://localhost:8080/my' {data: { googleId: user.googleId },
      headers: {
         Authorization: `Bearer ${user.token}`,
      },
    }),
      setIsAuthenticated(false);
      setUser(null);
      alert('계정이 탈퇴되었습니다.');
    } catch (error) {
      console.error('계정 삭제 실패:', error);
      alert('계정 삭제 실패. 나중에 다시 시도해주세요.');
    }
  };

  return (
    <div>
      <h2>마이페이지</h2>
      <div className="my-favorite">
        <ul>
          {favorites.length > 0 ? (
            favorites.map((location) => (
              <li key={location.id}>
                {location.address_a_name} {location.address_b_name}
                <button
                  className="delete-button"
                  onClick={() => handleViewWeather(location)}
                >
                  보기
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(location.id)}
                >
                  X
                </button>
              </li>
            ))
          ) : (
            <li>즐겨찾기 항목이 없습니다.</li>
          )}
        </ul>

        <a href="/search" className="addFavorite">
          관심지역 설정하기
        </a>
      </div>
      <button id="deleteAccount" onClick={onAccountDeletion}>
        회원 탈퇴
      </button>
    </div>
  );
};

export default MyPage;
