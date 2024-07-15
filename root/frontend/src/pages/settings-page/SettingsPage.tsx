import { ReactComponentElement, useRef, useState } from "react";
import classes from "./style/settings.module.css";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import {
  Control,
  Controller,
  ControllerFieldState,
  UseControllerProps,
  useForm,
  UseFormHandleSubmit,
  UseFormRegister,
} from "react-hook-form";
import { useAppDispatch } from "../../hooks/reduxCustomHooks";
import { updateUserData } from "../../features/authSlice";
import { passwordLengthWithStars } from "../../helper_functions/passwordLengthWithStars";

type SettingComponentName =
  | "preferencesInformationSetting"
  | "publicInformationSetting"
  | "privateInformationSetting";

export default function Settings() {
  const dispatch = useAppDispatch();
  let userData = useSelector((state: RootState) => state.auth.userInfo);
  const rightSideMenu = useRef<HTMLFormElement>(null);
  const defaultValuesDTOs: IUserData = {
    name: userData.fullName,
    location: userData.location,
    age: userData.age,
    password: userData.password,
    email: userData.email,
    gender: userData.gender,
  };
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm({ defaultValues: defaultValuesDTOs });
  const onSubmit = (defVals: IUserData) => {
    dispatch(updateUserData({ _id: userData._id, updatedUserData: defVals }));
  };
  function switchSettingComponent(target: SettingComponentName) {
    const settingComponents = [
      ...[...rightSideMenu.current!.childNodes][0].childNodes,
    ] as HTMLDivElement[];
    settingComponents.forEach((component) => {
      console.log(component);
      if (component.getAttribute("id") === target) {
        component.style.display = "flex";
      } else {
        component.style.display = "none";
      }
    });
  }
  return (
    <div className={classes.settingsComponent}>
      <div className={classes.leftSideMenu}>
        <ul>
          <li
            onClick={() => {
              switchSettingComponent("publicInformationSetting");
            }}
          >
            Public information
          </li>
          <li
            onClick={() => {
              switchSettingComponent("privateInformationSetting");
            }}
          >
            Private information
          </li>
          <li
            onClick={() => {
              switchSettingComponent("preferencesInformationSetting");
            }}
          >
            Preferences
          </li>
        </ul>
      </div>
      <form className={classes.rightSideBody} ref={rightSideMenu}>
        <div className="settingsComponent">
          <div
            className={classes.publicInformationSetting}
            id="publicInformationSetting"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <div className={classes.nameSetting}>
              <Controller
                name="name"
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: "name is required, please fill this field",
                  },
                  maxLength: {
                    value: 18,
                    message: "name filed length is too long",
                  },
                }}
                render={() => {
                  return (
                    <input
                      type="text"
                      placeholder="fill your name"
                      className={
                        errors.name ? classes.errorInp : classes.nameInp
                      }
                      {...register("name")}
                    />
                  );
                }}
              />
              <p className={classes.currName}>{userData.fullName}</p>
              <h4 className={classes.label}>name</h4>
            </div>
            <div className={classes.locationSetting}>
              <Controller
                name="location"
                control={control}
                rules={{
                  maxLength: {
                    value: 28,
                    message: "location filed length is too long",
                  },
                }}
                render={() => {
                  return (
                    <input
                      type="text"
                      placeholder="fill your location"
                      className={
                        errors.location ? classes.errorInp : classes.locationInp
                      }
                      {...register("location")}
                    />
                  );
                }}
              />
              <p className={classes.currLocation}>{userData.location}</p>
              <h4 className={classes.label}>location</h4>
            </div>
            <div className={classes.ageSetting}>
              <Controller
                name="age"
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: "age is required, please fill this field",
                  },
                }}
                render={() => {
                  return (
                    <input
                      type="text"
                      placeholder="fill your age"
                      className={errors.age ? classes.errorInp : classes.ageInp}
                      {...register("age")}
                    />
                  );
                }}
              />
              <p className={classes.currAge}>{userData.age}</p>
              <h4 className={classes.label}>age</h4>
            </div>
            <div className={classes.genderSetting}>
              <Controller
                name="gender"
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: "age is required, please fill this field",
                  },
                }}
                render={() => {
                  return (
                      <select name="gender" className={
                        errors.age ? classes.genderBoxError : classes.genderBox
                      }>
                        <option value="male">male</option>
                        <option value="female">female</option>
                      </select>
                  );
                }}
              />
              <p className={classes.currGender}>{userData.gender}</p>
              <h4 className={classes.label}>gender</h4>
            </div>
          </div>
          <div
            className={classes.privateInformationSetting}
            id="privateInformationSetting"
            style={{ display: "none", flexDirection: "column" }}
          >
            <div className={classes.loginSetting}>
              <Controller
                name="email"
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: "email is required, please fill this field",
                  },
                  minLength: {
                    value: 5,
                    message: "email filed length is too short",
                  },
                  maxLength: {
                    value: 30,
                    message: "email filed length is too long",
                  },
                }}
                render={() => {
                  return (
                    <input
                      type="email"
                      placeholder="Email"
                      className={
                        errors.email ? classes.errorInp : classes.loginInp
                      }
                      {...register("email")}
                    />
                  );
                }}
              />
              <p className={classes.currLogin}>{userData.email}</p>
              <h4 className={classes.label}>email</h4>
            </div>
            <div className={classes.passwordSetting}>
              <Controller
                name="password"
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: "password field is required",
                  },
                  minLength: {
                    value: 8,
                    message: "password field length is too short",
                  },
                  maxLength: {
                    value: 100,
                    message: "password field length is too long",
                  },
                }}
                render={() => {
                  return (
                    <input
                      type="password"
                      placeholder="Password"
                      className={
                        errors.password ? classes.errorInp : classes.passwordInp
                      }
                      {...register("password")}
                    />
                  );
                }}
              />
              <p className={classes.currPassword}>
                {passwordLengthWithStars(userData.password)}
              </p>
              <h4 className={classes.label}>password</h4>
            </div>
          </div>
          <div
            className="preferencesInformationSetting"
            id="preferencesInformationSetting"
            style={{ display: "none", flexDirection: "column" }}
          ></div>
        </div>
        <div className={classes.submitComponent}>
          <input type="submit" />
        </div>
      </form>
    </div>
  );
}
