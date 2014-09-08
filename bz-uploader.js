/*! bzUploader v0.1.0 by Vitalii Savchuk(esvit666@gmail.com) - https://github.com/esvit/bz-uploader - New BSD License */
!function(a,b){return"function"==typeof define&&define.amd?void define(["angular","angular-file-upload"],function(a){return b(a)}):b(a)}(angular||null,function(a){var b=a.module("bzUploader",["angularFileUpload"]),c=["$scope","FileUploader","$parse",function(b,c,d){b.autoupload=b.autoupload||!1,b.text=a.extend({choose:"Choose files",upload:"Upload",cancel:"Cancel"},d(b.translates||"")(b)||{}),b.limit=b.limit||10,b.errors=[];var e=new c({scope:b,url:b.url.replace("\\:",":")});b.uploader=e,e.onAfterAddingFile=function(){b.autoupload&&e.uploadAll()},e.onSuccessItem=function(c,d){d=a.fromJson(d),1==b.limit?(b.files=b.files||"",b.files=d):(b.files=b.files||[],b.files.push(d)),a.forEach(e.queue,function(a,b){a==c&&e.queue.splice(b,1)})},e.onErrorItem=function(a,c){a.remove(),a.progress=100,b.errors=b.errors||[],b.errors.push(c)},e.onProgressAll=function(a){e.progress=a},e.onCompleteAll=function(){e.progress=100},b.deleteFiles=function(){b.files=[]},b.deleteFile=function(c){a.forEach(b.files,function(a,d){a==c&&b.files.splice(d,1)})}}];return b.directive("bzUploader",[function(){return{restrict:"A",scope:{url:"=bzUploader",files:"=ngModel",autoupload:"=",errors:"=",translates:"@text",limit:"@"},controller:c,templateUrl:"bz-uploader/uploader.html",replace:!0,transclude:!0,require:"?ngModel"}}]),a.module("bzUploader").run(["$templateCache",function(a){a.put("bz-uploader/uploader.html",'<div class="bz-uploader" ng-if="uploader" uploader="uploader" nv-file-drop> <div class="btn-upload"> <a href="" class="btn btn-default">{{ text.choose }}</a> <input class="btn-file-uploader" nv-file-select uploader="uploader" type="file" multiple/> </div> <div class="bz-upload-total row" ng-if="uploader.queue.length"> <div class="col col-lg-4 btn-group" ng-if="!autoupload"> <a class="btn btn-default" ng-href="#" ng-click="$event.preventDefault(); uploader.uploadAll()"> <span class="fa fa-upload"></span> {{ text.upload }} <span class="badge">{{ uploader.queue.length }}</span> </a> <a class="btn btn-danger" ng-href="#" ng-click="$event.preventDefault(); uploader.clearQueue()"> <span class="fa fa-trash-o"></span> {{ text.cancel }} <span class="badge">{{ uploader.queue.length }}</span> </a> </div> <div class="col col-lg-8" ng-if="uploader.progress> 0 && uploader.progress <100"> <div class="progress"> <span>{{ uploader.progress }}%</span> <div class="progress-bar progress-bar-success" ng-style="{ \'width\': uploader.progress + \'%\' }"> <span>{{ uploader.progress }}%</span> </div> </div> </div> </div> <div class="bz-upload-files" ng-if="uploader.queue.length"> <ul class="list-unstyled"> <li ng-repeat="item in uploader.queue"> <div ng-show="item.isUploaded">{{ item.file.name }}</div> <div class="row" ng-if="!item.isUploaded"> <div class="col col-lg-8"> <div class="progress"> <span>{{ item.file.name }}</span> <div class="progress-bar" ng-style="{ \'width\': item.progress + \'%\' }"> <span>{{ item.file.name }}</span> </div> </div> </div> <div class="col col-lg-4" ng-if="!autoupload"> <div class="btn-group"> <a class="btn btn-default btn-sm" ng-href="" ng-click="$event.preventDefault(); item.upload()" ng-disabled="item.isUploaded"> <span class="fa fa-upload"></span> </a> <a class="btn btn-danger btn-sm" ng-href="" ng-click="$event.preventDefault(); item.remove()"> <span class="fa fa-trash-o"></span> </a> </div> </div> </div> </li> </ul> </div> <div ng-transclude></div> </div>')}]),b});