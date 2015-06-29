var dot = require('dot');

var $id='';
var $child = [];
var $childcode=[];
function __construct($src,name){

    var $match=$src.split(/<\/script>/ig);

    if($match.length >0){
        $match.pop()
        for (var i= 0; i< $match. length; i++){

            $child.push($match[i]);
        }
    }

    if($child.length ==0 )
        $child.push($src);

    $id=name;
}
function compaim(){
    $child.forEach(function($value){
        $childcode.push ( {
            'id': getId($value),
            'code':dot.template($value.replace(/<script.*id=[\"'](.*)[\"'].*>/ig, "").replace ("</script>" ,"" ),'').toString()
        });
    });
    return render();
}
function render() {
    var $child = [];
    $childcode.forEach(function(el) {
        var tmp = '    exports.' + el.id + ' =' + el.code + ';';
        $child.push(tmp);
    });
    var codetmp = [];
    codetmp.push('define("' + $id + '",function(require,exports,module){');
    codetmp.push($child.join('\r\n'));
    codetmp.push(' });');
    return codetmp.join('\r\n');
}
function getId($str){
    var $match=$str.match(/<script.*id=[\"'](.*)[\"'].*>/i );
    if($match){
        return $match[ 1];
    }
}

exports.dot=function(srcCode,name){
    __construct(srcCode,name);
    return compaim();
}