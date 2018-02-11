import * as React from 'react'
import * as ReactDOM from 'react-dom'
import RCPhoneNumber from '../src'

const App: React.SFC<any> = (): JSX.Element => (
  <div style={{width: '25%'}}>
    <p>With initial value</p>
    <RCPhoneNumber value="+79107409656" />
    <br />
    <p>With prefered contries</p>
    <RCPhoneNumber preferredCountries={['in', 'us', 'uk']} />
    <br />
    <p>With Ip-lookup</p>
    <RCPhoneNumber withIpLookup />
  </div>
)

ReactDOM.render(<App />, document.getElementById('app'))
