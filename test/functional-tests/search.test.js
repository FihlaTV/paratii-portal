/* eslint-disable */
//
// Note for devs: WORK IN PROGRESS
//
//
// MIGRATING FROM paratii-player/tests/
// Issue where this migratin is tracked: https://github.com/Paratii-Video/paratii-portal/issues/29
//
//
//
//
//
//
//
//
//
//
//
//
import { createVideo } from './test-utils/helpers.js'
import { assert } from 'chai'

describe('Search video :', function() {
  beforeEach(function() {
    browser.url('http:localhost:3000/search')
  })

  it.skip('search is triggered if user enter a 3 character lenght keyword ', function(done) {
    server.execute(
      createVideo,
      '12345',
      'this is the video key title',
      'this is the video key description ',
      'Uploader key name',
      ['foo', 'keyword'],
      0
    )
    browser.setValue('[name="search"]', 'k')
    browser.pause(2000)
    let results = browser.elements('.thumbs-list li')
    assert.equal(results.value.length, 0)

    browser.setValue('[name="search"]', 'ke')
    browser.pause(2000)
    results = browser.elements('.thumbs-list li')
    assert.equal(results.value.length, 0)

    browser.setValue('[name="search"]', 'key')
    browser.pause(2000)
    results = browser.elements('.thumbs-list li')
    assert.equal(results.value.length, 1)
    done()
  })

  it.skip('search must return no video with no matching title', function(done) {
    server.execute(
      createVideo,
      '12345',
      'matching-keyword-title',
      'matching-keyword-description',
      'matching-keyword-user',
      ['foo', 'keyword'],
      0
    )
    browser.setValue('[name="search"]', 'noresultkeyword')
    browser.pause(2000)
    let results = browser.elements('.thumbs-list li')
    assert.equal(results.value.length, 0)
    done()
  })

  it.skip('search must return 4 video with matching keyword in different field', function(done) {
    server.execute(
      createVideo,
      '12345',
      'foo keyword foo',
      'fookeyword1foo',
      'fookeyword1foo',
      ['foo', 'fookeyword1foo'],
      0
    )
    server.execute(
      createVideo,
      '12346',
      'fookeyword2foo',
      'foo keyword foo',
      'fookeyword2foo',
      ['foo', 'fookeyword2foo'],
      0
    )
    server.execute(
      createVideo,
      '12347',
      'fookeyword3foo',
      'fookeyword3foo',
      'foo keyword foo',
      ['foo', 'fookeyword3foo'],
      0
    )
    server.execute(
      createVideo,
      '12348',
      'fookeyword4foo',
      'fookeyword4foo',
      'fookeyword4foo',
      ['foo', 'foo keyword foo'],
      0
    )
    browser.setValue('[name="search"]', 'keyword')
    browser.waitForExist('.thumbs-list li')
    let results = browser.elements('.thumbs-list li')
    assert.equal(results.value.length, 4)
    done()
  })

  it.skip('search must return some video with matching title', function(done) {
    server.execute(
      createVideo,
      '12345',
      'matching-keyword-title',
      '',
      '',
      [],
      0
    )
    browser.setValue('[name="search"]', 'keyword')
    browser.waitForExist('.thumbs-list li')
    let results = browser.elements('.thumbs-list li')
    assert.equal(results.value.length, 1)
    done()
  })

  it.skip('search must return some video with matching description', function(done) {
    server.execute(
      createVideo,
      '12345',
      '',
      'matching-keyword-description',
      '',
      [],
      0
    )
    browser.setValue('[name="search"]', 'keyword')
    browser.waitForExist('.thumbs-list li')
    let results = browser.elements('.thumbs-list li')
    assert.equal(results.value.length, 1)
    done()
  })

  it.skip('search must return some video with matching uploader name', function(done) {
    server.execute(createVideo, '12345', '', '', 'matching-keyword-user', [], 0)
    browser.setValue('[name="search"]', 'keyword')
    browser.waitForExist('.thumbs-list li')
    let results = browser.elements('.thumbs-list li')
    assert.equal(results.value.length, 1)
    done()
  })

  it.skip('search must return some video with matching tags', function(done) {
    server.execute(
      createVideo,
      '12345',
      '',
      '',
      '',
      ['foo', 'matching-keyword-tag'],
      0
    )
    browser.setValue('[name="search"]', 'keyword')
    browser.waitForExist('.thumbs-list li')
    let results = browser.elements('.thumbs-list li')
    assert.equal(results.value.length, 1)
    done()
  })

  it.skip('search must return a video with a matching field and player should open in the right video', function(done) {
    server.execute(
      createVideo,
      '12345',
      'fookeyword1foo',
      '',
      '',
      ['foo', 'matching-keyword-tag'],
      0
    )
    browser.setValue('[name="search"]', 'keyword')
    browser.waitForClickable('.thumbs-list li')
    let results = browser.elements('.thumbs-list li')
    assert.equal(results.value.length, 1)
    let title = browser.getText('.thumbs-list-title')
    browser.click('.thumbs-list li')
    browser.waitForClickable('.player-title')
    let videoTitle = browser.getText('.player-title')
    assert.equal(title, videoTitle)
    done()
  })

  // TODO: out of scope sorting
  it.skip('search results must sorted by price ascending', function(done) {
    done()
  })

  it.skip('search results must sorted by price descending', function(done) {
    done()
  })

  it.skip('search results must sorted by date ascending', function(done) {
    done()
  })

  it.skip('search results must sorted by date descending', function(done) {})
})
