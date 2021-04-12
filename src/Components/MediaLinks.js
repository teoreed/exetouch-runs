import React from 'react';
import {Icon, Menu} from 'semantic-ui-react';

const MediaLinks = () => {
    return ( 
// href="http://www.instagram.com/eutrc/"
// href="http://www.facebook.com/eutrc"
        <React.Fragment>
            <div className="footer">
                {/* <Menu secondary borderless className="footerMenu"> */}
                    <Menu.Item onClick={() => {window.open("http://www.instagram.com/eutrc/", '_blank');}} >
                        <Icon link inverted name="instagram" size="big"  />
                    </Menu.Item>
                    <Menu.Item onClick={() => {window.open("http://www.facebook.com/eutrc/", '_blank');}}>
                        <Icon link inverted name="facebook f" size="big" />
                    </Menu.Item>
                {/* </Menu> */}
            </div>
        </React.Fragment>
        
    );
}
 
export default MediaLinks;