function Popup({closePopup, popupHeaderText, popupMessageText}) {
    
    return (
        <div style={{width:'40em', borderStyle:'solid', borderRadius:'1.7em', borderColor:'lightgray',
        borderWidth: '0.12em', zIndex: 10, backgroundColor: 'white', display: 'flex', flexDirection: 'column',
        alignItems: 'center'}}>
            <h1 style={{overflowWrap: 'break-word', maxWidth: '80%'}}>
                {popupHeaderText}
            </h1>
            <p style={{color:'gray', fontSize: '1.1em', marginTop: '1em', overflowWrap: 'break-word', maxWidth: '80%'}}>
                {popupMessageText}
            </p>

            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', borderStyle: 'solid',
            borderColor: 'lightgray', borderLeft: 'none', borderRight: 'none', borderBottom: 'none',
            marginTop: '2em', width: '100%'}}>
                <p style={{color:'#2890eb', fontSize: '1.5em', fontWeight:'bold', cursor:'pointer'}} onClick={closePopup}>
                    Ok
                </p>
            </div>
        </div>
    );
}


export default Popup;
