import axios from "axios";

class PurchaseItemService {
    getAllPurchaseItems() {
        return axios.get(`${process.env.REACT_APP_API_URL}/purchase-item`)
    }

}

const purchaseItemService = new PurchaseItemService();
export default purchaseItemService;