var bzUploaderController = ['$scope', '$fileUploader', '$parse', function($scope, $fileUploader, $parse) {
    $scope.autoupload = $scope.autoupload || false;
    $scope.text = angular.extend({
        'choose': 'Choose files',
        'upload': 'Upload',
        'cancel': 'Cancel'
    }, $parse($scope.translates || '')($scope) || {});
    $scope.limit = $scope.limit || 10;

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
        console.log('Success: ', response);
    });

    uploader.bind('complete', function (event, xhr, item) {
        //console.log('Complete: ' + xhr.status);
        //item.progress = 100;
    });
    uploader.bind('error', function (event, xhr, item) {
        //console.log('Complete: ', item);
        item.remove();
        item.progress = 100;
        if($scope.limit == 1) {
            $scope.files = xhr;
        } else {
            $scope.files = $scope.files || [];
            $scope.files.push({error: xhr.response});
        }
    });

    uploader.bind('progressall', function (event, progress) {
        //console.log('Total progress: ' + progress);
        uploader.progress = progress;
    });

    uploader.bind('completeall', function (event, items) {
        //console.log('All files are transferred');
        uploader.progress = 100;
    });

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