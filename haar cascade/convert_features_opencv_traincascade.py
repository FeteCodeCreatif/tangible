import xml.etree.ElementTree, os.path, sys


'''
Classifier - array layout:
    [width, height, threshold, num_simple_classifiers, tilted, num_features, f1, f2, f3, f4, f_weight, simple_threshold, left_val, right, val, ...] 
'''

wrapper = "(function(module) {\n" + \
          "    \"use strict\";\n" + \
          "    \n" + \
          "    var classifier = %classifier;\n" + \
          "    module.classifier = new Float32Array(classifier);\n" + \
          "    module.classifier.tilted = false;\n" + \
          "})(objectdetect);"
 
def convert(filename):
    '''
    Converts xml haar cascade to json.
    
    cascade = {size:[20 20], complex_classifiers:[]}
    complex_classifier = {simple_features:[], treshold}
    simple_classifier = {features:[], threshold, left_val, right_val}
    feature = [x, y, width, height, factor]
    '''
    pos = filename.rfind(".");
    json_file = file((filename if pos == -1 else filename[0:pos]) + ".js", "w");
    
    tree = xml.etree.ElementTree.parse(filename)
    json_file.write(parse_cascase(tree.getroot()[0]))
    
    json_file.close();

def parse_cascase(element, wrapper=wrapper):
    complex_classifiers = []
    
    features = []
    for feature in element.find("features").findall("_"):
        features.append(parse_feature(feature))
        
    for stage in element.find("stages").findall("_"):
        complex_classifiers.append(parse_complex_classifier(stage, features))
    
    return wrapper.replace("%classifier",
                           "[" + element.find("width").text.strip() + "," + element.find("height").text.strip() + "," + \
                           ",".join(complex_classifiers) + "]")

def parse_complex_classifier(element, features):
    simple_classifiers = []
    
    for weak_classifier in element.find("weakClassifiers").findall("_"):
        simple_classifiers.append(parse_weak_classifier(weak_classifier, features))
            
    return element.find("stageThreshold").text + "," + \
           str(len(simple_classifiers)) + "," + \
           ",".join(simple_classifiers)

def parse_weak_classifier(element, features):
    internal_node = element.find("internalNodes").text.strip().split(" ")
    leaf_values = element.find("leafValues").text.strip().split(" ")
    feature = features[int(internal_node[2])]
    return internal_node[0] + "," + \
           str(len(feature)) + "," + \
           ",".join(feature) + "," + \
           internal_node[3] + "," + \
           leaf_values[0] + "," + \
           leaf_values[1]

def parse_feature(element):
    feature = []
    for rect in element.find("rects").findall("_"):
        feature.append(",".join(rect.text.strip().split(" ")))
    return feature;

def main():	
	if len(sys.argv) != 2:
		sys.stderr.write("Usage: %s <opencv_xml_file>\n" 
			% sys.argv[0])
		return -1


	if not os.path.isfile(sys.argv[1]):
		sys.stderr.write("File does not exist\n")
		return -1 

	convert(sys.argv[1])

if __name__ == "__main__":
	main()