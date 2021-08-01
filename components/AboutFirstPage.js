import React from 'react'
import Lottie from 'lottie-react'
import animationData from '@public/dataNonFast-4.json'
import styled from 'styled-components'
import Grid from '@material-ui/core/Grid'


const StyledPage = styled.div`
    width: 100vw;
    height: 100vh;
`
const StyledText = styled.div`
    text-align: center;
   
    color: white;
    font-size: 2.2em;
    font-family: 'Lato', sans-serif;
`

class AboutFirstPage extends React.Component {
    constructor(props) {
        super(props);
        this.lottieRef = React.createRef()
    }
    componentDidMount() {
       /* console.log(this.lottieRef)
        if (this.props.doPlay) {
            this.lottieRef.current.play()
        }*/
    }
    componentDidUpdate() {
        /*
        if (this.props.doPlay) {
            this.lottieRef.current.play()
        }*/
    }
    render() {
        return (
            <StyledPage>
            <Lottie
                lottieRef={this.lottieRef} loop={false} autoplay={false} animationData={animationData} loop = {true}
                
            />
                <div style = {{'position': 'absolute', 'top': '0'}}>
                <Grid style = {{'position': 'absolute', 'top': '0%','left': '0%', 'height': '100vh', 'width': '100vw'}} container justify = 'center' alignItems = 'center'>
                    <Grid item xs= {12}>
                        <StyledText>I was born here </StyledText>
                    </Grid> </Grid>
                    </div>
                {
            /*<Lottie
                lottieRef={this.lottieRef} loop={false} autoplay={false} animationData={animationData}
                style={{ 'position': 'relative', 'top': '10%', 'height': '90%', 'width': '100%' }}
            />*/}
            </StyledPage>
        );
    }

}

export default AboutFirstPage;


