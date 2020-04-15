let pageApp = angular.module('pageApp', []);
pageApp.controller('pageCtrl', function ($scope, $http) {
  $scope.model = {
    technologyList: [],
    selectedTechnology: {},
    studentTypeList: [],
    selectedStudentType: {},
    cellphone: '',

    //begin: 数据列表
    fromIndex: 0,
    toIndex: 0,
    pageNumber: 1,
    totalCount: 0,
    maxPageNumber: 0,
    dataList: [],
    paginationArray: [],
    prePageNum: -1,
    nextPageNum: -1,
    //end: 数据列表

    isLogin: false,
    loginUser: null
  };

  $scope.initPage = function () {
    $scope.model.isLogin = commonUtility.isLogin();
    $scope.model.loginUser = commonUtility.getLoginUser();
    $scope.setMenuActive();
    $scope.initTechnologyList();
    $scope.initStudentList();

  };

  $scope.setMenuActive = function () {
    $('ul.kt-menu__nav li').removeClass('kt-menu__item--here');
    $('ul.kt-menu__nav li:nth-child(3)').addClass('kt-menu__item--here');
  };

  $scope.initTechnologyList = function () {
    $http.get('/ability/analysis/technologySimple').then(function successCallback(response) {
      if (response.data.err) {
        bootbox.alert(localMessage.formatMessage(response.data.code, response.data.msg));
        return false;
      }
      if (response.data.dataList === null) {
        return false;
      }
      $scope.model.technologyList = response.data.dataList;
      $scope.model.selectedTechnology = response.data.dataList[0];
      $scope.loadStudentList();
    }, function errorCallback(response) {
      bootbox.alert(localMessage.NETWORK_ERROR);
    });
  };

  $scope.initStudentList = function () {
    $scope.model.studentTypeList.push({
      studentTypeID: 0,
      studentTypeText: '全部学生',
      studentUniversityCode: 0,
      studentSchoolID: 0,
      teacherUniversityCode: 0,
      teacherSchoolID: 0,
      teacherID: 0
    });

    $scope.model.selectedStudentType = $scope.model.studentTypeList[0];

    if (!$scope.model.isLogin) {
      return false;
    }

    $scope.model.studentTypeList.push({
      studentTypeID: 1,
      studentTypeText: '本校学生',
      studentUniversityCode: $scope.model.loginUser.universityCode,
      studentSchoolID: 0,
      teacherUniversityCode: 0,
      teacherSchoolID: 0,
      teacherID: 0
    });
    $scope.model.studentTypeList.push({
      studentTypeID: 2,
      studentTypeText: '本院学生',
      studentUniversityCode: $scope.model.loginUser.universityCode,
      studentSchoolID: $scope.model.loginUser.schoolID,
      teacherUniversityCode: 0,
      teacherSchoolID: 0,
      teacherID: 0
    });
    $scope.model.studentTypeList.push({
      studentTypeID: 3,
      studentTypeText: '我的学生',
      studentUniversityCode: 0,
      studentSchoolID: 0,
      teacherUniversityCode: $scope.model.loginUser.universityCode,
      teacherSchoolID: $scope.model.loginUser.schoolID,
      teacherID: $scope.model.loginUser.customerID
    });
  };

  $scope.onFilterTechnology = function (technology) {
    if ($scope.model.selectedTechnology.technologyID === technology.technologyID) {
      return false;
    }
    $scope.model.selectedTechnology = technology;
    $scope.loadStudentList();
  };

  $scope.onFilterStudent = function (studentType) {
    if ($scope.model.selectedStudentType.studentTypeID === studentType.studentTypeID) {
      return false;
    }
    $scope.model.selectedStudentType = studentType;
    $scope.loadStudentList();
  };

  $scope.onFilterCellphone = function () {
    $scope.loadStudentList();
  };

  $scope.initData = function () {
    $scope.model.totalCount = 0;
    $scope.model.dataList = [];
    $scope.model.pageNumber = 1;
    $scope.model.maxPageNumber = 0;
    $scope.model.paginationArray = [];
    $scope.model.prePageNum = -1;
    $scope.model.nextPageNum = -1;
    $scope.model.fromIndex = 0;
    $scope.model.toIndex = 0;
  };

  $scope.loadStudentList = function () {
    KTApp.blockPage({
      overlayColor: '#000000',
      type: 'v2',
      state: 'primary',
      message: '正在查询...'
    });

    let cellphone = $scope.model.cellphone;
    if (commonUtility.isEmpty(cellphone)) {
      cellphone = 'NULL';
    }
    $scope.initData();
    $http.get(`/ability/analysis/data?pageNumber=${$scope.model.pageNumber}&technologyID=${$scope.model.selectedTechnology.technologyID}&studentUniversityCode=${$scope.model.selectedStudentType.studentUniversityCode}&studentSchoolID=${$scope.model.selectedStudentType.studentSchoolID}&teacherUniversityCode=${$scope.model.selectedStudentType.teacherUniversityCode}&teacherSchoolID=${$scope.model.selectedStudentType.teacherSchoolID}&teacherID=${$scope.model.selectedStudentType.teacherID}&cellphone=${cellphone}`)
        .then(function successCallback(response) {
          if (response.data.err) {
            bootbox.alert(localMessage.formatMessage(response.data.code, response.data.msg));
            KTApp.unblockPage();
            return false;
          }
          if (response.data.dataContent === null || response.data.dataContent.dataList === null) {
            KTApp.unblockPage();
            return false;
          }

          response.data.dataContent.dataList.forEach(function (data) {
            data.finishKnowledgePercent = data.finishKnowledgePercent + '%';
            data.positionSite = data.positionSite + '%';
            data.onceCompilationSuccessRate = data.onceCompilationSuccessRate + '%';
            data.onceRunSuccessRate = data.onceRunSuccessRate + '%';
          });

          $scope.model.totalCount = response.data.dataContent.totalCount;
          $scope.model.dataList = response.data.dataContent.dataList;
          $scope.model.pageNumber = response.data.dataContent.currentPageNum;
          $scope.model.maxPageNumber = Math.ceil(response.data.dataContent.totalCount / response.data.dataContent.pageSize);
          $scope.model.paginationArray = response.data.dataContent.paginationArray;
          $scope.model.prePageNum = response.data.dataContent.prePageNum === undefined ? -1 : response.data.dataContent.prePageNum;
          $scope.model.nextPageNum = response.data.dataContent.nextPageNum === undefined ? -1 : response.data.dataContent.nextPageNum;
          $scope.model.fromIndex = response.data.dataContent.dataList === null ? 0 : ($scope.model.pageNumber - 1) * Constants.PAGE_SIZE + 1;
          $scope.model.toIndex = response.data.dataContent.dataList === null ? 0 : ($scope.model.pageNumber - 1) * Constants.PAGE_SIZE + $scope.model.dataList.length;
          KTApp.unblockPage();
        }, function errorCallback(response) {
          bootbox.alert(localMessage.NETWORK_ERROR);
        });
  };

  $scope.onFirstPage = function () {
    if ($scope.model.pageNumber === 1) {
      return false;
    }
    $scope.model.pageNumber = 1;
    $scope.loadStudentList();
  };

  $scope.onPrePage = function () {
    if ($scope.model.pageNumber === 1) {
      return false;
    }
    $scope.model.pageNumber--;
    $scope.loadStudentList();
  };

  $scope.onPagination = function (pageNumber) {
    if ($scope.model.pageNumber === pageNumber) {
      return false;
    }
    $scope.model.pageNumber = pageNumber;
    $scope.loadStudentList();
  };

  $scope.onNextPage = function () {
    if ($scope.model.pageNumber === $scope.model.maxPageNumber4Exercises) {
      return false;
    }
    $scope.model.pageNumber++;
    $scope.loadStudentList();
  };

  $scope.onLastPage = function () {
    if ($scope.model.pageNumber === $scope.model.maxPageNumber4Exercises) {
      return false;
    }
    $scope.model.pageNumber = $scope.model.maxPageNumber4Exercises;
    $scope.loadStudentList();
  };

  $scope.initPage();
});

angular.bootstrap(document.querySelector('[ng-app="pageApp"]'), ['pageApp']);