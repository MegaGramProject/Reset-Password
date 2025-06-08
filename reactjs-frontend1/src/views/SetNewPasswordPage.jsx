import { useState, useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Footer from '../components/ComponentsOfBothPages/footer';
import HeaderBar from '../components/SetNewPasswordPageComponents/headerBar';
import MainBox from '../components/SetNewPasswordPageComponents/mainBox';

import '../styles.css';

function SetNewPasswordPage({params}) {
    const [username, setUsername] = useState('');
    const [passwordResetToken, setPasswordResetToken] = useState('');
    const [language, setLanguage] = useState('English');
    const [footerText, setFooterText] = useState(
        'Megagram, a web-application that blends a bit of Instagram with a bit of Amazon, is a personal project of Rishav Ray.'
    );
    const [loginText, setLoginText] = useState('Log in');
    const [signupText, setSignupText] = useState('Sign up');
    const [createAStrongPasswordText, setCreateAStrongPasswordText] = useState('Create a Strong Password');
    const [instructionsText, setInstructionsText] = useState(
        `Your password must be at-least 65% strong according to the password-strength bar.
        Remember that this page is only valid for 30 min, & if you don't reset your password till then, you will
        have to send another login link to your email-address/phone-number!`
    );
    const [inputPlaceholderText, setInputPlaceholderText] = useState('New password');
    const [inputPlaceholder2Text, setInputPlaceholder2Text] = useState('Confirm new password');
    const [buttonText, setButtonText] = useState('Reset password');
    
    const navigate = useNavigate(); 

    const textStateNameToTextStateSetterMappings = {
        'footerText': setFooterText,

        'loginText': setLoginText,
        'signupText': setSignupText,

        'createAStrongPasswordText': setCreateAStrongPasswordText,
        'instructionsText': setInstructionsText,
        'inputPlaceholderText': setInputPlaceholderText,
        'inputPlaceholder2Text': setInputPlaceholder2Text,
        'buttonText': setButtonText,
    };
    const languageLongFormToShortCodeMappings = {
        English: 'en',
        Français: 'fr',
        Español: 'es',
        हिंदी: 'hi',
        বাংলা: 'bn',
        中国人: 'zh-CN',
        العربية: 'ar',
        Deutsch: 'de',
        'Bahasa Indonesia': 'id',
        Italiano: 'it',
        日本語: 'ja',
        Русский: 'ru'
    };


    useEffect(() => {
        document.title = 'Set New Password';

        const { paramsUsername, paramsPasswordResetToken } = params;
        setUsername(paramsUsername);
        setPasswordResetToken(paramsPasswordResetToken);

        const queryString = window.location.search.substring(1);
        const urlParams = new URLSearchParams(queryString);
        const lingo = urlParams.get('language');
        if (lingo) {
            changeLanguage(lingo);
        }
    }, []);


    async function changeLanguage(newLanguage) {
        if(language===newLanguage) {
            return;
        }
        let redisCachedLanguageTranslations = {};
        try {
            const response = await fetch(
                `http://34.111.89.101/login-register/api/getRedisCachedLanguageTranslations/
                ${language}/${newLanguage}`
            );
            if(!response.ok) {
                console.error('The server had trouble providing the Redis-cached language-translations');
            }
            else {
                redisCachedLanguageTranslations = await response.json();
            }
        }
        catch (error) {
            console.error('There was trouble connecting to the server to get the Redis-cached language-translations');
        }

        const valuesOfTextStatesToTranslate = [];
        const namesOfTextStatesToTranslate = [];
        if(footerText in redisCachedLanguageTranslations) {
            setFooterText(redisCachedLanguageTranslations[footerText]);
        }
        else {
            valuesOfTextStatesToTranslate.push(footerText)
            namesOfTextStatesToTranslate.push('footerText');
        }
        if(loginText in redisCachedLanguageTranslations) {
            setLoginText(redisCachedLanguageTranslations[loginText]);
        }
        else {
            valuesOfTextStatesToTranslate.push(loginText)
            namesOfTextStatesToTranslate.push('loginText');
        }
        if(signupText in redisCachedLanguageTranslations) {
            setSignupText(redisCachedLanguageTranslations[signupText]);
        }
        else {
            valuesOfTextStatesToTranslate.push(signupText)
            namesOfTextStatesToTranslate.push('signupText');
        }
        if(createAStrongPasswordText in redisCachedLanguageTranslations) {
            setCreateAStrongPasswordText(redisCachedLanguageTranslations[createAStrongPasswordText]);
        }
        else {
            valuesOfTextStatesToTranslate.push(createAStrongPasswordText)
            namesOfTextStatesToTranslate.push('createAStrongPasswordText');
        }
        if(instructionsText in redisCachedLanguageTranslations) {
            setInstructionsText(redisCachedLanguageTranslations[instructionsText]);
        }
        else {
            valuesOfTextStatesToTranslate.push(instructionsText)
            namesOfTextStatesToTranslate.push('instructionsText');
        }
        if(inputPlaceholderText in redisCachedLanguageTranslations) {
            setInputPlaceholderText(redisCachedLanguageTranslations[inputPlaceholderText]);
        }
        else {
            valuesOfTextStatesToTranslate.push(inputPlaceholderText)
            namesOfTextStatesToTranslate.push('inputPlaceholderText');
        }
        if(inputPlaceholder2Text in redisCachedLanguageTranslations) {
            setInputPlaceholder2Text(redisCachedLanguageTranslations[inputPlaceholder2Text]);
        }
        else {
            valuesOfTextStatesToTranslate.push(inputPlaceholder2Text)
            namesOfTextStatesToTranslate.push('inputPlaceholder2Text');
        }
        if(buttonText in redisCachedLanguageTranslations) {
            setButtonText(redisCachedLanguageTranslations[buttonText]);
        }
        else {
            valuesOfTextStatesToTranslate.push(buttonText)
            namesOfTextStatesToTranslate.push('buttonText');
        }

        if (valuesOfTextStatesToTranslate.length>0) {
            let translatedTexts = [];
            try {
                const response1 = await fetch(`http://34.111.89.101/login-register/api/translateTextsWithRapidAPIDeepTranslate`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        input_texts: valuesOfTextStatesToTranslate,
                        source_lang_shortened_code: languageLongFormToShortCodeMappings[language],
                        target_lang_shortened_code: languageLongFormToShortCodeMappings[newLanguage]
                    })
                });
                if(!response1.ok) {
                    console.error("The server had trouble providing the 'not-already-Redis-cached' language-translations");
                }
                else {
                    translatedTexts = await response1.json();
                    for(let i=0; i<translatedTexts.length; i++) {
                        const nameOfTextStateToTranslate = namesOfTextStatesToTranslate[i];
                        const setterOfTextStateToTranslate = textStateNameToTextStateSetterMappings[nameOfTextStateToTranslate];
                        const translatedText = translatedTexts[i];
                        setterOfTextStateToTranslate(translatedText);
                    }
                }
            }
            catch (error) {
                console.error(
                    "There was trouble connecting to the server to get the 'not-already-Redis-cached' language-translations"
                );
            }
        }

        if (newLanguage === 'English') {
            navigate(`/reset-password/setNewPassword/${username}/${passwordResetToken}`,
            {
                replace: true,
                state: {
                    title: 'Set New Password'
                }
            });
        } else {
            navigate(
                `/reset-password/setNewPassword/${username}/${passwordResetToken}?language=${newLanguage}`,
                {
                    replace: true,
                    state: {
                        title: 'Set New Password'
                    }
                });
        }
        setLanguage(newLanguage);
    }


    return (
        <>
            <HeaderBar loginText={loginText} signupText={signupText}/>
            <div style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                <MainBox username={username} passwordResetToken={passwordResetToken}
                createAStrongPasswordText={createAStrongPasswordText} instructionsText={instructionsText}
                inputPlaceholderText={inputPlaceholderText} inputPlaceholder2Text={inputPlaceholder2Text}
                buttonText={buttonText}
                />
                
                <Footer changeLanguage={changeLanguage} footerText={footerText}/>
            </div>
        </>
    );
}


function SetNewPasswordPageWrapper() {
    const params = useParams();
    return <SetNewPasswordPage params={params} />;
}


export default SetNewPasswordPageWrapper;