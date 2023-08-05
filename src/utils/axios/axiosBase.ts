import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL || '/api'

export default axios.create({
    baseURL
})