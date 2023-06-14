import axios from "axios";

class AddressService {
    create(address){
        return axios.post(`${process.env.REACT_APP_API_URL}/address`, address)
    }
    delete(id){
        return axios.delete(`${process.env.REACT_APP_API_URL}/address/${id}`, id)
    }
    getOneAddress(id){
        return axios.get(`${process.env.REACT_APP_API_URL}/address/${id}`)
    }
}

const addressService = new AddressService();
export default addressService;