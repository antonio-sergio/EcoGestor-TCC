import axios from "axios";
import interceptor from "../auth/interceptor";

class UserService {
    constructor() {
        interceptor();
    }
    getUserImage(id_user) {
        return axios.get(`${process.env.REACT_APP_API_URL}/user/image/${id_user}`)
    }
    create(user) {
        const formData = new FormData();

        for (const campo in user) {
            formData.append(campo, user[campo]); // adiciona os campos do objeto user ao FormData
        }
        return axios.post(`${process.env.REACT_APP_API_URL}/user`, formData)
    }
    getAllUsers() {
        return axios.get(`${process.env.REACT_APP_API_URL}/user`)
    }
    updateUser(user){
        return axios.put(`${process.env.REACT_APP_API_URL}/user/${user.id}`, user)
    }
    getCustomers(){
        return axios.get(`${process.env.REACT_APP_API_URL}/user/type/customer`)
    }
    getSellers(){
        return axios.get(`${process.env.REACT_APP_API_URL}/user/type/seller`)
    }
}

const userService = new UserService();
export default userService;