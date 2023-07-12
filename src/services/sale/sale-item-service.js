import axios from "axios";

class SaleItemService {
    
    getAllSaleItems() {
        return axios.get(`${process.env.REACT_APP_API_URL}/sale-item`)
    }
    
}

const saleItemService = new SaleItemService();
export default saleItemService;