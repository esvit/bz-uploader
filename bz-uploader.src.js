(function(angular, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['angular', 'angular-file-upload'], function(angular) {
            return factory(angular);
        });
    } else {
        return factory(angular);
    }
}(angular || null, function(angular) {
var app = angular.module('bzUploader', ['angularFileUpload']);
var bzUploaderController = ['$scope', 'FileUploader', '$parse', '$window', function($scope, FileUploader, $parse, $window) {
    $scope.autoupload = $scope.autoupload || false;
    $scope.text = angular.extend({
        'choose': 'Choose files',
        'upload': 'Upload',
        'cancel': 'Cancel'
    }, $parse($scope.translates || '')($scope) || {});

    $scope.limit = $scope.limit || 10;
    $scope.errors = [];

    var token = $window.localStorage['token'] || $window.localStorage['ngStorage-token'];
    var headers = {};
    if (token) {
        headers['Authorization'] = 'Bearer ' + token;
    }

    // create a uploader with options
    var uploader = new FileUploader({
        scope: $scope,                          // to automatically update the html. Default: $rootScope
        headers: headers,
        url: $scope.url.replace('\\:', ':')    // replace \: -> : when port number
    });
    $scope.uploader = uploader;

    uploader.onAfterAddingFile = function (items) {
        if ($scope.autoupload) {
            uploader.uploadAll();
        }
    };

    uploader.onSuccessItem = function (item, response, status, headers) {
        response = (typeof response == 'object' || typeof response == 'string') ? decodeURIComponent(response) : JSON.parse(response);
        if($scope.limit == 1) {
            $scope.files = $scope.files || '';
            $scope.files = response;
        } else {
            $scope.files = $scope.files || [];
            $scope.files.push(response);
        }

        angular.forEach(uploader.queue, function(file, n) {
            if (file == item) {
                uploader.queue.splice(n, 1);
            }
        });
    };

    uploader.onErrorItem = function (item, response, status, headers) {
        item.remove();
        item.progress = 100;

        $scope.errors = $scope.errors || [];
        $scope.errors.push(response);
    };

    uploader.onProgressAll = function (progress) {
        uploader.progress = progress;
    };

    uploader.onCompleteAll = function () {
        uploader.progress = 100;
    };

    $scope.deleteFiles = function() {
        $scope.files = [];
    };
    $scope.deleteFile = function(file) {
        angular.forEach($scope.files, function(item, i){
            if (item == file) {
                $scope.files.splice(i, 1);
            }
        });
    };
}];
app.directive('bzUploader', [function() {
    return {
        restrict: 'A',
        scope: {
            'url': '=bzUploader',
            'files': '=ngModel',
            'autoupload': '=',
            'errors': '=',
            'translates': '@text',
            'limit': '@'
        },
        controller: bzUploaderController,
        templateUrl: 'bz-uploader/uploader.html',
        replace: true,
        transclude: true,
        require: '?ngModel'
    };
}]);

angular.module('bzUploader').run(['$templateCache', function ($templateCache) {
	$templateCache.put('bz-uploader/uploader.html', '<div class="bz-uploader" ng-show="uploader" uploader="uploader" nv-file-drop> <div class="btn-upload"> <a href="" class="btn btn-default">{{ text.choose }}</a> <input class="btn-file-uploader" nv-file-select uploader="uploader" type="file" multiple/> </div> <div class="bz-upload-total row" ng-if="uploader.queue.length"> <div class="col col-lg-4 btn-group" ng-if="!autoupload"> <a class="btn btn-default" ng-href="#" ng-click="$event.preventDefault(); uploader.uploadAll()"> <span class="fa fa-upload"></span> {{ text.upload }} <span class="badge">{{ uploader.queue.length }}</span> </a> <a class="btn btn-danger" ng-href="#" ng-click="$event.preventDefault(); uploader.clearQueue()"> <span class="fa fa-trash-o"></span> {{ text.cancel }} <span class="badge">{{ uploader.queue.length }}</span> </a> </div> <div class="col col-lg-8" ng-if="uploader.progress> 0 && uploader.progress <100"> <div class="progress"> <span>{{ uploader.progress }}%</span> <div class="progress-bar progress-bar-success" ng-style="{ \'width\': uploader.progress + \'%\' }"> <span>{{ uploader.progress }}%</span> </div> </div> </div> </div> <div class="bz-upload-files" ng-if="uploader.queue.length"> <ul class="list-unstyled"> <li ng-repeat="item in uploader.queue"> <div ng-show="item.isUploaded">{{ item.file.name }}</div> <div class="row" ng-if="!item.isUploaded"> <div class="col col-lg-8"> <div class="progress"> <span>{{ item.file.name }}</span> <div class="progress-bar" ng-style="{ \'width\': item.progress + \'%\' }"> <span>{{ item.file.name }}</span> </div> </div> </div> <div class="col col-lg-4" ng-if="!autoupload"> <div class="btn-group"> <a class="btn btn-default btn-sm" ng-href="" ng-click="$event.preventDefault(); item.upload()" ng-disabled="item.isUploaded"> <span class="fa fa-upload"></span> </a> <a class="btn btn-danger btn-sm" ng-href="" ng-click="$event.preventDefault(); item.remove()"> <span class="fa fa-trash-o"></span> </a> </div> </div> </div> </li> </ul> </div> <div ng-transclude></div> </div>');
}]);
    return app;
}));