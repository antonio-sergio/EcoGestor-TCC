import axios from "axios";

class UserService {
    getUserImage(id_user) {
        return axios.get(`${process.env.REACT_APP_API_URL}/user/image/${id_user}`)
    }
    create(user){
        const formData = new FormData();
  
        for (const campo in user) {
          formData.append(campo, user[campo]); // adiciona os campos do objeto user ao FormData
        }
        return axios.post(`${process.env.REACT_APP_API_URL}/user`, formData)
    }
}

const userService = new UserService();
export default userService;