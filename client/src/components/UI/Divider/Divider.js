import React from 'react'

import { Image } from 'react-bootstrap'

const Divider = (props) => {
  return(
    <div className="divider-custom">
      <div className="divider-custom-line"/>
      <div className="divider-custom-icon">
          { props.certification ?
              <i className=""><Image className="dividerCertification" src="static/img/fierro.png"  alt="..."/></i>
              : <i className=""><Image className="dividerIcon" src="static/img/fierro.png"  alt="..."/></i>
          }
              </div>
      <div className="divider-custom-line"/>
    </div>
    )
}

export default Divider

