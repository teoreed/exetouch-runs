
import React from 'react';


let CountdownTimer  = require('react-countdown-to-future-date');



const Countdown = () => {
    return (
        <CountdownTimer className="countdown" givenDate={"June, 12, 2020"} />
    );
}
 
export default Countdown;