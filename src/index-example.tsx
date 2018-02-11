import * as React from 'react'
import * as ReactDOM from 'react-dom'
import RCPhoneNumber from '../src'

class App extends React.Component<any, any> {

  state = { value: undefined }

  render(): JSX.Element {
    return <div style={{width: '25%'}}>
      <RCPhoneNumber
        onChange={e => this.setState({ value: '+' + e.country.dialCode + e.number })}
        onBlur={e => this.setState({ value: '+' + e.country.dialCode + e.number })}
        value={this.state.value}
        withIpLookup
      />
    </div>
  }
}

ReactDOM.render(<App />, document.getElementById('app'))
