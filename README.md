# Overview

AngularJS directive for sending scope data to server and receiving response.
This directive is attached to an HTML element.

* Posts scope data via AJAX to server when an event is fired on element.
* Receives error response from server and saves it to scope.

## Install

    bower install <path to github repo>

Include styles and JavaScript:

```HTML
<script src="/bower_components/teg-ng-poster-child/dist/teg-ng-poster-child.min.js"></script>
```

If you need to support browsers that do not understand ECMAScript 5 (like IE8) please also include:

    bower install es5-shim
    <script src="/bower_components/es5-shim/es5-shim.min.js"></script>

## Use in AngularJS app

Add module to your app's dependencies:

    angular.module('YourApp', ['TegNgPosterChild'])

## Usage example

### Click element

```HTML
<button class='TegNgPosterChild'
    data-submit-url='/submit-element'
    data-shared='sharedData'
    data-trigger-events='click'>Click Me</button>
```

### Submit form

```HTML
<form class='TegNgPosterChild'
  data-submit-url='/submit-form'
  data-shared='sharedData'
  data-trigger-events='submit'
  data-on-success-delegate='onSuccess(data)'>

  <!-- Your form content goes here -->

</form>
```

## Sending data to server

When event is fired on HTML element this directive sends scope property supplied in `shared.values` attribute to the server.

## Handling success response from server

Success response can be handled by:

* `success` property in `shared` attribute.

or

* Function in `on-success-delegate` attribute.

## Receiving error response from server

Server can send error messages back to client. It order to do it, reply with HTTP status `422`. The error response data will be saved to `errors` property.

Unexpected errors like 404 or 500 are handled separatelly and saved in `unknownError` property.

## Attributes

### submit-url `required`

  URL where the scope data is submitted.

### shared `required`

  Binds to object that will contains following data shared with parent scope.

  * **values**: Object will be submitted to server.
  * **success**: Data received from server on successfull reponse.
  * **errors**: Error response received from server. Error response is saved when status code is `422` (or matches the customized code in `error-status`).
  * **unknownError**: Unknown error response for erros like  404, 500 etc.
  * **busy**: `true` when an HTTP request is currently being made.

### submit-method `optional`

  HTTP method used to submit `shared.values` data to server.

  Default: 'POST'

### error-status `optional`

  Specify the error status for get error response from server.

  Default: '422'

### trigger-events `optional`

  Specify the event name that will trigger request to server. Multiple event names are comma separated.

  Example: 'post, click'

### on-success-delegate `optional`

  Code to be evaluated when server returns success.

  Arguments passed:

  * **data**: server response

## Development

After cloning the github repo into a dir:

    npm install
    bower install

Test:

    gulp test


Demo in browser:

    gulp serve

Build:

    gulp

Finally, bump bower version number:

    git tag v0.1.[patch number]
    git push origin v0.1.[patch number]

### Running e2e tests

Install Selemium stuff (only first time):

    ./node_modules/protractor/bin/webdriver-manager update

Start Selenium server:

    ./node_modules/protractor/bin/webdriver-manager start

Run e2e tests:

    gulp e2e_test


