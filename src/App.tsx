import "./App.css";
import { Chat } from "./components/chat";
import VoiceChat from "./components/live";

function App() {
  return (
    <div className="h-screen">
      {/* <Chat /> */}
      <VoiceChat />
    </div>
  );
}

export default App;
