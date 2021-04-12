
import React, { Component } from 'react';
import axios from 'axios';
import { Loader, Message, Button } from 'semantic-ui-react';
import ProgressBar from './Components/Progress';
import Buttons from './Components/Buttons';
import RecentActivity from './Components/RecentActivity';
import logo from './logo.png';
import * as firebase from 'firebase';
import PreProgress from './Components/PreProgress';
import Countdown from './Components/Countdown';
import Confetti from 'react-confetti';
import windowSize from 'react-window-size';
import UnderConstruction from './Components/UnderConstruction';
require('dotenv').config();




class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      startFundraiser: null,
      totalDistance: 0,
      runningTotal: 0,
      showModal: false,
      isLoading: true,
      stravaData:{},
      zeroThRun: "n/a",
      zeroThRunElaspsed: 0,
      currentRun: "n/a",
      currentRunElapsed: 0,
      hasFailed: false,
      covidlink : "n/a",
    };
  }
  
  getData(db) {
    
    db.collection('api-data').doc('strava').get().then((doc) => {
        let rawData = doc.data();
        this.setState({
          covidlink : rawData.covidLink,
          startFundraiser : rawData.startFundraiser,
          zeroThRun : rawData.zeroThRun,
          zeroThRunElaspsed: rawData.zeroThRunElaspsed,
          currentRun: rawData.currentRun,
          currentRunElapsed: rawData.currentRunElapsed,
          runningTotal: rawData.runningTotal,
          stravaData: {
            accessToken : rawData.accessToken,
            keyExpires : rawData.keyExpires,
            
          }
        })
        console.log(rawData.covidLink);
        if (this.isExpired()) {
          // key expired
          console.log("key expired")
          this.refreshAPI(db);
          return false
        } else {
          console.log("key up to date")
          this.requestStravaData(db);
          // key up to date
          return true
        }


      });
  }

  isExpired() {
    const currentTime = new Date();
    const currentTimeSeconds = Math.floor(currentTime.getTime() /1000);
    const expireTime = this.state.stravaData.keyExpires;
    
    console.log(currentTimeSeconds);
    console.log(expireTime);

    if (currentTimeSeconds < expireTime) {
      return false;
    }
    else {
      return true
    }
  }

  async refreshAPI(db) {
    const tokenurl = 'https://www.strava.com/oauth/token';
    // const proxy = 'http://cors-anywhere.herokuapp.com/';
    
    try {
      let result = await fetch(tokenurl, {
        method: 'post',
        headers: {
          'Accept' : 'application/json',
          'Content-Type' : 'application/json'
        },
        body: JSON.stringify( {
          client_id: 49018,
          client_secret: process.env.REACT_APP_STRAVA_CLIENT_SECRET,
          grant_type: "refresh_token",
          refresh_token: process.env.REACT_APP_STRAVA_REFRESH_TOKEN
        }  )
      })
      .then(response => {
          return response.json();
      }
        );
    db.collection('api-data').doc('strava').update({
      "accessToken" : result.access_token,
      "keyExpires" : result.expires_at,
      "refreshToken" : result.refresh_token,
    }).then(this.getData(db));

    } catch (e) {
      console.log(e);
      this.setState( {
        hasFailed: true
      })
    }
  }

  requestStravaData(db) {
    axios
    .get("https://www.strava.com/api/v3/clubs/610196/activities", {
    params: {
      access_token: this.state.stravaData.accessToken,
      per_page: "200",
      page: 1,
      id: 610196,
    }
  })
    .then(response => {
      let responseData = response.data;
      let i;
      for (i = 0; i < responseData.length; i++) {
          if (responseData[i].name === this.state.currentRun & responseData[i].elapsed_time === this.state.currentRunElapsed) {
              break;
          }
          else {
              this.setState({
                  data : this.state.data.concat(responseData[i]),
                  totalDistance : this.state.totalDistance + responseData[i].distance/1000
              })
          }
      }
      this.setState({
          isLoading:false,
          hasFailed: false
      })
      console.log(response.data);
    })
    .catch((error) => {
      if(error.response.status === 401) {
        try {
          this.refreshAPI(db);
        }
        catch {
          this.setState({
            hasFailed: true
          })
        }
        
      }
      this.setState({
        hasFailed: true
    })
      if (error.response) {
          /*
           * The request was made and the server responded with a
           * status code that falls out of the range of 2xx
           */
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
      } else if (error.request) {
          /*
           * The request was made but no response was received, `error.request`
           * is an instance of XMLHttpRequest in the browser and an instance
           * of http.ClientRequest in Node.js
           */
          console.log(error.request);
      } else {
          // Something happened in setting up the request and triggered an Error
          console.log('Error', error.message);
      }
      console.log(error.config);
  });

  }

  requestStravaDataV2(db) {
    axios
    .get("https://www.strava.com/api/v3/clubs/610196/activities", {
    params: {
      access_token: this.state.stravaData.accessToken,
      per_page: "200",
      page: 1,
      id: 610196,
    }
  })
    .then(response => {
      let responseData = response.data;
      let i;

      console.log(responseData);
      for (i = 0; i < responseData.length; i++) {
          if (responseData[i].name === this.state.currentRun & responseData[i].elapsed_time === this.state.currentRunElapsed) {
            console.log("Reached Current run");
            if (i < 2 ) {
              
              this.setState ({
                data : responseData.slice(0,3)
              });
              break;
            }
          //   this.setState({
          //     data : this.state.data.concat(responseData[i]),
          // })
              break;
          }
          else {
              console.log(responseData[i].distance/1000)
              this.setState({
                  data : this.state.data.concat(responseData[i]),
                  runningTotal : this.state.runningTotal + responseData[i].distance/1000
              })
          }
      }
      this.setState({
          isLoading:false,
          hasFailed: false,
          currentRun: responseData[0].name,
          currentRunElapsed: responseData[0].elapsed_time
      })

      db.collection('api-data').doc('strava').update({
        "currentRun" : this.state.currentRun,
        "currentRunElapsed" : this.state.currentRunElapsed,
        "runningTotal" : this.state.runningTotal
      })


    })
    .catch((error) => {
      if(error.response.status === 401) {
        try {
          this.refreshAPI(db);
        }
        catch {
          this.setState({
            hasFailed: true
          })
        }
        
      }
      this.setState({
        hasFailed: true
    })
      if (error.response) {
          /*
           * The request was made and the server responded with a
           * status code that falls out of the range of 2xx
           */
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
      } else if (error.request) {
          /*
           * The request was made but no response was received, `error.request`
           * is an instance of XMLHttpRequest in the browser and an instance
           * of http.ClientRequest in Node.js
           */
          console.log(error.request);
      } else {
          // Something happened in setting up the request and triggered an Error
          console.log('Error', error.message);
      }
      console.log(error.config);
  });

  }

  componentDidMount() {
    const db = firebase.firestore();
    
    // this.getData(db);

  }


  render() {

    let {runningTotal, totalDistance, isLoading, data, showModal, hasFailed, startFundraiser, covidlink} = this.state;
    console.log("start fundraiser : "+ startFundraiser);
    console.log(covidlink);

    // const { width, height} = useWindowSize();

    return ( 
      <div className="App">
        <React.Fragment>

            <div className="logoDiv">
              <img id="logo" src={logo} alt="Logo" />
              
            </div>
            <div className="covidBtn">
              <Button.Group>
            <Button className="btn" size="medium" onClick={() => {window.open('https://forms.gle/xqiEyPtE2AijrbH67', '_self');}} color="red" > COVID-19 SELF ASSESSMENT </Button>
            <Button className="btn" size="medium" onClick={() => {window.open("https://www.fixr.co/organiser/eutrc", '_blank');}} color="green" > FIXR TICKETS </Button>
            </Button.Group>
            </div>
            {/* <UnderConstruction /> */}
            <div className="usefulLinks">
              <h1>USEFUL LINKS</h1>
              <a href="https://www.youtube.com/watch?v=9syEPGrXKUU">HIGHLIGHTS REEL</a>
              <span>|</span>
              <a href="https://www.youtube.com/watch?v=r8cl2Jg3eMc">PROMO VIDEO</a>
              <span>|</span>
              <a href="http://www.englandtouch.org.uk/">ENGLAND TOUCH</a>
              <span>|</span>
              <a href="https://sport.exeter.ac.uk/studentsport/freshers/?fbclid=IwAR3DSRRLg-7295X6zLcZybioiLPw1FxkoZVgoIaJvqVmoHdaLl_wnZymXRU">FRESHERS WEEK SCHEDULE</a>
            </div>
          
        </React.Fragment>
      </div>
    )
    
    // if (isLoading) {
      
    //     if (!hasFailed) {
    //       return (
    //         <div className="App">
    //           <React.Fragment>
    //               <div className="logoDiv">
    //                 <img id="logo" src={logo} alt="Logo" />
    //               </div>
    //               <div className="loader">
    //                   <Loader size="massive" active inline='centered' inverted/>
    //               </div>
    //           </React.Fragment>
    //         </div>
    //       );
    //     }
    //     else {
    //       return (
    //         <div className="App">
    //           <React.Fragment>

    //               <div className="logoDiv">
    //                 <img id="logo" src={logo} alt="Logo" />
    //               </div>
    //               <Message>
    //               <Message.Header>Woops, Soomething went wrong...</Message.Header>
    //               <p>
    //                 Unfortunately, the site is unable to load our running progress! In order to keep this site free to run, we have to limit the way we load the data!
    //                 But don't worry! we are still running and you can, of course, still donate!
    //                 Come back and try again soon.
    //               </p>
    //             </Message>
    //             <Buttons showModal={showModal} />
                
    //           </React.Fragment>
    //         </div>
    //       );
    //     }

    //   } else {
    //     if (startFundraiser) {
    //       if (totalDistance + runningTotal >= 2000) {
    //         return (
    //           <React.Fragment>
    //             <Confetti
    //               width={this.props.windowWidth}
    //               height={this.props.windowHeight}
    //             />
    //             <div className="App">
    //                 <React.Fragment>
    //                   <div className="logoDiv">
    //                     <img id="logo" src={logo} alt="Logo" />
    //                   </div>
    //                   <ProgressBar distanceVal={totalDistance + runningTotal} />
    //                   <Buttons showModal={showModal} />
    //                   <RecentActivity data={data} />
    //                 </React.Fragment>
    //             </div>
                
    //           </React.Fragment>
    //         );

    //       } else {
    //                   return (
    //                     <React.Fragment>

    //                       <div className="App">
    //                           <React.Fragment>
    //                             <div className="logoDiv">
    //                               <img id="logo" src={logo} alt="Logo" />
    //                             </div>
    //                             <ProgressBar distanceVal={totalDistance + runningTotal} />
    //                             <Buttons showModal={showModal} />
    //                             <RecentActivity data={data} />
    //                           </React.Fragment>
    //                       </div>
                          
    //                     </React.Fragment>
    //                   );
    //                   }
    //               } else {
    //       return (
    //         <React.Fragment>
    //           <div className="App">
    //             <React.Fragment>
    //                 <div className="logoDiv">
    //                   <img id="logo" src={logo} alt="Logo" />
    //                 </div>
    //                 <PreProgress />
    //                 <Countdown />
    //                 <Buttons showModal={showModal} />
                    
    //             </React.Fragment>
    
    //           </div>
    
    //         </React.Fragment>
    
    //       );
    //       } 
    //   } 
    
    } 

}

export default App;
