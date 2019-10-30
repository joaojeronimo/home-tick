import * as React from 'react'
import * as ReactDOM from 'react-dom'

import App from './components/app'

const main = document.createElement('div')
main.id = 'main'

document.body.appendChild(main)

ReactDOM.render(<App />, main)
