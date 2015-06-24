'use strict';

describe('Controller: TrainCtrl', function () {

  // load the controller's module
  beforeEach(module('mindwaveApp'));

  var TrainCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TrainCtrl = $controller('TrainCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
