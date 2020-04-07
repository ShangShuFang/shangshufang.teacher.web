let serviceInvoke = require('../common/serviceInvokeUtils');
let sysConfig = require('../config/sysConfig');
let apiConfig = require('../config/apiConfig');
let pagingUtils = require('../common/pagingUtils');

exports.commonInvoke = function(apiName) {
  this.pageSize = sysConfig.pageSize;
  this.host = apiConfig.StoreService.host;
  this.port = apiConfig.StoreService.port;
  this.path = apiConfig.StoreService.path[apiName];

  this.queryPageData = function (pageNumber, callback) {
    let resourcePath = `${this.path}/${pageNumber}/${this.pageSize}`;
    serviceInvoke.query(this.host, this.port, resourcePath, callback)
  };

  this.queryAll = function (callback) {
    let resourcePath = `${this.path}/1/9999`;
    serviceInvoke.query(this.host, this.port, resourcePath, callback)
  };

  this.queryWithParameter = function (param, callback) {
    serviceInvoke.query(this.host, this.port, this.path + '/' + param, callback)
  };

  this.create = function (data, callback) {
    serviceInvoke.create(data, this.host, this.port, this.path, callback);
  };

  this.change = function (data, callback) {
    serviceInvoke.change(data, this.host, this.port, this.path, callback);
  };

  this.delete = function (param, callback) {
    serviceInvoke.delete(this.host, this.port, this.path + '/' + param, callback);
  }
};

exports.buildRenderData = function (title, pageNumber, pageSize, serviceResult) {
  let renderData = {};
  if(serviceResult.err || !serviceResult.content.result){
    renderData = {
      title: title,
      totalCount: 0,
      pageSize: pageSize,
      paginationArray:[],
      dataList: []
    };
  }else{
    let paginationArray = pagingUtils.getPaginationArray(pageNumber, serviceResult.content.totalCount);
    let prePaginationNum = pagingUtils.getPrePaginationNum(pageNumber);
    let nextPaginationNum = pagingUtils.getNextPaginationNum(pageNumber, serviceResult.content.totalCount);
    if(serviceResult.content.responseData === null){
      renderData = {
        title: title,
        totalCount: serviceResult.content.totalCount,
        currentPageNum: pageNumber,
        pageSize: sysConfig.pageSize,
        dataList: serviceResult.content.responseData
      }
    }else{
      if(prePaginationNum > 0 && nextPaginationNum > 0){
        renderData = {
          title: title,
          totalCount: serviceResult.content.totalCount,
          paginationArray: paginationArray,
          prePageNum: prePaginationNum,
          nextPageNum: nextPaginationNum,
          currentPageNum: pageNumber,
          pageSize: sysConfig.pageSize,
          dataList: serviceResult.content.responseData
        }
      }else if(prePaginationNum === 0 && nextPaginationNum === -1){
        renderData = {
          title: title,
          totalCount: serviceResult.content.totalCount,
          paginationArray: paginationArray,
          currentPageNum: pageNumber,
          pageSize: sysConfig.pageSize,
          dataList: serviceResult.content.responseData
        }
      }else if(prePaginationNum === 0) {
        renderData = {
          title: title,
          totalCount: serviceResult.content.totalCount,
          paginationArray: paginationArray,
          nextPageNum: nextPaginationNum,
          currentPageNum: pageNumber,
          pageSize: sysConfig.pageSize,
          dataList: serviceResult.content.responseData
        }
      }else{
        renderData = {
          title: title,
          totalCount: serviceResult.content.totalCount,
          paginationArray: paginationArray,
          prePageNum: prePaginationNum,
          currentPageNum: pageNumber,
          pageSize: sysConfig.pageSize,
          dataList: serviceResult.content.responseData
        }
      }
    }
  }

  return renderData;
};