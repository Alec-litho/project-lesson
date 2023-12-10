import React from "react";
import { Link } from "react-router-dom";
import "./login.css";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, getUser } from "../../features/authSlice.ts";
import Register from "../register-page/Register";

export default function Login() {
  const dispatch = useDispatch();
  const status = useSelector(state => state.auth.status);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm({ defaultValues: { email: "", password: "" }, mode: "onChange" });
  const onSubmit = (values) => {
    dispatch(loginUser(values))
      .then(res => {
        console.log(status);
        if(status !== 'error') dispatch(getUser(res.payload))
      })
  };
  return (
    <section className="container forms">
      <div className="form login">
        <div className="form-content">
          <header>Login</header>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="field input-field">

              <Controller name="email" control={control} rules={{
                required:{value:true, message:"email is required, please fill this field"},
                minLength:{value:5, message:"email filed length is too short"},
                maxLength:{value:30, message:"email filed length is too long"}
              }}
              render={() => {
                return <input
                type="email"
                placeholder="Email" 
                className={errors.email? "input-error":"input"}
                {...register("email")}
              />
              }}
              />
              {errors.email && (<p className="error_message">{errors.email.message}</p>)}
            </div>
            <div className="field input-field">
              {errors.password && <p className="error_message">{errors.password.message}</p>}

              <Controller
              name="password"
              control={control}
              rules={{
                required:{value:true, message:"password field is required"},
                minLength:{value:8, message:"password field length is too short"},
                maxLength:{value:20, message:"password field length is too long"}
              }}
              render={() => {
                return <input
                type="password"
                placeholder="Password"
                className={errors.password? "input-error":"input"}
                {...register("password")}
              />
              }}
              />
              
              <i className="bx bx-hide eye-icon" />
            </div>
            <div className="form-link">
              <a href="/login" className="forgot-pass">
                Forgot password?
              </a>
            </div>
            <div className="field button-field">
              <input type="submit" className="button" />
            </div>
          </form>
          <div className="form-link">
            <span>
              Don`t have an account?{" "}
              <Link
                to="/register"
                element={<Register />}
                className="link signup-link"
              >
                Register
              </Link>
            </span>
          </div>
        </div>
        <div className="line" />
        <div className="media-options">
          <a href="/login" className="field facebook">
            <i className="bx bxl-facebook facebook-icon" />
            <span>Login with Facebook</span>
          </a>
        </div>
        <div className="media-options">
          <a href="/login" className="field google">
            <img src="#" alt="" className="google-img" />
            <span>Login with Google</span>
          </a>
        </div>
      </div>
    </section>
  );
}
