import * as React from 'react'
import * as ReactDOM from 'react-dom'
import RCPhoneNumber from '../src'

const App: React.SFC<any> = (): JSX.Element => (<div style={{width: '25%'}}>
  <RCPhoneNumber value="+79107409656" withIpLookup />
</div>)

ReactDOM.render(<App />, document.getElementById('app'))
