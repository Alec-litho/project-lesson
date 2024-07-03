import { ReactComponentElement, useState } from 'react'
import classes from './style/settings.module.css'
import { useSelector } from 'react-redux'
import { RootState } from '../../app/store'
 import { Controller, useForm } from 'react-hook-form'

interface IDefaultValuesDTOs {
    public: {name: string, location: string, age: number},
    private: {password: string, email: string}
}


export default function Settings() {
    let userData = useSelector((state:RootState) => state.auth.userInfo)
    let [currSettingComponent, setCurrSettingComponent] = useState<JSX.Element>(<PublicInformationSettings {...userData}/>);
    let [currSettingDTO, setCurrSettingDTO] = useState<string>("public");
    const defaultValuesDTOs:IDefaultValuesDTOs = {
        public: {name: userData.fullName, location: userData.location, age: userData.age},
        private: {password: userData.password, email:userData.email}
    }
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isValid }
    } = useForm({defaultValues: defaultValuesDTOs[currSettingDTO  as keyof IDefaultValuesDTOs]})
    return (
        <div className={classes.settingsComponent}>
            <div className={classes.leftSideMenu}>
                <ul>
                    <li onClick={() => {setCurrSettingComponent(<PublicInformationSettings {...userData}/>);setCurrSettingDTO("public")}}>Public information</li>
                    <li onClick={() => {setCurrSettingComponent(<PrivateInformationSettings {...userData}/>);setCurrSettingDTO("private")}}>Private information</li>
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
                <input type="email" className={classes.loginInp} />
                <p className={classes.currLogin}>{privateInfo.email}</p>
            </div>
            <div className={classes.passwordSetting}>
                <input type="password" className={classes.passwordInp} />
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