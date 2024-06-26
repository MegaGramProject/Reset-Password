import React, { Component } from 'react';
import Footer from "./footer";
import HeaderBar from "./headerBar";
import MainBox from "./mainBox";
import Popup from './popup';
import './styles.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
        language: "English",
        inputValue: "",
        isButtonEnabled: false,
        isPopupEnabled: false,
        popupHeader: "",
        popupMessage: ""
        };
        this.deletePopup = this.deletePopup.bind(this);
        };

    changeLanguage = (newLanguage) =>  {
        this.setState({ language: newLanguage });
    }

    onInputChange = (value, buttonStatus) => {
        this.setState({
            inputValue: value,
            isButtonEnabled: buttonStatus,
        });
    }

    deletePopup() {
        this.setState({
        isPopupEnabled: false,
        isButtonEnabled: true,
        });
    }

    
    isValidEmail(email) {
        let atIndex = email.indexOf('@');
        if (atIndex < 1 || email.indexOf('@', atIndex + 1) !== -1) {
            return false;
        }
        let localPart = email.substring(0, atIndex);
        let domainPart = email.substring(atIndex + 1);
        if (localPart.length === 0 || localPart.length > 64) {
            return false;
        }

        if (domainPart.length === 0 || domainPart.length > 255) {
            return false;
        }
        let dotIndex = domainPart.indexOf('.');
        if (dotIndex < 1 || dotIndex === domainPart.length - 1) {
            return false;
        }
        let domainLabels = domainPart.split('.');
        for (let label of domainLabels) {
            if (label.length === 0 || label.length > 63) {
                return false;
            }
        }
        return true;
    };

    isValidNumber(number) {
        const phoneRegex = /^\d{8,17}$/;
        return phoneRegex.test(number);
    };

    usernameIsValid(usernameInput) {
        if (usernameInput.length > 30 || usernameInput.length < 1) {
            return false;
        }

        for (let i = 0; i < usernameInput.length; i++) {
            let char = usernameInput[i];
            if (!(char >= 'A' && char <= 'Z') && !(char >= 'a' && char <= 'z') &&
                !(char >= '0' && char <= '9') && char !== '.' && char !== "_") {
                return false;
            }
        }

        return true;
    };

    sendLoginLink = (input) => {
        if(this.isValidEmail(input)) {
            const apiUrl = "http://localhost:8003/sendLoginLink";
            const data = {"email": input}
            const options = {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }
            fetch(apiUrl, options)
            .then(response => {
                if (!response.ok) {
                    this.setState({
                        isButtonEnabled: false,
                        isPopupEnabled: true,
                        popupHeader: "Error",
                        popupMessage: "The network response was not ok"
                    })
                }
                return response.json();
            }).then(data => {
                if(data.userFound) {
                    this.setState({
                        isButtonEnabled: false,
                        isPopupEnabled: true,
                        popupHeader: "Email Sent",
                        popupMessage: "The login-link has been sent to your email-address"
                    });
                }
                else {
                    this.setState({
                        isButtonEnabled: false,
                        isPopupEnabled: true,
                        popupHeader: "Error",
                        popupMessage: "User not Found"
                    });

                }
                }).catch(error => {
                    this.setState({
                        isButtonEnabled: false,
                        isPopupEnabled: true,
                        popupHeader: "Error",
                        popupMessage: "There has been an issue with the server"
                    })
                });;
    }
    else if(this.isValidNumber(input)) {
        const apiUrl = "http://localhost:8003/sendLoginLink";
        const data = {"number": input}
        const options = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }
        fetch(apiUrl, options)
        .then(response => {
            if (!response.ok) {
                this.setState({
                    isButtonEnabled: false,
                    isPopupEnabled: true,
                    popupHeader: "Error",
                    popupMessage: "The network response was not ok"
                    })
            }
            return response.json();
        }).then(data => {
            if(data.userFound) {
                this.setState({
                    isButtonEnabled: false,
                    isPopupEnabled: true,
                    popupHeader: "Text Sent",
                    popupMessage: "The login-link has been sent to your number"
                });
            }
            else {
                this.setState({
                    isButtonEnabled: false,
                    isPopupEnabled: true,
                    popupHeader: "Error",
                    popupMessage: "User not Found"
                });

            }}).catch(error => {
                this.setState({
                    isButtonEnabled: false,
                    isPopupEnabled: true,
                    popupHeader: "Error",
                    popupMessage: "There has been an issue with the server"
                })
            });;

    }
    else {
        const apiUrl = "http://localhost:8003/sendLoginLink";
        const data = {"username": input}
        const options = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }
        fetch(apiUrl, options)
        .then(response => {
            if (!response.ok) {
                this.setState({
                    isButtonEnabled: false,
                    isPopupEnabled: true,
                    popupHeader: "Error",
                    popupMessage: "The network response was not ok"
                    })
            }
            return response.json();
        }).then(data => {
            if(data.userFound) {
                this.setState({
                    isButtonEnabled: false,
                    isPopupEnabled: true,
                    popupHeader: "Link Sent",
                    popupMessage: "The login-link has been sent to your contactInfo"
                    })
            }
            else {
                this.setState({
                    isButtonEnabled: false,
                    isPopupEnabled: true,
                    popupHeader: "Error",
                    popupMessage: "User not found"
                })
            }
            }).catch(error => {
                this.setState({
                    isButtonEnabled: false,
                    isPopupEnabled: true,
                    popupHeader: "Error",
                    popupMessage: "There has been an issue with the server"
                })
            });
    }
    }




    render() {
        const popupDivStyle = {
            display: this.state.isPopupEnabled ? "flex" : "none",
            flexDirection:'column',
            alignItems:'center',
            justifyContent:'center',
            marginTop: '-40em'
        };

        const mainBoxAndFooterDivStyle = {
            display:"flex",
            flexDirection:"column",
            alignItems:"center",
            justifyContent:"center",
            opacity: this.state.isPopupEnabled ? "0.03" : "1",
        };

    

        return (
            <React.Fragment>
                <HeaderBar title="Megagram" />
                <div style={mainBoxAndFooterDivStyle}>
                <MainBox language={this.state.language} inputValue={this.state.inputValue} isButtonEnabled={this.state.isButtonEnabled} popupMessage={this.state.popupMessage}
                onInputChange={this.onInputChange} sendLoginLink={this.sendLoginLink}/>
                <Footer language={this.state.language} changeLanguage={this.changeLanguage} />
                </div>
                <div style={popupDivStyle}>
                <Popup language={this.state.language} deletePopup={this.deletePopup} popupHeader={this.state.popupHeader} popupMessage={this.state.popupMessage}/>
                </div>
            </React.Fragment>
        );
    };
}
export default App;
