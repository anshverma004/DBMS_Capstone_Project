import { useEffect, useState } from 'react';
import { fetchUsers, signupUserApi, loginUserApi } from '../services/api';
import {
    SESSION_USER_KEY,
    SESSION_PAGE_KEY,
    checkIsOwnerAdmin
} from '../utils/authUtils';

export function useAuthSession({ setUsers, setSelectedSeatIds, setMessage }) {
    const [loggedInUser, setLoggedInUser] = useState(() => {
        try {
            const saved = localStorage.getItem(SESSION_USER_KEY);
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });

    const isAdmin = checkIsOwnerAdmin(loggedInUser);

    const [currentPage, setCurrentPage] = useState(() => {
        try {
            const savedUser = localStorage.getItem(SESSION_USER_KEY);
            const savedPage = localStorage.getItem(SESSION_PAGE_KEY);
            return savedUser && savedPage ? savedPage : 'landing';
        } catch {
            return 'landing';
        }
    });

    const [prefilledEmail, setPrefilledEmail] = useState('');
    const [selectedUserId, setSelectedUserId] = useState(() => {
        try {
            const saved = JSON.parse(localStorage.getItem(SESSION_USER_KEY) || 'null');
            return saved?.user_id ? Number(saved.user_id) : 1;
        } catch {
            return 1;
        }
    });

    useEffect(() => {
        if (!isAdmin && (currentPage === 'admin' || currentPage === 'analytics')) {
            setCurrentPage(loggedInUser ? 'theaters' : 'landing');
        }
    }, [isAdmin, currentPage, loggedInUser]);

    useEffect(() => {
        try {
            if (loggedInUser) {
                localStorage.setItem(SESSION_USER_KEY, JSON.stringify(loggedInUser));
            } else {
                localStorage.removeItem(SESSION_USER_KEY);
            }
            localStorage.setItem(SESSION_PAGE_KEY, currentPage);
        } catch {

        }
    }, [loggedInUser, currentPage]);

    async function handleSignupSubmit({ fullName, email }) {
        const res = await signupUserApi({ fullName, email });
        if (res.users) {
            setUsers(res.users);
        } else {
            const freshUsers = await fetchUsers();
            setUsers(freshUsers);
        }
        setPrefilledEmail(email);
        setMessage('Account created successfully! Please log in below.');
        setCurrentPage('login');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    async function handleLoginSubmit({ email }) {
        const res = await loginUserApi({ email });
        if (res.user) {
            setLoggedInUser(res.user);
            setSelectedUserId(Number(res.user.user_id));
        }
        setMessage(`Welcome, ${res.user?.full_name || email}! Select a theater below to view seats.`);
        setCurrentPage('theaters');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function handleLogout() {
        setLoggedInUser(null);
        setPrefilledEmail('');
        setSelectedSeatIds([]);
        setMessage('You have logged out.');
        setCurrentPage('landing');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    return {
        loggedInUser,
        isAdmin,
        currentPage,
        setCurrentPage,
        prefilledEmail,
        selectedUserId,
        handleSignupSubmit,
        handleLoginSubmit,
        handleLogout
    };
}
