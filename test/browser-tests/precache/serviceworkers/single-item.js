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

'use strict';

/* eslint-env browser */

importScripts('/sw-toolbox.js');

self.toolbox.options.cache = {
  name: 'precache-valid'
};

var thrownError = null;
try {
  self.toolbox.precache('/test/data/files/text.txt');
} catch (err) {
  thrownError = err;
}

// Send message to all client pages (one of which will be
// the test page)
self.clients.matchAll({
  includeUncontrolled: true
})
.then(function(clients) {
  clients.forEach(function(client) {
    client.postMessage(JSON.stringify({
      testPass: (thrownError instanceof TypeError)
    }));
  });
});
