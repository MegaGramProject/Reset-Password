import React, { Component } from 'react';
import { useParams } from 'react-router-dom';
import Footer from "./footer";
import HeaderBar2 from "./headerBar2";
import MainBox2 from "./mainBox2";
import './styles.css';


class App2 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            language: "English",
            inputValue: "",
            inputValue2: "",
            isButtonEnabled: "",
            passwordStrengthBarShown: false,
            passwordStrength: "0em",
            username: ""
        };
        
        
    }

    async componentDidMount() {
        const { username } = this.props.params;
        this.setState({username: username});
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
            <React.Fragment>
            <HeaderBar2 language={this.state.language}/>
            <div style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
            <MainBox2 language={this.state.language} inputValue={this.state.inputValue} inputValue2={this.state.inputValue2}
            isButtonEnabled={this.state.isButtonEnabled} onInputChange1={this.onInputChange1} onInputChange2={this.onInputChange2}
            passwordStrengthBarShown={this.state.passwordStrengthBarShown} passwordStrength = {this.state.passwordStrength}
            setPasswordStrength={this.onPasswordStrengthChange} toggleStrengthBar = {this.toggleStrengthBar} username={this.state.username}/>
            <Footer language={this.state.language} changeLanguage={this.changeLanguage} />
            </div>
            </React.Fragment>
        );
    };
}

const App2Wrapper = (props) => {
    const params = useParams();
    return <App2 {...props} params={params} />;
};

export default App2Wrapper;

