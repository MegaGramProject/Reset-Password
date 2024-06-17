import React, { Component } from 'react';
import './styles.css';
var bcrypt = require('bcryptjs');

class MainBox2 extends Component {
    constructor(props) {
        super(props);
        this.state = {
        createAStrongPassword: "Create a Strong Password",
        instructions: "Your password must be at-least 65% strong according to the password-strength bar.",
        inputPlaceholder: "New Password",
        inputPlaceholder2: "New Password, again",
        buttonText: "Reset Password",
        outputMessage: ""
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
        marginBottom: '40em'
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


    handleChange(event) {
        const value = event.target.value;
        this.props.onInputChange(value, this.isValidEmail(value) || this.isValidNumber(value) || this.usernameIsValid(value));
    }

    sendLoginLink() {
        this.props.sendLoginLink(this.props.inputValue);
    }

    
translateTextPromise = async function(text, language1, language2){
    let language1Code;
    let language2Code;
    if(language1===language2) {
        return text;
    }
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
        return "T";
    }
    }

    async updateCreateAStrongPassword(currLang) {
        try {
            const translatedText = await this.translateTextPromise(
                this.state.createAStrongPassword,
                currLang,
                this.props.language
            );
            this.setState({createAStrongPassword: translatedText});
        } catch (error) {
            console.error("Translation failed", error);
        }
    }

    async updateInstructions(currLang) {
        try {
            const translatedText = await this.translateTextPromise(
                this.state.instructions,
                currLang,
                this.props.language
            );
            this.setState({instructions: translatedText});
        } catch (error) {
            console.error("Translation failed", error);
        }
    }

    async updateInputPlaceholder(currLang) {
        try {
            const translatedText = await this.translateTextPromise(
                this.state.inputPlaceholder,
                currLang,
                this.props.language
            );
            this.setState({inputPlaceholder: translatedText});
        } catch (error) {
            console.error("Translation failed", error);
        }
    }

    async updateInputPlaceholder2(currLang) {
        try {
            const translatedText = await this.translateTextPromise(
                this.state.inputPlaceholder2,
                currLang,
                this.props.language
            );
            this.setState({inputPlaceholder2: translatedText});
        } catch (error) {
            console.error("Translation failed", error);
        }
    }

    async updateButtonText(currLang) {
        try {
            const translatedText = await this.translateTextPromise(
                this.state.buttonText,
                currLang,
                this.props.language
            );
            this.setState({buttonText: translatedText});
        } catch (error) {
            console.error("Translation failed", error);
        }
    }

    async updateOrText(currLang) {
        try {
            const translatedText = await this.translateTextPromise(
                this.state.orText,
                currLang,
                this.props.language
            );
            this.setState({orText: translatedText});
        } catch (error) {
            console.error("Translation failed", error);
        }
    }

    async updateCreateAccount(currLang) {
        try {
            const translatedText = await this.translateTextPromise(
                this.state.createAccount,
                currLang,
                this.props.language
            );
            this.setState({createAccount: translatedText});
        } catch (error) {
            console.error("Translation failed", error);
        }
    }

    async updateBackToLogin(currLang) {
        try {
            const translatedText = await this.translateTextPromise(
                this.state.backToLogin,
                currLang,
                this.props.language
            );
            this.setState({backToLogin: translatedText});
        } catch (error) {
            console.error("Translation failed", error);
        }
    }


    async componentDidMount() {
        await this.updateCreateAStrongPassword("English");
        await this.updateInstructions("English");
        await this.updateInputPlaceholder("English");
        await this.updateInputPlaceholder2("English");
        await this.updateButtonText("English");
        await this.updateOrText("English");
        await this.updateCreateAccount("English");
        await this.updateBackToLogin("English");
    }

    async componentDidUpdate(prevProps, prevState) {
        if (prevProps.language !== this.props.language) {
            await this.updateCreateAStrongPassword(prevProps.language);
            await this.updateInstructions(prevProps.language);
            await this.updateInputPlaceholder(prevProps.language);
            await this.updateInputPlaceholder2(prevProps.language);
            await this.updateButtonText(prevProps.language);
            await this.updateOrText(prevProps.language);
            await this.updateCreateAccount(prevProps.language);
            await this.updateBackToLogin(prevProps.language);
        }
    }



    getHashedPassword = function(password, salt) {
        return bcrypt.hashSync(password, salt);
    }

    resetPassword =  () => {
        const createUserURL = "http://localhost:8001/updateUser/" + this.props.username;
        const newSalt = bcrypt.genSaltSync(12);
        const newHashedPassword =  bcrypt.hashSync(this.props.inputValue, newSalt);
        const userData = {"salt":newSalt,"hashedPassword":newHashedPassword};
        const headers  = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        };
        fetch(createUserURL, headers)
        .then(response => {
            if (!response.ok) {
                this.setState({outputMessage: "The network response was not ok"});
            }
            else {
                this.setState({outputMessage: "Your password has been changed successfully!"})
                window.location.href = 'https://www.google.com';
            }
        }).catch(error => {
            this.setState({outputMessage: "There was an issue connecting to the server"});
        }
        );
    
    }


