import axios from "axios";
import React, { useEffect, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import jwt_decode from "jwt-decode";
import { GoogleLogin } from "@react-oauth/google";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../../../../node_modules/bootstrap/dist/css/bootstrap-grid.css";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import verified from "../../../Assets/verified.gif";
import {
  Card,
  CardContent,
  Button,
  TextField,
  Typography,
  Checkbox,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Box,
  styled,
} from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress, {
  circularProgressClasses,
} from "@mui/material/CircularProgress";
import login_img from "../../../Assets/login_img.webp";
import "./UserLogin.css";
import {
  signup,
  login,
  glogin,
  sendOTP,
  verifyOTP,
  getAdminOrders,
} from "../../../actions/auth";

function FacebookCircularProgress(props) {
  return (
    <Box sx={{ position: "relative" }}>
      <CircularProgress
        variant="determinate"
        sx={{
          color: (theme) =>
            theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
        }}
        size={40}
        thickness={4}
        {...props}
        value={100}
      />
      <CircularProgress
        variant="indeterminate"
        disableShrink
        sx={{
          color: (theme) =>
            theme.palette.mode === "light" ? "#1a90ff" : "#308fe8",
          animationDuration: "550ms",
          position: "absolute",
          left: 0,
          [`& .${circularProgressClasses.circle}`]: {
            strokeLinecap: "round",
          },
        }}
        size={40}
        thickness={4}
        {...props}
      />
    </Box>
  );
}

const actionButton = styled(Button)({
  textTransform: "none",
});

const UserLogin = () => {
  const [captched, setCaptched] = useState(false);
  const onChange = async (value) => {
    // await axios
    //   .post("https://www.google.com/recaptcha/api/siteverify", {
    //     secret: "6LdObVUoAAAAACKzMJXVTKo27HqNKnkKAeNHNafK",
    //     response: value,
    //   })
    //   .then(() => {

    //   });
    if (value !== null) {
      setCaptched(true);
    } else {
      setCaptched(false);
    }
  };
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const [Switch, setSwitch] = useState(false);
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [phone_code, setPhone_code] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const userType = "user";
  const User = useSelector((state) => state.fetch_current_userReducer);

  const navigate = useNavigate();
  useEffect(() => {
    if (Date.now() < User?.time + 3.6e6) {
      navigate("/user/dash");
    }
  }, [navigate, User]);

  function handleCallbackResponse(res) {
    var googleUser = jwt_decode(res.credential);
    let name = googleUser?.name;
    let email = googleUser?.email;
    let pic = googleUser?.picture;
    let password = googleUser?.sub;
    handleOpen();
    setTimeout(() => {
      handleClose();
    }, 5000);
    dispatch(glogin({ name, email, pic, password, userType }, navigate));
    console.log(User?.user?._id);
    dispatch(getAdminOrders());

    // setTimeout(() => {
    //   window.location.reload();
    // }, 2000);

    message.success("Login Succesfully");
  }

  const handleLogin = (e) => {
    e.preventDefault();
    handleOpen();
    setTimeout(() => {
      handleClose();
    }, 5000);
    dispatch(login({ email, password, userType }, navigate));
    dispatch(getAdminOrders());

    // setTimeout(() => {
    //   window.location.reload();
    // }, 2000);
    // message.success("Login Succesfully");
  };
  const handleRegister = (e) => {
    e.preventDefault();
    handleOpen();
    setTimeout(() => {
      handleClose();
    }, 5000);
    dispatch(
      signup({ name, email, phone_code, phone, password, userType }, navigate)
    );
    message.success("Registered Successfully");
  };

  //email verification
  const [otp, setOtp] = useState("");
  const [sent, setSent] = useState(false);
  const handleSendOTP = (e) => {
    e.preventDefault();
    dispatch(sendOTP({ email }));
    setSent(true);
  };

  const [otpverified, setOtpverified] = useState(false);
  const handleVerifyOTP = (e) => {
    e.preventDefault();
    setLoading(true);
    setInterval(() => {
      setLoading(false);
    }, 5000);
    dispatch(verifyOTP({ email, otp }, setOtpverified));
  };

  //verify phone
  const [phoneValidated, setPhoneValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const handlePhoneVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    const options = {
      method: "GET",
      url: "https://phonenumbervalidatefree.p.rapidapi.com/ts_PhoneNumberValidateTest.jsp",
      params: {
        number: `+${phone_code + phone}`,
        country: "India",
      },
      headers: {
        "X-RapidAPI-Key": "4ed5922f47msh7f03366838e7631p16a99bjsn9ee29cca8d10",
        "X-RapidAPI-Host": "phonenumbervalidatefree.p.rapidapi.com",
      },
    };

    try {
      const response = await axios.request(options);

      setLoading(false);
      if (response.data.carrier) {
        setPhoneValidated(true);
        toast.success(
          `Mobile No. Verified Successfully\nOperator: ${response?.data?.carrier},\n \tLocation: ${response?.data?.location}`
        );
      } else {
        toast.error("Please enter valid Mobile No.");
      }
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  var variant = "outlined";
  return (
    <div id="userloginPage">
      <div className="row">
        <Typography id="modal-modal-title" variant="h7" component="h2">
          Please Login to continue
        </Typography>
      </div>
      <br />
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className="row" id="chooseAction">
        {Switch ? (
          <>
            <div id="login/signup">
              <Button
                variant={`${variant}`}
                onClick={() => {
                  setSwitch(false);
                  variant = "contained";
                }}
              >
                Log in
              </Button>
              &nbsp;
              <Button
                variant="contained"
                onClick={() => setSwitch(true)}
                id="userRegister"
              >
                Register
              </Button>
            </div>
          </>
        ) : (
          <>
            <div id="login/signup">
              <Button
                variant="contained"
                onClick={() => {
                  setSwitch(false);
                }}
              >
                Log in
              </Button>
              &nbsp;
              <Button variant="outlined" onClick={() => setSwitch(true)}>
                Register
              </Button>
            </div>
          </>
        )}
      </div>
      <div className="seperatorLogin"></div>
      <div className="row">
        <div className="col-lg-6">
          <img src={login_img} alt="login_image" id="loginImg" />
        </div>

        <div className="col-lg-6" style={{ paddingLeft: "25px" }}>
          {Switch ? (
            <>
              <div className="usersignup" id="usersignup">
                <Card
                  id="signupcard"
                  sx={{
                    margin: "auto",
                    // marginTop: (theme) => theme.spacing(5),
                    padding: (theme) => theme.spacing(2),
                    textAlign: "center",
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" id="signuphead">
                      Join MedHos
                    </Typography>
                    <hr />
                    <br />
                    <TextField
                      label="Full Name"
                      name="name"
                      sx={{
                        width: "100%",
                        marginBottom: (theme) => theme.spacing(2),
                      }}
                      variant="outlined"
                      onChange={(e) => {
                        setName(e.target.value);
                      }}
                    />
                    <TextField
                      disabled={otpverified}
                      autoComplete="off"
                      required
                      type="email"
                      label="Email"
                      name="email"
                      sx={{
                        marginBottom: (theme) => theme.spacing(2),
                      }}
                      id="registeremail"
                      variant="outlined"
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                    />
                    <Button
                      disabled={sent}
                      sx={{ borderRadius: "10px" }}
                      onClick={handleSendOTP}
                      hidden={email.indexOf("@") === -1}
                      id="optsendbtn"
                    >
                      {otpverified ? (
                        <>
                          {" "}
                          <img src={verified} width="40px" alt="verified" />
                        </>
                      ) : (
                        <>Send OTP</>
                      )}
                    </Button>
                    <TextField
                      hidden={!sent || otpverified}
                      autoComplete="off"
                      id="verifyOTP"
                      required
                      type="otp"
                      label="OTP"
                      name="otp"
                      sx={{
                        marginBottom: (theme) => theme.spacing(2),
                      }}
                      variant="outlined"
                      onChange={(e) => {
                        setOtp(e.target.value);
                      }}
                    />
                    <Button
                      hidden={!sent || otpverified}
                      onClick={handleVerifyOTP}
                      id="optverifybtn"
                    >
                      {loading ? (
                        <>
                          <FacebookCircularProgress />
                        </>
                      ) : (
                        <>Verify</>
                      )}
                    </Button>
                    <form action="/" onSubmit={handlePhoneVerify}>
                      <select
                        disabled={phoneValidated}
                        className="form-select"
                        id="phone_code"
                        name="phone_code"
                        value={phone_code}
                        onChange={(e) => {
                          setPhone_code(e.target.value);
                        }}
                      >
                        <option value="">+ _ _ </option>
                        <option value="93">Afghanistan +93</option>
                        <option value="358">Aland Islands +358</option>
                        <option value="355">Albania +355</option>
                        <option value="213">Algeria +213</option>
                        <option value="1684">American Samoa +1684</option>
                        <option value="376">Andorra +376</option>
                        <option value="244">Angola +244</option>
                        <option value="1264">Anguilla +1264</option>
                        <option value="672">Antarctica +672</option>
                        <option value="1268">Antigua and Barbuda +1268</option>
                        <option value="54">Argentina +54</option>
                        <option value="374">Armenia +374</option>
                        <option value="297">Aruba +297</option>
                        <option value="61">Australia +61</option>
                        <option value="43">Austria +43</option>
                        <option value="994">Azerbaijan +994</option>
                        <option value="1242">Bahamas +1242</option>
                        <option value="973">Bahrain +973</option>
                        <option value="880">Bangladesh +880</option>
                        <option value="1246">Barbados +1246</option>
                        <option value="375">Belarus +375</option>
                        <option value="32">Belgium +32</option>
                        <option value="501">Belize +501</option>
                        <option value="229">Benin +229</option>
                        <option value="1441">Bermuda +1441</option>
                        <option value="975">Bhutan +975</option>
                        <option value="591">Bolivia +591</option>
                        <option value="599">
                          Bonaire, Sint Eustatius and Saba +599
                        </option>
                        <option value="387">Bosnia and Herzegovina +387</option>
                        <option value="267">Botswana +267</option>
                        <option value="55">Bouvet Island +55</option>
                        <option value="55">Brazil +55</option>
                        <option value="246">
                          British Indian Ocean Territory +246
                        </option>
                        <option value="673">Brunei Darussalam +673</option>
                        <option value="359">Bulgaria +359</option>
                        <option value="226">Burkina Faso +226</option>
                        <option value="257">Burundi +257</option>
                        <option value="855">Cambodia +855</option>
                        <option value="237">Cameroon +237</option>
                        <option value="1">Canada +1</option>
                        <option value="238">Cape Verde +238</option>
                        <option value="1345">Cayman Islands +1345</option>
                        <option value="236">
                          Central African Republic +236
                        </option>
                        <option value="235">Chad +235</option>
                        <option value="56">Chile +56</option>
                        <option value="86">China +86</option>
                        <option value="61">Christmas Island +61</option>
                        <option value="672">
                          Cocos (Keeling) Islands +672
                        </option>
                        <option value="57">Colombia +57</option>
                        <option value="269">Comoros +269</option>
                        <option value="242">Congo +242</option>
                        <option value="242">
                          Congo, Democratic Republic of the Congo +242
                        </option>
                        <option value="682">Cook Islands +682</option>
                        <option value="506">Costa Rica +506</option>
                        <option value="225">Cote D'Ivoire +225</option>
                        <option value="385">Croatia +385</option>
                        <option value="53">Cuba +53</option>
                        <option value="599">Curacao +599</option>
                        <option value="357">Cyprus +357</option>
                        <option value="420">Czech Republic +420</option>
                        <option value="45">Denmark +45</option>
                        <option value="253">Djibouti +253</option>
                        <option value="1767">Dominica +1767</option>
                        <option value="1809">Dominican Republic +1809</option>
                        <option value="593">Ecuador +593</option>
                        <option value="20">Egypt +20</option>
                        <option value="503">El Salvador +503</option>
                        <option value="240">Equatorial Guinea +240</option>
                        <option value="291">Eritrea +291</option>
                        <option value="372">Estonia +372</option>
                        <option value="251">Ethiopia +251</option>
                        <option value="500">
                          Falkland Islands (Malvinas) +500
                        </option>
                        <option value="298">Faroe Islands +298</option>
                        <option value="679">Fiji +679</option>
                        <option value="358">Finland +358</option>
                        <option value="33">France +33</option>
                        <option value="594">French Guiana +594</option>
                        <option value="689">French Polynesia +689</option>
                        <option value="262">
                          French Southern Territories +262
                        </option>
                        <option value="241">Gabon +241</option>
                        <option value="220">Gambia +220</option>
                        <option value="995">Georgia +995</option>
                        <option value="49">Germany +49</option>
                        <option value="233">Ghana +233</option>
                        <option value="350">Gibraltar +350</option>
                        <option value="30">Greece +30</option>
                        <option value="299">Greenland +299</option>
                        <option value="1473">Grenada +1473</option>
                        <option value="590">Guadeloupe +590</option>
                        <option value="1671">Guam +1671</option>
                        <option value="502">Guatemala +502</option>
                        <option value="44">Guernsey +44</option>
                        <option value="224">Guinea +224</option>
                        <option value="245">Guinea-Bissau +245</option>
                        <option value="592">Guyana +592</option>
                        <option value="509">Haiti +509</option>
                        <option value="39">
                          Holy See (Vatican City State) +39
                        </option>
                        <option value="504">Honduras +504</option>
                        <option value="852">Hong Kong +852</option>
                        <option value="36">Hungary +36</option>
                        <option value="354">Iceland +354</option>
                        <option value="91">India +91</option>
                        <option value="62">Indonesia +62</option>
                        <option value="98">
                          Iran, Islamic Republic of +98
                        </option>
                        <option value="964">Iraq +964</option>
                        <option value="353">Ireland +353</option>
                        <option value="44">Isle of Man +44</option>
                        <option value="972">Israel +972</option>
                        <option value="39">Italy +39</option>
                        <option value="1876">Jamaica +1876</option>
                        <option value="81">Japan +81</option>
                        <option value="44">Jersey +44</option>
                        <option value="962">Jordan +962</option>
                        <option value="7">Kazakhstan +7</option>
                        <option value="254">Kenya +254</option>
                        <option value="686">Kiribati +686</option>
                        <option value="850">
                          Korea, Democratic People's Republic of +850
                        </option>
                        <option value="82">Korea, Republic of +82</option>
                        <option value="383">Kosovo +383</option>
                        <option value="965">Kuwait +965</option>
                        <option value="996">Kyrgyzstan +996</option>
                        <option value="856">
                          Lao People's Democratic Republic +856
                        </option>
                        <option value="371">Latvia +371</option>
                        <option value="961">Lebanon +961</option>
                        <option value="266">Lesotho +266</option>
                        <option value="231">Liberia +231</option>
                        <option value="218">Libyan Arab Jamahiriya +218</option>
                        <option value="423">Liechtenstein +423</option>
                        <option value="370">Lithuania +370</option>
                        <option value="352">Luxembourg +352</option>
                        <option value="853">Macao +853</option>
                        <option value="389">
                          Macedonia, the Former Yugoslav Republic of +389
                        </option>
                        <option value="261">Madagascar +261</option>
                        <option value="265">Malawi +265</option>
                        <option value="60">Malaysia +60</option>
                        <option value="960">Maldives +960</option>
                        <option value="223">Mali +223</option>
                        <option value="356">Malta +356</option>
                        <option value="692">Marshall Islands +692</option>
                        <option value="596">Martinique +596</option>
                        <option value="222">Mauritania +222</option>
                        <option value="230">Mauritius +230</option>
                        <option value="262">Mayotte +262</option>
                        <option value="52">Mexico +52</option>
                        <option value="691">
                          Micronesia, Federated States of +691
                        </option>
                        <option value="373">Moldova, Republic of +373</option>
                        <option value="377">Monaco +377</option>
                        <option value="976">Mongolia +976</option>
                        <option value="382">Montenegro +382</option>
                        <option value="1664">Montserrat +1664</option>
                        <option value="212">Morocco +212</option>
                        <option value="258">Mozambique +258</option>
                        <option value="95">Myanmar +95</option>
                        <option value="264">Namibia +264</option>
                        <option value="674">Nauru +674</option>
                        <option value="977">Nepal +977</option>
                        <option value="31">Netherlands +31</option>
                        <option value="599">Netherlands Antilles +599</option>
                        <option value="687">New Caledonia +687</option>
                        <option value="64">New Zealand +64</option>
                        <option value="505">Nicaragua +505</option>
                        <option value="227">Niger +227</option>
                        <option value="234">Nigeria +234</option>
                        <option value="683">Niue +683</option>
                        <option value="672">Norfolk Island +672</option>
                        <option value="1670">
                          Northern Mariana Islands +1670
                        </option>
                        <option value="47">Norway +47</option>
                        <option value="968">Oman +968</option>
                        <option value="92">Pakistan +92</option>
                        <option value="680">Palau +680</option>
                        <option value="970">
                          Palestinian Territory, Occupied +970
                        </option>
                        <option value="507">Panama +507</option>
                        <option value="675">Papua New Guinea +675</option>
                        <option value="595">Paraguay +595</option>
                        <option value="51">Peru +51</option>
                        <option value="63">Philippines +63</option>
                        <option value="64">Pitcairn +64</option>
                        <option value="48">Poland +48</option>
                        <option value="351">Portugal +351</option>
                        <option value="1787">Puerto Rico +1787</option>
                        <option value="974">Qatar +974</option>
                        <option value="262">Reunion +262</option>
                        <option value="40">Romania +40</option>
                        <option value="7">Russian Federation +7</option>
                        <option value="250">Rwanda +250</option>
                        <option value="590">Saint Barthelemy +590</option>
                        <option value="290">Saint Helena +290</option>
                        <option value="1869">
                          Saint Kitts and Nevis +1869
                        </option>
                        <option value="1758">Saint Lucia +1758</option>
                        <option value="590">Saint Martin +590</option>
                        <option value="508">
                          Saint Pierre and Miquelon +508
                        </option>
                        <option value="1784">
                          Saint Vincent and the Grenadines +1784
                        </option>
                        <option value="684">Samoa +684</option>
                        <option value="378">San Marino +378</option>
                        <option value="239">Sao Tome and Principe +239</option>
                        <option value="966">Saudi Arabia +966</option>
                        <option value="221">Senegal +221</option>
                        <option value="381">Serbia +381</option>
                        <option value="381">Serbia and Montenegro +381</option>
                        <option value="248">Seychelles +248</option>
                        <option value="232">Sierra Leone +232</option>
                        <option value="65">Singapore +65</option>
                        <option value="721">Sint Maarten +721</option>
                        <option value="421">Slovakia +421</option>
                        <option value="386">Slovenia +386</option>
                        <option value="677">Solomon Islands +677</option>
                        <option value="252">Somalia +252</option>
                        <option value="27">South Africa +27</option>
                        <option value="500">
                          South Georgia and the South Sandwich Islands +500
                        </option>
                        <option value="211">South Sudan +211</option>
                        <option value="34">Spain +34</option>
                        <option value="94">Sri Lanka +94</option>
                        <option value="249">Sudan +249</option>
                        <option value="597">Suriname +597</option>
                        <option value="47">Svalbard and Jan Mayen +47</option>
                        <option value="268">Swaziland +268</option>
                        <option value="46">Sweden +46</option>
                        <option value="41">Switzerland +41</option>
                        <option value="963">Syrian Arab Republic +963</option>
                        <option value="886">
                          Taiwan, Province of China +886
                        </option>
                        <option value="992">Tajikistan +992</option>
                        <option value="255">
                          Tanzania, United Republic of +255
                        </option>
                        <option value="66">Thailand +66</option>
                        <option value="670">Timor-Leste +670</option>
                        <option value="228">Togo +228</option>
                        <option value="690">Tokelau +690</option>
                        <option value="676">Tonga +676</option>
                        <option value="1868">Trinidad and Tobago +1868</option>
                        <option value="216">Tunisia +216</option>
                        <option value="90">Turkey +90</option>
                        <option value="7370">Turkmenistan +7370</option>
                        <option value="1649">
                          Turks and Caicos Islands +1649
                        </option>
                        <option value="688">Tuvalu +688</option>
                        <option value="256">Uganda +256</option>
                        <option value="380">Ukraine +380</option>
                        <option value="971">United Arab Emirates +971</option>
                        <option value="44">United Kingdom +44</option>
                        <option value="1">United States +1</option>
                        <option value="1">
                          United States Minor Outlying Islands +1
                        </option>
                        <option value="598">Uruguay +598</option>
                        <option value="998">Uzbekistan +998</option>
                        <option value="678">Vanuatu +678</option>
                        <option value="58">Venezuela +58</option>
                        <option value="84">Viet Nam +84</option>
                        <option value="1284">
                          Virgin Islands, British +1284
                        </option>
                        <option value="1340">Virgin Islands, U.s. +1340</option>
                        <option value="681">Wallis and Futuna +681</option>
                        <option value="212">Western Sahara +212</option>
                        <option value="967">Yemen +967</option>
                        <option value="260">Zambia +260</option>
                        <option value="263">Zimbabwe +263</option>
                      </select>

                      <TextField
                        required
                        type="tel"
                        label="Phone number"
                        name="phone"
                        disabled={phoneValidated}
                        sx={{
                          marginBottom: (theme) => theme.spacing(2),
                        }}
                        variant="outlined"
                        onChange={(e) => {
                          setPhone(e.target.value);
                        }}
                        id="phone_number"
                      />

                      <Button
                        disabled={
                          phone.length < 5 || !phone_code || phoneValidated
                        }
                        type="submit"
                        onClick={handlePhoneVerify}
                        id="phoneverifybtn"
                      >
                        {phoneValidated ? (
                          <>
                            <img src={verified} width="40px" alt="verified" />
                          </>
                        ) : (
                          <>
                            {loading ? (
                              <>
                                <FacebookCircularProgress />
                              </>
                            ) : (
                              <>Verify</>
                            )}
                          </>
                        )}
                      </Button>
                    </form>
                    <FormControl
                      sx={{ m: 1 }}
                      variant="outlined"
                    >
                      <InputLabel htmlFor="outlined-adornment-password">
                        Password
                      </InputLabel>
                      <OutlinedInput
                        id="outlined-adornment-password"
                        type={showPassword ? "text" : "password"}
                        className="signuppassword"
                        onChange={(e) => {
                          setPassword(e.target.value);
                        }}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                        label="Password"
                      />
                    </FormControl>
                    <div id="signuppromodiv">
                      <span>
                        <Checkbox defaultChecked />
                      </span>

                      <span id="signuppromo">
                        Receive relavant offers and promotional communication
                        from MedHos{" "}
                      </span>
                    </div>
                    <br />
                    <div id="captcha">
                      <ReCAPTCHA
                        sitekey="6LdObVUoAAAAAHYn9BYhbKcy1ggsqnOS6jsesWx1"
                        onChange={onChange}
                      />
                    </div>

                    <Button
                      disabled={!captched}
                      variant="contained"
                      color="primary"
                      sx={{
                        width: "100%",
                      }}
                      onClick={handleRegister}
                    >
                      Register
                    </Button>
                    <br />
                  </CardContent>
                </Card>
                <br />
              </div>
            </>
          ) : (
            <>
              <div
                className="userlogin"
                id="userlogin"
                style={{ textAlign: "center" }}
              >
                <div id="googleloginbutton">
                  <GoogleLogin
                    onSuccess={(credentialResponse) => {
                      handleCallbackResponse(credentialResponse);
                    }}
                    onError={() => {
                      console.log("Login Failed");
                    }}
                    text="continue_with"
                    locale="hindi"
                    logo_alignment="center"
                  />
                </div>

                <br />
                <div id="seperatorOr">Or</div>
                <br />

                <TextField
                  name="email"
                  type="text"
                  label="Mobile Number or Email ID"
                  variant="outlined"
                  autoComplete="off"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  id="userlogininput"
                />
                <br />
                <br />
                <FormControl variant="outlined">
                  <InputLabel htmlFor="outlined-adornment-password">
                    Password
                  </InputLabel>
                  <OutlinedInput
                    className="userlogininput"
                    id="outlined-adornment-password"
                    type={showPassword ? "text" : "password"}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Password"
                  />
                </FormControl>
                <br />
                <div>
                  <Link to="/user/forgotpassword" id="userForgot">
                    Forgot Password ?
                  </Link>
                </div>
                <br />
                <Button
                  variant="contained"
                  onClick={handleLogin}
                  id="submitLogin"
                >
                  Login
                </Button>
              </div>
              <br />
            </>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default UserLogin;
