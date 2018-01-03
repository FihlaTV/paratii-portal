/* eslint-disable */
//
// Note for devs: WORK IN PROGRESS
// Check https://github.com/Paratii-Video/paratii-portal/issues/25 for progress
//
//
// MIGRATING FROM paratii-player/tests/
//
//
// Notes:
//    Some of these functions are already tested in paratii-mediaplayer.
//    Those tests do not need to be migrated and can be removed..
//
//
//
//
//
//
//

import { assert } from 'chai'
import { assertUserIsLoggedIn, assertUserIsNotLoggedIn, createUserAndLogin, createPlaylist, createVideo } from './helpers.js'

const playerIsFullScreen = () => !!(
  document.fullscreenElement ||
  document.mozFullScreenElement ||
  document.webkitFullscreenElement ||
  document.msFullscreenElement
)

describe('Player:', function () {

  let videoId = 'QmNZS5J3LS1tMEVEP3tz3jyd2LXUEjkYJHyWSuwUvHDaRJ' // this is  a known videoId defined in fixtures.js

  before(function () {
    browser.addCommand('waitUntilVideoIsPlaying', () => {
      browser.waitUntil(() => (
        parseInt(browser.getAttribute('#video-player', 'currentTime'), 10) !== 0 &&
        browser.getAttribute('#video-player', 'paused') !== 'true' &&
        browser.getAttribute('#video-player', 'ended') !== 'true'
      ))
    })
    browser.addCommand('waitUntilBuffered', () => {
      browser.waitUntil(() => !!browser.execute(() => {
        const playerEl = document.querySelector('#video-player')
        for (let i = 0; i < playerEl.buffered.length; i += 1) {
          if (playerEl.buffered.end(i) > 0) {
            return true
          }
        }
        return false
      }).value)
    })
  })

  beforeEach(function () {
    // server.execute(createVideo, '12345', 'Test 1', '', '', [''], 0)
    // server.execute(createVideo, '23456', 'Test 2', '', '', [''], 0)
    // server.execute(createPlaylist, '98765', 'Playlist test', ['12345', '23456'])
  })

  it('should have basic flow in place', function () {
    // set up the test and add a video via paratii-lib
    // there should be a player here
    browser.url(`http://localhost:8080/play/${videoId}`)
    browser.pause(10000)
    // no need to test all controlers - they are tested in paratii-mediaplayer
  })

  it.skip('play a free video', function () {
    browser.url(`http://localhost:8080/play/${videoId}`)
    browser.waitForExist('#video-player')
    browser.waitForExist('.player-overlay')
    assert.equal(browser.getText('.player-title'), 'Test 1')
    browser.waitForExist('.player-controls')
    assert.isTrue(browser.getAttribute('.player-container', 'class').includes('play'))
    browser.waitAndClick('#play-pause-button')
    assert.isTrue(browser.getAttribute('#nav', 'class').includes('closed'))
    assert.isTrue(browser.getAttribute('.player-container', 'class').includes('pause'))
    assert.isTrue(browser.getAttribute('.player-container', 'class').includes('pause'))
  })

  it.skip('click on the progress bar [TODO]', function () {
    browser.url('http://localhost:3000/play/12345')
    browser.waitForExist('#video-player')
    // browser.waitForExist('#loaded-bar')
    // browser.waitUntil(() => browser.getElementSize('#loaded-bar', 'width') > 30, 5000, 'video load timeout')
    // browser.click('#loaded-bar')
    // browser.pause(2000)
    // assert.notEqual(browser.getText('#current-time'), '00:00')
    // assert.isAbove(browser.getElementSize('#played-bar', 'width'), 0)
    // assert.isAbove(browser.getLocation('#scrubber', 'x'), 0)
  })

  it.skip('click on next video', () => {
    browser.url('http://localhost:3000/play/12345?playlist=98765')
    browser.waitForExist('.player-overlay')
    assert.equal(browser.getText('.player-title'), 'Test 1')
    // Close modal
    // browser.waitForExist('#loginModal')
    // browser.click('#btn-editprofile-close')
    // browser.pause(2000)
    browser.waitAndClick('#next-video-button')
    browser.waitForExist('.player-overlay')
    assert.equal(browser.getText('.player-title'), 'Test 2')
  })

  it.skip('click on previous video', () => {
    browser.url('http://localhost:3000/play/12345?playlist=98765')
    browser.waitForExist('.player-overlay')
    assert.equal(browser.getText('.player-title'), 'Test 1')
    browser.waitAndClick('#previous-video-button')
    browser.waitForExist('.player-overlay')
    assert.equal(browser.getText('.player-title'), 'Test 2')
  })

  it.skip('if a player is within a playlist and it ended related videos don\'t show up [TODO]', () => {
  })

  it.skip('if a player is not within a playlist and it ended related videos show up [TODO]', () => {
  })

  it.skip('like and dislike a video as an anonymous user', () => {
    assertUserIsNotLoggedIn(browser)
    browser.url('http://localhost:3000/play/12345?playlist=98765')
    browser.waitForClickable('#button-like')
    browser.waitUntil(() => (
      browser.getText('#button-like') === '0' &&
      browser.getText('#button-dislike') === '0'
    ))

    browser.click('#button-like')
    browser.waitUntil(() => (
      browser.getText('#button-like') === '1' &&
      browser.getText('#button-dislike') === '0'

    ))

    browser.click('#button-dislike')

    browser.waitUntil(() => (
      browser.getText('#button-like') === '0' &&
      browser.getText('#button-dislike') === '1'
    ))
  })
  it.skip('like and dislike a video as a logged-in user', () => {
    createUserAndLogin(browser)
    assertUserIsLoggedIn(browser)
    browser.url('http://localhost:3000/play/12345?playlist=98765')
    browser.url('http://localhost:3000/play/12345?playlist=98765')
    browser.waitForClickable('#button-like')
    browser.waitUntil(() => (
      browser.getText('#button-like') === '0' &&
      browser.getText('#button-dislike') === '0'
    ))

    browser.click('#button-like')
    browser.waitUntil(() => (
      browser.getText('#button-like') === '1' &&
      browser.getText('#button-dislike') === '0'

    ))

    browser.click('#button-dislike')

    browser.waitUntil(() => (
      browser.getText('#button-like') === '0' &&
      browser.getText('#button-dislike') === '1'
    ))
  })

  it.skip('should play/pause a video when the spacebar is pressed', () => {
    browser.url('http://localhost:3000/play/12345?playlist=98765')
    browser.waitUntilBuffered()
    browser.waitForClickable('#play-pause-button')
    browser.switchTab()
    browser.waitUntil(() => browser.hasFocus('#player-container'))
    browser.keys('Space')
    browser.waitUntilVideoIsPlaying()
    it
    browser.keys('Space')

    browser.waitUntil(() => browser.getAttribute('#video-player', 'paused') === 'true')
  })

  it.skip('should play/pause a video when the player is single-clicked', () => {
    browser.url('http://localhost:3000/play/12345?playlist=98765')
    browser.waitAndRemove('.player-uploader-name')
    browser.waitAndRemove('.player-stats')
    browser.waitAndRemove('.player-title')
    browser.waitAndRemove('.player-info')
    browser.waitUntilBuffered()
    browser.waitAndClick('#video-player')

    browser.waitUntilVideoIsPlaying()

    browser.waitAndClick('#video-player')

    browser.waitUntil(() => browser.getAttribute('#video-player', 'paused') === 'true')
  })

  it.skip('should toggle full-screen mode on double click', () => {
    browser.url('http://localhost:3000/play/12345?playlist=98765')
    browser.waitAndRemove('.player-uploader-name')
    browser.waitAndRemove('.player-stats')
    browser.waitAndRemove('.player-title')
    browser.waitAndRemove('.player-info')
    browser.waitUntilBuffered()
    browser.waitForClickable('#video-player')
    browser.doubleClick('#video-player')

    browser.waitUntil(() => !!browser.execute(playerIsFullScreen).value)

    browser.waitForClickable('#video-player')
    browser.doubleClick('#video-player')

    browser.waitUntil(() => !browser.execute(playerIsFullScreen).value)
  })

  it.skip('should stay in full-screen mode when a video is paused via the space bar', () => {
    browser.url('http://localhost:3000/play/12345?playlist=98765')
    browser.waitUntilBuffered()
    browser.waitAndClick('#play-pause-button')
    browser.waitUntilVideoIsPlaying()

    browser.waitAndClick('#fullscreen-button')

    browser.waitUntil(() => !!browser.execute(playerIsFullScreen).value)

    browser.switchTab()
    browser.keys('Space')

    browser.waitUntil(() => browser.getAttribute('#video-player', 'paused') === 'true')
    browser.waitUntil(() => !!browser.execute(playerIsFullScreen).value)

    browser.waitAndClick('#fullscreen-button')
    browser.waitUntil(() => !browser.execute(playerIsFullScreen).value)
  })
})
