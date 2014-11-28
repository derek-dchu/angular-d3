
app = angular.module('sorting', []);

app.controller('MainCtrl', function($scope, $window) {
    angular.element($window).on('resize', function(){ $scope.$apply(); });
});

app.directive('sort', function() {
    function link(scope, elem, attr) {
        elem = elem[0];
        var data = scope.data || _.shuffle(d3.range(scope.min, scope.max+1));
        var cache = data;
    }

    return {
        link: link
        , restrict: 'E'
        , scope: {
            max: '=',
            min: '=',
            data: '='
        }
        , replace: true
        , template: '<div class="sort"></div>'
    }



});
