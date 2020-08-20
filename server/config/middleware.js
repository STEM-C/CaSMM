module.exports = {
    timeout: 100,
    settings: {
        public: {
            path: './public',
            maxAge: 60000,
        },
        client: {
            enabled: true,
            path: './public/client',
            routes: [
                '/',
                '/login',
                '/dashboard',
                '/student',
                '/workspace',
                '/sandbox',
                '/day',
                '/classroom/*',
                '/teacherlogin'
            ]
        },
        // router: {
        //     prefix: '/api'
        // },
        // logger: {
        //     // dev + prod
        //     level: debug + info,
        //     requests: true + false
        // }
        
        // dev
        // cors: {
        //     enabled: true,
        //     origin: ['http://localhost:3000', 'http://localhost:1337']
        // },
    },
}