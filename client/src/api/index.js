import axios from "axios";
const API = axios.create({
  baseURL: "https://med-hos-server.vercel.app", //http://localhost:7000
});
API.interceptors.request.use((req) => {
  if (localStorage.getItem("Profile")) {
    req.headers.authorization = `Bearer ${
      JSON.parse(localStorage.getItem("Profile")).token
    }`;
  }
  return req;
});

export const logIn = (authData) => API.post("/user/login", authData);
export const signUp = (authData) => API.post("/user/signup", authData);
export const smartTwiiter = () => API.post("/tlogin");

export const dlogIn = (authData) => API.post("/doctor/login", authData);
export const updateUser = (authData) => API.post("/user/update", authData);
export const glogIn = (authData) => API.post("/user/glogin", authData);
export const saveOrder = (authData) => API.post("/user/saveOrder", authData);
export const getOrder = () => API.post("/user/getOrder");
export const getAdminOrders = () => API.post("/user/getAdminOrders");
export const updateOrderStatus = (authData) =>
  API.post("/user/updateOrderStatus", authData);
export const verifyPayment = (paymentData) =>
  API.post("/user/verifyPayment", paymentData);
export const makePayment = () => API.post("/create-checkout-session");
export const verifyOTP = (authData) =>
  API.post("/doctor/verify/email", authData);

export const doctorsignUp = (authData) => API.post("/doctor/signup", authData);
export const getAllDoctors = () => API.get("/user/getAllDoctors");

export const getUserData = () => API.post("/user/getAllDoctors");
export const getUserAppointments = () => API.get("/user/user-appointments");
export const addMedicine = (medicines) => API.post("/medicines/add", medicines);
export const getMedicines = () => API.get("/medicines/getMedicines");
export const getUserCart=()=>API.post("/user/getCart");
export const addtoCart = (medicine) =>
  API.post("/medicines/addtoCart", medicine);
export const remove = (medicine) => API.post("/medicines/remove", medicine);
export const increaseQty = (medicine) =>
  API.patch("/medicines/increseQty", medicine);
export const decreaseQty = (medicine) =>
  API.patch("/medicines/decreaseQty", medicine);
export const getCity = () => API.post("/fetchCity");
