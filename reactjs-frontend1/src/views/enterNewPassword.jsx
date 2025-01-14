import React, { Component } from 'react';
import { useParams } from 'react-router-dom';
import Footer from "../components/DidYouForgetPasswordPageComponents/footer";
import HeaderBar from "../components/EnterNewPasswordPageComponents/headerBar";
import MainBox from "../components/EnterNewPasswordPageComponents/mainBox";
import '../styles.css';


class EnterNewPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            language: "English",
            inputValue: "",
            inputValue2: "",
            isButtonEnabled: "",
            passwordStrengthBarShown: false,
            passwordStrength: "0em",
            username: "",
            footerText: "Megagram, a web-app that blends a bit of Instagram with a bit of Amazon, is a personal project created by Rishav Ray."
        };
        
        document.title = "Enter new Password";
    }

    async componentDidMount() {
        //const params = useParams();
        //const { username } = params;
        //this.setState({username: username});
    }

    getLanguage = (newLanguage) =>  {
        this.setState({ language: newLanguage });
    }


    onInputChange1 = (value, buttonStatus) => {
        this.setState({
            inputValue: value,
            isButtonEnabled: buttonStatus,
        });
    }

    onInputChange2 = (value, buttonStatus) => {
        this.setState({
            inputValue2: value,
            isButtonEnabled: buttonStatus,
        });
    }

    onPasswordStrengthChange = (passwordStrength) => {
        const width = passwordStrength/1 *24.75;
        this.setState({
            passwordStrength: width.toString()+"em",
        });
    }

    toggleStrengthBar = () => {
        const newValue = !(this.state.passwordStrengthBarShown);
        this.setState({
            passwordStrengthBarShown: newValue
        });
    }

    


    render() {
        return (
            <>
                <HeaderBar language={this.state.language}/>
                <div style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                    <MainBox language={this.state.language} inputValue={this.state.inputValue} inputValue2={this.state.inputValue2}
                    isButtonEnabled={this.state.isButtonEnabled} onInputChange1={this.onInputChange1} onInputChange2={this.onInputChange2}
                    passwordStrengthBarShown={this.state.passwordStrengthBarShown} passwordStrength = {this.state.passwordStrength}
                    setPasswordStrength={this.onPasswordStrengthChange} toggleStrengthBar = {this.toggleStrengthBar} username={this.state.username}/>
                    
                    <Footer changeLanguage={this.changeLanguage} footerText={this.state.footerText}/>
                </div>
            </>
        );
    };
}

export default EnterNewPassword;


