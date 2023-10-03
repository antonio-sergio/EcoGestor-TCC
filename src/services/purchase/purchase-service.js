import axios from "axios";

class PurchaseService {
    create(purchase){
        return axios.post(`${process.env.REACT_APP_API_URL}/purchase`, purchase)
    }
    delete(id){
        return axios.delete(`${process.env.REACT_APP_API_URL}/purchase/${id}`)
    }
    getAllPurchase() {
        return axios.get(`${process.env.REACT_APP_API_URL}/purchase`)
    }

    getPurchaseItems(id_purchase){
        return axios.get(`${process.env.REACT_APP_API_URL}/purchase-item/purchase/${id_purchase}`)
    }
    getTotalPurchase(period){
        return axios.get(`${process.env.REACT_APP_API_URL}/purchase/total?startDate=${period.startDate}&endDate=${period.endDate}`)
    }
    getSaleByCustomer(id_seller){
        return axios.get(`${process.env.REACT_APP_API_URL}/purchase/customer/${id_seller}`)
    }
    delele(id){
        return axios.delete(`${process.env.REACT_APP_API_URL}/purchase/${id}`);
    }
}

const purchaseService = new PurchaseService();
export default purchaseService;