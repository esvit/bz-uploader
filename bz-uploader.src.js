(function(angular, factory) {
    if (typeof define === 'function' && define.amd) {
        define('bzUploader', ['angular', 'angular-file-upload'], function($, angular) {
            return factory(angular);
        });
    } else {
        return factory(angular);
    }
}(angular || null, function(angular) {
var app = angular.module('bzUploader', ['angularFileUpload']);
/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

/**
 * @ngdoc service
 * @name ngTable.factory:ngTableParams
 * @description Parameters manager for ngTable
 */
app.factory('ngTableParams', ['$q', function ($q) {
    var isNumber = function (n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    };
    var ngTableParams = function (baseParameters, baseSettings) {
        var self = this;

        /**
         * @ngdoc method
         * @name ngTable.factory:ngTableParams#parameters
         * @methodOf ngTable.factory:ngTableParams
         * @description Set new parameters or get current parameters
         *
         * @param {string} newParameters      New parameters
         * @param {string} parseParamsFromUrl Flag if parse parameters like in url
         * @returns {Object} Current parameters or `this`
         */
        this.parameters = function (newParameters, parseParamsFromUrl) {
            parseParamsFromUrl = parseParamsFromUrl || false;
            if (angular.isDefined(newParameters)) {
                for (var key in newParameters) {
                    var value = newParameters[key];
                    if (parseParamsFromUrl && key.indexOf('[') >= 0) {
                        var keys = key.split(/\[(.*)\]/).reverse()
                        var lastKey = '';
                        for (var i = 0, len = keys.length; i < len; i++) {
                            var name = keys[i];
                            if (name !== '') {
                                var v = value;
                                value = {};
                                value[lastKey = name] = (isNumber(v) ? parseFloat(v) : v);
                            }
                        }
                        if (lastKey === 'sorting') {
                            params[lastKey] = {};
                        }
                        params[lastKey] = angular.extend(params[lastKey] || {}, value[lastKey]);
                    } else {
                        params[key] = (isNumber(newParameters[key]) ? parseFloat(newParameters[key]) : newParameters[key]);
                    }
                }
                return this;
            }
            return params;
        };

        /**
         * @ngdoc method
         * @name ngTable.factory:ngTableParams#settings
         * @methodOf ngTable.factory:ngTableParams
         * @description Set new settings for table
         *
         * @param {string} newSettings New settings or undefined
         * @returns {Object} Current settings or `this`
         */
        this.settings = function (newSettings) {
            if (angular.isDefined(newSettings)) {
                settings = angular.extend(settings, newSettings);
                return this;
            }
            return settings;
        };

        /**
         * @ngdoc method
         * @name ngTable.factory:ngTableParams#page
         * @methodOf ngTable.factory:ngTableParams
         * @description If parameter page not set return current page else set current page
         *
         * @param {string} page Page number
         * @returns {Object|Number} Current page or `this`
         */
        this.page = function (page) {
            return angular.isDefined(page) ? this.parameters({'page': page}) : params.page;
        };

        /**
         * @ngdoc method
         * @name ngTable.factory:ngTableParams#total
         * @methodOf ngTable.factory:ngTableParams
         * @description If parameter total not set return current quantity else set quantity
         *
         * @param {string} total Total quantity of items
         * @returns {Object|Number} Current page or `this`
         */
        this.total = function (total) {
            return angular.isDefined(total) ? this.settings({'total': total}) : settings.total;
        };

        /**
         * @ngdoc method
         * @name ngTable.factory:ngTableParams#count
         * @methodOf ngTable.factory:ngTableParams
         * @description If parameter count not set return current count per page else set count per page
         *
         * @param {string} count Count per number
         * @returns {Object|Number} Count per page or `this`
         */
        this.count = function (count) {
            // reset to first page because can be blank page
            return angular.isDefined(count) ? this.parameters({'count': count, 'page': 1}) : params.count;
        };

        /**
         * @ngdoc method
         * @name ngTable.factory:ngTableParams#filter
         * @methodOf ngTable.factory:ngTableParams
         * @description If parameter page not set return current filter else set current filter
         *
         * @param {string} filter New filter
         * @returns {Object} Current filter or `this`
         */
        this.filter = function (filter) {
            return angular.isDefined(filter) ? this.parameters({'filter': filter}) : params.filter;
        };

        /**
         * @ngdoc method
         * @name ngTable.factory:ngTableParams#sorting
         * @methodOf ngTable.factory:ngTableParams
         * @description If parameter page not set return current sorting else set current sorting
         *
         * @param {string} sorting New sorting
         * @returns {Object} Current sorting or `this`
         */
        this.sorting = function (sorting) {
            return angular.isDefined(sorting) ? this.parameters({'sorting': sorting}) : params.sorting;
        };

        /**
         * @ngdoc method
         * @name ngTable.factory:ngTableParams#orderBy
         * @methodOf ngTable.factory:ngTableParams
         * @description Return object of sorting parameters for angular filter
         *
         * @returns {Array} Array like: [ '-name', '+age' ]
         */
        this.orderBy = function () {
            var sorting = [];
            for (var column in params.sorting) {
                sorting.push((params.sorting[column] === "asc" ? "+" : "-") + column);
            }
            return sorting;
        };

        /**
         * @ngdoc method
         * @name ngTable.factory:ngTableParams#getData
         * @methodOf ngTable.factory:ngTableParams
         * @description Called when updated some of parameters for get new data
         *
         * @param {Object} $defer promise object
         * @param {Object} params New parameters
         */
        this.getData = function ($defer, params) {
            $defer.resolve([]);
        };

        /**
         * @ngdoc method
         * @name ngTable.factory:ngTableParams#getGroups
         * @methodOf ngTable.factory:ngTableParams
         * @description Return groups for table grouping
         */
        this.getGroups = function ($defer, column) {
            var defer = $q.defer();

            defer.promise.then(function(data) {
                var groups = {};
                for (var k in data) {
                    var item = data[k],
                        groupName = angular.isFunction(column) ? column(item) : item[column];

                    groups[groupName] = groups[groupName] || {
                        data: []
                    };
                    groups[groupName]['value'] = groupName;
                    groups[groupName].data.push(item);
                }
                var result = [];
                for (var i in groups) {
                    result.push(groups[i]);
                }
                $defer.resolve(result);
            });
            this.getData(defer, self);
        };

        /**
         * @ngdoc method
         * @name ngTable.factory:ngTableParams#generatePagesArray
         * @methodOf ngTable.factory:ngTableParams
         * @description Generate array of pages
         *
         * @param {boolean} currentPage which page must be active
         * @param {boolean} totalItems  Total quantity of items
         * @param {boolean} pageSize    Quantity of items on page
         * @returns {Array} Array of pages
         */
        this.generatePagesArray = function (currentPage, totalItems, pageSize) {
            var maxBlocks, maxPage, maxPivotPages, minPage, numPages, pages;
            maxBlocks = 11;
            pages = [];
            numPages = Math.ceil(totalItems / pageSize);
            if (numPages > 1) {
                pages.push({
                    type: 'prev',
                    number: Math.max(1, currentPage - 1),
                    active: currentPage > 1
                });
                pages.push({
                    type: 'first',
                    number: 1,
                    active: currentPage > 1
                });
                maxPivotPages = Math.round((maxBlocks - 5) / 2);
                minPage = Math.max(2, currentPage - maxPivotPages);
                maxPage = Math.min(numPages - 1, currentPage + maxPivotPages * 2 - (currentPage - minPage));
                minPage = Math.max(2, minPage - (maxPivotPages * 2 - (maxPage - minPage)));
                i = minPage;
                while (i <= maxPage) {
                    if ((i === minPage && i !== 2) || (i === maxPage && i !== numPages - 1)) {
                        pages.push({
                            type: 'more',
                            active: false
                        });
                    } else {
                        pages.push({
                            type: 'page',
                            number: i,
                            active: currentPage !== i
                        });
                    }
                    i++;
                }
                pages.push({
                    type: 'last',
                    number: numPages,
                    active: currentPage !== numPages
                });
                pages.push({
                    type: 'next',
                    number: Math.min(numPages, currentPage + 1),
                    active: currentPage < numPages
                });
            }
            return pages;
        };

        /**
         * @ngdoc method
         * @name ngTable.factory:ngTableParams#url
         * @methodOf ngTable.factory:ngTableParams
         * @description Return groups for table grouping
         *
         * @param {boolean} asString flag indicates return array of string or object
         * @returns {Array} If asString = true will be return array of url string parameters else key-value object
         */
        this.url = function (asString) {
            asString = asString || false;
            var pairs = (asString ? [] : {});
            for (key in params) {
                if (params.hasOwnProperty(key)) {
                    var item = params[key],
                        name = encodeURIComponent(key);
                    if (typeof item === "object") {
                        for (var subkey in item) {
                            if (!angular.isUndefined(item[subkey]) && item[subkey] !== "") {
                                var pname = name + "[" + encodeURIComponent(subkey) + "]";
                                if (asString) {
                                    pairs.push(pname + "=" + encodeURIComponent(item[subkey]));
                                } else {
                                    pairs[pname] = encodeURIComponent(item[subkey]);
                                }
                            }
                        }
                    } else if (!angular.isFunction(item) && !angular.isUndefined(item) && item !== "") {
                        if (asString) {
                            pairs.push(name + "=" + encodeURIComponent(item));
                        } else {
                            pairs[name] = encodeURIComponent(item);
                        }
                    }
                }
            }
            return pairs;
        };

        /**
         * @ngdoc method
         * @name ngTable.factory:ngTableParams#reload
         * @methodOf ngTable.factory:ngTableParams
         * @description Reload table data
         */
        this.reload = function() {
            var $defer = $q.defer(),
                self = this;

            settings.$loading = true;
            if (settings.groupBy) {
                settings.getGroups($defer, settings.groupBy, this);
            } else {
                settings.getData($defer, this);
            }
            $defer.promise.then(function(data) {
                settings.$loading = false;
                if (settings.groupBy) {
                    settings.$scope.$groups = data;
                } else {
                    settings.$scope.$data = data;
                }
                settings.$scope.pages = self.generatePagesArray(self.page(), self.total(), self.count());
            });
        };

        var params = this.$params = {
            page: 1,
            count: 1,
            filter: {},
            sorting: {},
            group: {},
            groupBy: null
        };
        var settings = {
            $scope: null, // set by ngTable controller
            $loading: false,
            total: 0,
            counts: [10, 25, 50, 100],
            getGroups: this.getGroups,
            getData: this.getData
        };

        this.settings(baseSettings);
        this.parameters(baseParameters, true);
        return this;
    };
    return ngTableParams;
}]);
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
	$templateCache.put('bz-uploader/uploader.html', '<div class="bz-uploader" ng-file-drop> <div class="btn-upload"> <a href="" class="btn btn-default">Upload</a> <input class="btn-file-uploader" ng-file-select type="file" multiple/> </div> <div class="progress-uploaded" ng-if="uploader.queue.length && !autoupload"> <div> <b>Progress:</b> {{ uploader.progress }} <div class="progress progress-striped active"> <div class="bar" ng-style="{ \'width\': uploader.progress + \'%\' }"></div> </div> </div> <div class="btn-group"> <a class="btn btn-danger" ng-href="#" ng-click="$event.preventDefault(); uploader.uploadAll()">Загрузить все</a> <a class="btn btn-inverse" ng-href="#" ng-click="$event.preventDefault(); uploader.clearQueue()">Удалить все</a> </div> </div> <div class="upload-files" ng-if="uploader.queue.length"> <h4>Для загрузки выбрано {{ uploader.queue.length }} файла(ов).</h4> <ul class="list-unstyled"> <li ng-repeat="item in uploader.queue"> <div ng-show="item.isUploaded" style="float: left; margin-right: 10px">{{ item.file.name }}</div> <div class="row" ng-if="!item.isUploaded"> <div class="col col-lg-8"> <div class="progress"> <span>{{ item.file.name }}</span> <div class="progress-bar progress-bar-info" ng-style="{ \'width\': item.progress + \'%\' }"> <span>{{ item.file.name }}</span> </div> </div> </div> <div class="col col-lg-4"> <div class="btn-group"> <a class="btn btn-default btn-sm" ng-href="" ng-click="$event.preventDefault(); item.upload()" ng-disabled="item.isUploaded"> <span class="fa fa-upload"></span> </a> <a class="btn btn-danger btn-sm" ng-href="" ng-click="$event.preventDefault(); item.remove()"> <span class="fa fa-trash-o"></span> </a> </div> </div> </div> </li> </ul> </div> <div class="uploaded-files" ng-if="files.length"> <div ng-transclude></div> <div class="clearfix"></div> <a class="btn btn-inverse" ng-href="" ng-click="deleteFiles()">Удалить все</a> </div> </div>');
}]);
    return app;
}));