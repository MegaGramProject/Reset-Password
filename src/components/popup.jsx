import React, { Component } from 'react';
import './styles.css';

class Popup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            popupHeader: this.props.popupHeader,
            popupMessage: this.props.popupMessage,
            ok: "OK"
        };
        this.removePopup = this.removePopup.bind(this);
        };

    removePopup(){
            this.props.deletePopup();
        };




    translateTextPromise = async (text, language1, language2) => {
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

    updateHeaderText = async (currLang) => {
        try {
            const translatedText = await this.translateTextPromise(
                this.props.popupHeader,
                currLang,
                this.props.language
            );
            this.setState({popupHeader: translatedText});
        } catch (error) {
            console.error("Translation failed", error);
        }
    }

    updateMessageText = async (currLang) => {
        try {
            const translatedText = await this.translateTextPromise(
                this.state.popupMessage,
                currLang,
                this.props.language
            );
            this.setState({popupMessage: translatedText});
        } catch (error) {
            console.error("Translation failed", error);
        }
    }

    updateOk = async (currLang) => {
        try {
            const translatedText = await this.translateTextPromise(
                this.state.ok,
                currLang,
                this.props.language
            );
            this.setState({ok: translatedText});
        } catch (error) {
            console.error("Translation failed", error);
        }
    }

    componentDidMount = async () => {
        await this.updateHeaderText("English");
        await this.updateMessageText("English");
        await this.updateOk("English");
    }

    async componentDidUpdate(prevProps, prevState) {
        if (prevProps.popupHeader !== this.props.popupHeader) {
            this.setState({ popupHeader: this.props.popupHeader });
            await this.updateHeaderText("English");
        }
        else if(prevProps.language !== this.props.language) {
            await this.updateHeaderText(prevProps.language);
        }
        if (prevProps.popupMessage !== this.props.popupMessage) {
            this.setState({ popupMessage: this.props.popupMessage });
            await this.updateMessageText("English");
        }
        else if(prevProps.language !== this.props.language) {
            await this.updateMessageText(prevProps.language);
        }
        if (prevProps.language !== this.props.language) {
            await this.updateOk(prevProps.language);
        }

    }
    

    render() {
        return (
                <div style={{width:'40em', height: '16em', borderStyle:'solid', borderRadius:'1.7em', borderColor:'lightgray', borderWidth: '0.12em',
                paddingTop:'2em'}}>
                <h3>{this.state.popupHeader}</h3>
                <p style={{color:'gray', fontSize: '1.3em'}}>{this.state.popupMessage}</p>
                <br/>
                <hr/>
                <p style={{color:'#2890eb', fontSize: '1.5em', fontWeight:'bold', cursor:'pointer'}} onClick={this.removePopup}>
                {this.state.ok}</p>
                </div>
        );
    }
}


export default Popup;
