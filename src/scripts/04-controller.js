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
    token = token || $window.localStorage['satellizer_token'];
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
        if(typeof response == 'string') {
            try {
                response = JSON.parse(response);
            } catch (er) {
                response = decodeURIComponent(response);
            }
        }
        console.log('Success: ', response);

        $scope.errors = [];
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