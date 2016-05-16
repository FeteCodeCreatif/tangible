(function(module) {
    "use strict";
    
    var classifier = [80,40,1.,1,0,2,25,21,18,5,-1.,31,21,6,5,3.,-2.6090286672115326e-02,1.,-1.,1.,1,0,3,35,15,16,16,-1.,35,15,8,8,2.,43,23,8,8,2.,4.0719371289014816e-02,-1.,1.,1.,1,0,2,18,11,21,6,-1.,25,13,7,2,9.,4.6921405009925365e-03,-1.,1.];
    module.classifier = new Float32Array(classifier);
    module.classifier.tilted = false;
})(objectdetect);