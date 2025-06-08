import { useState } from 'react';

import blueSecurityKey from '../../assets/images/blueSecurityKey.jpg';


function MainBox({username, passwordResetToken, createAStrongPasswordText, instructionsText, inputPlaceholderText,
inputPlaceholder2Text, buttonText}) {
    const [inputValue, setInputValue] = useState('');
    const [inputValue2, setInputValue2] = useState('');
    const [isButtonEnabled, setIsButtonEnabled] = useState('');
    const [passwordStrengthBarShown, setPasswordStrengthBarShown] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState('0em');
    const [outputMessageText, setOutputMessageText] = useState('');


    function resetPassword() {
        setIsButtonEnabled(false);
        fetch(`http://34.111.89.101/reset-passsword/api/resetPassword/${username}/${passwordResetToken}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'newPassword': inputValue
            })
        })
        .then(response => {
            if (!response.ok) {
                setIsButtonEnabled(true);
                setOutputMessageText('The server had trouble updating your password.');
            }
            else {
                setOutputMessageText('Your password has been changed successfully!');
                setTimeout(() => {
                    window.location.href = 'http://34.111.89.101/login-register/login';
                }, 2500)
            }
        }).catch(_ => {
            setIsButtonEnabled(true);
            setOutputMessageText('There was an issue connecting to the server to update your password.');
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
        <div className='box' style={{width: '28em', marginTop: '3em', padding: '2em 2em',
        gap: '0.75em'}}>
                <p className='translatableText' style={{fontSize: '1.36em', fontWeight: 'bold'}}>
                    {createAStrongPasswordText}
                </p>

                <img src={blueSecurityKey} style={{height: '9em', width: '37%', objectFit: 'contain',
                pointerEvents: 'none'}}></img>

                <p className='translatableText' style={{ color: '#a2a4a6', fontSize: '0.9em', marginBottom: '3em'}}>
                    {instructionsText}
                </p>
                <input
                    style={{ width: '23em', padding: '1em 1em', fontSize: '1em'}}
                    type='password'
                    placeholder={inputPlaceholderText}
                    onChange={onInputChange1}
                    value={inputValue}
                />

                {passwordStrengthBarShown && 
                    <div style={{width:'24.75em', height:'0.4375em', backgroundColor: 'lightgray'}}>
                        <div style={{width: `${passwordStrength*100}%`,  height:'0.4375em', backgroundColor:'green'}}></div>
                    </div>
                }

                <input
                    style={{ width: '23em', padding: '1em 1em', fontSize: '1em'}}
                    type='password'
                    placeholder={inputPlaceholder2Text}
                    onChange={onInputChange2}
                    value={inputValue2}
                />

                <button className='blueButton'
                style={{width: '25.5em', height: '2.7em', backgroundColor: isButtonEnabled ? '#347aeb' : '#82bbf5',
                cursor: isButtonEnabled ? 'pointer' : '', fontWeight: 'bold'}}
                onClick = {isButtonEnabled ? resetPassword : null}>
                    <span className='translatableText'>
                        {buttonText}
                    </span>
                </button>

                <p className='translatableText' style={{fontSize:'small', marginBottom: '2em'}}>
                    {outputMessageText} 
                </p>
        </div>
    );
}


export default MainBox;