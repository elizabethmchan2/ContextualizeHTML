document.addEventListener('DOMContentLoaded', function() {
    
    // https://www.w3.org/TR/2016/WD-wai-aria-practices-1.1-20160317/examples/radio/radio.html
    // code below: how to make radio buttons more accessible (code from link above)
    var KEYCODE = {
        DOWN: 40,
        LEFT: 37,
        RIGHT: 39,
        SPACE: 32,
        UP: 38
    }

    var radiobuttons = document.querySelectorAll('[role=radio]');

    for(var i = 0; i < radiobuttons.length; i++ ) {
        var rb = radiobuttons[i];
        console.log(i)

        console.log(rb.tagName + " " + rb.id)

        rb.addEventListener('click', clickRadioGroup);
        rb.addEventListener('keydown', keyDownRadioGroup);
        rb.addEventListener('focus', focusRadioButton);
        rb.addEventListener('blur', blurRadioButton);
    }

    function firstRadioButton(node) {

        var first = node.parentNode.firstChild;
      
        while(first) {
          if (first.nodeType === Node.ELEMENT_NODE) {
            if (first.getAttribute("role") === 'radio') return first;
          }
          first = first.nextSibling;
        }
      
        return null;
      }

    function lastRadioButton(node) {

        var last = node.parentNode.lastChild;
        
        while(last) {
            if (last.nodeType === Node.ELEMENT_NODE) {
            if (last.getAttribute("role") === 'radio') return last;
            }
            last = last.previousSibling;
        }
        
        return last;
    }


    function nextRadioButton(node) {

        var next = node.nextSibling;
        
        while(next) {
            if (next.nodeType === Node.ELEMENT_NODE) {
            if (next.getAttribute("role") === 'radio') return next;
            }
            next = next.nextSibling;
        }
        
        return null;
    }


    function previousRadioButton(node) {

        var prev = node.previousSibling;
        
        while(prev) {
            if (prev.nodeType === Node.ELEMENT_NODE) {
            if (prev.getAttribute("role") === 'radio') return prev;
            }
            prev = prev.previousSibling;
        }
        
        return null;
    }

    function getImage(node) {

        var child = node.firstChild;
      
        while(child) {
          if (child.nodeType === Node.ELEMENT_NODE) {
            if (child.tagName === 'IMG') return child;
          }
          child = child.nextSibling;
        }
      
        return null;
    }


    function setRadioButton(node, state) {
        var image = getImage(node);
        
        if (state == 'true') {
            node.setAttribute('aria-checked', 'true')
            node.tabIndex = 0;
            node.focus()
        }
        else {
            node.setAttribute('aria-checked', 'false') 
            node.tabIndex = -1;
        }
    }

    function clickRadioGroup(event) {
        var type = event.type;
        
        if (type === 'click') {
            // If either enter or space is pressed, execute the funtion
        
            var node = event.currentTarget;
        
            var radioButton = firstRadioButton(node);
        
            while (radioButton) {
                setRadioButton(radioButton, "false");
                radioButton = nextRadioButton(radioButton);
            }
        
            setRadioButton(node, "true");
        
            event.preventDefault();
            event.stopPropagation();
        }
    }

    function keyDownRadioGroup(event) {
        var type = event.type;
        var next = false;
        
        if(type === "keydown"){
            var node = event.currentTarget;
        
            switch (event.keyCode) {
            case KEYCODE.DOWN:
            case KEYCODE.RIGHT:
                var next = nextRadioButton(node);
                if (!next) next = firstRadioButton(node); //if node is the last node, node cycles to first.
                break;
        
            case KEYCODE.UP:
            case KEYCODE.LEFT:
                next = previousRadioButton(node);
                if (!next) next = lastRadioButton(node); //if node is the last node, node cycles to first.
                break;
        
            case KEYCODE.SPACE:
                next = node;
                break;
            }
        
            if (next) {
            var radioButton = firstRadioButton(node);
        
            while (radioButton) {
                setRadioButton(radioButton, "false");
                radioButton = nextRadioButton(radioButton);
            }
        
            setRadioButton(next, "true");
        
            event.preventDefault();
            event.stopPropagation();
            }
        }
    }
    
    function focusRadioButton(event) {
        event.currentTarget.className += ' focus';
      }

      
    function blurRadioButton(event) {
        event.currentTarget.className = event.currentTarget.className.replace(' focus','');
    }


    // https://www.w3.org/TR/2016/WD-wai-aria-practices-1.1-20160317/examples/radio/radio.html
    // code above: how to make radio buttons more accessible (code from link above)
        


    //https://www.w3.org/TR/2016/WD-wai-aria-practices-1.1-20160317/examples/checkbox/checkbox-1.html
    // code below: how to make checkbox buttons more accessible 
    var checkbuttons = document.querySelectorAll('[role=checkbox]');

    for(var i = 0; i < checkbuttons.length; i++ ) {
        var cb = checkbuttons[i];
        console.log(i)

        console.log(cb.tagName + " " + cb.id)

        cb.addEventListener('click', clickCheckGroup);
        cb.addEventListener('keydown', keyDownCheckGroup);
        cb.addEventListener('focus', focusCheckbox);
        cb.addEventListener('blur', blurCheckbox);
    }

    function clickCheckGroup(event) {
        var type = event.type;
        
        if (type === 'click') {
            // If either enter or space is pressed, execute the funtion

            var node = event.currentTarget
            var image = node.getElementsByTagName('img')[0]
        
            var state = node.getAttribute('aria-checked').toLowerCase()

            if (state === 'true') {
                console.log("yes true")
                node.setAttribute('aria-checked', 'false')
                image.src = '../unchecked.png';
            }
            else {
                console.log("no false")
                node.setAttribute('aria-checked', 'true')
                image.src = '../checked.jpg';
            }  
            event.preventDefault()
            event.stopPropagation()
        }

    }

    function keyDownCheckGroup(event) {

        var type = event.type;
        if(type === "keydown"){
            var node = event.currentTarget
            var image = node.getElementsByTagName('img')[0]
        

            var state = node.getAttribute('aria-checked')

            if (state === 'true') {
                console.log("yes true")
                node.setAttribute('aria-checked', 'false')
                image.src = '../unchecked.png';
            }
            else {
                console.log("no false")
                node.setAttribute('aria-checked', 'true')
                image.src = '../checked.jpg';
            }  
            event.preventDefault()
            event.stopPropagation()
        }
    }

    function focusCheckbox(event) {
    event.currentTarget.className += ' focus'
    }

    function blurCheckbox(event) {
    event.currentTarget.className = event.currentTarget.className .replace(' focus','')
    }

    //https://www.w3.org/TR/2016/WD-wai-aria-practices-1.1-20160317/examples/checkbox/checkbox-1.html
    // code above: how to make checkbox buttons more accessible 



    var sub = document.getElementById('sub');
    var op = document.getElementById('op'); 
    var resetNode = document.getElementById('reset');
    var getO = document.getElementById("getTO");
    var levelO = document.getElementById("levelOf");

    resetNode.addEventListener('click', function () {
        args = {"level": "reset"}

        sub.style.display = "block";
        levelO.style.display = "block";
        resetNode.style.display = "none";

        //claer out radio buttons checked image
        var radiobuttons = document.querySelectorAll('[role=radio]');

        for(var i = 0; i < radiobuttons.length; i++ ) {
            var rb = radiobuttons[i];
            rb.setAttribute('aria-checked', 'false') 
            rb.tabIndex = -1;

            
        }


        //clear out check buttons checked image 
        var checkbuttons = document.querySelectorAll('[role=checkbox]');

        for(var j = 0; j < checkbuttons.length; j++ ) {
            var cb = checkbuttons[j];
            console.log(cb)
            var image = cb.getElementsByTagName("img")[0];
            console.log(image)
            cb.setAttribute('aria-checked', 'false')
            image.src = '../unchecked.png';

        }

        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {data: args}, function(response) {
                console.log('reset success');
            });
        });


    });


    sub.addEventListener('click', function () {
        var abstraction = document.querySelectorAll('.abstraction');
        var abst;
        var args; 
        for (var i = 0, length = abstraction.length; i < length; i++) {
            if (abstraction[i].getAttribute('aria-checked') === "true") {
                console.log(abstraction[i].getAttribute("value"))
                abst = `${abstraction[i].getAttribute("value")}`
            }
        }
        console.log(abst)

        if (abst === "high") {
            getO.style.display = "block"
        } else if (abst === "low") {
            args = {"level": "low"}

            getO.style.display = "none"
            reset.style.display = "block";
            sub.style.display = "none";
            levelO.style.display = "none";

            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {data: args}, function(response) {
                    console.log('low success');
                });
            });
        } else { 
            alert("no level of abstraction chosen - please try again");
            
        }
    });


    op.addEventListener('click', function () {
        var options = document.querySelectorAll('.options');
        var opts = {
            "level": "high",
            "headings": false,
            "rowscols": false,
            "data": false
        }
    
        for (var i = 0, length = options.length; i < length; i++) {
            if (options[i].getAttribute('aria-checked') === "true") {
                opts[options[i].getAttribute("value")] = true; 
            }
        }
        args = opts; 

        resetNode.style.display = "block";
        getO.style.display = "none";
        sub.style.display = "none";
        levelO.style.display = "none";

        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {data: args}, function(response) {
                console.log('high success');
            });
        });
    });

});

