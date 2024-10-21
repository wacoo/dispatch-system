export default function authHeader() {
    const user = JSON.parse(sessionStorage.getItem('user'));

    if (user && user.access) {
        return { Authorization: 'Bearer ' + user.access };
    } else {
        return {};
    }
}