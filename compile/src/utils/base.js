module.exports.compileLog = (message) => {

    // construct log
    const logPrefix = `[${(new Date()).toISOString()}]`
    const log = `${logPrefix} ${message}`

    // output
    console.log(log)
}