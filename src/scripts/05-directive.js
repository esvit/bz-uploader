app.directive('bzUploader', [function() {
    return {
        restrict: 'A',
        scope: {
            'url': '=bzUploader',
            'files': '=ngModel',
            'autoupload': '=',
            'text': '='
        },
        controller: bzUploaderController,
        templateUrl: 'bz-uploader/uploader.html',
        replace: true,
        transclude: true,
        require: '?ngModel',
        link: function(scope, element, attr) {
            scope.text = angular.extend({
                'choose': 'Choose files',
                'upload': 'Upload',
                'cancel': 'Cancel'
            }, scope.text || {});
        }
    };
}]);