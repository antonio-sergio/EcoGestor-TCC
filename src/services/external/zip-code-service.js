import axios from "axios";

class ZipCodeService {
    searchZipCode(zip_code){
        return axios.get(`https://viacep.com.br/ws/${zip_code}/json/`)
    }
}

const zipCodeService = new ZipCodeService();
export default zipCodeService;