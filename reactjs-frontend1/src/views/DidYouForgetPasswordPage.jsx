import { useState, useEffect } from 'react';
import Footer from "../components/ComponentsOfBothPages/footer";
import HeaderBar from "../components/DidYouForgetPasswordPageComponents/headerBar";
import MainBox from "../components/DidYouForgetPasswordPageComponents/mainBox";
import Popup from '../components/DidYouForgetPasswordPageComponents/popup';
import blackScreen from '../assets/images/blackScreen.png';
import '../styles.css';

function DidYouForgetPasswordPage() {
    const [language , setLanguage] = useState("English");
    const [isButtonEnabled, setIsButtonEnabled] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [popupHeaderText, setPopupHeaderText] = useState("Popup Header");
    const [popupMessageText, setPopupMessageText] = useState("This is the Popup Message");
    const [okText, setOkText] = useState("Ok");
    const [footerText, setFooterText] = useState(
        "Megagram, a web-app that blends a bit of Instagram with a bit of Amazon, is a personal project created by Rishav Ray."
    );
    const [troubleLoggingInText, setTroubleLoggingInText] = useState("Trouble logging in?");
    const [instructionsText, setInstructionsText] = useState(
        "Enter your email, phone, or username and we'll send you a link to get back into your account."
    );
    const [inputPlaceholderText, setInputPlaceholderText] = useState("Email, phone number, or username");
    const [buttonText, setButtonText] = useState("Send login link");
    const [orText, setOrText] = useState("OR");
    const [createAccountText, setCreateAccountText] = useState("Create new account");
    const [backToLoginText, setBackToLoginText] = useState("Back to login");


    const textStateNameToTextStateSetterMappings = {
        'popupHeaderText': setPopupHeaderText,
        'popupMessageText': setPopupMessageText,
        'okText': setOkText,

        'footerText': setFooterText,

        'troubleLoggingInText': setTroubleLoggingInText,
        'instructionsText': setInstructionsText,
        'inputPlaceholderText': setInputPlaceholderText,
        'buttonText': setButtonText,
        'orText': setOrText,
        'createAccountText': setCreateAccountText,
        'backToLoginText': setBackToLoginText
    };
    const languageLongFormToShortCodeMappings = {
        English: "en",
        Français: "fr",
        Español: "es",
        हिंदी: "hi",
        বাংলা: "bn",
        中国人: "zh-CN",
        العربية: "ar",
        Deutsch: "de",
        "Bahasa Indonesia": "id",
        Italiano: "it",
        日本語: "ja",
        Русский: "ru"
    };


    useEffect(() => {
        document.title = "Forgot Password?";
    }, []);

    
    async function changeLanguage(newLanguage) {
        let redisCachedLanguageTranslations = {};
        try {
            const response = await fetch(
                `http://34.111.89.101/loginregister/api/getRedisCachedLanguageTranslations/
                ${language}/${newLanguage}`
            );
            if(!response.ok) {
                console.error("The server had trouble providing the Redis-cached language-translations");
            }
            else {
                redisCachedLanguageTranslations = await response.json();
            }
        }
        catch (error) {
            console.error("There was trouble connecting to the server to get the Redis-cached language-translations");
        }

        const valuesOfTextStatesToTranslate = [];
        const namesOfTextStatesToTranslate = [];
        if(popupHeaderText in redisCachedLanguageTranslations) {
            setPopupHeaderText(redisCachedLanguageTranslations[popupHeaderText]);
        }
        else {
            valuesOfTextStatesToTranslate.push(popupHeaderText)
            namesOfTextStatesToTranslate.push('popupHeaderText');
        }
        if(popupMessageText in redisCachedLanguageTranslations) {
            setPopupMessageText(redisCachedLanguageTranslations[popupMessageText]);
        }
        else {
            valuesOfTextStatesToTranslate.push(popupMessageText)
            namesOfTextStatesToTranslate.push('popupMessageText');
        }
        if(okText in redisCachedLanguageTranslations) {
            setOkText(redisCachedLanguageTranslations[okText]);
        }
        else {
            valuesOfTextStatesToTranslate.push(okText)
            namesOfTextStatesToTranslate.push('okText');
        }
        if(footerText in redisCachedLanguageTranslations) {
            setFooterText(redisCachedLanguageTranslations[footerText]);
        }
        else {
            valuesOfTextStatesToTranslate.push(footerText)
            namesOfTextStatesToTranslate.push('footerText');
        }
        if(troubleLoggingInText in redisCachedLanguageTranslations) {
            setTroubleLoggingInText(redisCachedLanguageTranslations[troubleLoggingInText]);
        }
        else {
            valuesOfTextStatesToTranslate.push(troubleLoggingInText)
            namesOfTextStatesToTranslate.push('troubleLoggingInText');
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
        if(buttonText in redisCachedLanguageTranslations) {
            setButtonText(redisCachedLanguageTranslations[buttonText]);
        }
        else {
            valuesOfTextStatesToTranslate.push(buttonText)
            namesOfTextStatesToTranslate.push('buttonText');
        }
        if(orText in redisCachedLanguageTranslations) {
            setOrText(redisCachedLanguageTranslations[orText]);
        }
        else {
            valuesOfTextStatesToTranslate.push(orText)
            namesOfTextStatesToTranslate.push('orText');
        }
        if(createAccountText in redisCachedLanguageTranslations) {
            setCreateAccountText(redisCachedLanguageTranslations[createAccountText]);
        }
        else {
            valuesOfTextStatesToTranslate.push(createAccountText)
            namesOfTextStatesToTranslate.push('createAccountText');
        }
        if(backToLoginText in redisCachedLanguageTranslations) {
            setBackToLoginText(redisCachedLanguageTranslations[backToLoginText]);
        }
        else {
            valuesOfTextStatesToTranslate.push(backToLoginText)
            namesOfTextStatesToTranslate.push('backToLoginText');
        }

        if (valuesOfTextStatesToTranslate.length>0) {
            let translatedTexts = [];
            try {
                const response1 = await fetch(`http://34.111.89.101/loginregister/api/translateTextsWithRapidAPIDeepTranslate`, {
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

        setLanguage(newLanguage);
    }

    function onInputChange(buttonStatus) {
        setIsButtonEnabled(buttonStatus);
    }

    function closePopup() {
        setShowPopup(false);
    }
    
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

    async function sendLoginLink(input) {
        setIsButtonEnabled(false);
        if(isValidEmail(input)) {
            try {
                const response = await fetch('http://localhost:8003/sendLoginLink', {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "email": input
                    })
                });
                if (!response.ok) {
                    setIsButtonEnabled(true);
                    setShowPopup(true);
                    setPopupHeaderText("Error");
                    setPopupMessageText("The server could not email you the login-link.");
                }
                else {
                    setShowPopup(true);
                    setPopupHeaderText("Success");
                    setPopupMessageText("A login-link has successfully been emailed to you.");
                }
            }
            catch(error) {
                setIsButtonEnabled(true);
                setShowPopup(true);
                setPopupHeaderText("Error");
                setPopupMessageText("There was trouble connecting to the server to email you the login-link.");
            }
        }
        else if(isValidNumber(input)) {
            try {
                const response = await fetch('http://localhost:8003/sendLoginLink', {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "number": input
                    })
                });
                if (!response.ok) {
                    setIsButtonEnabled(true);
                    setShowPopup(true);
                    setPopupHeaderText("Error");
                    setPopupMessageText("The server could not text you the login-link.");
                }
                else {
                    setShowPopup(true);
                    setPopupHeaderText("Success");
                    setPopupMessageText("A login-link has successfully been texted to you.");
                }
            }
            catch(error) {
                setIsButtonEnabled(true);
                setShowPopup(true);
                setPopupHeaderText("Error");
                setPopupMessageText("There was trouble connecting to the server to text you the login-link.");
            }
        }
        else {
            try {
                const response = await fetch('http://localhost:8003/sendLoginLink', {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "username": input
                    })
                });
                if (!response.ok) {
                    setIsButtonEnabled(true);
                    setShowPopup(true);
                    setPopupHeaderText("Error");
                    setPopupMessageText("The server could not send you the login-link.");
                }
                else {
                    setShowPopup(true);
                    setPopupHeaderText("Success");
                    setPopupMessageText("A login-link has successfully been sent to you.");
                }
            }
            catch(error) {
                setIsButtonEnabled(true);
                setShowPopup(true);
                setPopupHeaderText("Error");
                setPopupMessageText("There was trouble connecting to the server to send you the login-link.");
            }
        }
    }

    return (
        <>
            <HeaderBar/>
            <div style={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center"}}>
                <MainBox isButtonEnabled={isButtonEnabled} onInputChange={onInputChange} sendLoginLink={sendLoginLink}
                troubleLoggingInText={troubleLoggingInText} instructionsText={instructionsText}
                inputPlaceholderText={inputPlaceholderText} buttonText={buttonText} orText={orText}
                createAccountText={createAccountText} backToLoginText={backToLoginText}/>

                <Footer changeLanguage={changeLanguage} footerText={footerText}/>
            </div>
            
            {showPopup &&
                <img src={blackScreen} onClick={closePopup}
                style={{position: 'absolute', top: '0%', left: '0%', width: '100%', height: '150%', opacity: '0.7'}}/>
            }
            {showPopup &&
                <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
                    <Popup closePopup={closePopup} popupHeaderText={popupHeaderText} popupMessageText={popupMessageText}
                    okText={okText}/>
                </div>
            }
        </>
    );
}

export default DidYouForgetPasswordPage;
