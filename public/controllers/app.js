(function() {
  var app = angular.module('app',[]);

  app.controller("TabController", function() {
    this.tab = 1;

    this.isSet = function(checkTab) {
      return this.tab === checkTab;
    };

    this.setTab = function(setTab) {
      this.tab = setTab;
    };
  });

  app.controller('teamController', ['$http', function($http){
    var team = this;

    this.players = [];
    $http.get('/players/').success(function(data){
      team.players = data;
    });

  }]);

  app.controller('adminTeamController', ['$http', function($http){
    var team = this;
    this.newPlayer = {};

    this.positions = ['Keeper','Defender', 'Midfielder', 'Attacker'];

    this.players = [];
    $http.get('/players/').success(function(data){
      team.players = data;
    });

    this.add = function(){
      team.players.push(this.newPlayer);
      $http.post('/players/', this.newPlayer).success(function(data){
        team.newPlayer = {};
        team.newPlayer.name = 'Done baby!';
      });
    };
  }]);

  app.controller('finesController', ['$http', function($http){
    this.title = 'Fine list';
    var fines = this;

    var newFine = {};

    this.fineList = [];
    $http.get('/fines/').success(function(data){
      fines.fineList = data;
    });

    this.add = function(){
      console.log(this.newFine);
      fines.fineList.push(this.newFine);
      $http.post('/fines/', this.newFine).success(function(){
        fines.newFine = {};
        fines.newFine.desc = 'Done baby!';
      });
    };
  }]);

  app.controller('playerfinesController', ['$http', function($http){
    this.title = 'Players fines';
    this.updated;
    this.payedTotal = 0;
    this.oweTotal = 0;
    var playerfines = this;

    this.playerfinesList = [];

    $http.get('/playerfines/').success(function(data){
      var payed = 0;
      var owe = 0;
      var playerOwe = 0;
      for (var i = 0; i < data.length; i++) {
        payed += data[i].payed;
        for (var k = 0; k < data[i].fines.length; k++) {
          owe += data[i].fines[k].price;
          playerOwe += data[i].fines[k].price;
        }
        data[i].owe = playerOwe - data[i].payed;
        playerOwe = 0;
      }
      playerfines.playerfinesList = data;
      playerfines.payedTotal = payed;
      playerfines.oweTotal = owe;
      playerfines.updated = data[0].updated;
    });

    this.fineList = [];
    $http.get('/fines/').success(function(data){
      playerfines.fineList = data;
    });

    this.charge = function(selectedPlayer, selectedFine){
      $http.post('/playerfines/',{player : selectedPlayer.player, fine : selectedFine});
      alert('Done!!');
    }

    this.pay = function(selectedPlayer, payAmout){
      $http.post('/playerfines/pay',{player : selectedPlayer.player, payAmout : payAmout});
      alert('Done!!');
    }

  }]);

  app.controller('GameStatsController' , ['$http' , function($http){
    var gameStats = this;
    this.sortType = 'name'
    this.sortReverse = false;

    this.players = [];
    $http.get('/gamestats/').success(function(data){
      gameStats.players = data;
    });

    this.update = function(selectedPlayer){
      $http.post('/gamestats/', selectedPlayer);
    };

  }]);

  app.directive('theFooter', function(){
    return {
      restrict: 'E',
      templateUrl: 'the-footer.html'
    };
  });

})();
