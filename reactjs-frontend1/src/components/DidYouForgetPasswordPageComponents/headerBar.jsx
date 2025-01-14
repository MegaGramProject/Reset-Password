function HeaderBar() {
    return (
        <div style={{width: '100%', borderStyle: 'solid', borderTop: 'none', borderLeft: 'none', borderRight: 'none',
        borderColor: 'lightgray', borderWidth: '0.06em', padding: '1.5em 2em'}}>
            <a href="http://34.111.89.101/loginregister/login" style={{cursor: 'pointer', textDecoration: 'none',
            color: 'black', fontFamily: 'Billabong', fontSize: '2.7em', fontWeight: 'bold'}}>
                Megagram
            </a>
        </div>
    );
}

export default HeaderBar;