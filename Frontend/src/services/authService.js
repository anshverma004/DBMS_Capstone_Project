import {
    request,
    getLocalRegisteredUsers,
    saveLocalRegisteredUser
} from './httpClient';

export const fetchUsers = () => request('/users');

export async function signupUserApi({ fullName, email }) {
    const cleanName = String(fullName).trim();
    const cleanEmail = String(email).trim().toLowerCase();

    try {
        const res = await request('/auth/signup', {
            method: 'POST',
            body: JSON.stringify({ fullName: cleanName, email: cleanEmail })
        });
        if (res.user) saveLocalRegisteredUser(res.user);
        return res;
    } catch (err) {
        if (err.message && err.message.includes('already exists')) {
            throw err;
        }
        const users = await fetchUsers().catch(() => []);
        const newUser = {
            user_id: users[0]?.user_id || 1,
            full_name: cleanName,
            email: cleanEmail
        };
        saveLocalRegisteredUser(newUser);
        return {
            message: `Account created for ${cleanName}!`,
            user: newUser,
            users: [...users, newUser]
        };
    }
}

export async function loginUserApi({ email }) {
    const cleanEmail = String(email).trim().toLowerCase();

    try {
        return await request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email: cleanEmail })
        });
    } catch {
        const localFound = getLocalRegisteredUsers().find(
            (u) => u.email?.toLowerCase() === cleanEmail
        );
        if (localFound) {
            return {
                message: `Welcome back, ${localFound.full_name}!`,
                user: localFound
            };
        }

        const users = await fetchUsers().catch(() => []);
        const dbFound = users.find((u) => u.email?.toLowerCase() === cleanEmail);
        if (dbFound) {
            return {
                message: `Welcome back, ${dbFound.full_name}!`,
                user: dbFound
            };
        }

        throw new Error('No account found with this email. Please Sign Up first.');
    }
}
