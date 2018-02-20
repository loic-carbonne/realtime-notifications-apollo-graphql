import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import PushNotification from './PushNotification';
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { ToastContainer, toast } from 'react-toastify';

class App extends Component {
  componentWillReceiveProps({ data: { newNotification: { label } } }) {
    toast(label);
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <div className="App-intro">
          <PushNotification/>
        </div>
        <ToastContainer />
      </div>
    );
  }
}

const subNewNotification = gql`
  subscription {
    newNotification {
      label
    }
  }
`;

export default graphql(subNewNotification)(App);
