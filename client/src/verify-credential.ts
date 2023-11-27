import { agent } from './veramo/setup.js'

async function main() {
  const result = await agent.verifyCredential({
    credential: {
      credentialSubject: {
        you: 'Rock',
        id: 'did:web:example.com',
      },
      issuer: {
        id: 'did:ethr:goerli:0x0350eeeea1410c5b152f1a88e0ffe8bb8a0bc3df868b740eb2352b1dbf93b59c16',
      },
      type: ['VerifiableCredential'],
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      issuanceDate: '2022-10-28T11:54:22.000Z',
      proof: {
        type: 'JwtProof2020',
        jwt: 'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIl0sImNyZWRlbnRpYWxTdWJqZWN0Ijp7InlvdSI6IlJvY2sifX0sInN1YiI6ImRpZDp3ZWI6ZXhhbXBsZS5jb20iLCJuYmYiOjE2NjY5NTgwNjIsImlzcyI6ImRpZDpldGhyOmdvZXJsaToweDAzNTBlZWVlYTE0MTBjNWIxNTJmMWE4OGUwZmZlOGJiOGEwYmMzZGY4NjhiNzQwZWIyMzUyYjFkYmY5M2I1OWMxNiJ9.EPeuQBpkK13V9wu66SLg7u8ebY2OS8b2Biah2Vw-RI-Atui2rtujQkVc2t9m1Eqm4XQFECfysgQBdWwnSDvIjw',
      },
    },
  })
  console.log(`Credential verified`, result.verified)
}

main().catch(console.log)