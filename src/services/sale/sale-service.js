import axios from "axios";

class SaleService {
    create(sale){
        return axios.post(`${process.env.REACT_APP_API_URL}/sale`, sale)
    }
    delete(id){
        return axios.delete(`${process.env.REACT_APP_API_URL}/sale/${id}`)
    }
    getAllSale() {
        return axios.get(`${process.env.REACT_APP_API_URL}/sale`)
    }
    getSaleItems(id_sale){
        return axios.get(`${process.env.REACT_APP_API_URL}/sale-item/sale/${id_sale}`)
    }
}

const saleService = new SaleService();
export default saleService;