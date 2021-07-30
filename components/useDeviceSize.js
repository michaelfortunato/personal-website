/* This code is taken directory from Ismoil Shokirov 
   See here: https://stackoverflow.com/questions/55151041/window-is-not-defined-in-next-js-react-app
*/

import { useState, useEffect} from "react"
const useDeviceSize = () => {

	const [width, setWidth] = useState(0)
	const [height, setHeight] = useState(0)

	const handleWindowResize = () => {
		setWidth(window.innerWidth);
		setHeight(window.innerHeight);
	}

	useEffect(() => {
		// component is mounted and window is available
		handleWindowResize();
		window.addEventListener('resize', handleWindowResize);
		// unsubscribe from the event on component unmount
		return () => window.removeEventListener('resize', handleWindowResize);
	}, []);

	return [width, height]

}

export default useDeviceSize