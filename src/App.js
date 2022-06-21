import "./App.css";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Order from "./Order";

let container = null;
const root = ReactDOM.createRoot(document.getElementById("root"));

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Order />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

if (!container) {
  root.render(<App />);
}
export default App;
