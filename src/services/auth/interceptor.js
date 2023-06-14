import axios from "axios";

const interceptor = () => {
  axios.interceptors.request.use(
    (config) => {
      let token = localStorage.getItem("token"); 
      if (token) {
        //remover aspas do token
        token = token.replace(/^"(.*)"$/, '$1');
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};

export default interceptor;