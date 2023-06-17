import axios from "axios";

class InventoryService {
 
    updateInventory(id, qtd){
        let inventory = {
            amount: qtd
        }
        return axios.put(`${process.env.REACT_APP_API_URL}/inventory/${id}`, inventory)
    }
}

const inventoryService = new InventoryService();
export default inventoryService;