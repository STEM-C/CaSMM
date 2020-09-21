module.exports = ({ env }) => ({
    url: env('REDIS_URL', 'redis://compile_queue:6379')
})