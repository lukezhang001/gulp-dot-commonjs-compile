var fs = require('fs');
var dot = require('dot');
// var sourcefilename="tpl_wg.dealDetail.html";
// var srcCode = fs.readFileSync( "./"+sourcefilename, "utf-8" );
var $source="";
var $id;
var $code;
var $child = [];
var $childcode=[];
function __construct($src){

    //var $match=$code.match(/<script(.|\s)*<\/script>/ig);
    var $match=$src.split(/<\/script>/ig);

    if($match.length >0){
        $match.pop()
        for (var i= 0; i< $match. length; i++){
            if(i ==0 ){
                $source = $match[ i];
            }
            else{
                $child.push($match[i]);
            }
        }
    }

    if($source =="" )
        $source = $src;

}
function compaim(){
    $id = getId($source);
    // $code = getCode($source);
    $code = dot.template($source.replace(/<script.*id=[\"'](.*)[\"'].*>/ig, "").replace ("</script>" ,"" )).toString()
    //$getRequire();
    $child.forEach(function($value){
        $childcode.push ( {
            'id': getId($value),
            'code':dot.template($value.replace(/<script.*id=[\"'](.*)[\"'].*>/ig, "").replace ("</script>" ,"" )).toString()//getCode($value)
        });
    });
    return render();
}
function render() {
    var $child = [];
    $childcode.forEach(function(el) {
        var tmp = [];
        tmp.push("exports.child_" + el.id + " = function(it){");
        tmp.push("    " + el.code + "");
        tmp.push("}");
        $child.push(tmp.join('\r\n'));
    });
    var codetmp = [];
    codetmp.push('define("tpl_' + $id + '",function(require,exports,module){');
    codetmp.push('    var _cacheThisModule_,ins={};');
    codetmp.push('    exports.template = function(it){');
    codetmp.push('        ' + $code + '');
    codetmp.push('    };');
    codetmp.push('    ' + $child.join(';') + '');
    codetmp.push(' });');
    return codetmp.join('\r\n');
}
function getId($str){
    var $match=$str.match(/<script.*id=[\"'](.*)[\"'].*>/i );
    if($match){
        return $match[ 1];
    }
}

exports.dot=function(srcCode){
    __construct(srcCode);
    return compaim();
}