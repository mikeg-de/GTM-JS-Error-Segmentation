<script>
    // Ressources
    // Extracting domain from URL: http://www.primaryobjects.com/CMS/Article145
    // Stack traces: https://bugsnag.com/blog/js-stacktraces/
	var documentDomain = {{Page Hostname}},
		jsSegment = undefined, // Used for event action to segment types of javascripts independent from error message and transplation
		jsErrorMsg = {{Error Message}},
		jsErrorUrl = {{Error URL}},
        //scriptDomain = !(jsErrorUrl) ? jsErrorUrl.match(/\b((xn--)?[a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}\b/i)[0] : undefined,
        scriptDomain = jsErrorUrl.match(/\b((xn--)?[a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}\b/i)[0],
        origin = undefined, // Used for event category to distinguish same or cross origin issues
        jsErrorRegEx = ["Line 0\: Script error",
			"permission|zugriff|acc\w+",
			"Error loading",
			"\W? \w{2,3}( .)? ((\w+)?d.fin\w+)",
			"\w+ (expected|erwartet)",
			"\w+ (required|erforderlich)",
			"\W erwartet|expected \W",
			"(invalid|ungültiges) (character|zeichen|argument)",
			"syntax(\s?\w{5,6})|(\s?\w{5,6}).+syntax",
			"typeerror",
            "referenceerror",
            "uncaught referenceerror",
            "evalerror",
            "internalerror",
            "rangeerror",
            "urierror",
			"[^error](eigenschaft|prop.+) \W.*null",
			"obje\w?t.+(prop\w+|eigenschaft).+m.thod",
			"(Unterminated|nicht).+\wonstant",
			"Unspecified|unbekannt",
			"recursion|leitung",
			"timeout|zeit",
			"html parsing"
		],
		jsErrorMsgType = undefined; // Used to match regEx with error type

    switch (true) {
      case (documentDomain == scriptDomain):
		origin = "Same-Origin";
        break;
      case (new RegExp(documentDomain.replace(/^www\./,''), "i").test(scriptDomain)):
        origin = "Sub-Domain";
        break;
      case (scriptDomain == undefined):
        origin = "Script file not found";
        break;
      default:
		origin = "X-Origin";
    }


/*    if (documentDomain == scriptDomain) {
		origin = 'Same-Origin';
	} else if (new RegExp(documentDomain.replace(/^www\./,''), "i").test(scriptDomain)) {
        origin = 'Sub-Domain';
    } else if (scriptDomain == undefined) {
        origin = 'Script file not found';
    } else {
		origin = 'X-Origin';
	}
*/

	function jsErrorSegmenting() {
		for (i = 0; i < jsErrorRegEx.length; i++) {
            //console.log("i: "+ i);
			if (new RegExp(jsErrorRegEx[i], "i").test(jsErrorMsg) === true) {
				//console.log("Succesfull RegExp: " + new RegExp(jsErrorRegEx[i], "i"));
                i++;
                return jsErrorMsgType = i;
			}
            else {
                //console.log("Failed RegExp: " + new RegExp(jsErrorRegEx[i], "i"));
            }
		}
	}

	jsErrorSegmenting(jsErrorMsgType);

    switch (jsErrorMsgType) {
        case 1:
            jsSegment = "Line 0: script error";
            break;
        case 2:
            jsSegment = "Permission denied";
            break;
        case 3:
            jsSegment = "Error loading script";
            break;
        case 4:
            jsSegment = "foo not defined";
            break;
        case 5:
            jsSegment = "foo expected";
            break;
        case 6:
            jsSegment = "foo required";
            break;
        case 7:
            jsSegment = "'foo' expected";
            break;
        case 8:
            jsSegment = "Invalid foo";
            break;
        case 9:
            jsSegment = "Syntax Error";
            break;
        case 10:
            jsSegment = "Type Error";
            break;
        case 11:
            jsSegment = "Reference Error";
            break;
        case 12:
            jsSegment = "Uncaught Reference Error";
            break;
        case 13:
            jsSegment = "Eval Error";
            break;
        case 14:
            jsSegment = "Internal Error";
            break;
        case 15:
            jsSegment = "Range Error";
            break;
        case 16:
            jsSegment = "URI Error";
            break;
        case 17:
            jsSegment = "Unable to get value: object is null or undefined";
            break;
        case 18:
            jsSegment = "Object doesn't support this property or method";
            break;
        case 19:
            jsSegment = "Unterminated string constant";
            break;
        case 20:
            jsSegment = "Unspecified error";
            break;
        case 21:
            jsSegment = "too much recursion";
            break;
        case 22:
            jsSegment = "JavaScript timeout";
            break;
        case 23:
            jsSegment = "HTML Parsing Error";
            break;
        default:
            jsSegment = 'Not assigned';
    }

	dataLayer.push({
		'event': 'JS-Error Segmented',
		'eventCategory': "JS-Error " + origin,
		'eventAction': jsSegment,
		'eventLabel': "Line " + {{Error Line}} + ": " + jsErrorMsg + " URL: " + jsErrorUrl,
		'eventValue': {{Event flush variable}},
		'nonInteractive': 1
	});
</script>
