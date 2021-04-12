import { Header, Card } from 'semantic-ui-react';
import React from 'react';
import { round } from 'mathjs';


class RecentActivity extends React.Component {
    render() {

        const slicedRuns = this.props.data.slice(0,3);

        const runs = slicedRuns.map((run) => 

            <Card className="card" key={round(run.elapsed_time,0)} target="_blank" href="https://www.strava.com/clubs/610196/recent_activity">
                    <Card.Content>
                        <Card.Header> {run.athlete.firstname} {run.athlete.lastname}</Card.Header>
                        <Card.Meta>{run.name} </Card.Meta>
                        <Card.Description>{run.athlete.firstname} ran {round(run.distance/1000,2)}KM!</Card.Description>
                    </Card.Content>
            </Card>

                );
        return (
            <React.Fragment>
                <div className="recentActivities">
                    <div className="recentHeader">
                        <Header as='h2' icon textAlign='center' inverted>
                            <Header.Content>WHO'S RUNNING?</Header.Content>
                        </Header>
                    </div>
                    <div className="activityDiv">
                        <Card.Group itemsPerRow="3" stackable>
                            {runs}
                        </Card.Group>
                    </div>
                </div>
            </React.Fragment>
        );
    }
    
};
 
export default RecentActivity;

