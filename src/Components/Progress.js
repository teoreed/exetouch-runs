import React from "react";
import { Progress, Statistic, Responsive } from "semantic-ui-react";
import { round } from 'mathjs';

const ProgressBar = ({distanceVal}) => {

    console.log("distance val: " + distanceVal);

    if (distanceVal > 2000) {
        distanceVal = 2000
    }

    

    return ( 
        

        <div className="progressDiv">
            <h3>EUTRC HAS RUN</h3>
            <Responsive as={Statistic} className="stat" minWidth={460} size="small" inverted horizontal>
                <Statistic.Value>
                    {round(distanceVal,1)}
                </Statistic.Value>
                <Statistic.Value>
                    /2000 
                </Statistic.Value>   
                <Statistic.Label>
                    KM
                </Statistic.Label> 
            </Responsive>
            <Responsive as={Statistic} className="stat" maxWidth={459} size="tiny" inverted horizontal>
                <Statistic.Value>
                    
                    {round(distanceVal,1)}
                </Statistic.Value>
                <Statistic.Value>
                    /2000
                </Statistic.Value>   
                <Statistic.Label>
                    KM
                </Statistic.Label> 
            </Responsive>
            <Progress color="green" size="big" value={distanceVal} total={2000} active />
        </div>
        );   
    
    }

export default ProgressBar;