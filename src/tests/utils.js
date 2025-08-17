module.exports = {
    generateRandomEmail: () => {
        const randomString = Math.random().toString(36).substring(2, 12);
        return `${randomString}@test.com`;
    },
    generateRandomPassword: () => {
        const randomString = Math.random().toString(36).substring(2, 8);
        return randomString;
    }
}