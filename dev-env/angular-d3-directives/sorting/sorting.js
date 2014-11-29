
app = angular.module( 'sorting', [] );

app.controller('MainCtrl', function( $scope, $window ) {
    angular.element($window).on('resize', function(){ $scope.$apply(); });
    this.min = 1;
    this.max = 10;
    this.speed = 100;
    this.isClicked = false;
    this.click = function() { this.isClicked = !this.isClicked }
});

app.directive('sort', ['$interval', function($interval) {
    function link( scope, elem, attr ) {
        elem.on('$destory', function() {
            $interval.cancel(stop);
            stop = undefined;
        });

        elem = elem[0];
        var stop;
        var w, h, i, j;
        var min = +scope.min;
        var max = +scope.max;
        var speed = +scope.speed;
        var data = scope.data || _.shuffle(d3.range(min, max+1));
        var cache = data;
        var graph = d3.select(elem);

        function swap( arr, a, b ) {
            var tmp = arr[a];
            arr[a] = arr[b];
            arr[b] = tmp;
            update();
        }

        /*scope.$watch(function(){
         w = elem.clientWidth;
         h = elem.clientHeight;
         return w + h;
         }, resize);

         function resize() {
         update();
         }*/

        scope.$watchGroup(['min', 'max', 'data'], function(newVal, oldVal) {
            data = _.shuffle(d3.range(+newVal[0], +newVal[1] +1));
            if (angular.isDefined(stop)) {
                $interval.cancel(stop);
                stop = undefined;
            }
            update();
        });

        scope.$watch('isClicked', function(newVal) {
            if(newVal) {
                i = 0;
                j = 0;
                stop = $interval(bubbleSort, speed);
                scope.isClicked = !scope.isClicked;
            }
        });

        scope.$watch('speed', function(newVal) {
            speed = newVal;
            if (angular.isDefined(stop)) {
                $interval.cancel(stop);
                stop = $interval(bubbleSort, speed);
            }
        });

        function update() {
            if (!data) {
                return;
            }
            var bars = graph.selectAll('div').data(data);
            bars.exit().remove();
            bars.enter().append('div')
                .attr({
                    class: 'bar'
                });
            bars.style('width', function (d) {
                return d + '%';
            })
        }

        function bubbleSort() {
            if (data[i-1] > data[i]) {
                swap(data, i-1, i);
            }
            i++;
            if (i === data.length - j) {
                j++;
                i = 1;
            }
            if (j === data.length-1) {
                $interval.cancel(stop);
                stop = undefined;
            }
        }
    }

    return {
        link: link
        , restrict: 'E'
        , scope: {
            max: '=',
            min: '=',
            data: '=',
            speed: '=',
            isClicked: '='
        }
        , replace: true
        , template: '<div ng-transclude class="graph"></div>'
        , transclude: true
    }
}]);