import { assert } from 'chai'
import { paratii } from './test-utils/helpers'

describe('Uploader Tool', function () {
  it('should have basic flow in place', async function () {
    // see https://github.com/Paratii-Video/paratii-portal/issues/8
    const video = {
      title: 'Some title',
      description:
        'Description of the video which can be pretty long and may contain dïàcrítics'
    }
    browser.url('http://localhost:8080/upload')

    const fileToUpload = `${__dirname}/data/pti-logo.mp4`
    browser.waitForExist('input[type="file"]')
    browser.chooseFile('input[type="file"]', fileToUpload)

    // now we should see a form to fill in
    browser.waitForExist('#video-title')
    // the form should contain the id of our video
    var videoId = browser.getValue('input#video-id')
    assert.isOk(videoId)
    assert.isOk(videoId.length > 8)
    browser.setValue('#video-title', video.title)
    browser.setValue('#video-description', video.description)
    // submit the form
    browser.click('#video-submit')
    // // we now should be on the status screen

    // wait untilt he video is saved on the blockchain
    const getVideoInfoFromBlockchain = async function () {
      try {
        const videoInfoFromBlockchain = await paratii.eth.vids.get(videoId)
        return videoInfoFromBlockchain
      } catch (err) {
        // console.log(err)
      }
    }
    browser.waitUntil(getVideoInfoFromBlockchain)
    const videoInfoFromBlockchain = await getVideoInfoFromBlockchain()
    assert.isOk(videoInfoFromBlockchain)
    assert.equal(videoInfoFromBlockchain.owner, paratii.config.account.address)

    // now wait until the transcoder is done - we should see a "play" link at this point
    await browser.waitForExist(`a[href="/play/${videoId}"]`)
    await browser.click(`a[href="/play/${videoId}"]`)
    console.log('done?')
  })

  it.skip('cancel upload should work [but is not yet]', function () {
    // start uploading a file
    browser.url('http://localhost:8080/uploader/upload-file')
    const fileToUpload = `${__dirname}/data/data.txt`
    browser.chooseFile('input[type="file"]', fileToUpload)
    browser.click('#upload-submit')
    // (the file is small so is immediately done uploading, but the cancel button should be avaiblabel in any case)
    browser.waitForExist('#cancel-upload')
  })
  it.skip('Upload file should have decent error handling', function () {})

  it.skip('Edit  video should have decent error handling', function () {})
})
