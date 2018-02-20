import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

class PushNotification extends Component {
  state = { label: '' }

  render() {
    return (
      <div>
        <input
          value={this.state.label}
          onChange={e => this.setState({ label: e.target.value })}
          type="text"
          placeholder="A label"
        />
        <button onClick={() => this._pushNotification()}>Submit</button>
      </div>
    )
  }

  _pushNotification = async () => {
    const { label } = this.state
    await this.props.pushNotificationMutation({
      variables: {
        label
      }
    })
    this.setState({ label: '' });
  }
}

const POST_MUTATION = gql`
mutation PushNotificationMutation($label: String!){
  pushNotification(label: $label) {
    label
  }
}
`

export default graphql(POST_MUTATION, { name: 'pushNotificationMutation' })(PushNotification)
