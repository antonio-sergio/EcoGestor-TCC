import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-date-range/dist/styles.css'; // Importe os estilos do react-date-range
import 'react-date-range/dist/theme/default.css'; // Importe o tema padrão do react-date-range



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
