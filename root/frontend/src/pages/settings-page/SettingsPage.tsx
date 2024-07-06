import { ReactComponentElement, useState } from 'react'
import classes from './style/settings.module.css'
import { useSelector } from 'react-redux'
import { RootState } from '../../app/store'
 import { Control, Controller, useForm } from 'react-hook-form'
import { useAppDispatch } from '../../hooks/reduxCustomHooks'
import { updateUserData } from '../../features/authSlice'


/*
I cant use displaying errors because i have a problem with passing props to component - it gives me this error:
"Type '{ fullName: string; email: string; password: string; location: string; friends: number; age: number; gender: string; avatarUrl: string; _id: string; privateInfo: true; }' 
is not assignable to type 'IntrinsicAttributes & IUser'.
Property 'privateInfo' does not exist on type 'IntrinsicAttributes & IUser'

*/


export default function Settings() {
    const dispatch = useAppDispatch();
    let userData = useSelector((state:RootState) => state.auth.userInfo)
    let [currSettingComponent, setCurrSettingComponent] = useState<JSX.Element>(<PublicInformationSettings {...userData}/>);
    const defaultValuesDTOs:IUserData = {name: userData.fullName, location: userData.location, age: userData.age, password: userData.password, email:userData.email}
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isValid }
    } = useForm({defaultValues: defaultValuesDTOs})
    const onSubmit = (defVals: IUserData) => {
        dispatch(updateUserData({_id: userData._id, updatedUserData: defVals}))
         
      };
    return (
        <div className={classes.settingsComponent}>
            <div className={classes.leftSideMenu}>
                <ul>
                    <li onClick={() => {setCurrSettingComponent(<PublicInformationSettings {...userData}/>)}}>Public information</li>
                    <li onClick={() => {setCurrSettingComponent(<PrivateInformationSettings {...userData} />)}}>Private information</li>
                    <li onClick={() => setCurrSettingComponent(<PreferenceSettings/>)}>Preference</li>
                </ul>
            </div>
            <div className={classes.rightSideBody}>
                {currSettingComponent}
                <div className={classes.publishChanges}>
                    <button className={classes.publish}>Send changes</button>
                </div>
            </div> 
        </div>
    )
} 

function PublicInformationSettings(publicInfo:IUser) {

    function switchGender(e:React.MouseEvent) {
        let currEl = e.target as HTMLInputElement
        const parentEl = currEl.parentNode as HTMLDivElement
        const childNodes = [...parentEl.childNodes] as HTMLInputElement[]
        currEl.className === "male"? childNodes[1].checked = false : childNodes[0].checked = false
        console.log(childNodes)
    }

    return (
        <div className={classes.publicInformationSett}>
            <div className={classes.nameSetting}>
                <input type="text" className={classes.nameInp} />
                <p className={classes.currName}>{publicInfo.fullName}</p>
            </div>
            <div className={classes.locationSetting}>
                <input type="text" className={classes.locationInp} />
                <p className={classes.currLocation}>{publicInfo.location}</p>
            </div>
            <div className={classes.ageSetting}>
                <input type="date" className={classes.ageInp} />
                <p className={classes.currAge}>{publicInfo.age}</p>
            </div>
            <div className={classes.genderSetting}>
                <div className={classes.genderBox}>
                    <input type="radio" className="male" onClick={(e) => switchGender(e)}/>
                    <input type="radio" className="female" onClick={(e) => switchGender(e)} />
                </div>
                
                <p className={classes.currGender}>{publicInfo.gender}</p>
            </div>
        </div>
    )
}

function PrivateInformationSettings(privateInfo:IUser) {

    function passwordLengthWithStars(currPassword:string) {
        let result = '';
        for (let i = 0; i < currPassword.length; i++) {result += "*"}
        return result
    }

    return (
        <div className={classes.privateInformationSett}>
            <div className={classes.loginSetting}>
                <input
                type="email"
                placeholder="Email" 
                className={classes.loginInp}
              />
                <p className={classes.currLogin}>{privateInfo.email}</p>
            </div>
            <div className={classes.passwordSetting}>
                <input type="password" 
                className={classes.passwordInp}
                placeholder="Password" 
                 />
                <p className={classes.currPassword}>{passwordLengthWithStars(privateInfo.password)}</p>
            </div>
        </div>
    )
}

function PreferenceSettings() {
    return (
        <div className="preferenceInformationSetting">

        </div>
    )
}