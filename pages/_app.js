import { initializeApp } from 'firebase/app'
import { AppBar } from "@mui/material/AppBar"

import '../styles/globals.css'

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD0EmXbXmaMxXwA9JvenDQrOb2rcERik8Q",
  authDomain: "coursespace-lakehead.firebaseapp.com",
  projectId: "coursespace-lakehead",
  storageBucket: "coursespace-lakehead.appspot.com",
  messagingSenderId: "106168839052",
  appId: "1:106168839052:web:2bf8c0b1e2a170edd184a9"
};

initializeApp(firebaseConfig);

export default function MyApp({ Component, pageProps }) {
  return (
    <Component {...pageProps} />
  )
}
