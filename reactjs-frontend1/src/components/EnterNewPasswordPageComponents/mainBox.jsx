import { useState } from 'react';

function MainBox({username, createAStrongPasswordText, instructionsText, inputPlaceholderText, inputPlaceholder2Text,
buttonText}) {

    const [inputValue, setInputValue] = useState("");
    const [inputValue2, setInputValue2] = useState("");
    const [isButtonEnabled, setIsButtonEnabled] = useState("");
    const [passwordStrengthBarShown, setPasswordStrengthBarShown] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState("0em");
    const [outputMessageText, setOutputMessageText] = useState("");

    function resetPassword() {
        setIsButtonEnabled(false);
        const createUserURL = "http://34.111.89.101/loginregister/api/updateUser/" + username;
        const headers  = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "password": inputValue
            })
        };
        fetch(createUserURL, headers)
        .then(response => {
            if (!response.ok) {
                setIsButtonEnabled(true);
                setOutputMessageText("The server had trouble updating your password.");
            }
            else {
                setOutputMessageText("Your password has been changed successfully!");
                setTimeout(() => {
                    window.location.href = 'http://34.111.89.101/loginregister/login';
                }, 2500)
            }
        }).catch(_ => {
            setIsButtonEnabled(true);
            setOutputMessageText("There was an issue connecting to the server to update your password.");
        });
    }

    function onInputChange1(event) {
        const value = event.target.value;
        setInputValue(value); 
        setPasswordStrengthBarShown(value.length>0);
        
        const passwordStrength = getPasswordStrength(value);;
        setPasswordStrength(passwordStrength);
        setIsButtonEnabled(value === inputValue2 && passwordStrength>=0.65);
    }

    function onInputChange2(event) {
        const value = event.target.value;
        setInputValue2(value);
        setIsButtonEnabled(value === inputValue && getPasswordStrength(inputValue)>=0.65);
    }

    function getPasswordStrength(passwordInput) {
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

    return (
        <div className="box" style={{width: '28em', marginTop: '3em', padding: '2em 2em',
        gap: '0.75em'}}>
                <p style={{fontSize: '1.36em', fontWeight: 'bold', overflowWrap: 'break-word',
                maxWidth: '80%'}}>
                    {createAStrongPasswordText}
                </p>
                <p style={{ color: '#a2a4a6', fontSize: '0.9em', marginBottom: '3em',
                overflowWrap: 'break-word', maxWidth: '80%'}}>
                    {instructionsText}
                </p>
                <input
                    style={{ width: '23em', padding: '1em 1em', fontSize: '1em'}}
                    type="password"
                    placeholder={inputPlaceholderText}
                    onChange={onInputChange1}
                    value={inputValue}
                />

                {passwordStrengthBarShown && 
                    <div style={{width:"24.75em", height:"0.4375em", backgroundColor: "lightgray"}}>
                        <div style={{width: `${passwordStrength*100}%`,  height:"0.4375em", backgroundColor:"green"}}></div>
                    </div>
                }

                <input
                    style={{ width: '23em', padding: '1em 1em', fontSize: '1em'}}
                    type="password"
                    placeholder={inputPlaceholder2Text}
                    onChange={onInputChange2}
                    value={inputValue2}
                />

                <button className="blueButton"
                style={{width: '25.5em', height: '2.7em', backgroundColor: isButtonEnabled ? '#347aeb' : '#82bbf5',
                cursor: isButtonEnabled ? 'pointer' : '', fontWeight: 'bold'}}
                onClick = {isButtonEnabled ? resetPassword : null}>
                    <span style={{overflowWrap: 'break-word', maxWidth: '80%'}}>
                        {buttonText}
                    </span>
                </button>

                <p style={{fontSize:'small', marginBottom: '2em', overflowWrap: 'break-word', maxWidth: '80%'}}>
                    {outputMessageText} 
                </p>
        </div>
    );
}

export default MainBox;