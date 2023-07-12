import axios from "axios";

class EmailService {
    sendEmail(obj) {
        return axios.post(`${process.env.REACT_APP_API_URL}/email`, obj)
    }
}

const emailService = new EmailService();
export default emailService;