import React, {ReactElement} from 'react'
import { Booking } from './views/Booking';
import './css/app.css';

export const App:React.FC = ():ReactElement => {
    return (
        <div id="wrapper">
            <Booking />
        </div>
    )
}
