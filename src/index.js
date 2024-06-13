import 'bootstrap/dist/css/bootstrap.css';
import React from "react";
import ReactDOM from "react-dom";
import Footer from "./components/footer";
import HeaderBar from "./components/headerBar";
import MainBox from "./components/mainBox";


ReactDOM.render(<HeaderBar />, document.getElementById('headerBar'));
ReactDOM.render(<MainBox />, document.getElementById('mainBox'));
ReactDOM.render(<Footer />, document.getElementById('footer'));