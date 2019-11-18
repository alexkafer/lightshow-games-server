import React from 'react';
import logo from './logo.svg';
import './App.css';

import Onboarding from 'react-native-onboarding-swiper';
import { AppRegistry, StyleSheet, Text, View, Image } from 'react-native-web';


function App() {
  return (
    <div className="App">
      <Onboarding pages={[
        {
          backgroundColor: '#fff',
          image: <Image source={logo} />,
          title: 'Onboarding',
          subtitle: 'Done with React Native Onboarding Swiper',
        }
      ]}
    />
    </div>
  );
}

// AppRegistry.registerComponent('App', () => App);
// AppRegistry.runApplication('App', { rootTag: document.getElementById('react-root') });

export default App;
