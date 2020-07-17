import React, {useContext, useEffect} from 'react'
import Contacts from '../contacts/Contacts';
import { ContactFilter } from '../contacts/ContactFilter'
import { ContactForm } from '../contacts/ContactForm';
import AuthContext from '../../context/auth/authContext';

export const Home = () => {
    const authContext = useContext(AuthContext);

    // useEffect runs as soon as the component loads
    useEffect(() => {
        authContext.loadUser();
        // eslint-disable-next-line
    }, []);

    return (
        <div className="grid-2">
            <div>
                {/* Contact Form */}
                <ContactForm></ContactForm>
            </div>
            <div>
                <ContactFilter></ContactFilter>
                <Contacts></Contacts>
            </div>
        </div>
    )
}
