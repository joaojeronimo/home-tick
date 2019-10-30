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

interface AppState {
  measurements: measurement[]
}

class App extends React.PureComponent<{}, AppState> {
  state: AppState = {
    measurements: [],
  }

  componentDidMount() {
    ;(async () => {
      const res = await fetch(`https://api.${config.tld}/initial-payload`)
      const measurements = await res.json()
      this.setState({
        measurements: measurements.map(mapMeasurement),
      })
    })()
  }

  render() {
    const { measurements } = this.state
    return (
      <Wrapper>
        <GlobalStyle />
        {measurements.map(measurement => (
          <MeasurementCard key={measurement.label} measurement={measurement} />
        ))}
      </Wrapper>
    )
  }
}

export default App
