import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContextProvider } from './services/auth/AuthContext';
import { ThemeProvider } from './components/style/ThemeContext';

import RoutesApp from './routes/Routes';
function App() {
  return (
    <ThemeProvider>
      <AuthContextProvider>
        <RoutesApp />
      </AuthContextProvider>
    </ThemeProvider>
  );
}

export default App;
