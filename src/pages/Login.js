import { useContext, useState } from "react";
import AuthContext from "../services/auth/AuthContext";

const Login = () => {
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const loginSubmit = async (e) => {
        e.preventDefault();
        let payload = {
            email: email,
            password: password
        }
        try {
            await login(payload);
        } catch (error) {
            console.log(error);
        }
    };



    const handleEmail = (e) => {
        const email = e?.target?.value;
        setEmail(email)
    }
    const handlePassword = (e) => {
        const password = e?.target?.value;
        setPassword(password)
    }



    return (
        <>
            <div className="">
                <form className="" onSubmit={loginSubmit}>
                    Email: <input value={email} onChange={handleEmail} />
                    Password: <input type="password" value={password} onChange={handlePassword} />
                    <button type="submit">login</button>
                </form>

            </div>
        </>
    );
};
export default Login;