import AuthContext from "../services/auth/AuthContext";
import { useContext } from 'react';
const Home = () => {
    const { logout } = useContext(AuthContext);
    return <>
        Home

        <button onClick={logout}>logout</button>
    </>
}

export default Home;