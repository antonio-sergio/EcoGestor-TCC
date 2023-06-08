import axios from "axios";

class UserService {
    getUserImage(id_user) {
        return axios.get(`${process.env.REACT_APP_API_URL}/user/image/${id_user}`)
    }
}

const userService = new UserService();
export default userService;