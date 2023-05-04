import classes from './register.module.css'

export default function Register() {
    return (
        <div className={classes.background}>
          <div className={classes.window}>
          <div className={classes.container}>
              <h2>Register</h2>
              <div className={classes.register}>
                <div className={classes.email}>
                   <h3>Email</h3>
                   <input/>
                </div>
                <div className={classes.password}>
                   <h3>Password</h3>
                   <input/>
                </div>
                <button className={classes.registerBTN}>Register</button>
              </div>
          </div>
          </div>
          
        </div>
    )
}