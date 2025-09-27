import axios from "axios"

const axiosInstance = axios.create({
  baseURL: 'http://localhost:4000/api/', // later change this
  withCredentials : true, // send cookie to server
});


export default axiosInstance;