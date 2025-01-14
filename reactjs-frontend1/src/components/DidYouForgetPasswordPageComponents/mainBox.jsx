import { useState } from 'react';
import lockSymbol from '../../assets/images/lockSymbol.png';

function MainBox({isButtonEnabled, onInputChange, sendLoginLink, troubleLoggingInText, instructionsText,
inputPlaceholderText, buttonText, orText, createAccountText, backToLoginText}) {
    const [inputValue, setInputValue] = useState("")

    function isValidEmail(email) {
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

    function isValidNumber(phoneNumberInput) {
        const phoneRegex = /^\d{8,17}$/;
        return phoneRegex.test(phoneNumberInput);
    };

    function usernameIsValid(usernameInput) {
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


    function handleChange(event) {
        const value = event.target.value;
        setInputValue(value);
        onInputChange(isValidEmail(value) || isValidNumber(value) || usernameIsValid(value));
    }


    return (
            <>
                <div className="box" style={{padding: '3em 1em', width: '31em',
                marginTop: '3em'}}>
                    <img className="iconsToBeAdjustedForDarkMode"
                    src={lockSymbol} style={{width: '47%', height: '47%', objectFit: 'contain', pointerEvents: 'none'}}/>

                    <p style={{ fontSize: '1.5em', fontWeight: 'bold', overflowWrap: 'break-word', maxWidth: '80%'}}>
                        {troubleLoggingInText}
                    </p>
                    <p style={{ color: '#828281', fontSize: '1em', overflowWrap: 'break-word', maxWidth: '80%'}}>
                        {instructionsText}
                    </p>
                    <br/>
                    <input
                        value={inputValue}
                        style={{ width: '19em', padding: '1em 1em', fontSize: '1.1em'}}
                        placeholder={inputPlaceholderText}
                        onChange={handleChange}
                        maxLength="320"
                    />
                    <button
                    className="blueButton"
                    style={{width: '23.5em', height: '3em', backgroundColor: isButtonEnabled ? '#347aeb' : '#82bbf5',
                    cursor: isButtonEnabled ? 'pointer' : '', overflowWrap: 'break-word', maxWidth: '80%'}}
                    onClick = {isButtonEnabled ? () => {sendLoginLink(inputValue)} : null}>
                        {buttonText}
                    </button>

                    <b style={{color: 'gray', overflowWrap: 'break-word', maxWidth: '80%', marginTop: '2em',
                    marginBottom: '2em', fontSize: '1.15em'}}>
                        {orText}
                    </b>

                    <a href="http://34.111.89.101/loginregister/signup"
                    style={{fontWeight: 'bold', fontSize: '1.2em', marginTop: '1em', color:'#079bdb', textDecoration: 'none',
                    overflowWrap: 'break-word', maxWidth: '80%'}}>
                        {createAccountText}
                    </a>
                    <br/>
                </div>
                
                <div id="backToLoginBox" className="box" style={{width: '31em', backgroundColor: '#f7f5f5', borderStyle: 'solid',
                borderColor: 'gray', padding: '1em 1em'}}>
                    <a href="http://34.111.89.101/loginregister/login"
                    style={{ fontWeight: 'bold', fontSize: '1.2em', textDecoration: 'none',
                    overflowWrap: 'break-word', maxWidth: '80%'}}>
                        {backToLoginText}
                    </a>
                </div>
            </>
    );
}

export default MainBox;
