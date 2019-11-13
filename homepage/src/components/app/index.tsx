import * as React from 'react'
import styled from 'styled-components'

import config from '../../config'
import MeasurementCard from '../measurement-card'
import { mapMeasurement } from './utils'

import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Lato&display=swap');
  * {
    margin: 0;
    padding: 0;
    font-family: 'Lato', sans-serif;
  }

  body {
    background-color: #eee;
    color: #333;
  }
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  align-content: space-around;
  min-height: 100vh;
`

const Cards = styled.div`
  display: grid;
  grid-template-areas:
    ". . . . "
    ". indoor-SDS_P2 outdoor-SDS_P2 ."
    ". indoor-SDS_P1 outdoor-SDS_P1 ."
    ". indoor-humidity indoor-temperature ."
    ". . . . ";
`

interface AppState {
  indoor: measurement[]
  outdoor: measurement[]
}

class App extends React.PureComponent<{}, AppState> {
  state: AppState = {
    indoor: [],
    outdoor: []
  }

  componentDidMount() {
    ; (async () => {
      const res = await fetch(`https://api.${config.tld}/initial-payload`)
      const { indoor, outdoor } = await res.json()
      this.setState({
        indoor: indoor.map(mapMeasurement('indoor')),
        outdoor: outdoor.map(mapMeasurement('outdoor'))
      })
    })()
  }

  render() {
    const { indoor, outdoor } = this.state
    return (
      <Wrapper>
        <GlobalStyle />

        <Cards>
          {indoor.map(measurement => (
            <MeasurementCard key={measurement.label} measurement={measurement} />
          ))}
          {outdoor.map(measurement => (
            <MeasurementCard key={measurement.label} measurement={measurement} />
          ))}
        </Cards>
      </Wrapper>
    )
  }
}

export default App