    onInputChange1 = (event) => {
        const value = event.target.value;
        const passwordStrength = this.getPasswordValidity(value);
        this.props.onInputChange1(value, value===this.props.inputValue2 && passwordStrength>=0.65);
        this.props.setPasswordStrength(passwordStrength);
        if(value.length > 0 && this.props.passwordStrengthBarShown==false) {
            this.props.toggleStrengthBar();
        }
        else if(value.length==0 && this.props.passwordStrengthBarShown==true) {
            this.props.toggleStrengthBar();
        }
    }

    onInputChange2 = (event) => {
        const value = event.target.value;
        this.props.onInputChange2(value, value===this.props.inputValue && this.getPasswordValidity(this.props.inputValue)>=0.65);
    }

    getPasswordValidity = function(passwordInput) {
        if(passwordInput.length == 0 || passwordInput.length > 128) {
            return 0;
        }
        const lengthWeight = 0.6;
        const varietyWeight = 0.4;
        
        const lengthScore = Math.min(passwordInput.length / 20, 1);
        
        let varietyScore = 0;
        if (/[a-z]/.test(passwordInput)) varietyScore += 0.25;
        if (/[A-Z]/.test(passwordInput)) varietyScore += 0.25;
        if (/[0-9]/.test(passwordInput)) varietyScore += 0.25;
        if (/[^a-zA-Z0-9]/.test(passwordInput)) varietyScore += 0.25;
    
        const strengthScore = (lengthWeight * lengthScore) + (varietyWeight * varietyScore);
    
        return strengthScore;
    }




    render() {
        const resetPasswordButtonStyle = {
            width: '30em',
            height: '4em',
            backgroundColor: this.props.isButtonEnabled ? '#347aeb' : '#82bbf5',
            cursor: this.props.isButtonEnabled ? 'pointer' : 'initial',
            fontSize: '0.88em',
            fontWeight: 'bold'
        };



        return (
                <React.Fragment>
                <div className="box" style={this.boxStyle}>
                    <p style={{ fontSize: '1.5em', fontWeight: 'bold', marginTop: '0em' }}>{this.state.createAStrongPassword}</p>
                    <p style={{ color: '#828281', fontSize: '1.2em', width: '19em' }}>
                    {this.state.instructions}
                    </p>
                    <input
                        className="textInput"
                        style={{ width: '23em', padding: '1.5em 1em', fontSize: '1.1em'}}
                        type="password"
                        placeholder={this.state.inputPlaceholder}
                        onChange={this.onInputChange1}
                        value = {this.props.inputValue}
                    />
                    <div id="passwordStrengthContainer" style={{width:"24.75em", height:"0.4375em", backgroundColor: "lightgray",
                    display: this.props.passwordStrengthBarShown ? "inline-block" : "none", marginTop:"-2em"}}>
                    <div id="passwordStrength" style={{width: this.props.passwordStrength,  height:"0.4375em", backgroundColor:"green"}}></div>
                    </div>
                    <input
                        className="textInput"
                        style={{ width: '23em', padding: '1.5em 1em', marginTop: '-1em', fontSize: '1.1em'}}
                        type="password"
                        placeholder={this.state.inputPlaceholder2}
                        onChange={this.onInputChange2}
                        value = {this.props.inputValue2}
                    />
                    <button
                        className="blueButton"
                        style={resetPasswordButtonStyle}
                        onClick = {this.props.isButtonEnabled ? this.resetPassword : null}>
                        {this.state.buttonText}
                    </button>
                    <p style={{fontSize:'small'}}>{this.state.outputMessage}</p>
                    <br />
                </div>
                </React.Fragment>
        );
    }
}

export default MainBox2;