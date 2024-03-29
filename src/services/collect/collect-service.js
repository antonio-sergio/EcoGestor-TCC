import axios from "axios";
import moment from 'moment';

class CollectService {
    create(collect) {
        const formData = new FormData();

        for (const campo in collect) {
            formData.append(campo, collect[campo]); // adiciona os campos do objeto user ao FormData
        }
       
        return axios.post(`${process.env.REACT_APP_API_URL}/collect`, formData)
    }

    getAllCollects() {
        return axios.get(`${process.env.REACT_APP_API_URL}/collect`)
    }
    getCollectsByUser(id) {
        return axios.get(`${process.env.REACT_APP_API_URL}/collect/user/${id}`)
    }
    getCollectsByDate(date) {
        return axios.get(`${process.env.REACT_APP_API_URL}/collect/date/date=${date}`)
    }
    getCollectsByStatus(status) {
        return axios.get(`${process.env.REACT_APP_API_URL}/collect/status/${status}`)
    }
    approval(id) {
        return axios.put(`${process.env.REACT_APP_API_URL}/collect/${id}`, {
            "status": "pendente"
        })
    }
    refuse(id, reason) {
        return axios.put(`${process.env.REACT_APP_API_URL}/collect/${id}`, {
            "status": "recusada",
            "details": reason
        })
    }
    cancel(id, reason) {
        return axios.put(`${process.env.REACT_APP_API_URL}/collect/${id}`, {
            "status": "cancelada",
            "details": reason
        })
    }
    reanalyze(id) {
        return axios.put(`${process.env.REACT_APP_API_URL}/collect/${id}`, {
            "status": "aguardando",
        })
    }
    finalizeCollect(collect) {
        const currentDate = moment().format('YYYY-MM-DD');
        let payload = {
            "status": "finalizado",
            "final_date": currentDate
        }
        return axios.put(`${process.env.REACT_APP_API_URL}/collect/${collect.id}`, payload)
    }
    findBeteweenDate(startDate, endDate){
        return axios.get(`${process.env.REACT_APP_API_URL}/collect/date/${startDate}/${endDate}`)

    }
    getCollectImage(id_collect) {
        return axios.get(`${process.env.REACT_APP_API_URL}/collect/image/${id_collect}`)
    }
}

const collectService = new CollectService();
export default collectService;