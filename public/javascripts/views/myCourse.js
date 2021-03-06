let pageApp = angular.module('pageApp', []);
pageApp.controller('pageCtrl', function($scope, $http) {
    $scope.model = {
        bizLog: {
            pageName: 'myCourse',
            operationName: {
                PAGE_LOAD: 'PL',
                FILTER_COURSE_YEAR: 'FCY',
                FILTER_COURSE_STATUS: 'FCS',

                LOAD_MORE_COURSE: 'LMC',
                COURSE_IMAGE_LINK: 'CIL',
                COURSE_TEXT_LINK: 'CTL',
                COURSE_REDIRECT_INFO: 'CRI',
                COURSE_REDIRECT_REVIEW: 'CRR',
                COURSE_CHANGE_FINISH: 'CCF',
            },
            logMemo: '',
        },

        directionList: [],
        selectedDirection: { directionID: 0, directionName: '全部' },

        categoryList: [],
        selectedCategory: { categoryID: 0, categoryName: '全部' },

        selectedTime: {},
        timeList: [],
        selectedDataStatus: {},
        dataStatusList: [],

        pageNumber: 1,
        courseTotalCount: 0,
        courseList: [],
        fromIndex: 0,
        toIndex: 0,
        maxPageNumber: 0,
        paginationArray: [],
        prePageNum: -1,
        nextPageNum: -1,

        isLogin: false,
        loginUser: null
    };

    $scope.initPage = function() {
        tracking.view(trackingSetting.view.myCourse);
        $scope.model.isLogin = commonUtility.isLogin();
        $scope.model.loginUser = commonUtility.getLoginUser();
        $scope.setMenuActive();
        $scope.loadDirectionList();
        $scope.loadTechnologyCategoryList();
        $scope.setCourseFilterList();
        $scope.loadCourseList();
    };

    $scope.setMenuActive = function() {
        $('ul.kt-menu__nav li').removeClass('kt-menu__item--here');
        $('ul.kt-menu__nav li:nth-child(2)').addClass('kt-menu__item--here');
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
            $scope.model.isAppendData = false;
            $scope.loadTechnologyCategoryList();
            $scope.loadCourseList();
            return false;
        }
        $scope.model.selectedDirection = { directionID: direction.directionID, directionName: direction.directionName };
        $scope.model.selectedCategory = { categoryID: 0, categoryName: '全部' };
        $scope.model.isAppendData = false;
        $scope.loadTechnologyCategoryList();
        $scope.loadCourseList();
    };

    $scope.onFilterByCategory = function(category) {
        if (category === undefined) {
            $scope.model.selectedCategory = { categoryID: 0, categoryName: '全部' };
            $scope.model.isAppendData = false;
            $scope.loadCourseList();
            return false;
        }
        $scope.model.selectedCategory = { categoryID: category.technologyCategoryID, categoryName: category.technologyCategoryName };
        $scope.model.isAppendData = false;
        $scope.loadCourseList();
    };

    $scope.setCourseFilterList = function() {
        $scope.model.timeList.push({ timeCode: 0, timeText: '全部' });
        $scope.model.timeList.push({ timeCode: -1, timeText: '近一年' });
        $scope.model.timeList.push({ timeCode: -2, timeText: '近两年' });
        $scope.model.timeList.push({ timeCode: -3, timeText: '近三年' });

        $scope.model.dataStatusList.push({ statusCode: 'NULL', statusText: '全部' });
        $scope.model.dataStatusList.push({ statusCode: '0', statusText: '未开始' });
        $scope.model.dataStatusList.push({ statusCode: '1', statusText: '进行中' });
        $scope.model.dataStatusList.push({ statusCode: '2', statusText: '已结束' });

        $scope.model.selectedTime = $scope.model.timeList[1];
        $scope.model.selectedDataStatus = $scope.model.dataStatusList[2];
    };

    $scope.loadCourseList = function() {
        if (!$scope.model.isLogin) {
            return false;
        }
        let pageSize = Constants.PAGE_SIZE;
        let currentDateString = dateUtils.getCurrentDate();
        let universityCode = $scope.model.loginUser.universityCode;
        let schoolID = $scope.model.loginUser.schoolID;
        let teacherID = $scope.model.loginUser.customerID;
        let courseTimeBegin = '';
        if ($scope.model.selectedTime.timeCode === 0) {
            courseTimeBegin = 'NULL';
        } else {
            courseTimeBegin = dateUtils.addDateYear(currentDateString, $scope.model.selectedTime.timeCode) + ' 00:00:00';
        }
        let dataStatus = $scope.model.selectedDataStatus.statusCode;
        $http.get(`/course/list?pageNumber=${$scope.model.pageNumber}&universityCode=${universityCode}&schoolID=${schoolID}&teacherID=${teacherID}&directionID=${$scope.model.selectedDirection.directionID}&categoryID=${$scope.model.selectedCategory.categoryID}&technologyID=0&courseTimeBegin=${courseTimeBegin}&dataStatus=${dataStatus}&isSelf=true`).then(function successCallback(response) {
            if (response.data.err) {
                bootbox.alert(localMessage.formatMessage(response.data.code, response.data.msg));
                return false;
            }

            if (response.data.dataContent.dataList === null || response.data.dataContent.dataList.length === 0) {
                $scope.model.courseList.splice(0, $scope.model.courseList.length);
                $scope.model.courseTotalCount = 0;
                if ($scope.model.pageNumber > 1) {
                    $scope.model.pageNumber--;
                    layer.msg(localMessage.NO_TECHNOLOGY_DATA);
                }
                return false;
            }

            $scope.model.courseList = response.data.dataContent.dataList;
            $scope.model.courseTotalCount = response.data.dataContent.totalCount;
            $scope.model.pageNumber = parseInt(response.data.dataContent.currentPageNum);
            $scope.model.maxPageNumber = Math.ceil(response.data.dataContent.totalCount / response.data.dataContent.pageSize);
            $scope.model.paginationArray = response.data.dataContent.paginationArray;
            $scope.model.prePageNum = response.data.dataContent.prePageNum === undefined ? -1 : response.data.dataContent.prePageNum;
            $scope.model.nextPageNum = response.data.dataContent.nextPageNum === undefined ? -1 : response.data.dataContent.nextPageNum;
            $scope.model.fromIndex = response.data.dataContent.dataList === null ? 0 : ($scope.model.pageNumber - 1) * pageSize + 1;
            $scope.model.toIndex = response.data.dataContent.dataList === null ? 0 : ($scope.model.pageNumber - 1) * pageSize + response.data.dataContent.dataList.length;

        }, function errorCallback(response) {
            bootbox.alert(localMessage.NETWORK_ERROR);
        });
    };

    $scope.onFirstPage = function() {
        if ($scope.model.pageNumber === 1) {
            return false;
        }
        $scope.model.pageNumber = 1;
        $scope.loadCourseList();
    };
    $scope.onPrePage = function() {
        if ($scope.model.pageNumber === 1) {
            return false;
        }
        $scope.model.pageNumber--;
        $scope.loadCourseList();
    };
    $scope.onPagination = function(pageNumber) {
        if ($scope.model.pageNumber === pageNumber) {
            return false;
        }
        $scope.model.pageNumber = pageNumber;
        $scope.loadCourseList();
    };
    $scope.onNextPage = function() {
        if ($scope.model.pageNumber === $scope.model.maxPageNumber) {
            return false;
        }
        $scope.model.pageNumber++;
        $scope.loadCourseList();
    };
    $scope.onLastPage = function() {
        if ($scope.model.pageNumber === $scope.model.maxPageNumber) {
            return false;
        }
        $scope.model.pageNumber = $scope.model.maxPageNumber;
        $scope.loadCourseList();
    };

    $scope.onSelectedTime = function(data) {
        $scope.model.selectedTime = data;
        $scope.loadCourseList();
    };

    $scope.onSelectDataStatus = function(data) {
        $scope.model.selectedDataStatus = data;
        $scope.loadCourseList();
    };

    $scope.onLoadMoreCourse = function() {
        $scope.model.pageNumber++;
        $scope.loadCourseList();
    };

    $scope.onOpenTechnologyInfo = function(technologyID) {
        window.open(`/technology?technology=${technologyID}`);
    };

    $scope.onOpenCourseDetail = function(course, flag, tabIndex) {
        let operationName = '';
        switch (flag) {
            case 0:
                operationName = $scope.model.bizLog.operationName.COURSE_TEXT_LINK;
                break;
            case 1:
                operationName = $scope.model.bizLog.operationName.COURSE_REDIRECT_INFO;
                break;
            default:
                operationName = $scope.model.bizLog.operationName.COURSE_REDIRECT_REVIEW;
                break;
        }
        let courseParam = JSON.stringify({
            universityCode: course.universityCode,
            schoolID: course.schoolID,
            courseID: course.courseID
        });

        localStorage.setItem(Constants.KEY_INFO_COURSE_IDENTIFY, courseParam);
        if (tabIndex !== undefined) {
            window.open(`/course/detail?tabIndex=${tabIndex}`);
            return false;
        }
        window.open('/course/detail');
    };

    $scope.onFinishCourse = function(course) {

    };

    $scope.initPage();
});

angular.bootstrap(document.querySelector('[ng-app="pageApp"]'), ['pageApp']);