import React, { Component } from 'react';
import lockSymbol from './images/lockSymbol.png';
import './styles.css';

class MainBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: "",
            language: "English",
            isButtonEnabled: false,
            msg: ""
        };

        this.handleChange = this.handleChange.bind(this);
        this.sendLoginLink = this.sendLoginLink.bind(this);
    }

    boxStyle = {
        paddingLeft: '1.5em',
        paddingRight: '1.5em',
        height: '43em',
        width: '33em',
        marginTop: '3em',
    };

    lockSymbolStyle = {
        width: '55%',
        height: '55%',
        objectFit: 'contain',
        marginTop: '-5.3em',
        pointerEvents: 'none',
        marginRight:'1em'
    };

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
    }

    isValidNumber(number) {
        const phoneRegex = /^\d{8,17}$/;
        return phoneRegex.test(number);
    }

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
    }


    handleChange(event) {
        const value = event.target.value;
        this.setState({
            inputValue: value,
            isButtonEnabled: this.isValidEmail(value) || this.isValidNumber(value) || this.usernameIsValid(value),
        });
    }

    sendLoginLink() {
        if(this.isValidEmail(this.state.inputValue)) {
            const apiUrl = "http://localhost:8002/sendLoginLink";
            const data = {"email": this.state.inputValue}
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
                    throw new Error("Network response not ok");
                }
                return response.json();
            }).then(data => {
                this.setState({
                        msg: "The login-link has been sent to your email-address"
                    })
                });
    }
    else if(this.isValidNumber(this.state.inputValue)) {
        const apiUrl = "http://localhost:8002/sendLoginLink";
        const data = {"number": this.state.inputValue}
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
                throw new Error("Network response not ok");
            }
            return response.json();
        }).then(data => {
            this.setState({
                msg: "The login-link has been sent to your number"
                })
            });

    }
    else {
        const apiUrl = "http://localhost:8002/sendLoginLink";
        const data = {"username": this.state.inputValue}
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
                throw new Error("Network response not ok");
            }
            return response.json();
        }).then(data => {
            if(data.success) {
                this.setState({
                    msg: "The login-link has been sent to your contactInfo"
                    })
            }
            else {
                this.setState({
                    msg: "User not found"
                })
            }
            });
    }
}

    
translateTextPromise = async function(text, language1, language2){
    let language1Code;
    let language2Code;
    if (language1==="English"){
        language1Code = "en";
    }
    else if(language1==="Español") {
        language1Code = "es";
    }
    else if(language1==="Français") {
        language1Code = "fr";
    }
    else if(language1==="हिंदी") {
        language1Code = "hi";
    }
    else if(language1==="中国人") {
        language1Code = "zh-CN";
    }
    else if(language1==="বাংলা"){
        language1Code = "bn";
    }
    else if(language1==="العربية") {
        language1Code = "ar";
    }
    else if(language1==="Deutsch") {
        language1Code = "de";
    }
    else if(language1==="Bahasa Indonesia") {
        language1Code = "id";
    }
    else if(language1==="Italiano"){
        language1Code = "it";
    }
    else if(language1==="日本語") {
        language1Code = "ja";
    }
    else if(language1==="Русский") {
        language1Code = "ru";
    }
    if (language2==="English"){
        language2Code = "en";
    }
    else if(language2==="Español") {
        language2Code = "es";
    }
    else if(language2==="Français") {
        language2Code = "fr";
    }
    else if(language2==="हिंदी") {
        language2Code = "hi";
    }
    else if(language2==="中国人") {
        language2Code = "zh-CN";
    }
    else if(language2==="বাংলা"){
        language2Code = "bn";
    }
    else if(language2==="العربية") {
        language2Code = "ar";
    }
    else if(language2==="Deutsch") {
        language2Code = "de";
    }
    else if(language2==="Bahasa Indonesia") {
        language2Code = "id";
    }
    else if(language2==="Italiano"){
        language2Code = "it";
    }
    else if(language2==="日本語") {
        language2Code = "ja";
    }
    else if(language2==="Русский") {
        language2Code = "ru";
    }
    const apiUrl = "https://deep-translate1.p.rapidapi.com/language/translate/v2";
    const data = {"q":text,"source":language1Code,"target":language2Code};
    const options = {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-host': 'deep-translate1.p.rapidapi.com',
        'x-rapidapi-key': '14da2e3b7emsh5cd3496c28a4400p16208cjsn947339fe37a4'
        },
        body: JSON.stringify(data)
    };
    try {
        const response = await fetch(apiUrl, options);
        if (!response.ok) {
            throw new Error("Network response not ok");
        }
        return response.json()['data']['translations']['translatedText'];
    }

    catch (error) {
        console.error('Error:', error);
        return "";
    }
    }

    translateText(text, language1, language2) {
            if(language1===language2) {
                return text;
                }
            this.translateTextPromise(text, language1, language2).then(translatedText => {
            return translatedText;
            });
        }



    render() {
        const sendLinkButtonStyle = {
            width: '30em',
            height: '3em',
            backgroundColor: this.state.isButtonEnabled ? '#347aeb' : '#82bbf5',
            cursor: this.state.isButtonEnabled ? 'pointer' : 'initial',
        };

        return (
            <React.Fragment>
                <div className="box" style={this.boxStyle}>
                    <img src={lockSymbol} style={this.lockSymbolStyle} alt="Lock Symbol" />
                    <p style={{ fontSize: '1.5em', fontWeight: 'bold', marginTop: '-3em' }}>{this.translateText("Trouble logging in?", "English", this.state.language)}</p>
                    <p style={{ color: '#828281', fontSize: '1.2em', width: '19em' }}>
                    {this.translateText("Enter your email, phone, or username and we'll send you a link to get back into your account.", "English", this.state.language)}
                    </p>
                    <input
                        className="textInput"
                        style={{ width: '23em', padding: '1.5em 1em' }}
                        type="text"
                        placeholder={this.translateText("Email, Phone, or Username", "English", this.state.language)}
                        onChange={this.handleChange}
                    />
                    <button
                        id="sendLinkButton"
                        className="blueButton"
                        style={sendLinkButtonStyle}
                    >
                        {this.translateText("Send login link", "English", this.state.language)}
                    </button>
                    <p id="noUsersFound" style={{color:'black', fontSize:'small', display:'none'}}>{this.translateText(this.state.msg, "English", this.state.language)}</p>
                    <br />
                    <div>
                        <p className="orLine">_________________</p>
                        <p className="OR">{this.translateText("OR", "English", this.state.language)}</p>
                        <p className="orLine" style={{ marginLeft: '0.5em' }}>_________________</p>
                    </div>
                    <a href="http://localhost:8000/signUp" className="noUnderline" style={{ fontWeight: 'bold', fontSize: '1.2em', marginTop: '1em', color:'black'}}>{this.translateText("Create new account", "English", this.state.language)}</a>
                    <br />
                </div>
                <div className="box" style={{ width: '33em', height: '3.2em', backgroundColor: '#f7f5f5', borderStyle: 'solid', borderColor: 'gray', marginBottom: '40em' }}>
                    <a href="http://localhost:8000/login" className="noUnderline" style={{ fontWeight: 'bold', fontSize: '1.2em', color: 'black' }}>{this.translateText("Back to login", "English", this.state.language)}</a>
                </div>
            </React.Fragment>
        );
    }
}

export default MainBox;
