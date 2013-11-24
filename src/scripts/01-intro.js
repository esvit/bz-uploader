(function(angular, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['angular', 'angular-file-upload'], function(angular) {
            return factory(angular);
        });
    } else {
        return factory(angular);
    }
}(angular || null, function(angular) {