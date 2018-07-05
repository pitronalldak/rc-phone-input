import * as React from 'react'
import * as ReactDOM from 'react-dom'
import RCPhoneNumber from '../src'

class App extends React.Component<any, any> {

  public state = { value: undefined }

  public render(): JSX.Element {
    return <div style={{width: '25%'}}>
      <RCPhoneNumber
        onChange={e => console.log(e)}
        onBlur={e => console.log(e)}
        value={this.state.value}
        placeholder="Phone"
        withIpLookup
      />
    </div>
  }
}

ReactDOM.render(<App />, document.getElementById('app'))
