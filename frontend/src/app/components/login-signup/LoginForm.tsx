"use client";

import { useState } from 'react';
import { getCookie } from 'typescript-cookie'
import { redirect } from "next/navigation";

/*
   IM NOT GOOD WITH TYPESCRIPT, PROBABLY VIOLATING A BUNCH OF BEST PRACTICES
*/
export default function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        const response = await fetch('/accounts/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
            },
            body: JSON.stringify({username, password}),
            credentials: 'include',
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message);
            redirect('/');
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
                Password:
                <input type="password1" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </label>
            <br />
            <button type="submit">Login</button>
        </form>
    );
}