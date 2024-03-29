import React from 'react'
import './DescriptionBox.css'

const DescriptionBox = () => {
  return (
    <div className='descriptionbox'>
        <div className="descriptionbox-navigator">
            <div className="descriptionbox-nav-box">Description</div>
            <div className="descriptionbox-nav-box fade">Reviews (122)</div>
        </div>
      <div className="descriptionbox-description">
        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nulla debitis repellendus maxime cupiditate quod nisi sequi, dolorum odio corrupti quos minus ad est ipsam a odit nihil veniam, laborum animi.</p>
      </div>
    </div>
  )
}

export default DescriptionBox
