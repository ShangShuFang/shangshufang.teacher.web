let pageApp = angular.module('pageApp', []);
pageApp.controller('pageCtrl', function ($scope, $http) {
  $scope.model = {
    abilityLevelList1: [],
    abilityLevelList2: [],
  };

  $scope.initPage = function() {
    $scope.setMenuActive();
    $scope.setAbilityLevel();
  };

  $scope.setMenuActive = function () {
    $('ul.kt-menu__nav li').removeClass('kt-menu__item--here');
  };

  $scope.setAbilityLevel = function() {
    $scope.model.abilityLevelList1.push({
      "level": "L1",
      "levelFullName": "Level 1",
      "mappingCompany": "即将公布L1符合要求的企业数量",
      "finishKnowledge": "小于50%",
      "finishComprehensiveExercises": "0个",
      "joinProject": "0个"
    });
    $scope.model.abilityLevelList1.push({
      "level": "L2",
      "levelFullName": "Level 2",
      "mappingCompany": "即将公布L2符合要求的企业数量",
      "finishKnowledge": "大于50%",
      "finishComprehensiveExercises": "小于3个",
      "joinProject": "0个"
    });
    $scope.model.abilityLevelList1.push({
      "level": "L3",
      "levelFullName": "Level 3",
      "mappingCompany": "即将公布L3符合要求的企业数量",
      "finishKnowledge": "大于90%",
      "finishComprehensiveExercises": "3～6个",
      "joinProject": "0个"
    });
    $scope.model.abilityLevelList1.push({
      "level": "L4",
      "levelFullName": "Level 4",
      "mappingCompany": "即将公布L4符合要求的企业数量",
      "finishKnowledge": "大于90%",
      "finishComprehensiveExercises": "6～9个",
      "joinProject": "0个"
    });

    $scope.model.abilityLevelList2.push({
      "level": "L5",
      "levelFullName": "Level 5",
      "mappingCompany": "即将公布L5符合要求的企业数量",
      "finishKnowledge": "大于90%",
      "finishComprehensiveExercises": "大于9个",
      "joinProject": "0个"
    });
    $scope.model.abilityLevelList2.push({
      "level": "L6",
      "levelFullName": "Level 6",
      "mappingCompany": "即将公布L6符合要求的企业数量",
      "finishKnowledge": "大于90%",
      "finishComprehensiveExercises": "大于12个",
      "joinProject": "小于3个"
    });
    $scope.model.abilityLevelList2.push({
      "level": "L7",
      "levelFullName": "Level 7",
      "mappingCompany": "即将公布L7符合要求的企业数量",
      "finishKnowledge": "大于90%",
      "finishComprehensiveExercises": "大于12个",
      "joinProject": "3～5个"
    });
    $scope.model.abilityLevelList2.push({
      "level": "L8",
      "levelFullName": "Level 8",
      "mappingCompany": "即将公布L8符合要求的企业数量",
      "finishKnowledge": "大于90%",
      "finishComprehensiveExercises": "大于12个",
      "joinProject": "大于5个"
    });
  };

  $scope.initPage();
});

angular.bootstrap(document.querySelector('[ng-app="pageApp"]'), ['pageApp']);