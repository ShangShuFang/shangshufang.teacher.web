let pageApp = angular.module('pageApp', []);
pageApp.controller('pageCtrl', function($scope, $http) {
    $scope.model = {
        directionList: [],
        selectedDirection: { directionID: 0, directionName: '全部' },

        categoryList: [],
        selectedCategory: { categoryID: 0, categoryName: '全部' },

        technologyList: [],
        selectedTechnology: { technologyID: 0, technologyName: '全部' },
        studentTypeList: [],
        selectedStudentType: {},
        studentName: '',

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

    $scope.initPage = function() {
        tracking.view(trackingSetting.view.abilityAnalysisList);
        $scope.model.isLogin = commonUtility.isLogin();
        $scope.model.loginUser = commonUtility.getLoginUser();
        $scope.setMenuActive();
        $scope.loadDirectionList();
        $scope.loadTechnologyCategoryList();
        $scope.loadTechnologyList();
        $scope.loadStudentList();
        $scope.loadStudentAbilityList();
    };

    $scope.setMenuActive = function() {
        $('ul.kt-menu__nav li').removeClass('kt-menu__item--here');
        $('ul.kt-menu__nav li:nth-child(4)').addClass('kt-menu__item--here');
    };

    $scope.loadDirectionList = function() {
        $http.get(`/common/direction/list`).then(function successCallback(response) {
            if (response.data.err) {
                bootbox.alert(localMessage.formatMessage(response.data.code, response.data.msg));
                return false;
            }
            $scope.model.directionList = response.data.dataList;
        }, function errorCallback(response) {
            bootbox.alert(localMessage.NETWORK_ERROR);
        });
    };

    $scope.loadTechnologyCategoryList = function() {
        $http.get(`/common/technology/category/list?directionID=${$scope.model.selectedDirection.directionID}`).then(function successCallback(response) {
            if (response.data.err) {
                bootbox.alert(localMessage.formatMessage(response.data.code, response.data.msg));
                return false;
            }
            $scope.model.categoryList = response.data.dataList;
        }, function errorCallback(response) {
            bootbox.alert(localMessage.NETWORK_ERROR);
        });
    };

    $scope.onFilterByDirection = function(direction) {
        if (direction === undefined) {
            $scope.model.selectedDirection = { directionID: 0, directionName: '全部' };
            $scope.model.selectedCategory = { categoryID: 0, categoryName: '全部' };
            $scope.loadTechnologyCategoryList();
            $scope.loadTechnologyList();
            $scope.loadStudentAbilityList();
            return false;
        }
        $scope.model.selectedDirection = { directionID: direction.directionID, directionName: direction.directionName };
        $scope.model.selectedCategory = { categoryID: 0, categoryName: '全部' };
        $scope.loadTechnologyCategoryList();
        $scope.loadTechnologyList();
        $scope.loadStudentAbilityList();
    };

    $scope.onFilterByCategory = function(category) {
        if (category === undefined) {
            $scope.model.selectedCategory = { categoryID: 0, categoryName: '全部' };
            $scope.loadTechnologyList();
            $scope.loadStudentAbilityList();
            return false;
        }
        $scope.model.selectedCategory = { categoryID: category.technologyCategoryID, categoryName: category.technologyCategoryName };
        $scope.loadTechnologyList();
        $scope.loadStudentAbilityList();
    };

    $scope.onFilterByTechnology = function(technology) {
        $scope.model.selectedTechnology = technology === undefined ? { technologyID: 0, technologyName: '全部' } : { technologyID: technology.technologyID, technologyName: technology.technologyName };
        $scope.loadStudentAbilityList();
    };

    $scope.onFilterStudent = function(studentType) {
        if ($scope.model.selectedStudentType.studentTypeID === studentType.studentTypeID) {
            return false;
        }
        $scope.model.selectedStudentType = studentType;
        $scope.loadStudentAbilityList();
    };

    $scope.onFilterByName = function(e) {
        let keyCode = e.keyCode;
        if (keyCode === 13) {
            $scope.loadStudentAbilityList();
        }
    };

    $scope.loadTechnologyList = function() {
        $http.get(`/ability/analysis/technologySimple?directionID=${$scope.model.selectedDirection.directionID}&categoryID=${$scope.model.selectedCategory.categoryID}`).then(function successCallback(response) {
            if (response.data.err) {
                bootbox.alert(localMessage.formatMessage(response.data.code, response.data.msg));
                return false;
            }
            if (response.data.dataList === null) {
                return false;
            }
            $scope.model.technologyList = response.data.dataList;
            $scope.model.selectedTechnology = { technologyID: 0, technologyName: '全部' };
            // $scope.loadStudentAbilityList();
        }, function errorCallback(response) {
            bootbox.alert(localMessage.NETWORK_ERROR);
        });
    };

    $scope.loadStudentList = function() {
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
    };

    $scope.initData = function() {
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

    $scope.loadStudentAbilityList = function() {
        KTApp.blockPage({
            overlayColor: '#000000',
            type: 'v2',
            state: 'primary',
            message: '正在查询...'
        });

        let studentName = $scope.model.studentName;
        if (commonUtility.isEmpty(studentName)) {
            studentName = 'NULL';
        }
        $http.get('/ability/analysis/data'
            .concat(`?pageNumber=${$scope.model.pageNumber}`)
            .concat(`&directionID=${$scope.model.selectedDirection.directionID}`)
            .concat(`&categoryID=${$scope.model.selectedCategory.categoryID}`)
            .concat(`&technologyID=${$scope.model.selectedTechnology.technologyID}`)
            .concat(`&universityCode=${$scope.model.selectedStudentType.studentUniversityCode}`)
            .concat(`&schoolID=${$scope.model.selectedStudentType.studentSchoolID}`)
            .concat(`&studentName=${studentName}`))
            .then(function successCallback(response) {
                if (response.data.err) {
                    bootbox.alert(localMessage.formatMessage(response.data.code, response.data.msg));
                    KTApp.unblockPage();
                    return false;
                }
                if (response.data.dataContent === null || response.data.dataContent.dataList === null) {
                    $scope.initData();
                    KTApp.unblockPage();
                    return false;
                }

                response.data.dataContent.dataList.forEach(function(data) {
                    data.finishKnowledgePercent = data.finishedKnowledgePercent + '%';
                    data.positionSite = data.positionSite + '%';
                });

                $scope.model.totalCount = response.data.dataContent.totalCount;
                $scope.model.dataList = response.data.dataContent.dataList;
                $scope.model.pageNumber = parseInt(response.data.dataContent.currentPageNum);
                $scope.model.maxPageNumber = Math.ceil(response.data.dataContent.totalCount / response.data.dataContent.pageSize);
                $scope.model.paginationArray = response.data.dataContent.paginationArray;
                $scope.model.prePageNum = response.data.dataContent.prePageNum === undefined ? -1 : response.data.dataContent.prePageNum;
                $scope.model.nextPageNum = response.data.dataContent.nextPageNum === undefined ? -1 : response.data.dataContent.nextPageNum;
                $scope.model.fromIndex = response.data.dataContent.dataList === null ? 0 : ($scope.model.pageNumber - 1) * response.data.dataContent.pageSize + 1;
                $scope.model.toIndex = response.data.dataContent.dataList === null ? 0 : ($scope.model.pageNumber - 1) * response.data.dataContent.pageSize + $scope.model.dataList.length;
                KTApp.unblockPage();
            }, function errorCallback(response) {
                bootbox.alert(localMessage.NETWORK_ERROR);
            });
    };

    $scope.onFirstPage = function() {
        if ($scope.model.pageNumber === 1) {
            return false;
        }
        $scope.model.pageNumber = 1;
        $scope.loadStudentAbilityList();
    };

    $scope.onPrePage = function() {
        if ($scope.model.pageNumber === 1) {
            return false;
        }
        $scope.model.pageNumber--;
        $scope.loadStudentAbilityList();
    };

    $scope.onPagination = function(pageNumber) {
        if ($scope.model.pageNumber === pageNumber) {
            return false;
        }
        $scope.model.pageNumber = pageNumber;
        $scope.loadStudentAbilityList();
    };

    $scope.onNextPage = function() {
        if ($scope.model.pageNumber === $scope.model.maxPageNumber) {
            return false;
        }
        $scope.model.pageNumber++;
        $scope.loadStudentAbilityList();
    };

    $scope.onLastPage = function() {
        if ($scope.model.pageNumber === $scope.model.maxPageNumber) {
            return false;
        }
        $scope.model.pageNumber = $scope.model.maxPageNumber;
        $scope.loadStudentAbilityList();
    };

    $scope.initPage();
});

angular.bootstrap(document.querySelector('[ng-app="pageApp"]'), ['pageApp']);