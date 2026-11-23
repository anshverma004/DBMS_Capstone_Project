export const SESSION_USER_KEY = 'cinepulse_active_user';
export const SESSION_PAGE_KEY = 'cinepulse_active_page';

export function checkIsOwnerAdmin(user) {
    if (!user) return false;
    const name = String(user.full_name || '').toLowerCase();
    const email = String(user.email || '').toLowerCase();
    return (
        name.includes('ansh') ||
        email.includes('ansh') ||
        name.includes('admin') ||
        email.includes('admin')
    );
}
