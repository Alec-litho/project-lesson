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
import { switchGender } from "../../helper_functions/switchGenderOption";

type SettingComponentName = "preferencesInformationSetting" | "publicInformationSetting" | "privateInformationSetting"

export default function Settings() {
  const dispatch = useAppDispatch();
  let userData = useSelector((state: RootState) => state.auth.userInfo);
  const rightSideMenu = useRef<HTMLDivElement>(null);
  const defaultValuesDTOs: IUserData = {
    name: userData.fullName,
    location: userData.location,
    age: userData.age,
    password: userData.password,
    email: userData.email,
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
  function switchSettingComponent(target:SettingComponentName) {
    const settingComponents = [...rightSideMenu.current!.childNodes] as HTMLDivElement[];
    settingComponents.forEach((component) => {
      console.log(component)
      if(component.getAttribute("id") === target) {
        component.style.display = "flex"
      } else {
        component.style.display = "none"
      }
    })
  }

  return (
    <div className={classes.settingsComponent}>
      <div className={classes.leftSideMenu}>
        <ul>
          <li onClick={() => {switchSettingComponent("publicInformationSetting")}}>Public information</li>
          <li onClick={() => {switchSettingComponent("privateInformationSetting")}}>Private information</li>
          <li onClick={() => {switchSettingComponent("preferencesInformationSetting")}}>Preferences</li>
        </ul>
      </div>
      <div className={classes.rightSideBody} ref={rightSideMenu}>
        <div className={classes.userDataInformationSett} id="publicInformationSetting">
          <div className={classes.nameSetting}>
            <input type="text" className={classes.nameInp} />
            <p className={classes.currName}>{userData.fullName}</p>
          </div>
          <div className={classes.locationSetting}>
            <input type="text" className={classes.locationInp} />
            <p className={classes.currLocation}>{userData.location}</p>
          </div>
          <div className={classes.ageSetting}>
            <input type="date" className={classes.ageInp} />
            <p className={classes.currAge}>{userData.age}</p>
          </div>
          <div className={classes.genderSetting}>
            <div className={classes.genderBox}>
              <input
                type="radio"
                className="male"
                onClick={(e) => switchGender(e)}
              />
              <input
                type="radio"
                className="female"
                onClick={(e) => switchGender(e)}
              />
            </div>

            <p className={classes.currGender}>{userData.gender}</p>
          </div>
        </div>
        <div className={classes.privateInformationSett} id="privateInformationSetting">
          <div className={classes.loginSetting}>
            <input
              type="email"
              placeholder="Email"
              className={classes.loginInp}
            />
            <p className={classes.currLogin}>{userData.email}</p>
          </div>
          <div className={classes.passwordSetting}>
            <input
              type="password"
              className={classes.passwordInp}
              placeholder="Password"
            />
            <p className={classes.currPassword}>
              {passwordLengthWithStars(userData.password)}
            </p>
          </div>
        </div>
        <div className="preferencesInformationSetting" id="preferencesInformationSetting">

        </div>
      </div>
    </div>
  );
}
