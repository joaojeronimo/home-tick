import * as React from 'react'
import styled from 'styled-components'

const Card = styled.div`
  margin: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
`

const Reading = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  order: -1;
`

const Value = styled.span`
  font-size: 40pt;
`

const Unit = styled.span`
  font-size: 16pt;
`

const Label = styled.h1`
  font-size: 12pt;
  font-weight: 400;
  align-self: center;
`

interface MeasurementCardProps {
  measurement: measurement
}

const MeasurementCard = ({ measurement }: MeasurementCardProps) => (
  <Card>
    <CardContent>
      <Label>{measurement.label}</Label>
      <Reading>
        <Value>{measurement.value}</Value>
        <Unit>{measurement.unit}</Unit>
      </Reading>
    </CardContent>
  </Card>
)

export default MeasurementCard
