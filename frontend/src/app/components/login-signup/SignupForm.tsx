"use client";

import { useState } from 'react';
import { getCookie } from 'typescript-cookie'
import {redirect} from "next/navigation";

/*
   IM NOT GOOD WITH TYPESCRIPT, PROBABLY VIOLATING A BUNCH OF BEST PRACTICES
*/
export default function SignupForm() {
    const [username, setUsername] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        const response = await fetch('/accounts/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
            },
            body: JSON.stringify({username, email, password1, password2}),
            credentials: 'include',
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message);
            redirect('/accounts/login');
        } else {
            alert(JSON.stringify(data));
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Username:
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </label>
            <br />
            <label>
                Email:
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </label>
            <br />
            <label>
                Password:
                <input type="password1" value={password1} onChange={(e) => setPassword1(e.target.value)} required />
            </label>
            <br />
            <label>
                Confirm Password:
                <input type="password2" value={password2} onChange={(e) => setPassword2(e.target.value)} required />
            </label>
            <br />
            <button type="submit">Sign Up</button>
        </form>
    );
}