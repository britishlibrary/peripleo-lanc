import React from 'react';
import { MdGpsFixed } from 'react-icons/md';

const MyLocation = props => {

  const onSuccess = position => {
    const { latitude, longitude } = position.coords;
    props.onPanTo(latitude, longitude);
  }

  const onError = error =>
    console.warn('Error fetching location: ' + error.message);

  const onClick = () => 
    navigator.geolocation.getCurrentPosition(onSuccess, onError, {
      enableHighAccuracy: true
    });

  return (
    <button 
      className="p6o-my-location"
      tabIndex={40}
      aria-label="Go to my location"
      onClick={onClick}>
      <MdGpsFixed />
    </button>
  )

}

export default MyLocation;