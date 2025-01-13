import React, { Component } from 'react';

class HeaderBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loginText: "Log in",
            signupText: "Sign up"
        };
        };

    headingStyle = {
        fontFamily: 'Billabong',
        fontSize: '2.4em',
        };
    
    loginButtonStyle = {
        width: '6em',
        height: '3em',
        backgroundColor: '#2189eb',
        fontSize: '0.7em'
    }

    signupButtonStyle = {
        width: '6em',
        height: '3em',
        backgroundColor: 'white',
        color: "#2189eb",
        fontSize: '0.7em'
        
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
    
        async updateLoginText(currLang) {
            try {
                const translatedText = await this.translateTextPromise(
                    this.state.loginText,
                    currLang,
                    this.props.language
                );
                this.setState({loginText: translatedText});
            } catch (error) {
                console.error("Translation failed", error);
            }
        }
    
        async updateSignupText(currLang) {
            try {
                const translatedText = await this.translateTextPromise(
                    this.state.signupText,
                    currLang,
                    this.props.language
                );
                this.setState({signupText: translatedText});
            } catch (error) {
                console.error("Translation failed", error);
            }
        }

        async componentDidMount() {
            await this.updateLoginText("English");
            await this.updateSignupText("English");
        }
        
        async componentDidUpdate(prevProps, prevState) {
            if (prevProps.language !== this.props.language) {
                await this.updateLoginText(prevProps.language);
                await this.updateSignupText(prevProps.language);
            }
        }

    takeUserToLogin = () => {
        window.location.href = "http://localhost:8000/login";
    }

    takeUserToSignup = () => {
        window.location.href = "http://localhost:8000/signUp";
    }

    render() {
        return (
            <React.Fragment>
            <div style={{display:'flex', justifyContent:'space-around', alignItems: 'end', paddingTop: '0.6em'}}>
            <h3 className="headerMegagram" onClick={this.takeUserToLogin} style={this.headingStyle}><span style={{cursor:'pointer'}}>Megagram</span></h3>
            <div style={{display:'flex', justifyContent:'space-between', paddingBottom:'0.25em'}}>
            <button onClick={this.takeUserToLogin} className="blueButton" style={this.loginButtonStyle}>{this.state.loginText}</button>
            <button onClick={this.takeUserToSignup} className="blueButton" style={this.signupButtonStyle}>{this.state.signupText}</button>
            </div>
            </div>
            <hr />
            </React.Fragment>
        );
    };
}
export default HeaderBar;