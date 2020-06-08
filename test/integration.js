const chai = require('chai')
const axios = require('axios')
const expect = chai.expect
const { topics, toolbox, compile } = require('./data')

describe('cms', function() {
    describe('/topics', function() {
        it('should return an array of topics', async function() {

            let response 
            try {
                response = (await axios.get('http://localhost:1337/topics')).data
            } catch (error) {
                throw error
            }

            expect(response).deep.equals(topics)
        })
    })
    
    describe('/activities/toolbox/:id', function() {
        it('should return activity 1\'s toolbox', async function() {

            let response 
            try {
                response = (await axios.get('http://localhost:1337/activities/toolbox/1')).data
            } catch (error) {
                throw error
            }

            expect(response).deep.equals(toolbox)
        })
    })
})

describe('compile', function() {
    describe('/compile', function() {
        it('should compile arduino code', async function() {

            let response 
            try {
                response = (await axios.post('http://localhost:8080/compile', compile.request)).data
            } catch (error) {
                throw error
            }
    
            expect(response).deep.equals(compile.response)
        })
    })
})