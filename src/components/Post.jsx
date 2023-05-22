import { ReactComponent as Delete } from '../assets/icons/delete.svg'
import { ReactComponent as Change } from '../assets/icons/change.svg'

export default function Post(props) {
    return (
        <div className='post'>
        <div className='postHeader'>
          <div><img className="profileCircle" ></img></div>
          <div className='date'>published on {props.date} {props.year} at {props.time}</div>
          <div className='postTools'>
            <Delete className='icon'/>
            <Change className='icon'/>
          </div>
        </div>
        <div className='text'>{props.text}</div>
        </div>
    )
}