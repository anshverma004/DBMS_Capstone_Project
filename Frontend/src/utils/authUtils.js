export const SESSION_USER_KEY = 'bms_active_user';
export const SESSION_PAGE_KEY = 'bms_active_page';

// Only Ansh (Owner/Admin) has Admin privileges; all other users see customer-only UI
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
