
// https://stackoverflow.com/questions/15397372/javascript-new-date-ordinal-st-nd-rd-th
// adds the proper nth ending to numbers 
function nth(num) {
    var d = parseInt(num);
    if (d > 3 && d < 21) return 'th';
    switch (d % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
    }
}


// general processing to extract tag names and information between tags to create nested array 
function preprocess(contextualizeMe) {

    var x = contextualizeMe
    var pre = {}
    var i = 0;
    //f inds all the indices in string that equal < and > and add to Object {< or >: index}
    while (i < x.length) {
        if (x.charAt(i) === "<" || x.charAt(i) === ">") {
            pre[i] = x.charAt(i);
        }
        i++;
    }
    // take the keys of the value 
    var pre_keys = Object.keys(pre);

    var find = []
    // iterates through the keys from the object and takes the data that is between > (outer tag) and < (inner tag), meaning the innerText of the HTML 
    for (var j = 1; j < pre_keys.length - 1; j += 2) {
        var start = parseInt(pre_keys[j]) + 1  // takes the value of pre_keys and adds one 
        var stop = parseInt(pre_keys[j + 1]) // adds one to the index then takes value
        // iterate through the 
        for (var k = start; k < stop; k++) {

            var possibleOpen = x[k] + x[k + 1] + x[k + 2] + x[k + 3]
            var possibleClose = x[k - 3] + x[k - 2] + x[k - 1] + x[k]

            // if new line, make it an empty space
            var breaker = "~"

            if (x[k] === '\n') {
                var newLine = x[k].replace('\n', "");
                find.push(newLine);
                // want to split on the beginning and end of &lt; and &gt; 
            } else if (x[k] === "&" || x[k] === ";") {
                if (possibleOpen === "&lt;" || possibleOpen === "&gt;") {
                    var startBracket = x[k].replace("&", `${breaker}&`);
                    find.push(startBracket);
                } else if (possibleClose === "&lt;" || possibleClose === "&gt;") {
                    var endBracket = x[k].replace(";", `;${breaker}`);
                    find.push(endBracket)
                }
            } else {
                find.push(x[k]);
            }
        }
    }
    console.log(find)
    // join the array together
    var begEnd = find.join("");
    // console.log(begEnd)
    // then split it again on the % 
    var split = begEnd.split(`${breaker}`);
    split.shift(); //remove empty first item from array

    // console.log(split)
    // now make the nested array, in which each array in the big array represents a small chunk of html i.e. <h1> hello, world </h1> 
    var HTMLchunks = [] // all the chunks!!!
    var temp = [] // temp array to represent each small chunk     
    // iterate through the split to add to temp array
    for (var k = 0; k < split.length; k++) {

        isEmpty = split[k].replace(/^\s+/, '').replace(/\s+$/, '');
        if (isEmpty !== '') { // text is not all whitespace
            temp.push(split[k]);
        } else { // text has no content, i.e. all whitespace including /n and /t 
            HTMLchunks.push(temp);
            temp = []
        }
    }
    console.log(HTMLchunks)
    // now separate the tags and their resepctive attributes and the innerHTML 
    var tokenized = []
    // console.log(HTMLchunks)
    for (var l = 0; l < HTMLchunks.length; l++) {
        var token = HTMLchunks[l];
        var tag = {}
        var part = []
        // console.log(token);
        if (token.length === 3) { //only one tag 
            if (token[1].charAt(0) !== "/") {
                part.push(token[0])
                part.push(token[1])
                part.push(token[2])
                tag.opening = part;
            } else {
                part.push(token[0])
                part.push(token[1])
                part.push(token[2])
                tag.closing = part;
            }
        } else { // more than just an opening or close tag 
            for (var m = 0; m < 3; m++) {
                part.push(token[m])
                tag.opening = part;
            }
            part = []
            if (token.length !== 3) {
                part.push(token[3]);
                tag.inner = part;
            }
            part = []
            for (var n = (token.length) - 3; n < token.length; n++) {
                part.push(token[n])
                tag.closing = part;
            }
        }
        part = []
        tokenized.push(tag)
    }

    // finally, separate the inner css from the tag itself 
    //find where the inner css exists and mark it in array
    var style_indices = [];
    for (var p = 0; p < tokenized.length; p++) {
        if (tokenized[p].hasOwnProperty("opening")) {
            var openingTag = tokenized[p].opening

            for (var q = 0; q < openingTag.length; q++) {
                var check = openingTag[q].split("=")
                var splitCheck = check[0].split(" ");
                if (splitCheck[1] === "style") { //inline css exists within tag
                    style_indices.push(p)

                }
            }
        }
    }


    // only one css attribute 
    if (style_indices.length > 0) {
        for (var r = 0; r < style_indices.length; r++) {

            var styles = tokenized[r].opening[1].split(" ") //split on space between the tag word and the style keyword for inline css

            var l = styles[1].length

            if (styles[1].charAt(l - 1) == '"') {

                var pattern = /".*?"/g;
                var p = pattern.exec(styles[1])  //execute the pattern on the string
                var splitP = p[0].replace(/['"]+/g, '').split(":") //remove double quotes within string and then split on colon (assuming that there is only one css attribute)
                var attribute = splitP[0].split("-").join(" ") //get rid of dash for appropriate attributes
                var str = `inline css with a ${attribute} of ${splitP[1]}`;
                // console.log(str)
            } else { 
                var styles = tokenized[r].opening[1].split(" ") //split on space between the tag word and the style keyword for inline css
               

                var sp = styles[1].split(/"/)
                var attribute = sp[1].split(":")
                var str = `inline css with a ${attribute[0]} of ${attribute[1]}`;

            }

            var n = []
            n.push(str)

            var t = `${tokenized[r].opening[1].split(" ")[0]} that has ${n}`
            var final = []
            final.push(t)
            tokenized[r].opening[1] = t;
        }
    }

    console.log(tokenized)

    return tokenized;



}
// a general process of basic html tags: 
//h1, h2, h3, h4, h5, h6 
//body 
//title
//p 
function normalParse(tokenized, opts) {
    var preprocessed = []
    for (var m = 0; m < tokenized.length; m++) {
        var tokenString = []


        if (tokenized[m].hasOwnProperty("opening")) {
            var t_open = tokenized[m].opening;
            var checkHTML = t_open[1]
            if (opts.level === "high") {
                if (checkHTML === "!DOCTYPE html" || checkHTML === "!DOCTYPEhtml") {
                    tokenString.push("Document is of type HTML;; <br> ");
                    preprocessed[m] = tokenString;
                }
            } else {
                if (checkHTML === "!DOCTYPE html" || checkHTML === "!DOCTYPEhtml") {
                    tokenString.push("Document is of type HTML;; <br>" + `opening ${t_open[1]} tag;; <br>`)
                    preprocessed[m] = tokenString;

                } else {
                    tokenString.push(`opening ${t_open[1]} tag;; <br>`)
                    preprocessed[m] = tokenString;
                }
            }
        }

        if (tokenized[m].hasOwnProperty("inner")) {
            var t_inner = tokenized[m].inner;
            if (opts.level === "high") {
                tokenString.push(`${tokenized[m].opening[1]} tag, ${t_inner[0]};; <br>`)
                preprocessed[m] = tokenString;
            } else {
                tokenString.push(`${t_inner[0]};; <br>`)
                preprocessed[m] = tokenString;
            }
        }
        if (tokenized[m].hasOwnProperty("closing")) {
            var t_close = tokenized[m].closing;
            if (opts.level === "high") {

            } else {
                tokenString.push(`closing ${t_close[1].replace("/", "")} tag;; <br>`)
                preprocessed[m] = tokenString;
            }
        }

        var tokenString = []

    }
    preprocessed.push(tokenString);
    tokenString = []

    var lastJoin = []
    var temp = []
    for (var n = 0; n < preprocessed.length; n++) {
        var x = preprocessed[n]
        if (x) {
            x = preprocessed[n].join("")
        } else {
            x = preprocessed[n]
        }
        temp.push(x);
        lastJoin.push(temp);
        temp = []
    }
    var final = lastJoin.join("");

    return final;

}

//parses and contexutalizes tables
//i.e. gives more information about where you are within the table when coding html tables (includes table, th (table heading), tr (table rows/the data))
function parseTable_low(tokenized) {
    var preprocessed = []
    var headings = []
    var numOfHeadings = 0;
    var rows = -1;
    var cols = 0;

    for (var m = 0; m < tokenized.length; m++) {
        var tokenString = []

        if (tokenized[m].hasOwnProperty("opening")) {
            var t_open = tokenized[m].opening;
            tokenString.push(`opening ${t_open[1]} tag;; <br>`)
            preprocessed[m] = tokenString;
            if (t_open[1] === "th") {
                numOfHeadings++;
            }
            if (t_open[1] === "tr") {
                rows++;
            }
        }

        if (tokenized[m].hasOwnProperty("inner")) {
            var t_inner = tokenized[m].inner;
            if (tokenized[m].opening[1] === "th") {
                headings.push(t_inner.join(""));
                var n = nth(numOfHeadings);
                tokenString.push(`${numOfHeadings}${n} heading, ${t_inner[0]};; <br>`)
                preprocessed[m] = tokenString;
            } else if (tokenized[m].opening[1] === "td") {
                cols++;
                var rows_n = nth(rows);
                var cols_n = nth(cols);
                tokenString.push(`${rows}${rows_n} row, ${cols}${cols_n} column, ${headings[cols - 1]} heading, ${t_inner[0]};; <br>`)
                preprocessed[m] = tokenString;
            } else {
                tokenString.push(`${t_inner[0]};; <br>`)
                preprocessed[m] = tokenString;
            }
        }
        if (tokenized[m].hasOwnProperty("closing")) {
            if (tokenized[m].closing[1] === "/tr") {
                cols = 0;
            } else {
                var t_close = tokenized[m].closing;
                tokenString.push(`closing ${t_close[1].replace("/", "")} tag;; <br>`)
                preprocessed[m] = tokenString;
            }
        }
        var tokenString = []
    }
    preprocessed.push(tokenString);
    tokenString = []


    tokenString = []

    var lastJoin = []
    var temp = []
    for (var n = 0; n < preprocessed.length; n++) {
        var x = preprocessed[n]
        if (x) {
            x = preprocessed[n].join("")
        } else {
            x = preprocessed[n]
        }
        temp.push(x);
        lastJoin.push(temp);
        temp = []
    }
    var final = lastJoin.join("");
    return final;

}

//high level of abstraction
function parseTable_high(tokenized, opts) {

    var preprocessed = []
    var headings = []
    var numOfHeadings = 0;
    var rows = -1;
    var cols = 0;
    var totalcols = 0;
    for (var m = 0; m < tokenized.length; m++) {
        var tokenString = []

        if (tokenized[m].hasOwnProperty("opening")) {
            var t_open = tokenized[m].opening;
            if (t_open[1] === "th") {
                numOfHeadings++;
            }
            if (t_open[1] === "tr") {
                rows++;
            }
        }

        if (tokenized[m].hasOwnProperty("inner")) {
            var t_inner = tokenized[m].inner;
            if (tokenized[m].opening[1] === "th") {
                headings.push(t_inner.join(""));
                var n = nth(numOfHeadings);
                tokenString.push(`${numOfHeadings}${n} heading, ${t_inner[0]};; <br>`)
                preprocessed[m] = tokenString;
            } else if (tokenized[m].opening[1] === "td") {
                cols++;
                totalcols++; 
                var rows_n = nth(rows);
                var cols_n = nth(cols);
                if (opts.rowscols) {
                    tokenString.push(`${rows}${rows_n} row, ${cols}${cols_n} column, ${headings[cols - 1]} heading, ${t_inner[0]};; <br>`)
                    preprocessed[m] = tokenString;
                } else if (!opts.rowscols && opts.data) {
                    tokenString.push(`${headings[cols - 1]} is ${t_inner[0]};; <br>`)
                    preprocessed[m] = tokenString;
                } else if (opts.data) {
                    tokenString.push(`${t_inner[0]};; <br>`)
                    preprocessed[m] = tokenString;
                }
            } else {
                tokenString.push(`${t_inner[0]};; <br>`)
                preprocessed[m] = tokenString;
            }
        }

        if (tokenized[m].hasOwnProperty("closing")) { //to reset columns
            if (tokenized[m].closing[1] === "/tr") {
                cols = 0;
            }
        }
        var tokenString = []
    }
    
    if (opts.headings) {
        var summary = []
        var s = `The following is a table - There are ${numOfHeadings} headings, with ${rows + 1} rows and ${totalcols/rows} columns;; <br>`
        summary.push(s)
        preprocessed.unshift(summary)
    }

    var final = preprocessed.join("");
    console.log("-------final")
    console.log(final)
    return final;

}

//insert node before another node
function insertBefore(el, referenceNode) {
    referenceNode.parentNode.insertBefore(el, referenceNode);
}

//will call separate parsing functions depending on type of input and then will change the innerHTML accordingly 
function contextualize(opts, changedCode) {
    // var changedCode = allCode.querySelectorAll('.w3-code.htmlHigh');
    var len = changedCode.length;
    console.log("----------------len: " + len)
    for (var i = 0; i < len; i++) {
        var contextualizeMe = changedCode[i].innerHTML;
        // console.log(contextualizeMe);
        var contextualize;
        if (contextualizeMe) {
            if (contextualizeMe.includes("&nbsp;")) {
                contextualize = contextualizeMe.replace(/&nbsp;/gi, '');
            } else {
                contextualize = contextualizeMe;
            }
        }

        var tokenized = preprocess(contextualize);

        var type;
        var check = tokenized[0].opening[1].split(" ")[0]
        if (check === "table") {
            if (opts[0] === "low") {
                type = "table_low";
            } else {
                type = "table_high"
            }
        } else {
            type = "normal";
        }

        var final;
        switch (type) {
            case "table_low":
                final = parseTable_low(tokenized)
                console.log("table low")
                break;
            case "table_high":
                final = parseTable_high(tokenized, opts)
                console.log("table high")
                break;
            case "normal":
                final = normalParse(tokenized, opts)
                console.log("normal")
                break;
            default:
                final = normalParse(tokenized, opts)
                console.log("default")
                break;
        }


        var newCode = document.createElement("div");
        newCode.className = "changedCode";
        newCode.innerHTML = `<p>${final}</p>`;
        newCode.style.width = 'auto';
        newCode.style.backgroundColor = "#fff";
        newCode.style.padding = "8px 12px";
        newCode.style.borderLeft = "4px solid #4CAF50";
        newCode.style.wordWrap = "break-word"
        changedCode[i].style.display = "none";
        insertBefore(newCode, changedCode[i]);
    }

    return false;
}

//reset to the original HTML code 
function getOriginal(changedCode) {
    var len = changedCode.length;
    for (var y = 0; y < len; y++) {
        changedCode[y].style.display = "block";
    }
    
    //remove changed nodes
    var changeNodes = document.querySelectorAll(".changedCode");
    for (var z = 0; z < changeNodes.length; z++) {
        console.log("REMOVING NODES")
        console.log(changeNodes[z])

        changeNodes[z].parentNode.removeChild(changeNodes[z]);
    }
}

//main function!!!! woooooooo
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log("something happening from the extension");
    
    var data = request.data || {};

    var parseMe = document.querySelectorAll(".w3-code.htmlHigh");
    if (data.level === "low") {
        console.log("LOW")
        contextualize(["low"], parseMe)
    } else if (data.level === "high") { 
        console.log("HIGH")
        contextualize(data, parseMe)
    } else if (data.level === "reset") {
        console.log("RESET")
        getOriginal(parseMe);
    }
    
    sendResponse({ data: data, success: true });
});

