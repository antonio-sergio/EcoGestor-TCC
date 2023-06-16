import axios from "axios";

class SaleService {
    create(sale){
        return axios.post(`${process.env.REACT_APP_API_URL}/sale`, sale)
    }
    delete(id){
        return axios.delete(`${process.env.REACT_APP_API_URL}/sale/${id}`, id)
    }
    getAllSale() {
        return axios.get(`${process.env.REACT_APP_API_URL}/sale`)
    }
    updateProduct(product){
        return axios.put(`${process.env.REACT_APP_API_URL}/product/${product.id_product}`, product)
    }
}

const saleService = new SaleService();
export default saleService;