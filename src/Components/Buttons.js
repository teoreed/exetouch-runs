import React from 'react';
import { Button, Modal, Header } from 'semantic-ui-react';

const Buttons = ({showModal}) => {
    return (
        <div className="buttonsDiv">

                <Modal closeIcon dimmer trigger={
                    <Button className="btn" inverted size="medium"> Why are we running? </Button> 
                } basic size='small'>
                            <Header content='Why are we running?' />
                            <Modal.Content>
                            <p>
                                In June, Exeter University Touch Rugby Club had planned a tour to Madrid, Spain. 
                                In replace of this, we plan to collectively run the distance from Exeter University to Madrid... 
                                and back! 2000km! ( And raise some money for charity in the process! )
                                <br />
                                <br />
                                For this challenge, we have decided to raise money for MIND, an organisation in support of mental health and global awareness. 
                                They provide advice and support, whilst also campaigning to improve services and encourage better understanding and education on mental health. This website will act as a running counter for our running progress so please visit again to see our progress!
                                <br />
                                <br />
                                Remember: everyone has mental health! 
                            </p>
                            </Modal.Content>
                </Modal>
                <Button size="medium" className="btn" onClick={() => {window.open("http://www.Justgiving.com/fundraising/eutrc/donate", '_blank');}} color="green"> Donate </Button>

        </div>
    );
}
export default Buttons;