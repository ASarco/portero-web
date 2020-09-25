import React, {useContext} from 'react';
import {auth} from "../firebase";
import { AuthContext } from "../Auth";

function Header(props) {
    const {currentUser} = useContext(AuthContext);
    return (
        <>
            <div>
                <div>{currentUser.email}</div>
                <button onClick={() => auth.signOut()}>Sign out</button>
            </div>
        </>
    );
}

export default Header;