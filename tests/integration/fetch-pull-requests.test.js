const { expect } = require('chai')
const { handler } = require('../../src/handlers/fetch')
const request = require('../__fixtures__/fetch-http-request')

describe('Fetch Pull Requests handler: ', () => {
    it('should extract the url from the request and return an array of all open pull requests with a total number of commits for each open prs.', async () => {
      const { statusCode, body } = await handler(request)
      const { pullRequests } = JSON.parse(body)

      expect(statusCode).to.not.be.undefined
      expect(statusCode).to.equal(200)

      expect(pullRequests).to.not.be.undefined
      expect(pullRequests).to.an('array')

      return pullRequests.map((prPayload) => {
        expect(prPayload).to.have.all.keys([
          'id',
          'user',
          'title',
          'totalCommits'
        ])
        expect(prPayload.id).to.not.be.undefined
        expect(prPayload.id).to.be.a('number')

        expect(prPayload.user).to.not.be.undefined
        expect(prPayload.user).to.be.a('string')

        expect(prPayload.title).to.not.be.undefined
        expect(prPayload.title).to.be.a('string')

        expect(prPayload.totalCommits).to.not.be.undefined
        expect(prPayload.totalCommits).to.be.a('number')
      })
    })

    it('should return a 404 error code if the url is not an existing repo.', async () => {
      const request = {
        queryStringParameters: {
          url: 'https://github.com/colincks/zod'
        }
      }
      const errorResponse = await handler(request)
      const { message: errorMessage } = JSON.parse(errorResponse.body)

      expect(errorResponse.statusCode).to.not.be.undefined
      expect(errorResponse.statusCode).to.equal()

      expect(errorMessage).to.not.be.undefined
      expect(errorMessage).to.equal()
    })
})