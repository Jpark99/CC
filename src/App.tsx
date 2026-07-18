import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Roster from './pages/Roster';
import Rankings from './pages/Rankings';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import TitleHistory from './pages/TitleHistory';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="roster" element={<Roster />} />
        <Route path="rankings" element={<Rankings />} />
        <Route path="events" element={<Events />} />
        <Route path="events/:eventId" element={<EventDetail />} />
        <Route path="titles" element={<TitleHistory />} />
      </Route>
    </Routes>
  );
}

export default App;
