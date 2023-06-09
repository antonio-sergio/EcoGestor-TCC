import axios from "axios";

class ProductService {
    create(product){
        return axios.post(`${process.env.REACT_APP_API_URL}/product`, product)
    }
    delete(id){
        return axios.delete(`${process.env.REACT_APP_API_URL}/product/${id}`, id)
    }
    getAllProducts() {
        return axios.get(`${process.env.REACT_APP_API_URL}/product`)
    }
    updateProduct(product){
        return axios.put(`${process.env.REACT_APP_API_URL}/product/${product.id_product}`, product)
    }
}

const productService = new ProductService();
export default productService;