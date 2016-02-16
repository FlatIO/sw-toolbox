/*
  Copyright 2014 Google Inc. All Rights Reserved.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

// This is a test and we want descriptions to be useful, if this
// breaks the max-length, it's ok.

/* eslint-disable max-len, no-lonely-if */
/* eslint-env browser, mocha */
/* global testHelper */

'use strict';

describe('Test precache method', () => {
  function compareCachedAssets(assetList, cachedAssets) {
    return new Promise((resolve, reject) => {
      var cachedAssetsKeys = Object.keys(cachedAssets);
      cachedAssetsKeys.should.have.length(assetList.length);

      for (var i = 0; i < assetList.length; i++) {
        var key = location.origin + assetList[i];
        if (typeof cachedAssets[key] === 'undefined') {
          reject(new Error('Cache doesn\'t have a cache item for: ' + key));
        }

        // TODO: Check the contents of the cache matches the data files?
      }

      resolve();
    });
  }

  var serviceWorkersFolder = '/test/browser-tests/precache/serviceworkers';

  it('should precache all desired assets in precache-valid', done => {
    var assetList = [
      '/test/data/files/text.txt',
      '/test/data/files/image.png'
    ];
    testHelper.activateSW(serviceWorkersFolder + '/simple.js')
    .then(() => {
      return testHelper.getAllCachedAssets('precache-valid');
    })
    .then(cachedAssets => {
      return compareCachedAssets(assetList, cachedAssets);
    })
    .then(() => done(), done);
  });

  it('should throw an error when precaching a string', done => {
    testHelper.addMessageHandler(function(result) {
      if (result.testPass) {
        done();
      } else {
        done('Unexpected test result.');
      }
    });
    testHelper.activateSW(serviceWorkersFolder + '/single-item.js');
  });

  it('should throw an error when attempting to precache an array of promises', done => {
    testHelper.addMessageHandler(function(result) {
      if (result.testPass) {
        done();
      } else {
        done('Unexpected test result.');
      }
    });
    testHelper.activateSW(serviceWorkersFolder + '/promises.js');
  });

  it.skip('should precache all desired assets from arrays of arrays in precache-valid', done => {
    var assetList = [
      '/test/data/files/text.txt',
      '/test/data/files/text-1.txt',
      '/test/data/files/text-2.txt',
      '/test/data/files/text-3.txt',
      '/test/data/files/text-4.txt',
      '/test/data/files/text-5.txt',
      '/test/data/files/text-6.txt',
      '/test/data/files/text-7.txt',
      '/test/data/files/text-8.txt'
    ];
    testHelper.activateSW(serviceWorkersFolder + '/arrays.js')
    .then(() => {
      return testHelper.getAllCachedAssets('precache-valid');
    })
    .then(cachedAssets => {
      return compareCachedAssets(assetList, cachedAssets);
    })
    .then(() => done(), done);
  });

  it.skip('should precache all desired assets from arrays of arrays of promisesin precache-valid', done => {
    var assetList = [
      '/test/data/files/text.txt',
      '/test/data/files/text-1.txt',
      '/test/data/files/text-2.txt',
      '/test/data/files/text-3.txt',
      '/test/data/files/text-4.txt',
      '/test/data/files/text-5.txt',
      '/test/data/files/text-6.txt',
      '/test/data/files/text-7.txt',
      '/test/data/files/text-8.txt'
    ];
    testHelper.activateSW(serviceWorkersFolder + '/promise-arrays.js')
    .then(() => {
      return testHelper.getAllCachedAssets('precache-valid');
    })
    .then(cachedAssets => {
      return compareCachedAssets(assetList, cachedAssets);
    })
    .then(() => done(), done);
  });

  it.skip('should not precache paths that do no exist', done => {
    var testId = 'precache-non-existant-files';
    var validAssetsList = [
      '/test/data/files/text.txt',
      '/test/data/files/image.png'
    ];
    testHelper.activateSW(serviceWorkersFolder + '/non-existant-files.js')
    .then(() => {
      return testHelper.getAllCachedAssets(testId);
    })
    .then(cachedAssets => {
      return compareCachedAssets(validAssetsList, cachedAssets);
    })
    .then(() => done(), done);
  });

  it('should precache all assets from each install step', done => {
    var toolboxAssetList = [
      '/test/data/files/text.txt',
      '/test/data/files/image.png'
    ];
    var additionalInstallAssets = [
      '/test/data/files/text-1.txt',
      '/test/data/files/text-2.txt'
    ];
    testHelper.activateSW(serviceWorkersFolder + '/custom-install.js')
    .then(() => {
      return testHelper.getAllCachedAssets('precache-custom-install-toolbox');
    })
    .then(cachedAssets => {
      return compareCachedAssets(toolboxAssetList, cachedAssets);
    })
    .then(() => {
      return testHelper.getAllCachedAssets('precache-custom-install');
    })
    .then(cachedAssets => {
      return compareCachedAssets(additionalInstallAssets, cachedAssets);
    })
    .then(() => done(), done);
  });
});
