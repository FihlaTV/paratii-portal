describe('🎥 Player:', function () {
  const videoId = 'TXWzBRXgWytP'
  const videoElementSelector = '[data-test-id="player"] video'
  const overlaySelector = '[data-test-id="video-overlay"]'
  const controlsSelector = '[data-test-id="player-controls"]'
  const playpauseButtonSelector = '[data-test-id="playpause-button"]'
  const fullscreenButtonSelector = '[data-test-id="fullscreen-button"]'

  const goToTestVideoUrl = ({ embed, overrideVideoId } = {}) => {
    browser.url(
      `http://localhost:8080/${embed ? 'embed' : 'play'}/${overrideVideoId ||
        videoId}`
    )
    browser.execute(() => {
      window.PLAYER_TEST_DATA = {
        playing: false,
        paused: false
      }
    })
    browser.waitUntil(
      () =>
        browser.execute(videoElementSelector => {
          const videoEl = window.document.querySelector(videoElementSelector)
          if (videoEl) {
            videoEl.addEventListener('playing', () => {
              window.PLAYER_TEST_DATA.playing = true
              window.PLAYER_TEST_DATA.paused = false
            })
            videoEl.addEventListener('pause', () => {
              window.PLAYER_TEST_DATA.paused = true
              window.PLAYER_TEST_DATA.playing = true
            })

            return true
          }

          return false
        }, videoElementSelector).value
    )
  }

  const assertControlsAre = ({ hidden } = { hidden: true }) => {
    browser.waitUntil(
      () =>
        browser.execute(
          (videoElementSelector, controlsSelector, hidden) => {
            const videoEl = document.querySelector(videoElementSelector)
            const controlsEl = document.querySelector(controlsSelector)
            if (videoEl && controlsEl) {
              const videoRect = videoEl.getBoundingClientRect()
              const controlsRect = controlsEl.getBoundingClientRect()
              return hidden
                ? controlsRect.y >= videoRect.y + videoRect.height
                : controlsRect.y < videoRect.y + videoRect.height
            }

            return false
          },
          videoElementSelector,
          controlsSelector,
          hidden
        ).value
    )
  }

  const assertControlsAreHidden = () => assertControlsAre({ hidden: true })
  const assertControlsAreVisible = () => assertControlsAre({ hidden: false })

  before(() => {
    browser.addCommand('waitUntilVideoIsPlaying', function (timeout = 20000) {
      this.waitUntil(
        () =>
          browser.execute(
            () => !!(window.PLAYER_TEST_DATA && window.PLAYER_TEST_DATA.playing)
          ).value,
        timeout,
        `Video did not play after ${timeout}ms`
      )
    })

    browser.addCommand('waitUntilVideoIsPaused', function (timeout = 5000) {
      this.waitUntil(
        () => browser.execute(() => !!window.PLAYER_TEST_DATA.paused).value,
        timeout,
        `Video did not pause after ${timeout}ms`
      )
    })
  })

  beforeEach(() => {
    browser.execute(() => {
      window.PLAYER_TEST_DATA = {
        playing: false,
        paused: false
      }
    })
  })

  const runPlayerExpectations = ({ embed } = {}) => {
    it('plays a video automatically', () => {
      goToTestVideoUrl({ embed })
      browser.waitUntilVideoIsPlaying()
    })

    it('pauses a video when the video overlay is clicked', () => {
      goToTestVideoUrl({ embed })
      browser.waitUntilVideoIsPlaying()
      browser.waitAndClick(overlaySelector)
      browser.waitUntilVideoIsPaused()
    })

    it('does not show the controls by default', () => {
      goToTestVideoUrl({ embed })
      browser.waitUntilVideoIsPlaying()
      assertControlsAreHidden()
      browser.pause(3000)
      assertControlsAreHidden()
    })

    it('shows the controls on hover', () => {
      goToTestVideoUrl({ embed })
      browser.waitUntilVideoIsPlaying()
      assertControlsAreHidden()
      browser.moveToObject(overlaySelector)
      assertControlsAreVisible()
    })

    it('hides the controls after not moving the mouse for approximately 2 seconds', () => {
      goToTestVideoUrl({ embed })
      browser.waitUntilVideoIsPlaying()
      assertControlsAreHidden()
      browser.moveToObject(overlaySelector)
      assertControlsAreVisible()
      browser.pause(2500)
      assertControlsAreHidden()
    })

    it('pauses the video when the playpause button is clicked for the first time', () => {
      goToTestVideoUrl({ embed })
      browser.waitUntilVideoIsPlaying()
      browser.moveToObject(overlaySelector)
      browser.waitAndClick(playpauseButtonSelector)
      browser.waitUntilVideoIsPaused()
    })

    it('toggles between pause and play when repeatedly clicking the playpause button', () => {
      goToTestVideoUrl({ embed })
      browser.waitUntilVideoIsPlaying()
      browser.moveToObject(overlaySelector)
      browser.waitAndClick(playpauseButtonSelector)
      browser.waitUntilVideoIsPaused()
      browser.waitAndClick(playpauseButtonSelector)
      browser.waitUntilVideoIsPlaying()
      browser.waitAndClick(playpauseButtonSelector)
      browser.waitUntilVideoIsPaused()
      browser.waitAndClick(playpauseButtonSelector)
      browser.waitUntilVideoIsPlaying()
    })

    it('should bring the player fullscreen and back', () => {
      goToTestVideoUrl({ embed })
      browser.moveToObject(overlaySelector)
      browser.waitAndClick(fullscreenButtonSelector)
      browser.waitUntil(
        () =>
          browser.execute(videoElementSelector => {
            const videoEl = document.querySelector(videoElementSelector)
            const fullscreenElement =
              document.fullscreenElement ||
              document.webkitFullscreenElement ||
              document.mozFullScreenElement ||
              document.msFullscreenElement

            return fullscreenElement.contains(videoEl)
          }, videoElementSelector).value
      )
      browser.moveToObject(overlaySelector)
      browser.waitAndClick(fullscreenButtonSelector)
      browser.waitUntil(
        () =>
          browser.execute(
            () =>
              !(
                document.fullscreenElement ||
                document.webkitFullscreenElement ||
                document.mozFullScreenElement ||
                document.msFullscreenElement
              )
          ).value
      )
    })
  }

  describe('portal player', () => {
    runPlayerExpectations({ embed: false })
  })

  describe('embed player', () => {
    runPlayerExpectations({ embed: true })
  })
})
