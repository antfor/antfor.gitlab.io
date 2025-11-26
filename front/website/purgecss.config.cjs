module.exports = {
    content: ['./dist/**/*.html','./dist/**/*.js'],
    css: ['./dist/assets/**/*.css'],
    safelist: {
        standard: ['html', 'body', 'btn'],
        deep: [/^col/, /^navbar/, /^container/, /^btn/, /^gap/, /^dropdown/, /^table/, /tooltip.*/, /feedback$/] 
    },
};
