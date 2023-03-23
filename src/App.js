import './App.css';
import { AuthContextProvider } from './services/auth/AuthContext';
import RoutesApp from './routes/Routes';
function App() {
  return (
    <AuthContextProvider>
      <RoutesApp />
    </AuthContextProvider>
  );
}

export default App;
