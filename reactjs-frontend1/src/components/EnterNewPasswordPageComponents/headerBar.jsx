function HeaderBar({loginText, signupText}) {    
    function takeUserToLogin() {
        window.location.href = "http://34.111.89.101/loginregister/login";
    }

    function takeUserToSignup() {
        window.location.href = "http://34.111.89.101/loginregister/signup";
    }

    return (
        <>
            <div style={{width: '100%', borderStyle: 'solid', borderTop: 'none', borderLeft: 'none', borderRight: 'none',
            borderColor: 'lightgray', borderWidth: '0.06em', padding: '1.5em 2em', display: 'flex',
            alignItems: 'center', justifyContent: 'space-between'}}>
                <a href="http://34.111.89.101/loginregister/login" style={{cursor: 'pointer', textDecoration: 'none',
                fontFamily: 'Billabong', fontSize: '2.7em', fontWeight: 'bold'}}>
                    Megagram
                </a>

                <div style={{display:'flex', alignItems:'center', marginRight: '2em', gap: '0.5em'}}>
                    <button onClick={takeUserToLogin} className="blueButton" style={{
                    padding: '0.5em 1em', backgroundColor: '#2189eb', fontSize: '0.75em',
                    cursor: 'pointer', overflowWrap: 'break-word', width: '5em', maxWidth: '80%'}}>
                        {loginText}
                    </button>

                    <button onClick={takeUserToSignup} className="blueButton" style={{padding: '0.5em 1em',
                    backgroundColor: 'white', color: "#2189eb", fontSize: '0.75em',
                    cursor: 'pointer', overflowWrap: 'break-word', width: '6em', maxWidth: '80%'}}>
                        {signupText}
                    </button>
                </div>
            </div>
        </>
    );
}

export default HeaderBar;