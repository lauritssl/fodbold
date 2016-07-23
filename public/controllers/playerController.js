(function() {
  var app = angular.module('app',[]);

  app.controller('playerController', function(){
    person1 = {
      name: 'person1',
      email: 'hej@person1.nu',
      number: '111111111'
    };
    person2 = {
      name: 'person2',
      email: 'hej@person2.nu',
      number: '222222222'
    };
    person3 = {
      name: 'person3',
      email: 'hej@person3.nu',
      number: '333333333'
    };
    person4 = {
      name: 'person4',
      email: 'hej@person4.nu',
      number: '444444444'
    };

    this.players = [person1,person2,person3,person4];
  });

})();
