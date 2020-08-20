module.exports = {
    timeout: 100,
    load: {
        before: ["proxy", "responseTime", "logger", "cors", "responses", "gzip"],
        order: [],
        after: ["parser", "router"]
    },
    settings: {
        public: {
            path: './public',
            maxAge: 60000,
        },
        proxy: {
            enabled: true,
            clientPath: './public/client',
        }
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