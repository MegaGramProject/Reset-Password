function HeaderBar({loginText, signupText}) {    
    function takeUserToLogin() {
        window.location.href = "http://34.111.89.101/login-register/login";
    }

    function takeUserToSignup() {
        window.location.href = "http://34.111.89.101/login-register/signup";
    }

    return (
        <>
            <div className="headerBarDiv" style={{justifyContent: 'space-between'}}>
                <a href="http://34.111.89.101/homefeed" className="MegagramText">
                    Megagram
                </a>

                <div style={{display:'flex', alignItems:'center', marginRight: '2em', gap: '0.5em'}}>
                    <button onClick={takeUserToLogin} className="blueButton" style={{
                    padding: '0.5em 1em', backgroundColor: '#2189eb', fontSize: '0.75em',
                    cursor: 'pointer', overflowWrap:'break-word', width: '5em'}}>
                        {loginText}
                    </button>

                    <button onClick={takeUserToSignup} className="blueButton" style={{padding: '0.5em 1em',
                    backgroundColor: 'white', color: "#2189eb", fontSize: '0.75em',
                    cursor: 'pointer', overflowWrap:'break-word', width: '6em'}}>
                        {signupText}
                    </button>
                </div>
            </div>
        </>
    );
}

export default HeaderBar;