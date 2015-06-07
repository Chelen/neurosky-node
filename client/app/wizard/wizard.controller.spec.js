'use strict';

describe('Controller: WizardCtrl', function () {

  // load the controller's module
  beforeEach(module('mindwaveApp'));

  var WizardCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    WizardCtrl = $controller('WizardCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
