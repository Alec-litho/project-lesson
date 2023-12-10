import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import {useForm, Controller} from 'react-hook-form';
import "./register.css";
import { useDispatch } from "react-redux";
import { getUser, registerUser } from "../../features/authSlice.ts";


export default function Register() {
  const navigate = useNavigate();
  let dispatch = useDispatch();
  let [gender, setGender] = useState("male");
  let [confirmPass, setConfirmedPass] = useState(null)
  let {register, handleSubmit, onErrors, control, formState:{errors, isValid},getValues} = useForm({defaultValues:{fullName:"",birth:"",email:"",password:"", gender},mode:"onChange"});
  console.log(confirmPass, errors, isValid);
  
  function checkPassword(pass) {
    const {password} = getValues();
    console.log(pass, password);
    if(pass === password) setConfirmedPass(true);
    else setConfirmedPass(false);
  }
  const onSubmit = (values) => {
    console.log(values);
    if(confirmPass) {
      dispatch(registerUser(values))
        .then(res => {
          console.log(res);
          dispatch(getUser(res.payload));
          navigate('/')
        })
      
    }
    else console.log("password is not matching");
  };
  return (
    <section className="container forms">
      <div className="form signup">
        <div className="form-content">
          <header>Signup</header>
          <form onSubmit={handleSubmit(onSubmit, onErrors)}>
                {/* ---------------------this field's rules list doesn't work------------------------ */}
          <div className="field input-field">
            <label id="name" className={errors.fullName? "label-error" : "label"}>{errors.fullName? errors.fullName.message : "Name"}</label>
            <Controller name="name" control={control} rules={{
              // required:{value:true, message:"name is required, please fill this field"},
              minLength:{value:1, message:"name filed length is too short"},
              maxLength:{value:14, message:"name filed length is too long"}
            }}
            render={() => {
              return <input htmlFor="name" type="text" placeholder="Name" id="fullName" className={errors.fullName? "input-error":"input"} {...register("fullName")}/>
            }}
            />
            </div>
                 {/* ---------------------this field's rules list doesn't work------------------------ */}
            <div className="field input-field">
            <label id="birth" className={errors.birth? "label-error" : "label"}>{errors.birth? errors.birth.message : "Your birth date"}</label>
            <Controller name="birth" control={control} rules={{
               required:{value:true, message:"birth field is required, please fill this field"},
            }}
            render={() => {
              return <input htmlFor="birth" type="date" className={errors.birth? "input-error":"input"} {...register("birth")}/>
            }}
            /> 
            </div>
            <div className="gender">
              <div className="gender-option">
                <input htmlFor="male" value="male" name="gender" type="radio" className="input" onClick={e => setGender(e.target.value)}/>
                <label id="male">Male</label>
              
              </div>
              <div className="gender-option">
                <input htmlFor="female" value="female" name="gender" type="radio" className="input" onClick={e => setGender(e.target.value)}/>
                <label id="female">Female</label>
                
              </div>
            </div>
            <div className="field input-field email">
            <label id="email" className={errors.email? "label-error" : "label"}>{errors.email? errors.email.message : "Email"}</label>
              <Controller name="email" control={control} rules={{
                required:{value:true, message:"email is required, please fill this field"},
                minLength:{value:5, message:"email filed length is too short"},
                maxLength:{value:30, message:"email filed length is too long"}
              }}
              render={() => {
                return <input htmlFor="email" type="email" placeholder="Email" className={errors.email? "input-error":"input"} id="email" {...register("email")}/>}}
              />
            </div>
            <div className="field input-field">
            <label id="password" className={errors.password? "label-error" : "label"}>{errors.password? errors.password.message : "Password"}</label>
            <Controller name="password" control={control} rules={{
                required:{value:true, message:"password field is required"},
                minLength:{value:8, message:"password field length is too short"},
                maxLength:{value:20, message:"password field length is too long"}
              }}
              render={() => {
                return <input htmlFor="password" type="password" placeholder="Password" className={errors.password? "input-error":"input"} {...register("password")}/>}}
              />
            </div>
            <div className="field input-field">
            <label id="repeat-password" className={confirmPass === false? "label-error" : "label"}>{confirmPass === false? "Password is not matching" : "Repeat password"}</label>
              <input
              onChange={(e) => checkPassword(e.target.value)}
              htmlFor="repeat-password"
                type="password"
                placeholder="Confirm password"
                className={confirmPass === false? "input-error":"input"}
              />
            </div>
            <div className="field button-field">
              <input type="submit" className="button"/>
            </div>
          </form>
          <div className="form-link">
            <span>
              Already have an account?
              <Link to="/login" className="link login-link">
                Log in
              </Link>
            </span>
          </div>
        </div>
        <div className="line" />
        <div className="media-options">
          <a href="/register" className="field facebook">
            <i className="bx bxl-facebook facebook-icon" />
            <span>Login with Facebook</span>
          </a>
        </div>
        <div className="media-options">
          <a href="/register" className="field google">
            <img src="#" alt="" className="google-img" />
            <span>Login with Google</span>
          </a>
        </div>
      </div>
    </section>
  );
}
