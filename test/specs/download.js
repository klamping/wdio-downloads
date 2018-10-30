// Load the libraries we need for path/URL manipulation & assertions
const path = require('path')
const fs = require('fs')
const { URL } = require('url')
const assert = require('assert');

const waitForFileExists = require('../../util/waitForFileExists')

describe('Downloads', function () {
  it('should download the file', function () {
    // go to a good page for testing download functionality
    browser.url('./download')

    // store the element reference for repeated use
    const downloadLink = $('*=some-file.txt');

    // click the link to initiate the download
    downloadLink.click();

    // get the value of the 'href' attibute on the download link
    // e.g. 'http://the-internet.herokuapp.com/download/some-file.txt'
    const downloadHref = downloadLink.getAttribute('href');

    // pass through Node's `URL` class
    // @see https://nodejs.org/dist/latest-v8.x/docs/api/url.html
    const downloadUrl = new URL(downloadHref);

    // get the 'pathname' off the url
    // e.g. 'download/some-file.txt'
    const fullPath = downloadUrl.pathname;

    // split in to an array, so we can get just the filename
    // e.g. ['download', 'some-file.txt']
    const splitPath = fullPath.split('/')

    // get just the filename at the end of the array
    // e.g.  'some-file.txt'
    const fileName = splitPath.splice(-1)[0]

    // join the filename to the path where we're storing the downloads
    // '/path/to/wdio/tests/tempDownload/some-file.txt'
    const filePath = path.join(global.downloadDir, fileName)

    // we need to wait for the file to fully download
    // so we use the 'browser.call' function since this is an async operation
    // @see http://webdriver.io/api/utility/call.html
    browser.call(function (){
      // call our custom function that checks for the file to exist
      return waitForFileExists(filePath, 60000)
    });

    // now that we have our file downloaded, we can do whatever we want with it
    // in this example, we'll read the file contents and
    // assert it contains the expected text
    const fileContents = fs.readFileSync(filePath, 'utf-8')
    assert.ok(fileContents.includes('asdf'))
  })
})