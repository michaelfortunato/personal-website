import React from 'react'
import ReactDOM from "react-dom";
import Lottie from 'react-lottie'
import animationData from '../data2.json'



const Triangle = (props) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    
  };
  return (
    <Lottie options={defaultOptions}
      width = '50vw'
      height = '100vh'
      style = {{'position':'relative', 'top':'10%'}}
    />
 
 

  );
}


export default Triangle;
