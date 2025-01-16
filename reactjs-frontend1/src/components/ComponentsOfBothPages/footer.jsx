function Footer({changeLanguage, footerText}) {    
    function changeSelectedLanguage(event) {
        changeLanguage(event.target.value);
    }

    return (
        <>
            <footer style={{color: 'gray', fontSize: '0.88em', marginTop: '16em',
            overflowWrap: 'break-word', maxWidth: '80%'}}>
                {footerText}
            </footer>
            
            <select style={{marginTop: '1em', width: '13em', padding: '0.5em 0.5em', marginBottom: '3em', outline: 'none'}}
            onChange={changeSelectedLanguage}>
                <option value="">Change Language</option>
                <option value="العربية">العربية</option>
                <option value="বাংলা">বাংলা</option>
                <option value="Deutsch">Deutsch</option>
                <option value="English">English</option>
                <option value="Español">Español</option>
                <option value="Français">Français</option>
                <option value="हिंदी">हिंदी</option>
                <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                <option value="Italiano">Italiano</option>
                <option value="日本語">日本語</option>
                <option value="Русский">Русский</option>
                <option value="中国人">中国人</option>
            </select>
        </>
    );
}


export default Footer;
