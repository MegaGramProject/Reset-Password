import React, { Component } from 'react';
import './styles.css';

class HeaderBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
        title: "Megagram"
        };
    }

    headingStyle = {
        fontFamily: 'Billabong',
        textAlign: 'center',
        paddingTop: '0.6em',
        fontSize: '2.8em'
    };

    titleStyle = {
        cursor: 'pointer'
    };

    takeUserToLogin() {
        window.location.href = "http://localhost:8000/login";
    };

    render() {
        return (
        <React.Fragment>
        <h1 class="headerMegagram" style={this.headingStyle}><span onClick={this.takeUserToLogin} style={this.titleStyle}>{this.state.title}</span></h1>
        <hr />
        </React.Fragment>);
    }
}

export default HeaderBar;