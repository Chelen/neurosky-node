'use strict';

describe('Controller: BarrelCtrl', function () {

  // load the controller's module
  beforeEach(module('mindwaveApp'));

  var BarrelCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BarrelCtrl = $controller('BarrelCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
