import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RequestList } from "./pages/RequestList";
import { NewRequest } from "./pages/NewRequest";
import { RequestDetail } from "./pages/RequestDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RequestList />} />
        <Route path="/new" element={<NewRequest />} />
        <Route path="/requests/:id" element={<RequestDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
