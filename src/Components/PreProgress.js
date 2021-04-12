import React from "react";
import {  Statistic } from "semantic-ui-react";

const PreProgress = () => {

    return ( 
        
        <div className="progressDiv">
            <h3>EUTRC IS GOING TO RUN</h3>
            <Statistic className="stat" size="tiny" inverted horizontal>
                <Statistic.Value>
                    2000 
                </Statistic.Value>   
                <Statistic.Label>
                    KM
                </Statistic.Label> 
            </Statistic>
            <h3>IN AID OF <a className="mind" href="http://www.mind.org.uk/" target="_blank" >MIND</a></h3>
            <div className="line"></div>
            <br /> 
            <h3 className="counterPrefix">STARTING IN</h3>
        </div>
        );   
    
    }

export default PreProgress;