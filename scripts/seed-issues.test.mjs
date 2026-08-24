import assert from 'node:assert/strict'
import test from 'node:test'
import { indexOpenIssues, issueRouteSlugs } from './seed-issues.mjs'

test('extracts canonical routes from current and legacy seeded issue bodies', () => {
  const body = [
    'See https://deshistartup.com/en/registration/invest-bangladesh-oss',
    'and https://deshistartup.com/case-studies/advance-payment-failures/.'
  ].join('\n')

  assert.deepEqual(issueRouteSlugs(body), [
    'registration/invest-bangladesh-oss',
    'case-studies/advance-payment-failures'
  ])
})

test('indexes routes independently of edited issue titles', () => {
  const index = indexOpenIssues([
    {
      title: 'Research the new OSS process',
      body: 'Stub: https://deshistartup.com/en/registration/invest-bangladesh-oss'
    }
  ])

  assert.equal(index.titles.has('Research the new OSS process'), true)
  assert.equal(index.slugs.has('registration/invest-bangladesh-oss'), true)
})

test('ignores unrelated links and handles missing issue bodies', () => {
  const index = indexOpenIssues([
    { title: 'External reference', body: 'https://example.com/en/registration/company' },
    { title: 'No body', body: null }
  ])

  assert.deepEqual([...index.slugs], [])
  assert.deepEqual([...index.titles], ['External reference', 'No body'])
})
