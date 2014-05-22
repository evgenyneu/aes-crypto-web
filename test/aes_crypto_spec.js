(function() {
  'use strict';

  describe('TegNgPosterChild controller', function() {

    beforeEach(module('TegNgPosterChild'));

    var scope, httpBackend;

    beforeEach(inject(function($rootScope, $controller, $httpBackend) {
      httpBackend = $httpBackend;
      scope = $rootScope.$new();
      $controller('TegNgPosterChildController', {
        $scope: scope
      });

      scope.shared = {};
    }));

    it('store error response data', function() {
      scope.saveErrors('error response');
      expect(scope.shared.errors).toEqual('error response');
    });

    it('clear errors', function() {
      scope.shared.errors = 'data';
      scope.shared.unknownError = 'Unknown error message';
      scope.clearErrors();

      expect(scope.shared.errors).toEqual({});
      expect(scope.shared.unknownError).toEqual(null);
    });

    describe('when form is submitted', function() {
      beforeEach(function(){
        spyOn(scope, 'clearErrors');
        spyOn(scope, 'sendRequest');

        scope.shared.values = { send: 'data' };

        scope.submitUrl = 'http://cats.jp';
        scope.submitMethod = 'POST';
      });

      it('clears errors', function() {
        scope.trigger();
        expect(scope.clearErrors).toHaveBeenCalled();
      });

      it('send data payload', function() {
        scope.submitMethod = 'POST';
        scope.shared.values = { my: 'data' };

        scope.trigger();

        expect(scope.sendRequest).toHaveBeenCalledWith({
          method: 'POST',
          url: 'http://cats.jp',
          data: { my : 'data' }
        });
      });

      it('submit with custom HTTP method', function() {
        scope.submitMethod = 'PUT';

        scope.trigger();

        expect(scope.sendRequest).toHaveBeenCalledWith({
          method: 'PUT',
          url: 'http://cats.jp',
          data: { send : 'data' }
        });
      });

      it('add data to URL params for GET request', function() {
        scope.submitMethod = 'GET';
        scope.shared.values = { test: 'value' };

        scope.trigger();

        expect(scope.sendRequest).toHaveBeenCalledWith({
          method: 'GET',
          url: 'http://cats.jp',
          params: { test : 'value' }
        });
      });
    });

    describe('when request is sent', function() {
      var expectRequest,
        options;

      beforeEach(function(){
        spyOn(scope, 'processOkResponse');
        spyOn(scope, 'processErrorResponse');
        options = { method: 'POST', url: 'http://cats.jp' };

        expectRequest = function(httpStatus, method, expectRespondData) {
          httpBackend.expect(method, 'http://cats.jp')
            .respond(httpStatus, expectRespondData);
        };
      });

      afterEach(function() {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
      });

      it('process successful response', function() {
        expectRequest(200, 'POST', 'test response data');
        scope.sendRequest(options);
        httpBackend.flush();
        expect(scope.processOkResponse).toHaveBeenCalledWith('test response data');
      });

      it('process error response', function() {
        expectRequest(404, 'POST', 'test response data');
        scope.sendRequest(options);
        httpBackend.flush();
        expect(scope.processErrorResponse).toHaveBeenCalledWith(404, 'test response data');
      });

      describe('busy status', function(){
        it('set busy status ON', function() {
          scope.shared.busy = false;
          expectRequest(200, 'POST', 'test response data');
          scope.sendRequest(options);
          expect(scope.shared.busy).toEqual(true);
          httpBackend.flush();
        });

        it('do not send request if it is busy', function() {
          scope.shared.busy = true;
          scope.sendRequest(options);
          // verifyNoOutstandingExpectation in afterEach will fire if any request is made
        });
      });
    });

    describe('process successful response', function() {
      beforeEach(function(){
        scope.onSuccessDelegate = jasmine.createSpy();
      });

      it('call success delegate and pass data', function(){
        scope.processOkResponse('test data 1 2');
        expect(scope.onSuccessDelegate).toHaveBeenCalledWith({ data: 'test data 1 2' });
      });

      it('saves success data to scope', function() {
        scope.processOkResponse('test data 3 4');
        expect(scope.shared.success).toEqual('test data 3 4');
      });

      it('clears busy status', function() {
        scope.shared.busy = true;
        scope.processOkResponse('ok');
        expect(scope.shared.busy).toEqual(false);
      });
    });

    describe('process unsuccessfull response', function() {
      beforeEach(function(){
        scope.errorStatus = '422';
        spyOn(scope, 'saveErrors');
        spyOn(scope, 'saveUnknownError');
      });

      it('save errors when status code is 422', function() {
        scope.processErrorResponse(422, 'error response');
        expect(scope.saveErrors).toHaveBeenCalledWith('error response');
      });

      it('does not save errors if status code is NOT 422', function() {
        scope.processErrorResponse(999, 'error response');
        expect(scope.saveErrors).not.toHaveBeenCalledWith('error response');
      });

      it('save unknownError', function(){
        scope.processErrorResponse(500, 'unknown error');
        expect(scope.saveUnknownError).toHaveBeenCalledWith('unknown error');
      });

      it('clears busy status', function() {
        scope.shared.busy = true;
        scope.processErrorResponse(422, 'error response');
        expect(scope.shared.busy).toEqual(false);
      });
    });

    it('error status as number', function(){
      scope.errorStatus = '234';
      expect(scope.errorStatusNumber()).toEqual(234);
    });

    it('save unknown error', function() {
      scope.saveUnknownError('Unexpected error');
      expect(scope.shared.unknownError).toEqual('Unexpected error');
    });

    describe('bind trigger events on element', function(){
      it('', function(){
        var element = { on: jasmine.createSpy() };
        var eventNames = 'click, submit';

        scope.bindTriggerEvents(element, eventNames);

        expect(element.on.callCount).toEqual(2);
        expect(element.on.argsForCall[0][0]).toEqual('click');
        expect(typeof element.on.argsForCall[0][1]).toEqual('function');
        expect(element.on.argsForCall[1][0]).toEqual('submit');
      });

      it('edge cases', function(){
        scope.bindTriggerEvents();
        scope.bindTriggerEvents(12, 12);
        scope.bindTriggerEvents(12, 'one, two');
      });
    });
  });

})(this);