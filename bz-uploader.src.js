(function(angular, factory) {
    if (typeof define === 'function' && define.amd) {
        define('bzUploader', ['angular', 'angular-file-upload'], function(angular) {
            return factory(angular);
        });
    } else {
        return factory(angular);
    }
}(angular || null, function(angular) {
var app = angular.module('bzUploader', ['angularFileUpload']);
var bzUploaderController = ['$scope', '$fileUploader', '$parse', function($scope, $fileUploader, $parse) {
    $scope.autoupload = $scope.autoupload || false;
    $scope.text = $scope.text || 'Upload';

    // create a uploader with options
    var uploader = $fileUploader.create({
        scope: $scope,                          // to automatically update the html. Default: $rootScope
        url: $scope.url.replace('\\:', ':'),    // replace \: -> : when port number
        filters: [
            function (item) {                    // first user filter
                //console.log('filter1', item);
                return true;
            }
        ]
    });
    $scope.uploader = uploader;

    // ADDING FILTER

    uploader.filters.push(function (item) { // second user filter
        //console.log('filter2');
        return true;
    });

    // REGISTER HANDLERS

    uploader.bind('afteraddingfile', function (event, item) {
        //item.upload();
        //console.log('After adding a file', item);
    });

    uploader.bind('afteraddingall', function (event, items) {
        if ($scope.autoupload) {
            uploader.uploadAll();
        }
        //console.log('After adding all files', items);
    });

    uploader.bind('changedqueue', function (event, items) {
        ///console.log('Changed queue', items);
    });

    uploader.bind('beforeupload', function (event, item) {
        //console.log('Before upload', item);
    });

    uploader.bind('progress', function (event, item, progress) {
        //console.log('Progress: ' + progress);
    });

    uploader.bind('success', function (event, xhr, item) {
        var response = $parse(xhr.response)();
        $scope.files = $scope.files || [];
        $scope.files.push(response);

        angular.forEach(uploader.queue, function(file, n) {
            if (file == item) {
                uploader.queue.splice(n, 1);
            }
        });
        console.log('Success: ', response);
    });

    uploader.bind('complete', function (event, xhr, item) {
        //console.log('Complete: ' + xhr.status);
        //item.progress = 100;
    });
    uploader.bind('error', function (event, xhr, item) {
        console.log('Complete: ', item);
        item.remove();
        item.progress = 100;
    });

    uploader.bind('progressall', function (event, progress) {
        //console.log('Total progress: ' + progress);
        uploader.progress = progress;
    });

    uploader.bind('completeall', function (event, items) {
        console.log('All files are transferred');
        uploader.progress = 100;
    });

    $scope.deleteFiles = function() {
        $scope.files = [];
    };
    $scope.deleteFile = function(file) {
        angular.forEach($scope.files, function(item, i){
            if (item == file) {
                $scope.files.splice(i, 1);
                console.info(file);
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
            'autoupload': '='
        },
        controller: bzUploaderController,
        templateUrl: 'bz-uploader/uploader.html',
        replace: true,
        transclude: true,
        require: '?ngModel'
    };
}]);
angular.module('bzUploader').run(['$templateCache', function ($templateCache) {
	$templateCache.put('bz-uploader/uploader.html', '<div class="bz-uploader" ng-file-drop> <div class="btn-upload"> <a href="" class="btn btn-default"><span class="fa fa-plus"></span> Upload</a> <input class="btn-file-uploader" ng-file-select type="file" multiple/> </div> <div class="bz-upload-total row" ng-if="uploader.queue.length"> <div class="col col-lg-4 btn-group" ng-if="!autoupload"> <a class="btn btn-default" ng-href="#" ng-click="$event.preventDefault(); uploader.uploadAll()"> <span class="fa fa-upload"></span> Upload <span class="badge">{{ uploader.queue.length }}</span> </a> <a class="btn btn-danger" ng-href="#" ng-click="$event.preventDefault(); uploader.clearQueue()"> <span class="fa fa-trash-o"></span> Cancel <span class="badge">{{ uploader.queue.length }}</span> </a> </div> <div class="col col-lg-8" ng-if="uploader.progress> 0"> <div class="progress"> <span>{{ uploader.progress }}%</span> <div class="progress-bar progress-bar-success" ng-style="{ \'width\': uploader.progress + \'%\' }"> <span>{{ uploader.progress }}%</span> </div> </div> </div> </div> <div class="bz-upload-files" ng-if="uploader.queue.length"> <ul class="list-unstyled"> <li ng-repeat="item in uploader.queue"> <div ng-show="item.isUploaded">{{ item.file.name }}</div> <div class="row" ng-if="!item.isUploaded"> <div class="col col-lg-8"> <div class="progress"> <span>{{ item.file.name }}</span> <div class="progress-bar" ng-style="{ \'width\': item.progress + \'%\' }"> <span>{{ item.file.name }}</span> </div> </div> </div> <div class="col col-lg-4" ng-if="!autoupload"> <div class="btn-group"> <a class="btn btn-default btn-sm" ng-href="" ng-click="$event.preventDefault(); item.upload()" ng-disabled="item.isUploaded"> <span class="fa fa-upload"></span> </a> <a class="btn btn-danger btn-sm" ng-href="" ng-click="$event.preventDefault(); item.remove()"> <span class="fa fa-trash-o"></span> </a> </div> </div> </div> </li> </ul> </div> <div class="uploaded-files" ng-if="files.length"> <div ng-transclude></div> </div> </div>');
}]);
    return app;
}));