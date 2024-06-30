import { Routes, Route } from "react-router-dom";
import "./App.css";
//Screens
import LobbyScreen from "./screens/Lobby";
import RoomPage from "./screens/Room";
import RegisterPage from "./screens/Register";
import LoginPage from "./screens/Login";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<RegisterPage />} />
        <Route path="/lobby" element={<LobbyScreen />} />
        <Route path="/room/:roomId" element={<RoomPage />} />
      </Routes>
    </div>
  );
}

export default App;
