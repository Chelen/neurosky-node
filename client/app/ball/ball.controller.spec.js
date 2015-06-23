'use strict';

describe('Controller: BallCtrl', function () {

  // load the controller's module
  beforeEach(module('mindwaveApp'));

  var BallCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BallCtrl = $controller('BallCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
