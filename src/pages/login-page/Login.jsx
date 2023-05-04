import classes from './login.module.css'
import {useForm} from 'react-hook-form'
import {useDispatch, useSelector} from 'react-redux'
import {fetchAuth,selectIsAuth} from '../../features/authSlice'


export default function Login() {
  const isAuth = useSelector(selectIsAuth)
  let dispatch = useDispatch()
  const {register, handleSubmit, setError, formState:{errors, isValid}} = useForm({
    defaultValues: {
      email: '',
      password: ''
    },
    mode: 'onChange'
  }) 

  const onSubmit = (vals) => {
    dispatch(fetchAuth(vals))
  }
  console.log(isAuth)
    return (
        <div className={classes.background}>
          <div className={classes.window}>
          <div className={classes.container}>
              <h2>Login</h2>
              {/* onsubmit will call only if login and password are correct */}
              <form onSubmit={handleSubmit(onSubmit)}>
              <div className={classes.login}>
                <div className={classes.email}>
                   <h3>Email</h3>
                   <input
                   type="email"
                   placeholder='Email'
                   required
                    {...register('email', {required: 'need email'})}
                   />
                </div>
                <div className={classes.password}>
                   <h3>Password</h3>
                   <input
                   type="password"
                   placeholder='Password'
                   required
                    {...register('password', {required: 'need password'})}
                   />
                </div>
                <button type="submit" className={classes.loginBTN}>LOGIN</button>
              </div>
              </form>
          </div>
          </div>
          
        </div>
    )
}