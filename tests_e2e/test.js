(function() {
  'use strict';

  describe('integration test', function() {
    it('', function(){
      browser.get('http://localhost:1337/');

      // Click link and display unknown error response
      // ---------------
      // element(by.css('.ClickButtonForSuccess')).click();
      // expect(element(by.css('.ClickSuccessData')).getText()).toEqual('Click received!');

      // // Submit form and display success response
      // // ---------------
      // element(by.css('.SubmitFormButton')).click();
      // expect(element(by.css('.SuccessDelegateData')).getText()).toEqual('{"hello":"from server"}');
      // expect(element(by.css('.SuccessData')).getText()).toEqual('{"hello":"from server"}');

      // // Submit form and display error response
      // // ---------------
      // element(by.css('.SubmitFormErrorButton')).click();
      // expect(element(by.css('.ErrorData')).getText()).toEqual('Cannot GET /test-data/submit-form-error.json?testField=hi+there+:)');

      // // Submit form and display unknown error response
      // // ---------------
      // element(by.css('.SubmitFormUnknownErrorButton')).click();
      // expect(element(by.css('.UnknownErrorData')).getText()).toEqual('Cannot POST /test-data/does-not-exist.json');

    });
  });
})();