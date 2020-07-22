module.exports = {
    timeout: 100,
    settings: {
        public: {
            path: './public',
            maxAge: 60000,
        },
        frontend: {
            enabled: true,
            path: './public/frontend',
            routes: [
                '/',
                '/login',
                '/dashboard',
                '/student',
                '/workspace',
                '/sandbox',
                '/roster/:id',
                '/activity',
                '/catalogue'
            ]
        },
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