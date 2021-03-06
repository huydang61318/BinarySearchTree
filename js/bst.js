// BST Widget, also includes AVL tree
// original author: Ivan Reinaldo, then maintained by Steven Halim

var BST = function () {
    var self = this;
    var gw = new GraphWidget();
    var isAVL = false;

    var valueRange = [1, 100]; // Range of valid values of BST vertexes allowed
    var maxHeightAllowed = 9; // max 9 edges (10 vertices)

    var initialArray = [15, 6, 23, 4, 7, 71, 5, 50];
    var initialAvlArray = [15, 6, 50, 4, 7, 23, 71, 5];

    /*
     * iBST: Internal representation of BST in this object
     * The keys are the text of the nodes, and the value is the attributes of the corresponding node encapsulated in a JS object, which are:
     * - "parent": text of the parent node. If the node is root node, the value is null.
     * - "leftChild": text of the left child. No child -> null
     * - "rightChild": text of the right child. No child -> null
     * - "cx": X-coordinate of center of the node
     * - "cy": Y-coordinate of center of the node
     * - "height": height of the node. Height of root is 0
     * - "vertexClassNumber": Vertex class number of the corresponding node
     *
     * In addition, there is a key called "root" in iBST, containing the text of the root node.
     * If BST is empty, root is null.
     */

    var iBST = {};
    var amountVertex = 0;
    iBST["root"] = null;

    if (isAVL) init(initialAvlArray);
    else init(initialArray);

    this.getGraphWidget = function () {
        return gw;
    };

    function dummyInit() {
        iBST["root"] = 15;
        iBST[15] = {
            "parent": null,
            "leftChild": 6,
            "rightChild": 23,
            "vertexClassNumber": 0
        };
        iBST[6] = {
            "parent": 15,
            "leftChild": 4,
            "rightChild": 7,
            "vertexClassNumber": 1
        };
        iBST[23] = {
            "parent": 15,
            "leftChild": null,
            "rightChild": 71,
            "vertexClassNumber": 2
        };
        iBST[4] = {
            "parent": 6,
            "leftChild": null,
            "rightChild": 5,
            "vertexClassNumber": 3
        };
        iBST[7] = {
            "parent": 6,
            "leftChild": null,
            "rightChild": null,
            "vertexClassNumber": 4
        };
        iBST[71] = {
            "parent": 23,
            "leftChild": 50,
            "rightChild": null,
            "vertexClassNumber": 5
        };
        iBST[5] = {
            "parent": 4,
            "leftChild": null,
            "rightChild": null,
            "vertexClassNumber": 6
        };
        iBST[50] = {
            "parent": 71,
            "leftChild": null,
            "rightChild": null,
            "vertexClassNumber": 7
        };

        $('#status').bind("DOMSubtreeModified", function () {
            $('#console').append($('#status').html());
        });




        var key;
        recalculatePosition();

        for (key in iBST) {
            if (key == "root")
                continue;

            var cur = iBST[key];
            gw.addVertex(cur["cx"], cur["cy"], key, cur["vertexClassNumber"], true);
        }

        for (key in iBST) {
            if (key == "root")
                continue;

            var cur = iBST[key];
            var parentVertex = iBST[cur["parent"]];
            if (cur["parent"] == null)
                continue;

            gw.addEdge(parentVertex["vertexClassNumber"], cur["vertexClassNumber"], cur["vertexClassNumber"], EDGE_TYPE_UDE, 1, true);
        }

        amountVertex = 8;
    }

    this.generate = function (array) {
        init(array);
    };

    this.generateEmpty = function () {
        var vertexAmt = 0;
        var initArr = [];
        init(initArr);
        return true;
    };


    this.generateExample = function (id) {
        var drawArray = getTreeArray();
        if (isAVL && (id == 1)) {
            $('#create-err').html("AVL trees are balanced. This example is not balanced.");
            return false;
        }
        var vertexAmt = 8; // for id == 1
        var initArr = [15, 6, 23, 4, 7, 71, 5, 50];
        if (id == 2) {
            vertexAmt = 10;
            initArr = [41, 20, 65, 11, 29, 50, 91, 32, 72, 99];
        }
        else if (id == 3) {
            vertexAmt = 15;
            initArr = [8, 4, 12, 2, 6, 10, 14, 1, 3, 5, 7, 9, 11, 13, 15];
        }
        else if (id == 4) {
            vertexAmt = 12;
            initArr = [8, 6, 16, 3, 7, 13, 19, 2, 11, 15, 18, 10];
        }
        else if (id == 5) {
            vertexAmt = 20;
            initArr = [13, 8, 18, 5, 11, 16, 20, 3, 7, 10, 12, 15, 17, 19, 2, 4, 6, 9, 14, 1];
        }else if(id == 6){
            vertexAmt = drawArray.length;
            initArr = drawArray;
        }
        init(initArr);
        return true;
    }

    this.generateRandom = function () {
        var vertexAmt = Math.floor((Math.random() * 7 + 5));
        var initArr = [];

        while (initArr.length < vertexAmt) {
            var random = Math.floor(1 + Math.random() * 99);
            if ($.inArray(random, initArr) < 0)
                initArr.push(random);
        }

        if (isAVL) {
            var initArrAvl = [];

            function recursion(startVal, endVal) {
                var total = startVal + endVal + 1;
                if (total < 1)
                    return;
                if (startVal > endVal)
                    return;
                if (total == 1)
                    initArrAvl.push(initArr[startVal]);
                else if (total % 2 != 0) {
                    initArrAvl.push(initArr[parseInt(total / 2)]);
                    recursion(startVal, parseInt(total / 2) - 1);
                    recursion(parseInt(total / 2) + 1, endVal);
                }
                else {
                    initArrAvl.push(initArr[parseInt(total / 2) - 1]);
                    recursion(startVal, parseInt(total / 2) - 2);
                    recursion(parseInt(total / 2), endVal);
                }
            }

            function sortNumber(a, b) {
                return a - b;
            }

            initArr.sort(sortNumber);
            recursion(0, initArr.length - 1);
            init(initArrAvl);
        }
        else
            init(initArr);

        return true;
    }

    this.generateSkewed = function (side) {
        if (isAVL) {
            $('#create-err').html('AVL trees are not skewed. Select the BST header to use this action.');
            return false;
        }
        else {
            var vertexAmt = Math.floor(5 + Math.random() * 5); // [5..9] vertices (allow +1 for one more right/left extreme insertion)
            var initArr = new Array();
            while (initArr.length < vertexAmt) {
                var random = Math.floor(1 + Math.random() * 99); // value [1..99]
                if ($.inArray(random, initArr) < 0)
                    initArr.push(random);
            }
            if (side == "left") {
                initArr.sort(function (a, b) {
                    return b - a;
                });
            }
            else if (side == "right") {
                initArr.sort(function (a, b) {
                    return a - b;
                });
            }
            init(initArr);
            return true;
        }
    };

    this.isAVL = function (bool) {
        if (typeof bool != 'boolean') return;

        if (bool != isAVL) {
            clearScreen();
            if (bool)
                init(initialAvlArray);
            else
                init(initialArray);
            isAVL = bool;
        }
    };

    this.getIsAVL = function () {
        return isAVL;
    };

    this.getRandomInBST = function () {
        var arr = new Array();
        for (var key in iBST) {
            if (key == "root") continue;
            arr.push(key);
        }
        return parseInt(arr[Math.floor(Math.random() * arr.length)]);
    }

    this.getRandomNotInBST = function () {
        var arr = new Array();
        for (var key in iBST) {
            if (key == "root") continue;
            arr.push(parseInt(key));
        }
        var candidate = 1 + Math.floor(Math.random() * 99); // [1..99]
        while ($.inArray(candidate, arr) > 0)
            candidate = 1 + Math.floor(Math.random() * 99);
        return candidate;
    }

    this.search = function (val, callback) {
        var sl = [], vertexTraversed = {}, edgeTraversed = {}, cur = iBST["root"], cs, currentVertexClass, key, ans;

        cs = createState(iBST);
        //cs["status"] = "The current BST";  //status_search_0
        cs["status"] = 'The current BST.';
        cs["lineNo"] = 0;
        sl.push(cs);

        while (cur != val && cur != null) {
            cs = createState(iBST, vertexTraversed, edgeTraversed);
            currentVertexClass = iBST[cur]["vertexClassNumber"];
            cs["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;
            vertexTraversed[cur] = true;
            //cs["status"] = "Comparing " + cur + " with " + val + "."; //status_search_1
            cs["status"] = 'Comparing  {cur} with {val}.'.replace("{cur}", cur).replace("{val}", val);
            cs["lineNo"] = 3;
            sl.push(cs);

            if (parseInt(val) > parseInt(cur)) {
                cs = createState(iBST, vertexTraversed, edgeTraversed);
                //cs["status"] = cur + " is smaller than " + val + "."; //status_search_2
                cs["status"] = '{cur} is smaller than {val}.'.replace("{cur}", cur).replace("{val}", val);
                cs["lineNo"] = 5;
                sl.push(cs);

                cur = iBST[cur]["rightChild"];
                if (cur == null) {
                    cs = createState(iBST, vertexTraversed, edgeTraversed);
                    //cs["status"] = "Value " + val + " is not in the BST."; //status_search_3
                    cs["status"] = 'Value {val} is not in the BST.'.replace("{val}", val);
                    cs["lineNo"] = [1, 2];
                    sl.push(cs);
                    break;
                }

                cs = createState(iBST, vertexTraversed, edgeTraversed);
                var edgeHighlighted = iBST[cur]["vertexClassNumber"];
                edgeTraversed[edgeHighlighted] = true;
                cs["el"][edgeHighlighted]["animateHighlighted"] = true;
                cs["el"][edgeHighlighted]["state"] = EDGE_TRAVERSED;
                //cs["status"] = "So search on the right."; //status_search_4
                cs["status"] = 'So search on the right.';
                cs["lineNo"] = 6;
                sl.push(cs);
            }
            else {
                cs = createState(iBST, vertexTraversed, edgeTraversed);
                //cs["status"] = cur + " is greater than " + val + "."; //status_search_5
                cs["status"] = '{cur} is greater than {val}.'.replace("{cur}", cur).replace("{val}", val);
                cs["lineNo"] = 7;
                sl.push(cs);

                cur = iBST[cur]["leftChild"];
                if (cur == null) {
                    cs = createState(iBST, vertexTraversed, edgeTraversed);
                    //cs["status"] = "Value " + val + " is not in the BST.";  //status_search_6
                    cs["status"] = 'Value {val} is not in the BST.'.replace("{val}", val);
                    cs["lineNo"] = [1, 2];
                    sl.push(cs);
                    break;
                }

                cs = createState(iBST, vertexTraversed, edgeTraversed);
                var edgeHighlighted = iBST[cur]["vertexClassNumber"];
                edgeTraversed[edgeHighlighted] = true;
                cs["el"][edgeHighlighted]["animateHighlighted"] = true;
                cs["el"][edgeHighlighted]["state"] = EDGE_TRAVERSED;
                //cs["status"] = "So search on the left.";  //status_search_7
                cs["status"] = 'So search on the left.';
                cs["lineNo"] = 7;
                sl.push(cs);
            }
        }

        if (cur != null) {
            cs = createState(iBST, vertexTraversed, edgeTraversed);
            currentVertexClass = iBST[cur]["vertexClassNumber"];
            cs["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;
            //cs["status"] = "Found value " + val + ".";  //status_search_8
            cs["status"] = 'Found value {val}.'.replace("{val}", val);
            cs["lineNo"] = 4;
            sl.push(cs);
        }

        gw.startAnimation(sl, callback);
        populatePseudocode(4);
        return true;
    }

    this.findMax = function () {
        var ans = -1;
        for (key in iBST) {
            if (key == "root") continue;
            ans = Math.max(ans, key);
        }
        return ans;
    }

    this.findMinMax = function (isMin, callback) {
        var sl = [], vertexTraversed = {}, edgeTraversed = {}, cur = iBST["root"], cs, key, ans;

        cs = createState(iBST);
        //cs["status"] = "The current BST"; //status_minmax_0
        cs["status"] = 'The current BST';
        cs["lineNo"] = 0;
        sl.push(cs);

        if (cur == null) {
            cs = createState(iBST);
            if (isMin) {
                //cs["status"] = "Tree is empty, there is no minimum value."; //status_minmax_1
                cs["status"] = 'Tree is empty, there is no minimum value.';
            }
            else {
                //cs["status"] = "Tree is empty, there is no maximum value."; //status_minmax_2
                cs["status"] = 'Tree is empty, there is no maximum value.';
            }
            cs["lineNo"] = 1;
            sl.push(cs);
            gw.startAnimation(sl, callback);
            return true;
        }

        while (cur != null) {
            cs = createState(iBST, vertexTraversed, edgeTraversed);
            key = iBST[cur]["vertexClassNumber"];
            cs["vl"][key]["state"] = VERTEX_HIGHLIGHTED;
            vertexTraversed[cur] = true;
            if ((isMin && (iBST[cur]["leftChild"] != null)) ||
                (!isMin && (iBST[cur]["rightChild"] != null))) {
                if (isMin) {
                    //cs["status"] = cur + " is not the minimum value as it has a left child.";  //status_minmax_3
                    cs["status"] = '{cur} is not the minimum value as it has a left child.'.replace("{cur}", cur);
                }
                else {
                    //cs["status"] = cur + " is not the maximum value as it has a right child.";  //status_minmax_4
                    cs["status"] = '{cur} is not the maximum value as it has a right child.'.replace("{cur}", cur);
                }
                cs["lineNo"] = 2;
            }
            else {
                ans = cur;
                if (isMin) {
                    //cs["status"] = "Minimum value found!";  //status_minmax_5
                    cs["status"] = 'Minimum value found!';
                }
                else {
                    //cs["status"] = "Maximum value found!";  //status_minmax_6
                    cs["status"] = 'Maximum value found!';
                }

                cs["lineNo"] = 4;
            }
            cur = (isMin ? iBST[cur]["leftChild"] : iBST[cur]["rightChild"]);
            sl.push(cs);

            if (cur == null) break;

            cs = createState(iBST, vertexTraversed, edgeTraversed);
            var edgeHighlighted = iBST[cur]["vertexClassNumber"];
            edgeTraversed[edgeHighlighted] = true;
            cs["el"][edgeHighlighted]["animateHighlighted"] = true;
            cs["el"][edgeHighlighted]["state"] = EDGE_TRAVERSED;
            if (isMin) {
                //cs["status"] = "Go left to check for smaller value..."; //status_minmax_7
                cs["status"] = 'Go left to check for smaller value...';
            }
            else {
                //cs["status"] = "Go right to check for larger value..."; //status_minmax_8
                cs["status"] = 'Go right to check for larger value...';
            }

            cs["lineNo"] = 3;
            sl.push(cs);
        }

        cs = createState(iBST);
        if (isMin) {
            //cs["status"] = "Find Min has ended.<br>The minimum value is " + ans + ".";  //status_minmax_9
            cs["status"] = 'Find Min has ended.<br>The minimum value is {ans}.'.replace("{ans}", ans);
        }
        else {
            //cs["status"] = "Find Max has ended.<br>The maximum value is " + ans + ".";  //status_minmax_10
            cs["status"] = 'Find Max has ended.<br>The maximum value is {ans}.'.replace("{ans}", ans);
        }

        cs["lineNo"] = 0;
        sl.push(cs);

        populatePseudocode(isMin ? 2 : 1);
        gw.startAnimation(sl, callback);
        return true;
    }

    this.findPredSucc = function (val, isPred, callback) {
        var sl = [], vertexTraversed = {}, edgeTraversed = {}, cur = iBST["root"], cs, key, currentVertexClass;
        cur = val = parseInt(val);

        if (val == null || val == undefined || isNaN(val)) {
            $('#predsucc-err').html('Please fill in a valid value!');
            return false;
            invalidval
        }

        if (iBST[val] == null) {
            $('#predsucc-err').html('Please fill in a value that is present inside the BST!');
            return false;
        }

        key = iBST[val]["vertexClassNumber"];
        cs = createState(iBST);
        //cs["status"] = "The current BST.";  //status_predsucc_0
        cs["status"] = 'The current BST.';
        cs["lineNo"] = 0;
        sl.push(cs);

        if ((isPred && (iBST[val]["leftChild"] != null)) ||
            (!isPred && (iBST[val]["rightChild"] != null))) {
            var subTreeRoot = (isPred ? iBST[val]["leftChild"] : iBST[val]["rightChild"]);
            var subTreeRootKey = iBST[subTreeRoot]["vertexClassNumber"];

            edgeTraversed[subTreeRootKey] = true;

            cs = createState(iBST, vertexTraversed, edgeTraversed);
            cs["vl"][key]["state"] = VERTEX_HIGHLIGHTED;
            cs["el"][subTreeRootKey]["animateHighlighted"] = true;
            if (isPred) {
                //cs["status"] = "This vertex has a left child, so go left.";  //status_predsucc_1
                cs["status"] = 'This vertex has a left child, so go left.';
            } else {
                //cs["status"] = "This vertex has a right child, so go right.";  //status_predsucc_2
                cs["status"] = 'This vertex has a right child, so go right.';
            }

            cs["lineNo"] = 1;
            sl.push(cs);

            cs = createState(iBST, vertexTraversed, edgeTraversed);
            cs["vl"][key]["state"] = VERTEX_HIGHLIGHTED;
            cs["vl"][subTreeRootKey]["state"] = VERTEX_HIGHLIGHTED;
            if (isPred) {
                //cs["status"] = "Check whether the left child has a right child."; //status_predsucc_3
                cs["status"] = 'Check whether the left child has a right child.';
            } else {
                //cs["status"] = "Check whether the right child has a left child."; //status_predsucc_4
                cs["status"] = 'Check whether the right child has a left child.';
            }
            cs["lineNo"] = 1;
            sl.push(cs);

            if ((isPred && (iBST[subTreeRoot]["rightChild"] != null)) ||
                (!isPred && (iBST[subTreeRoot]["leftChild"] != null))) {
                cur = subTreeRoot;
                currentVertexClass = iBST[cur]["vertexClassNumber"];

                cs = createState(iBST, vertexTraversed, edgeTraversed);
                cs["vl"][key]["state"] = VERTEX_HIGHLIGHTED;
                cs["vl"][subTreeRootKey]["state"] = VERTEX_HIGHLIGHTED;
                if (isPred) {
                    //cs["status"] = "Right child found! Go to the right."; //status_predsucc_5
                    cs["status"] = 'Right child found! Go to the right.';
                } else {
                    //cs["status"] = "Left child found! Go to the left."; //status_predsucc_6
                    cs["status"] = 'Left child found! Go to the left.';
                }
                cs["lineNo"] = 1;
                sl.push(cs);

                while ((isPred && (iBST[cur]["rightChild"] != null)) ||
                (!isPred && (iBST[cur]["leftChild"] != null))) {
                    cs = createState(iBST, vertexTraversed, edgeTraversed);
                    cs["vl"][key]["state"] = VERTEX_HIGHLIGHTED;
                    cs["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;
                    vertexTraversed[cur] = true;
                    if (isPred) {
                        //cs["status"] = cur + " is not the predecessor vertex as it has a right child."; //status_predsucc_7
                        cs["status"] = '{cur} is not the predecessor vertex as it has a right child.'.replace("{cur}", cur);
                    } else {
                        //cs["status"] = cur + " is not the successor vertex as it has a left child.";  //status_predsucc_8
                        cs["status"] = '{cur} is not the successor vertex as it has a left child.'.replace("{cur}", cur);
                    }
                    cs["lineNo"] = 1;
                    sl.push(cs);

                    cur = (isPred ? iBST[cur]["rightChild"] : iBST[cur]["leftChild"]);
                    currentVertexClass = iBST[cur]["vertexClassNumber"];

                    cs = createState(iBST, vertexTraversed, edgeTraversed);
                    var edgeHighlighted = currentVertexClass;
                    edgeTraversed[edgeHighlighted] = true;
                    cs["vl"][key]["state"] = VERTEX_HIGHLIGHTED;
                    cs["el"][edgeHighlighted]["animateHighlighted"] = true;
                    cs["el"][edgeHighlighted]["state"] = EDGE_TRAVERSED;
                    if (isPred) {
                        //cs["status"] = "Go right to check for larger value."; //status_predsucc_9
                        cs["status"] = 'Go right to check for larger value.';
                    } else {
                        //cs["status"] = "Go left to check for smaller value."; //status_predsucc_10
                        cs["status"] = 'Go left to check for smaller value.';
                    }
                    cs["lineNo"] = 1;
                    sl.push(cs);
                }

                ans = cur;

                cs = createState(iBST, vertexTraversed, edgeTraversed);
                cs["vl"][key]["state"] = VERTEX_HIGHLIGHTED;
                cs["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;
                if (isPred) {
                    //cs["status"] = "Predecessor found!<br>The predecessor of " + val + " is " + ans + ".";  //status_predsucc_11
                    cs["status"] = 'Predecessor found!<br>The predecessor of {val} is {ans}.'.replace("{ans}", ans).replace("{val}", val);
                } else {
                    //cs["status"] = "Successor found!<br>The successor of " + val + " is " + ans + ".";  //status_predsucc_12
                    cs["status"] = 'Successor found!<br>The successor of {val} is {ans}.'.replace("{ans}", ans).replace("{val}", val);
                }
                cs["vl"][key]["extratext"] = "value";
                cs["vl"][currentVertexClass]["extratext"] = "its " + (isPred ? "predecessor" : "successor");
                cs["lineNo"] = 1;
                sl.push(cs);
            }
            else {
                ans = subTreeRoot;

                cs = createState(iBST, vertexTraversed, edgeTraversed);
                cs["vl"][key]["state"] = VERTEX_HIGHLIGHTED;
                cs["vl"][subTreeRootKey]["state"] = VERTEX_HIGHLIGHTED;
                if (isPred) {
                    //cs["status"] = "No right child found, so this vertex is the predecessor.<br>The predecessor of " + val + " is " + ans + ".";  //status_predsucc_13
                    cs["status"] = 'No right child found, so this vertex is the predecessor.<br>The predecessor of {val} is {ans}.'.replace("{ans}", ans).replace("{val}", val);
                } else {
                    //cs["status"] = "No left child found, so this vertex is the successor.<br>The successor of " + val + " is " + ans + "."; //status_predsucc_14
                    cs["status"] = 'No left child found, so this vertex is the successor.<br>The successor of {val} is {ans}.'.replace("{ans}", ans).replace("{val}", val);
                }
                cs["vl"][key]["extratext"] = "value";
                cs["vl"][subTreeRootKey]["extratext"] = "its " + (isPred ? "predecessor" : "successor");
                cs["lineNo"] = 1;
                sl.push(cs);
            }
        }
        else {
            currentVertexClass = iBST[cur]["vertexClassNumber"];

            edgeTraversed[currentVertexClass] = true;

            cs = createState(iBST, vertexTraversed, edgeTraversed);
            cs["vl"][key]["state"] = VERTEX_HIGHLIGHTED;
            cs["el"][currentVertexClass]["state"] = EDGE_HIGHLIGHTED;
            if (isPred) {
                //cs["status"] = "No left child found, so check the parent..";  //status_predsucc_15
                cs["status"] = 'No left child found, so check the parent..';
            } else {
                //cs["status"] = "No right child found, so check the parent.."; //status_predsucc_16
                cs["status"] = 'No right child found, so check the parent..';
            }
            cs["lineNo"] = [2, 3];
            sl.push(cs);

            cur = iBST[cur]["parent"];
            currentVertexClass = iBST[cur]["vertexClassNumber"];

            while (true) {
                cs = createState(iBST, vertexTraversed, edgeTraversed);
                cs["vl"][key]["state"] = VERTEX_HIGHLIGHTED;
                cs["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;
                vertexTraversed[cur] = true;
                if ((isPred && (cur > val)) ||
                    (!isPred && (cur < val))) {
                    if (isPred) {
                        //cs["status"] = cur + " is not the predecessor vertex as " + val + " is part of the left sub-tree";  //status_predsucc_17
                        cs["status"] = '{cur} is not the predecessor vertex as {val} is part of the left sub-tree'.replace("{cur}", cur).replace("{val}", val);
                    } else {
                        //cs["status"] = cur + " is not the successor vertex as " + val + " is part of the right sub-tree"; //status_predsucc_18
                        cs["status"] = '{cur} is not the successor vertex as {val} is part of the right sub-tree'.replace("{cur}", cur).replace("{val}", val);
                    }
                    cs["lineNo"] = 4;
                    sl.push(cs);
                }
                else {
                    ans = cur;
                    if (isPred) {
                        //cs["status"] = "Predecessor found!<br>The predecessor of " + val + " is " + ans + ".";  //status_predsucc_19
                        cs["status"] = 'Predecessor found!<br>The predecessor of {val} is {ans}.'.replace("{ans}", ans).replace("{val}", val);
                    } else {
                        //cs["status"] = "Successor found!<br>The successor of " + val + " is " + ans + ".";  //status_predsucc_20
                        cs["status"] = 'Successor found!<br>The successor of {val} is {ans}.'.replace("{ans}", ans).replace("{val}", val);
                    }
                    cs["vl"][key]["extratext"] = "value";
                    cs["vl"][currentVertexClass]["extratext"] = "its " + (isPred ? "predecessor" : "successor");
                    cs["lineNo"] = 7;
                    sl.push(cs);
                    break;
                }

                cs = createState(iBST, vertexTraversed, edgeTraversed);
                var edgeHighlighted = currentVertexClass;
                if (cur != iBST["root"])
                    edgeTraversed[edgeHighlighted] = true;
                cs["vl"][key]["state"] = VERTEX_HIGHLIGHTED;
                if (cur != iBST["root"])
                    cs["el"][edgeHighlighted]["state"] = EDGE_HIGHLIGHTED;
                //cs["status"] = "Go up to check for smaller value."; //status_predsucc_21
                cs["status"] = 'Go up to check for smaller value.';
                cs["lineNo"] = 5;
                sl.push(cs);

                cur = iBST[cur]["parent"];
                if (cur == null) break;

                currentVertexClass = iBST[cur]["vertexClassNumber"];
            }

            if (cur == null) {
                cs = createState(iBST, vertexTraversed, edgeTraversed);
                cs["vl"][key]["state"] = VERTEX_HIGHLIGHTED;
                if (isPred) {
                    //cs["status"] = "Parent is null, so " + val + " has no predecessor.";  //status_predsucc_22
                    cs["status"] = 'Parent is null, so {val} has no predecessor.'.replace("{val}", val);
                } else {
                    //cs["status"] = "Parent is null, so " + val + " has no successor.";  //status_predsucc_23
                    cs["status"] = 'Parent is null, so {val} has no successor.'.replace("{val}", val);
                }
                cs["lineNo"] = 6;
                sl.push(cs);

                ans = null;
            }
        }

        gw.startAnimation(sl, callback);
        populatePseudocode(isPred ? 9 : 8);
        return true;
    }

    this.inorderTraversal = function (callback) {
        var sl = [], vertexTraversed = {}, edgeTraversed = {}, cur = iBST["root"], cs, key;
        var vertexHighlighted = {};

        cs = createState(iBST);
        //cs["status"] = "The current BST.";  //status_inorder_0
        cs["status"] = 'The current BST.';
        cs["lineNo"] = 0;
        sl.push(cs);

        if (iBST["root"] == null) {
            cs = createState(iBST);
            //cs["status"] = "The Binary Search Tree is empty.<br>Return empty result.";  //status_inorder_1
            cs["status"] = 'The Binary Search Tree is empty.<br>Return empty result.';
            cs["lineNo"] = [1, 2];
            sl.push(cs);
            return true;
        }
        else {
            key = iBST[iBST["root"]]["vertexClassNumber"];

            cs = createState(iBST);
            cs["vl"][key]["state"] = VERTEX_TRAVERSED;
            cs["vl"][key]["extratext"] = "root";
            //cs["status"] = "The root " + iBST["root"] + " is not null.";  //status_inorder_2
            cs["status"] = 'The root {root} is not null.'.replace("{root}", iBST["root"]);
            cs["lineNo"] = 1;
            sl.push(cs);

            cs = createState(iBST);
            cs["vl"][key]["state"] = VERTEX_TRAVERSED;
            cs["vl"][key]["extratext"] = "root";
            //cs["status"] = "So recurse and check left child of " + iBST["root"] + ".";  //status_inorder_3
            cs["status"] = 'So recurse and check left child of {root}.'.replace("{root}", iBST["root"]);
            cs["lineNo"] = 3;
            sl.push(cs);

            inorderTraversalRecursion(iBST["root"]);
        }

        cs = createState(iBST, vertexTraversed, edgeTraversed);
        inorderHighlightVertex(key);
        //cs["status"] = "In-order traversal of the whole BST is complete.";  //status_inorder_4
        cs["status"] = 'In-order traversal of the whole BST is complete.';
        cs["vl"][key]["extratext"] = "root";
        cs["lineNo"] = 0;
        sl.push(cs);

        gw.startAnimation(sl, callback);

        function inorderTraversalRecursion(cur) {
            var curLeft = iBST[cur]["leftChild"], curRight = iBST[cur]["rightChild"];
            var key = iBST[cur]["vertexClassNumber"];

            if (curLeft == null) {
                vertexTraversed[cur] = true;
                cs = createState(iBST, vertexTraversed, edgeTraversed);
                inorderHighlightVertex(key);
                //cs["status"] = "The left child of vertex with value " + cur + " is empty.<br>Return empty.";  //status_inorder_5
                cs["status"] = 'The left child of vertex with value {cur} is empty.<br>Return empty.'.replace("{cur}", cur);
                cs["lineNo"] = [1, 2];
                sl.push(cs);
            }
            else {
                var curLeftClass = iBST[curLeft]["vertexClassNumber"];

                vertexTraversed[cur] = true;
                cs = createState(iBST, vertexTraversed, edgeTraversed);
                inorderHighlightVertex(key);
                //cs["status"] = "The left child of vertex with value " + cur + " is " + curLeft + " (not null).";  //status_inorder_6
                cs["status"] = 'The left child of vertex with value {cur} is {curLeft} (not null).'.replace("{cur}", cur).replace("{curLeft}", curLeft);
                cs["lineNo"] = 1;
                sl.push(cs);
                edgeTraversed[curLeftClass] = true;
                cs = createState(iBST, vertexTraversed, edgeTraversed);
                cs["el"][curLeftClass]["animateHighlighted"] = true;
                inorderHighlightVertex(key);
                //cs["status"] = "So recurse and check left child of vertex with value " + curLeft + ".";//status_inorder_7
                cs["status"] = 'So recurse and check left child of vertex with value {curLeft}.'.replace("{curLeft}", curLeft);
                cs["lineNo"] = 3;
                sl.push(cs);
                inorderTraversalRecursion(curLeft);
            }

            cs = createState(iBST, vertexTraversed, edgeTraversed);
            vertexHighlighted[key] = true;
            inorderHighlightVertex(key);
            //cs["status"] = "Visit vertex with value " + cur + ".<br>And preparing to visit the right child of this vertex.";  //status_inorder_8
            cs["status"] = 'Visit vertex with value {cur}.<br>And preparing to visit the right child of this vertex.'.replace("{cur}", cur);
            cs["lineNo"] = 4;
            sl.push(cs);

            if (curRight == null) {
                vertexTraversed[cur] = true;
                cs = createState(iBST, vertexTraversed, edgeTraversed);
                inorderHighlightVertex(key);
                //cs["status"] = "The right child of vertex with value " + cur + " is empty.<br>Return empty.<br>"; //status_inorder_9
                cs["status"] = 'The right child of vertex with value {cur} is empty.<br>Return empty.<br>'.replace("{cur}", cur);
                cs["lineNo"] = [1, 2];
                sl.push(cs);
            }
            else {
                var curRightClass = iBST[curRight]["vertexClassNumber"];

                cs = createState(iBST, vertexTraversed, edgeTraversed);
                inorderHighlightVertex(key);
                //cs["status"] = "The right child of vertex with value " + cur + " is " + curRight + " (not null).";  //status_inorder_10
                cs["status"] = 'The right child of vertex with value {cur} is {curRight} (not null).'.replace("{cur}", cur).replace("{curRight}", curRight);
                cs["lineNo"] = 1;
                sl.push(cs);
                edgeTraversed[curRightClass] = true;
                cs = createState(iBST, vertexTraversed, edgeTraversed);
                cs["el"][curRightClass]["animateHighlighted"] = true;
                inorderHighlightVertex(key);
                cs["status"] = 'So recurse and check the right child of vertex with value {curRight}.'.replace("{curRight}", curRight);
                cs["lineNo"] = 3;
                sl.push(cs);
                inorderTraversalRecursion(curRight);
            }

            cs = createState(iBST, vertexTraversed, edgeTraversed);
            if (cur != iBST["root"])
                cs["el"][key]["state"] = EDGE_HIGHLIGHTED;
            inorderHighlightVertex(key);

            //cs["status"] = "In-order traversal of " + cur + " is complete.";  //status_inorder_12
            cs["status"] = 'In-order traversal of {cur} is complete.'.replace("{cur}", cur);
            cs["lineNo"] = 0;
            sl.push(cs);
        }

        function inorderHighlightVertex(curkey) {
            for (var key in vertexHighlighted) cs["vl"][key]["state"] = VERTEX_HIGHLIGHTED;
            for (var key in vertexHighlighted) cs["vl"][key]["extratext"] = "";
            cs["vl"][curkey]["extratext"] = "^";
        }

        populatePseudocode(3);
        return true;
    }

    this.insertArr = function (vertexTextArr, callback) {
        var sl = [], vertexTraversed = {}, edgeTraversed = {}, cur = iBST["root"], cs, key, currentVertexClass, i;

        cs = createState(iBST);
        //cs["status"] = "The current BST.";  //status_insert_0
        cs["status"] = 'The current BST.';
        cs["lineNo"] = 0;
        sl.push(cs);

        // Check whether input is array
        if (Object.prototype.toString.call(vertexTextArr) != '[object Array]') {
            $('#insert-err').html('Please fill in a number or comma-separated array of numbers!');
            return false;
        }

        // Loop through all array values and...
        var tempiBST = deepCopy(iBST); // Use this to simulate internal insertion

        for (i = 0; i < vertexTextArr.length; i++) {
            var vt = parseInt(vertexTextArr[i]);

            // 1. Check whether value is number
            if (isNaN(vt)) {
                $('#insert-err').html('Please fill in a number or comma-separated array of numbers!');
                return false;
            }

            // 2. No duplicates allowed. Also works if more than one similar value are inserted
            if (tempiBST[vt] != null) {
                $('#insert-err').html('No duplicate vertex allowed!');
                if (typeof callback == 'function') callback();
                return false;
            }

            // 3. Check range
            if (parseInt(vt) < valueRange[0] || parseInt(vt) > valueRange[1]) {
                $('#insert-err').html('Sorry, only values between {range1} and {range2} can be inserted.'.replace("{range1}", valueRange[0]).replace("{range2}", valueRange[1]));
                return false;
            }

            // 4. Insert the node into temporary internal structure and check for height
            var parentVertex = tempiBST["root"];
            var heightCounter = 0;

            if (parentVertex == null) {
                tempiBST["root"] = parseInt(vt);
                tempiBST[vt] = {
                    "parent": null,
                    "leftChild": null,
                    "rightChild": null
                };
            }
            else {
                while (true) {
                    heightCounter++;
                    if (parentVertex < vt) {
                        if (tempiBST[parentVertex]["rightChild"] == null)
                            break;
                        parentVertex = tempiBST[parentVertex]["rightChild"];
                    }
                    else {
                        if (tempiBST[parentVertex]["leftChild"] == null)
                            break;
                        parentVertex = tempiBST[parentVertex]["leftChild"];
                    }
                }

                if (parentVertex < vt)
                    tempiBST[parentVertex]["rightChild"] = vt;
                else
                    tempiBST[parentVertex]["leftChild"] = vt;

                tempiBST[vt] = {
                    "parent": parentVertex,
                    "leftChild": null,
                    "rightChild": null
                }
            }

            heightCounter++; // New vertex added will add new height

            if (heightCounter > maxHeightAllowed + 1) {
                $('#insert-err').html('Sorry, this visualization can only support tree of maximum height {maxHeight}'.replace("{maxHeight}", maxHeightAllowed));
                if (typeof callback == 'function') callback();
                return false;
            }
        }

        function checkNewHeight() {
            var parentVertex = tempiBST["root"];
            var heightCounter = 0;

            while (parentVertex != null) {
                if (parentVertex < parseInt(val))
                    parentVertex = tempiBST[parentVertex]["rightChild"];
                else
                    parentVertex = tempiBST[parentVertex]["leftChild"];
                heightCounter++;
            }

            heightCounter++; // New vertex added will add new height

            if (heightCounter > maxHeightAllowed + 1)
                return false;
            return true;
        }

        for (i = 0; i < vertexTextArr.length; i++) {
            var val = parseInt(vertexTextArr[i]);

            // Re-initialization
            vertexTraversed = {};
            edgeTraversed = {};
            cur = iBST["root"];
            cs = createState(iBST);

            // Find parent
            while (cur != val && cur != null) {
                cs = createState(iBST, vertexTraversed, edgeTraversed);
                currentVertexClass = iBST[cur]["vertexClassNumber"];

                cs["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;

                vertexTraversed[cur] = true;

                //cs["status"] = "Comparing " + val + " with " + cur; //status_insert_1
                cs["status"] = 'Comparing {val} with {cur}'.replace("{val}", val).replace("{cur}", cur);
                if (!isAVL) cs["lineNo"] = 3;
                else cs["lineNo"] = 1;

                sl.push(cs);

                var nextVertex;
                if (parseInt(val) > parseInt(cur))
                    nextVertex = iBST[cur]["rightChild"];
                else
                    nextVertex = iBST[cur]["leftChild"];

                if (nextVertex == null)
                    break;
                else
                    cur = nextVertex;

                cs = createState(iBST, vertexTraversed, edgeTraversed);

                var edgeHighlighted = iBST[cur]["vertexClassNumber"];
                edgeTraversed[edgeHighlighted] = true;

                cs["el"][edgeHighlighted]["animateHighlighted"] = true;
                cs["el"][edgeHighlighted]["state"] = EDGE_TRAVERSED;

                if (parseInt(val) > parseInt(iBST[cur]["parent"])) {
                    //cs["status"] = val + " is larger than " + iBST[cur]["parent"] + ", so go right."; //status_insert_2
                    cs["status"] = '{val} is larger than {parent}, so go right.'.replace("{val}", val).replace("{parent}", iBST[cur]["parent"]);
                    if (!isAVL) cs["lineNo"] = 5;
                    else cs["lineNo"] = 1;
                }
                else {
                    //cs["status"] = val + " is smaller than " + iBST[cur]["parent"] + ", so go left."; //status_insert_3
                    cs["status"] = '{val} is smaller than {parent}, so go left.'.replace("{val}", val).replace("{parent}", iBST[cur]["parent"]);
                    if (!isAVL) cs["lineNo"] = 4;
                    else cs["lineNo"] = 1;
                }

                sl.push(cs);
            }

            // Begin insertion
            // First, update internal representation
            iBST[parseInt(val)] = {
                "leftChild": null,
                "rightChild": null,
                "vertexClassNumber": amountVertex
            };

            if (cur != null) {
                iBST[parseInt(val)]["parent"] = cur;
                if (cur < parseInt(val))
                    iBST[cur]["rightChild"] = parseInt(val);
                else
                    iBST[cur]["leftChild"] = parseInt(val);
            }

            else {
                iBST[parseInt(val)]["parent"] = null;
                iBST["root"] = parseInt(val);
            }

            amountVertex++;
            recalculatePosition();

            // Then, draw edge
            var newNodeVertexClass = iBST[parseInt(val)]["vertexClassNumber"];

            if (cur != null) {
                cs = createState(iBST, vertexTraversed, edgeTraversed);
                cs["vl"][newNodeVertexClass]["state"] = OBJ_HIDDEN;

                cs["el"][newNodeVertexClass]["state"] = EDGE_TRAVERSED;
                cs["el"][newNodeVertexClass]["animateHighlighted"] = true;

                //cs["status"] = "Location found!<br>Inserting " + val + "."; //status_insert_4
                cs["status"] = 'Location found!<br>Inserting {val}.'.replace("{val}", val);
                cs["lineNo"] = 1;

                sl.push(cs);

                edgeTraversed[newNodeVertexClass] = true;
            }

            // Lastly, draw vertex
            cs = createState(iBST, vertexTraversed, edgeTraversed);
            cs["vl"][newNodeVertexClass]["state"] = EDGE_HIGHLIGHTED;

            //cs["status"] = val + " has been inserted!"  //status_insert_5
            cs["status"] = '{val} has been inserted!'.replace("{val}", val);
            if (!isAVL) cs["lineNo"] = 2;
            else cs["lineNo"] = 1;
            sl.push(cs);

            // End State
            cs = createState(iBST);
            //cs["status"] = "Insert " + val + " has been completed." //status_insert_6
            cs["status"] = 'Insert {val} has been completed.'.replace("{val}", val);
            if (isAVL) cs["lineNo"] = 1;
            sl.push(cs);

            if (isAVL) {
                recalculateBalanceFactor();

                var vertexCheckBf = iBST[val]["parent"];
                while (vertexCheckBf != null) {
                    var vertexCheckBfClass = iBST[vertexCheckBf]["vertexClassNumber"];
                    var bf = iBST[vertexCheckBf]["balanceFactor"];

                    cs = createState(iBST);
                    cs["vl"][vertexCheckBfClass]["state"] = VERTEX_HIGHLIGHTED;
                    //cs["status"] = "Balance factor of " + vertexCheckBf + " is " + bf + ".";  //status_insert_7
                    cs["status"] = 'Balance factor of {vertexCheckBf} is {bf}.'.replace("{vertexCheckBf}", vertexCheckBf).replace("{bf}", bf);
                    cs["lineNo"] = 2;
                    sl.push(cs);

                    if (bf == 2) {
                        var vertexCheckBfLeft = iBST[vertexCheckBf]["leftChild"];
                        var vertexCheckBfLeftClass = iBST[vertexCheckBfLeft]["vertexClassNumber"];
                        var bfLeft = iBST[vertexCheckBfLeft]["balanceFactor"];

                        cs = createState(iBST);
                        cs["vl"][vertexCheckBfClass]["state"] = VERTEX_HIGHLIGHTED;
                        cs["vl"][vertexCheckBfLeftClass]["state"] = VERTEX_HIGHLIGHTED;
                        //cs["status"] = "And balance factor of " + vertexCheckBfLeft + " is " + bfLeft + ".";  //status_insert_8
                        cs["status"] = 'And balance factor of {vertexCheckBf} is {bf}.'.replace("{vertexCheckBf}", vertexCheckBfLeft).replace("{bf}", bfLeft);
                        cs["lineNo"] = 2;
                        sl.push(cs);

                        if (bfLeft == 1 || bfLeft == 0) {
                            rotateRight(vertexCheckBf);

                            cs = createState(iBST);
                            cs["vl"][vertexCheckBfClass]["state"] = VERTEX_HIGHLIGHTED;
                            cs["vl"][vertexCheckBfLeftClass]["state"] = VERTEX_HIGHLIGHTED;
                            cs["el"][vertexCheckBfClass]["state"] = EDGE_HIGHLIGHTED;
                            if (iBST["root"] != vertexCheckBfLeft)
                                cs["el"][vertexCheckBfLeftClass]["state"] = EDGE_HIGHLIGHTED;
                            //cs["status"] = "Rotate right " + vertexCheckBf + "."; //status_insert_9
                            cs["status"] = 'Rotate right {vertexCheckBf}.'.replace("{vertexCheckBf}", vertexCheckBf);
                            cs["lineNo"] = 3;
                            sl.push(cs);

                            recalculatePosition();

                            cs = createState(iBST);
                            cs["vl"][vertexCheckBfClass]["state"] = VERTEX_HIGHLIGHTED;
                            cs["vl"][vertexCheckBfLeftClass]["state"] = VERTEX_HIGHLIGHTED;
                            cs["el"][vertexCheckBfClass]["state"] = EDGE_HIGHLIGHTED;
                            if (iBST["root"] != vertexCheckBfLeft)
                                cs["el"][vertexCheckBfLeftClass]["state"] = EDGE_HIGHLIGHTED;
                            //cs["status"] = "Relayout the tree.";  //status_insert_10
                            cs["status"] = 'Relayout the tree.';
                            cs["lineNo"] = 3;
                            sl.push(cs);
                        }
                        else if (bfLeft == -1) {
                            var vertexCheckBfLeftRight = iBST[vertexCheckBfLeft]["rightChild"];
                            var vertexCheckBfLeftRightClass = iBST[vertexCheckBfLeftRight]["vertexClassNumber"];

                            rotateLeft(vertexCheckBfLeft);

                            cs = createState(iBST);
                            cs["vl"][vertexCheckBfLeftClass]["state"] = VERTEX_HIGHLIGHTED;
                            cs["vl"][vertexCheckBfLeftRightClass]["state"] = VERTEX_HIGHLIGHTED;
                            cs["el"][vertexCheckBfLeftClass]["state"] = EDGE_HIGHLIGHTED;
                            cs["el"][vertexCheckBfLeftRightClass]["state"] = EDGE_HIGHLIGHTED;
                            //cs["status"] = "Rotate left " + vertexCheckBfLeft + ".";  //status_insert_11
                            cs["status"] = 'Rotate left {vertexCheckBf}.'.replace("{vertexCheckBf}", vertexCheckBfLeft);
                            cs["lineNo"] = 4;
                            sl.push(cs);

                            recalculatePosition();

                            cs = createState(iBST);
                            cs["vl"][vertexCheckBfLeftClass]["state"] = VERTEX_HIGHLIGHTED;
                            cs["vl"][vertexCheckBfLeftRightClass]["state"] = VERTEX_HIGHLIGHTED;
                            cs["el"][vertexCheckBfLeftClass]["state"] = EDGE_HIGHLIGHTED;
                            cs["el"][vertexCheckBfLeftRightClass]["state"] = EDGE_HIGHLIGHTED;
                            //cs["status"] = "Relayout the tree.";  //status_insert_10
                            cs["status"] = 'Relayout the tree.';
                            cs["lineNo"] = 4;
                            sl.push(cs);

                            rotateRight(vertexCheckBf);

                            cs = createState(iBST);
                            cs["vl"][vertexCheckBfClass]["state"] = VERTEX_HIGHLIGHTED;
                            cs["vl"][vertexCheckBfLeftRightClass]["state"] = VERTEX_HIGHLIGHTED;
                            cs["el"][vertexCheckBfClass]["state"] = EDGE_HIGHLIGHTED;
                            if (iBST["root"] != vertexCheckBfLeftRight)
                                cs["el"][vertexCheckBfLeftRightClass]["state"] = EDGE_HIGHLIGHTED;
                            //cs["status"] = "Rotate right " + vertexCheckBf + "."; //status_insert_9
                            cs["status"] = 'Rotate right {vertexCheckBf}.'.replace("{vertexCheckBf}", vertexCheckBf);
                            cs["lineNo"] = 4;
                            sl.push(cs);

                            recalculatePosition();

                            cs = createState(iBST);
                            cs["vl"][vertexCheckBfClass]["state"] = VERTEX_HIGHLIGHTED;
                            cs["vl"][vertexCheckBfLeftRightClass]["state"] = VERTEX_HIGHLIGHTED;
                            cs["el"][vertexCheckBfClass]["state"] = EDGE_HIGHLIGHTED;
                            if (iBST["root"] != vertexCheckBfLeftRight)
                                cs["el"][vertexCheckBfLeftRightClass]["state"] = EDGE_HIGHLIGHTED;
                            //cs["status"] = "Relayout the tree.";  //status_insert_10
                            cs["status"] = 'Relayout the tree.';
                            cs["lineNo"] = 4;
                            sl.push(cs);
                        }
                    }
                    else if (bf == -2) {
                        var vertexCheckBfRight = iBST[vertexCheckBf]["rightChild"];
                        var vertexCheckBfRightClass = iBST[vertexCheckBfRight]["vertexClassNumber"];
                        var bfRight = iBST[vertexCheckBfRight]["balanceFactor"];

                        cs = createState(iBST);
                        cs["vl"][vertexCheckBfClass]["state"] = VERTEX_HIGHLIGHTED;
                        cs["vl"][vertexCheckBfRightClass]["state"] = VERTEX_HIGHLIGHTED;
                        //cs["status"] = "And balance factor of " + vertexCheckBfRight + " is " + bfRight + ".";  //status_insert_8
                        cs["status"] = 'And balance factor of {vertexCheckBf} is {bf}.'.replace("{vertexCheckBf}", vertexCheckBfRight).replace("{bf}", bfRight);
                        cs["lineNo"] = 2;
                        sl.push(cs);

                        if (bfRight == 1) {
                            var vertexCheckBfRightLeft = iBST[vertexCheckBfRight]["leftChild"];
                            var vertexCheckBfRightLeftClass = iBST[vertexCheckBfRightLeft]["vertexClassNumber"];

                            rotateRight(vertexCheckBfRight);

                            cs = createState(iBST);
                            cs["vl"][vertexCheckBfRightClass]["state"] = VERTEX_HIGHLIGHTED;
                            cs["vl"][vertexCheckBfRightLeftClass]["state"] = VERTEX_HIGHLIGHTED;
                            cs["el"][vertexCheckBfRightClass]["state"] = EDGE_HIGHLIGHTED;
                            cs["el"][vertexCheckBfRightLeftClass]["state"] = EDGE_HIGHLIGHTED;
                            //cs["status"] = "Rotate right " + vertexCheckBfRight + ".";  //status_insert_9
                            cs["status"] = 'Rotate right {vertexCheckBf}.'.replace("{vertexCheckBf}", vertexCheckBfRight);
                            cs["lineNo"] = 6;
                            sl.push(cs);

                            recalculatePosition();

                            cs = createState(iBST);
                            cs["vl"][vertexCheckBfRightClass]["state"] = VERTEX_HIGHLIGHTED;
                            cs["vl"][vertexCheckBfRightLeftClass]["state"] = VERTEX_HIGHLIGHTED;
                            cs["el"][vertexCheckBfRightClass]["state"] = EDGE_HIGHLIGHTED;
                            cs["el"][vertexCheckBfRightLeftClass]["state"] = EDGE_HIGHLIGHTED;
                            //cs["status"] = "Relayout the tree.";  //status_insert_10
                            cs["status"] = 'Relayout the tree.';
                            cs["lineNo"] = 6;
                            sl.push(cs);

                            rotateLeft(vertexCheckBf);

                            cs = createState(iBST);
                            cs["vl"][vertexCheckBfClass]["state"] = VERTEX_HIGHLIGHTED;
                            cs["vl"][vertexCheckBfRightLeftClass]["state"] = VERTEX_HIGHLIGHTED;
                            cs["el"][vertexCheckBfClass]["state"] = EDGE_HIGHLIGHTED;
                            if (iBST["root"] != vertexCheckBfRightLeft)
                                cs["el"][vertexCheckBfRightLeftClass]["state"] = EDGE_HIGHLIGHTED;
                            //cs["status"] = "Rotate left " + vertexCheckBf + ".";  //status_insert_11
                            cs["status"] = 'Rotate left {vertexCheckBf}.'.replace("{vertexCheckBf}", vertexCheckBf);
                            cs["lineNo"] = 6;
                            sl.push(cs);

                            recalculatePosition();

                            cs = createState(iBST);
                            cs["vl"][vertexCheckBfClass]["state"] = VERTEX_HIGHLIGHTED;
                            cs["vl"][vertexCheckBfRightLeftClass]["state"] = VERTEX_HIGHLIGHTED;
                            cs["el"][vertexCheckBfClass]["state"] = EDGE_HIGHLIGHTED;
                            if (iBST["root"] != vertexCheckBfRightLeft)
                                cs["el"][vertexCheckBfRightLeftClass]["state"] = EDGE_HIGHLIGHTED;
                            //cs["status"] = "Relayout the tree.";  //status_insert_10
                            cs["status"] = 'Relayout the tree.';
                            cs["lineNo"] = 6;
                            sl.push(cs);
                        }
                        else if (bfRight == -1 || bfRight == 0) {
                            rotateLeft(vertexCheckBf);

                            cs = createState(iBST);
                            cs["vl"][vertexCheckBfClass]["state"] = VERTEX_HIGHLIGHTED;
                            cs["vl"][vertexCheckBfRightClass]["state"] = VERTEX_HIGHLIGHTED;
                            cs["el"][vertexCheckBfClass]["state"] = EDGE_HIGHLIGHTED;
                            if (iBST["root"] != vertexCheckBfRight)
                                cs["el"][vertexCheckBfRightClass]["state"] = EDGE_HIGHLIGHTED;
                            //cs["status"] = "Rotate left " + vertexCheckBf + ".";  //status_insert_11
                            cs["status"] = 'Rotate left {vertexCheckBf}.'.replace("{vertexCheckBf}", vertexCheckBf);
                            cs["lineNo"] = 5;
                            sl.push(cs);

                            recalculatePosition();

                            cs = createState(iBST);

                            cs["vl"][vertexCheckBfClass]["state"] = VERTEX_HIGHLIGHTED;
                            cs["vl"][vertexCheckBfRightClass]["state"] = VERTEX_HIGHLIGHTED;
                            cs["el"][vertexCheckBfClass]["state"] = EDGE_HIGHLIGHTED;
                            if (iBST["root"] != vertexCheckBfRight)
                                cs["el"][vertexCheckBfRightClass]["state"] = EDGE_HIGHLIGHTED;
                            cs["status"] = "Relayout the tree.";  //status_insert_10
                            cs["status"] = 'Relayout the tree.';
                            cs["lineNo"] = 5;
                            sl.push(cs);
                        }
                    }

                    if (vertexCheckBf != iBST["root"]) {
                        cs = createState(iBST);
                        cs["el"][vertexCheckBfClass]["state"] = EDGE_HIGHLIGHTED;
                        //cs["status"] = "Check the parent vertex.";  //status_insert_12
                        cs["status"] = 'Check the parent vertex.';
                        cs["lineNo"] = 2;
                        sl.push(cs);
                    }

                    vertexCheckBf = iBST[vertexCheckBf]["parent"];
                }

                cs = createState(iBST);
                //cs["status"] = "The tree is now balanced."; //status_insert_13
                cs["status"] = 'The tree is now balanced.';
                cs["lineNo"] = 7;
                sl.push(cs);
            }
        }

        gw.startAnimation(sl, callback);
        if (isAVL) populatePseudocode(6);
        else populatePseudocode(0);
        return true;
    }

    this.removeArr = function (vertexTextArr, callback) {
        var sl = [];
        var vertexTraversed = {};
        var edgeTraversed = {};
        var cur = iBST["root"];
        var cs = createState(iBST);
        var currentVertexClass;
        var key;
        var i;

        //cs["status"] = "The current BST"; //status_remove_0
        cs["status"] = 'The current BST';
        cs["lineNo"] = 0;
        sl.push(cs);

        if (Object.prototype.toString.call(vertexTextArr) != '[object Array]') {
            $('#remove-err').html('Please fill in a number or comma-separated array of numbers!');
            return false;
        }

        // Loop through all array values and...
        for (i = 0; i < vertexTextArr.length; i++) {
            var vt = parseInt(vertexTextArr[i]);

            // Check whether value is number
            if (isNaN(vt)) {
                $('#remove-err').html('Please fill in a number or comma-separated array of numbers!');
                return false;
            }
            // Other checks not required
        }

        for (i = 0; i < vertexTextArr.length; i++) {
            var val = parseInt(vertexTextArr[i]);
            var vertexCheckBf;

            // Re-initialization
            vertexTraversed = {};
            edgeTraversed = {};
            cur = iBST["root"];
            cs = createState(iBST);

            // Find vertex
            while (cur != val && cur != null) {
                cs = createState(iBST, vertexTraversed, edgeTraversed);
                currentVertexClass = iBST[cur]["vertexClassNumber"];

                cs["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;

                vertexTraversed[cur] = true;

                //cs["status"] = "Searching for node " + val + " to remove";  //status_remove_1
                cs["status"] = 'Searching for node {val} to remove'.replace("{val}", val);
                cs["lineNo"] = 1;
                sl.push(cs);

                if (parseInt(val) > parseInt(cur))
                    cur = iBST[cur]["rightChild"];
                else
                    cur = iBST[cur]["leftChild"];

                if (cur == null) break;

                cs = createState(iBST, vertexTraversed, edgeTraversed);

                var edgeHighlighted = iBST[cur]["vertexClassNumber"];
                edgeTraversed[edgeHighlighted] = true;

                cs["el"][edgeHighlighted]["animateHighlighted"] = true;
                cs["el"][edgeHighlighted]["state"] = EDGE_TRAVERSED;

                //cs["status"] = "Searching for node " + val + " to remove";  //status_remove_1
                cs["status"] = 'Searching for node {val} to remove'.replace("{val}", val);
                cs["lineNo"] = 1;
                sl.push(cs);
            }

            if (cur != null) {
                cs = createState(iBST, vertexTraversed, edgeTraversed);
                currentVertexClass = iBST[cur]["vertexClassNumber"];

                cs["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;

                //cs["status"] = "Searching for node " + val + " to remove";  //status_remove_1
                cs["status"] = 'Searching for node {val} to remove'.replace("{val}", val);
                cs["lineNo"] = 1;
                sl.push(cs);
            }
            // Vertex is not inside the tree
            else {
                cs = createState(iBST);
                //cs["status"] = "Node " + val + " is not in the BST";  //status_remove_2
                cs["status"] = 'Node {val} is not in the BST'.replace("{val}", val);
                cs["lineNo"] = 0; //Node {val} is not in the BST
                sl.push(cs);
                continue;
            }

            // Vertex found; begin deletion
            // Case 1: no child
            if (iBST[cur]["leftChild"] == null && iBST[cur]["rightChild"] == null) {
                cs = createState(iBST, vertexTraversed, edgeTraversed);
                //cs["status"] = "Node " + val + " has no children. It is a leaf."; //status_remove_3
                cs["status"] = 'Node {val} has no children. It is a leaf.'.replace("{val}", val);
                if (!isAVL) cs["lineNo"] = 2;
                else cs["lineNo"] = 1;
                sl.push(cs);

                var parentVertex = iBST[cur]["parent"];

                if (parentVertex != null) {
                    if (parseInt(parentVertex) < parseInt(cur))
                        iBST[parentVertex]["rightChild"] = null;
                    else
                        iBST[parentVertex]["leftChild"] = null;
                }
                else
                    iBST["root"] = null;

                currentVertexClass = iBST[cur]["vertexClassNumber"];
                delete iBST[cur];
                delete vertexTraversed[cur];
                delete edgeTraversed[currentVertexClass];

                cs = createState(iBST, vertexTraversed, edgeTraversed);

                //cs["status"] = "Remove leaf " + val;  //status_remove_4
                cs["status"] = 'Remove leaf {val}'.replace("{val}", val);
                if (!isAVL) cs["lineNo"] = 3;
                else cs["lineNo"] = 1;
                sl.push(cs);

                vertexCheckBf = parentVertex;
            }
            // Case 2: One child
            else if (iBST[cur]["leftChild"] == null) { // Only right child
                cs = createState(iBST, vertexTraversed, edgeTraversed);
                //cs["status"] = "Node " + val + " has a right child only"; //status_remove_5
                cs["status"] = 'Node {val} has a right child only'.replace("{val}", val);
                if (!isAVL) cs["lineNo"] = 4;
                else cs["lineNo"] = 1;
                sl.push(cs);

                var parentVertex = iBST[cur]["parent"];
                var rightChildVertex = iBST[cur]["rightChild"];

                if (parentVertex != null) {
                    if (parseInt(parentVertex) < parseInt(cur))
                        iBST[parentVertex]["rightChild"] = rightChildVertex;
                    else
                        iBST[parentVertex]["leftChild"] = rightChildVertex;
                }
                else
                    iBST["root"] = rightChildVertex;

                iBST[rightChildVertex]["parent"] = parentVertex;

                currentVertexClass = iBST[cur]["vertexClassNumber"];
                rightChildVertexClass = iBST[rightChildVertex]["vertexClassNumber"];
                delete iBST[cur];
                delete vertexTraversed[cur];
                delete edgeTraversed[currentVertexClass];

                cs = createState(iBST, vertexTraversed, edgeTraversed);

                cs["vl"][rightChildVertexClass]["state"] = VERTEX_HIGHLIGHTED;

                if (parentVertex != null)
                    cs["el"][rightChildVertexClass]["state"] = EDGE_HIGHLIGHTED;

                //cs["status"] = "Delete node " + val + " and connect its parent to its right child"; //status_remove_6
                cs["status"] = 'Delete node {val} and connect its parent to its right child'.replace("{val}", val);
                if (!isAVL) cs["lineNo"] = 5;
                else cs["lineNo"] = 1;
                sl.push(cs);

                recalculatePosition();

                cs = createState(iBST, vertexTraversed, edgeTraversed);

                cs["vl"][rightChildVertexClass]["state"] = VERTEX_HIGHLIGHTED;

                if (parentVertex != null)
                    cs["el"][rightChildVertexClass]["state"] = EDGE_HIGHLIGHTED;

                //cs["status"] = "Re-layout the tree";  //status_remove_7
                cs["status"] = 'Re-layout the tree';
                if (!isAVL) cs["lineNo"] = 5;
                else cs["lineNo"] = 1;
                sl.push(cs);

                vertexCheckBf = rightChildVertex;
            }
            else if (iBST[cur]["rightChild"] == null) { // Only left child
                cs = createState(iBST, vertexTraversed, edgeTraversed);
                //cs["status"] = "Node " + val + " has a left child only";  //status_remove_8
                cs["status"] = 'Node {val} has a left child only'.replace("{val}", val);
                if (!isAVL) cs["lineNo"] = 4;
                else cs["lineNo"] = 1;
                sl.push(cs);

                var parentVertex = iBST[cur]["parent"];
                var leftChildVertex = iBST[cur]["leftChild"];

                if (parentVertex != null) {
                    if (parseInt(parentVertex) < parseInt(cur))
                        iBST[parentVertex]["rightChild"] = leftChildVertex;
                    else
                        iBST[parentVertex]["leftChild"] = leftChildVertex;
                }
                else
                    iBST["root"] = leftChildVertex;

                iBST[leftChildVertex]["parent"] = parentVertex;

                currentVertexClass = iBST[cur]["vertexClassNumber"];
                leftChildVertexClass = iBST[leftChildVertex]["vertexClassNumber"];
                delete iBST[cur];
                delete vertexTraversed[cur];
                delete edgeTraversed[currentVertexClass];

                cs = createState(iBST, vertexTraversed, edgeTraversed);

                cs["vl"][leftChildVertexClass]["state"] = VERTEX_HIGHLIGHTED;

                if (parentVertex != null)
                    cs["el"][leftChildVertexClass]["state"] = EDGE_HIGHLIGHTED;

                //cs["status"] = "Delete node " + val + " and connect its parent to its left child";  //status_remove_9
                cs["status"] = 'Delete node {val} and connect its parent to its left child'.replace("{val}", val);
                if (!isAVL) cs["lineNo"] = 5;
                else cs["lineNo"] = 1;
                sl.push(cs);

                recalculatePosition();

                cs = createState(iBST, vertexTraversed, edgeTraversed);

                cs["vl"][leftChildVertexClass]["state"] = VERTEX_HIGHLIGHTED;

                if (parentVertex != null)
                    cs["el"][leftChildVertexClass]["state"] = EDGE_HIGHLIGHTED;

                //cs["status"] = "Re-layout the tree";  //status_remove_7
                cs["status"] = 'Re-layout the tree';
                if (!isAVL) cs["lineNo"] = 5;
                else cs["lineNo"] = 1;
                sl.push(cs);

                vertexCheckBf = leftChildVertex;
            }
            else { // Case 3: two children
                var parentVertex = iBST[cur]["parent"];
                var leftChildVertex = iBST[cur]["leftChild"];
                var rightChildVertex = iBST[cur]["rightChild"];
                var successorVertex = iBST[cur]["rightChild"];
                var successorVertexClass = iBST[successorVertex]["vertexClassNumber"];

                cs = createState(iBST, vertexTraversed, edgeTraversed);

                cs["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;

                cs["el"][successorVertexClass]["state"] = EDGE_TRAVERSED;
                cs["el"][successorVertexClass]["animateHighlighted"] = true;

                //cs["status"] = "Finding successor of " + val; //status_remove_10
                cs["status"] = 'Finding successor of {val}'.replace("{val}", val);
                if (!isAVL) cs["lineNo"] = 6;
                else cs["lineNo"] = 1;
                sl.push(cs);

                edgeTraversed[successorVertexClass] = true;
                vertexTraversed[successorVertex] = true;

                cs = createState(iBST, vertexTraversed, edgeTraversed);

                cs["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;
                cs["vl"][successorVertexClass]["state"] = VERTEX_HIGHLIGHTED;

                //cs["status"] = "Finding successor of " + val; //status_remove_10
                cs["status"] = 'Finding successor of {val}'.replace("{val}", val);
                if (!isAVL) cs["lineNo"] = 6;
                else cs["lineNo"] = 1;
                sl.push(cs);

                while (iBST[successorVertex]["leftChild"] != null) {
                    successorVertex = iBST[successorVertex]["leftChild"];
                    successorVertexClass = iBST[successorVertex]["vertexClassNumber"];

                    cs = createState(iBST, vertexTraversed, edgeTraversed);

                    cs["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;

                    cs["el"][successorVertexClass]["state"] = EDGE_TRAVERSED;
                    cs["el"][successorVertexClass]["animateHighlighted"] = true;

                    //cs["status"] = "Finding successor of " + val; //status_remove_10
                    cs["status"] = 'Finding successor of {val}'.replace("{val}", val);
                    if (!isAVL) cs["lineNo"] = 6;
                    else cs["lineNo"] = 1;
                    sl.push(cs);

                    edgeTraversed[successorVertexClass] = true;
                    vertexTraversed[successorVertex] = true;

                    cs = createState(iBST, vertexTraversed, edgeTraversed);

                    cs["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;
                    cs["vl"][successorVertexClass]["state"] = VERTEX_HIGHLIGHTED;

                    //cs["status"] = "Finding successor of " + val; //status_remove_10
                    cs["status"] = 'Finding successor of {val}'.replace("{val}", val);
                    if (!isAVL) cs["lineNo"] = 6;
                    else cs["lineNo"] = 1;
                    sl.push(cs);
                }

                var successorParentVertex = iBST[successorVertex]["parent"]
                var successorRightChildVertex = iBST[successorVertex]["rightChild"];

                // Update internal representation
                if (parentVertex != null) {
                    if (parseInt(parentVertex) < parseInt(cur))
                        iBST[parentVertex]["rightChild"] = successorVertex;
                    else
                        iBST[parentVertex]["leftChild"] = successorVertex;
                }
                else
                    iBST["root"] = successorVertex;

                iBST[successorVertex]["parent"] = parentVertex;
                iBST[successorVertex]["leftChild"] = leftChildVertex;

                iBST[leftChildVertex]["parent"] = successorVertex;

                if (successorVertex != rightChildVertex) {
                    iBST[successorVertex]["rightChild"] = rightChildVertex;
                    iBST[rightChildVertex]["parent"] = successorVertex;

                    if (successorRightChildVertex != null) {
                        if (parseInt(successorParentVertex) < parseInt(successorVertex))
                            iBST[successorParentVertex]["rightChild"] = successorRightChildVertex;
                        else
                            iBST[successorParentVertex]["leftChild"] = successorRightChildVertex;
                        iBST[successorRightChildVertex]["parent"] = successorParentVertex;
                    }
                    else {
                        if (parseInt(successorParentVertex) < parseInt(successorVertex))
                            iBST[successorParentVertex]["rightChild"] = null;
                        else
                            iBST[successorParentVertex]["leftChild"] = null;
                    }
                }

                delete iBST[cur];
                delete vertexTraversed[cur];
                delete edgeTraversed[currentVertexClass];

                if (parentVertex == null)
                    delete edgeTraversed[successorVertexClass];

                cs = createState(iBST, vertexTraversed, edgeTraversed);

                var leftChildVertexClass = iBST[leftChildVertex]["vertexClassNumber"];

                cs["vl"][successorVertexClass]["state"] = VERTEX_HIGHLIGHTED;
                cs["el"][leftChildVertexClass]["state"] = EDGE_HIGHLIGHTED;

                if (parentVertex != null) {
                    var parentVertexClass = iBST[parentVertex]["vertexClassNumber"];
                    cs["el"][successorVertexClass]["state"] = EDGE_HIGHLIGHTED;
                }

                if (successorVertex != rightChildVertex) {
                    var rightChildVertexClass = iBST[rightChildVertex]["vertexClassNumber"];
                    cs["el"][rightChildVertexClass]["state"] = EDGE_HIGHLIGHTED;

                    if (successorRightChildVertex != null) {
                        var successorRightChildVertexClass = iBST[successorRightChildVertex]["vertexClassNumber"];
                        cs["el"][successorRightChildVertexClass]["state"] = EDGE_HIGHLIGHTED;
                    }
                }

                //cs["status"] = "Replace node " + val + " with its successor"; //status_remove_11
                cs["status"] = 'Replace node {val} with its successor'.replace("{val}", val);
                if (!isAVL) cs["lineNo"] = 6;
                else cs["lineNo"] = 1;
                sl.push(cs);

                recalculatePosition();

                cs = createState(iBST, vertexTraversed, edgeTraversed);

                leftChildVertexClass = iBST[leftChildVertex]["vertexClassNumber"];

                cs["vl"][successorVertexClass]["state"] = VERTEX_HIGHLIGHTED;
                cs["el"][leftChildVertexClass]["state"] = EDGE_HIGHLIGHTED;

                if (parentVertex != null) {
                    var parentVertexClass = iBST[parentVertex]["vertexClassNumber"];
                    cs["el"][successorVertexClass]["state"] = EDGE_HIGHLIGHTED;
                }

                if (successorVertex != rightChildVertex) {
                    var rightChildVertexClass = iBST[rightChildVertex]["vertexClassNumber"];
                    cs["el"][rightChildVertexClass]["state"] = EDGE_HIGHLIGHTED;

                    if (successorRightChildVertex != null) {
                        var successorRightChildVertexClass = iBST[successorRightChildVertex]["vertexClassNumber"];
                        cs["el"][successorRightChildVertexClass]["state"] = EDGE_HIGHLIGHTED;
                    }
                }

                //cs["status"] = "Re-layout the tree";  //status_remove_7
                cs["status"] = 'Re-layout the tree';
                if (!isAVL) cs["lineNo"] = 6;
                else cs["lineNo"] = 1;
                sl.push(cs);

                vertexCheckBf = successorVertex;
                if (successorVertex != rightChildVertex)
                    vertexCheckBf = successorParentVertex;
            }

            cs = createState(iBST);
            //cs["status"] = "Removal of " + val + " completed";  //status_remove_12
            cs["status"] = 'Removal of {val} completed'.replace("{val}", val);
            if (!isAVL) cs["lineNo"] = 0;
            else cs["lineNo"] = 1;
            sl.push(cs);

            if (isAVL) {
                recalculateBalanceFactor();
                // console.log(iBST);

                while (vertexCheckBf != null) {
                    var vertexCheckBfClass = iBST[vertexCheckBf]["vertexClassNumber"];

                    var bf = iBST[vertexCheckBf]["balanceFactor"];

                    cs = createState(iBST);
                    cs["vl"][vertexCheckBfClass]["state"] = VERTEX_HIGHLIGHTED;
                    //cs["status"] = "Balance factor of " + vertexCheckBf + " is " + bf + ".";  //status_remove_13
                    cs["status"] = 'Balance factor of {vertexCheckBf} is {bf}.'.replace("{vertexCheckBf}", vertexCheckBf).replace("{bf}", bf);
                    cs["lineNo"] = 2;
                    sl.push(cs);

                    if (bf == 2) {
                        var vertexCheckBfLeft = iBST[vertexCheckBf]["leftChild"];
                        var vertexCheckBfLeftClass = iBST[vertexCheckBfLeft]["vertexClassNumber"];
                        var bfLeft = iBST[vertexCheckBfLeft]["balanceFactor"];

                        cs = createState(iBST);
                        cs["vl"][vertexCheckBfClass]["state"] = VERTEX_HIGHLIGHTED;
                        cs["vl"][vertexCheckBfLeftClass]["state"] = VERTEX_HIGHLIGHTED;
                        //cs["status"] = "And balance factor of " + vertexCheckBfLeft + " is " + bfLeft + ".";  //status_remove_14
                        cs["status"] = 'And balance factor of {vertexCheckBf} is {bf}.'.replace("{vertexCheckBfLeft}", vertexCheckBf).replace("{bfLeft}", bf);
                        cs["lineNo"] = 2;
                        sl.push(cs);

                        if (bfLeft == 1 || bfLeft == 0) {
                            rotateRight(vertexCheckBf);

                            cs = createState(iBST);
                            cs["vl"][vertexCheckBfClass]["state"] = VERTEX_HIGHLIGHTED;
                            cs["vl"][vertexCheckBfLeftClass]["state"] = VERTEX_HIGHLIGHTED;
                            cs["el"][vertexCheckBfClass]["state"] = EDGE_HIGHLIGHTED;
                            if (iBST["root"] != vertexCheckBfLeft)
                                cs["el"][vertexCheckBfLeftClass]["state"] = EDGE_HIGHLIGHTED;
                            //cs["status"] = "Rotate right " + vertexCheckBf + "."; //status_remove_15
                            cs["status"] = 'Rotate right {vertexCheckBf}.'.replace("{vertexCheckBf}", vertexCheckBf);
                            cs["lineNo"] = 3;
                            sl.push(cs);

                            recalculatePosition();

                            cs = createState(iBST);
                            cs["vl"][vertexCheckBfClass]["state"] = VERTEX_HIGHLIGHTED;
                            cs["vl"][vertexCheckBfLeftClass]["state"] = VERTEX_HIGHLIGHTED;
                            cs["el"][vertexCheckBfClass]["state"] = EDGE_HIGHLIGHTED;
                            if (iBST["root"] != vertexCheckBfLeft)
                                cs["el"][vertexCheckBfLeftClass]["state"] = EDGE_HIGHLIGHTED;
                            //cs["status"] = "Relayout the tree.";  //status_remove_7
                            cs["status"] = 'Re-layout the tree';
                            cs["lineNo"] = 3;
                            sl.push(cs);
                        }
                        else if (bfLeft == -1) {
                            var vertexCheckBfLeftRight = iBST[vertexCheckBfLeft]["rightChild"];
                            var vertexCheckBfLeftRightClass = iBST[vertexCheckBfLeftRight]["vertexClassNumber"];

                            rotateLeft(vertexCheckBfLeft);

                            cs = createState(iBST);
                            cs["vl"][vertexCheckBfLeftClass]["state"] = VERTEX_HIGHLIGHTED;
                            cs["vl"][vertexCheckBfLeftRightClass]["state"] = VERTEX_HIGHLIGHTED;
                            cs["el"][vertexCheckBfLeftClass]["state"] = EDGE_HIGHLIGHTED;
                            cs["el"][vertexCheckBfLeftRightClass]["state"] = EDGE_HIGHLIGHTED;
                            //cs["status"] = "Rotate left " + vertexCheckBfLeft + ".";  //status_remove_16
                            cs["status"] = 'Rotate left {vertexCheckBf}.'.replace("{vertexCheckBf}", vertexCheckBfLeft);
                            cs["lineNo"] = 4;
                            sl.push(cs);

                            recalculatePosition();

                            cs = createState(iBST);
                            cs["vl"][vertexCheckBfLeftClass]["state"] = VERTEX_HIGHLIGHTED;
                            cs["vl"][vertexCheckBfLeftRightClass]["state"] = VERTEX_HIGHLIGHTED;
                            cs["el"][vertexCheckBfLeftClass]["state"] = EDGE_HIGHLIGHTED;
                            cs["el"][vertexCheckBfLeftRightClass]["state"] = EDGE_HIGHLIGHTED;
                            //cs["status"] = "Relayout the tree.";  //status_remove_7
                            cs["status"] = 'Re-layout the tree';
                            cs["lineNo"] = 4;
                            sl.push(cs);

                            rotateRight(vertexCheckBf);

                            cs = createState(iBST);
                            cs["vl"][vertexCheckBfClass]["state"] = VERTEX_HIGHLIGHTED;
                            cs["vl"][vertexCheckBfLeftRightClass]["state"] = VERTEX_HIGHLIGHTED;
                            cs["el"][vertexCheckBfClass]["state"] = EDGE_HIGHLIGHTED;
                            if (iBST["root"] != vertexCheckBfLeftRight)
                                cs["el"][vertexCheckBfLeftRightClass]["state"] = EDGE_HIGHLIGHTED;
                            //cs["status"] = "Rotate right " + vertexCheckBf + "."; //status_remove_15
                            cs["status"] = 'Rotate right {vertexCheckBf}.'.replace("{vertexCheckBf}", vertexCheckBf);
                            cs["lineNo"] = 4;
                            sl.push(cs);

                            recalculatePosition();

                            cs = createState(iBST);
                            cs["vl"][vertexCheckBfClass]["state"] = VERTEX_HIGHLIGHTED;
                            cs["vl"][vertexCheckBfLeftRightClass]["state"] = VERTEX_HIGHLIGHTED;
                            cs["el"][vertexCheckBfClass]["state"] = EDGE_HIGHLIGHTED;
                            if (iBST["root"] != vertexCheckBfLeftRight)
                                cs["el"][vertexCheckBfLeftRightClass]["state"] = EDGE_HIGHLIGHTED;
                            //cs["status"] = "Relayout the tree.";  //status_remove_7
                            cs["status"] = 'Re-layout the tree';
                            cs["lineNo"] = 4;
                            sl.push(cs);
                        }
                    }
                    else if (bf == -2) {
                        var vertexCheckBfRight = iBST[vertexCheckBf]["rightChild"];
                        var vertexCheckBfRightClass = iBST[vertexCheckBfRight]["vertexClassNumber"];
                        var bfRight = iBST[vertexCheckBfRight]["balanceFactor"];

                        cs = createState(iBST);
                        cs["vl"][vertexCheckBfClass]["state"] = VERTEX_HIGHLIGHTED;
                        cs["vl"][vertexCheckBfRightClass]["state"] = VERTEX_HIGHLIGHTED;
                        //cs["status"] = "And balance factor of " + vertexCheckBfRight + " is " + bfRight + ".";  //status_remove_14
                        cs["status"] = 'And balance factor of {vertexCheckBf} is {bf}.'.replace("{vertexCheckBf}", vertexCheckBfRight).replace("{bf}", bfRight);
                        cs["lineNo"] = 2;
                        sl.push(cs);

                        if (bfRight == 1) {
                            var vertexCheckBfRightLeft = iBST[vertexCheckBfRight]["leftChild"];
                            var vertexCheckBfRightLeftClass = iBST[vertexCheckBfRightLeft]["vertexClassNumber"];

                            rotateRight(vertexCheckBfRight);

                            cs = createState(iBST);
                            cs["vl"][vertexCheckBfRightClass]["state"] = VERTEX_HIGHLIGHTED;
                            cs["vl"][vertexCheckBfRightLeftClass]["state"] = VERTEX_HIGHLIGHTED;
                            cs["el"][vertexCheckBfRightClass]["state"] = EDGE_HIGHLIGHTED;
                            cs["el"][vertexCheckBfRightLeftClass]["state"] = EDGE_HIGHLIGHTED;
                            //cs["status"] = "Rotate right " + vertexCheckBfRight + ".";  //status_remove_15
                            cs["status"] = 'Rotate right {vertexCheckBf}.'.replace("{vertexCheckBf}", vertexCheckBfRight);
                            cs["lineNo"] = 6;
                            sl.push(cs);

                            recalculatePosition();

                            cs = createState(iBST);
                            cs["vl"][vertexCheckBfRightClass]["state"] = VERTEX_HIGHLIGHTED;
                            cs["vl"][vertexCheckBfRightLeftClass]["state"] = VERTEX_HIGHLIGHTED;
                            cs["el"][vertexCheckBfRightClass]["state"] = EDGE_HIGHLIGHTED;
                            cs["el"][vertexCheckBfRightLeftClass]["state"] = EDGE_HIGHLIGHTED;
                            //cs["status"] = "Relayout the tree.";  //status_remove_7
                            cs["status"] = 'Re-layout the tree';
                            cs["lineNo"] = 6;
                            sl.push(cs);

                            rotateLeft(vertexCheckBf);

                            cs = createState(iBST);
                            cs["vl"][vertexCheckBfClass]["state"] = VERTEX_HIGHLIGHTED;
                            cs["vl"][vertexCheckBfRightLeftClass]["state"] = VERTEX_HIGHLIGHTED;
                            cs["el"][vertexCheckBfClass]["state"] = EDGE_HIGHLIGHTED;
                            if (iBST["root"] != vertexCheckBfRightLeft)
                                cs["el"][vertexCheckBfRightLeftClass]["state"] = EDGE_HIGHLIGHTED;
                            //cs["status"] = "Rotate left " + vertexCheckBf + ".";  //status_remove_16
                            cs["status"] = 'Rotate left {vertexCheckBf}.'.replace("{vertexCheckBf}", vertexCheckBf);
                            cs["lineNo"] = 6;
                            sl.push(cs);

                            recalculatePosition();

                            cs = createState(iBST);
                            cs["vl"][vertexCheckBfClass]["state"] = VERTEX_HIGHLIGHTED;
                            cs["vl"][vertexCheckBfRightLeftClass]["state"] = VERTEX_HIGHLIGHTED;
                            cs["el"][vertexCheckBfClass]["state"] = EDGE_HIGHLIGHTED;
                            if (iBST["root"] != vertexCheckBfRightLeft)
                                cs["el"][vertexCheckBfRightLeftClass]["state"] = EDGE_HIGHLIGHTED;
                            //cs["status"] = "Relayout the tree.";  //status_remove_7
                            cs["status"] = 'Re-layout the tree';
                            cs["lineNo"] = 6;
                            sl.push(cs);
                        }
                        else if (bfRight == -1 || bfRight == 0) {
                            rotateLeft(vertexCheckBf);

                            cs = createState(iBST);
                            cs["vl"][vertexCheckBfClass]["state"] = VERTEX_HIGHLIGHTED;
                            cs["vl"][vertexCheckBfRightClass]["state"] = VERTEX_HIGHLIGHTED;
                            cs["el"][vertexCheckBfClass]["state"] = EDGE_HIGHLIGHTED;
                            if (iBST["root"] != vertexCheckBfRight)
                                cs["el"][vertexCheckBfRightClass]["state"] = EDGE_HIGHLIGHTED;
                            //cs["status"] = "Rotate left " + vertexCheckBf + ".";  //status_remove_16
                            cs["status"] = 'Rotate left {vertexCheckBf}.'.replace("{vertexCheckBf}", vertexCheckBf);
                            cs["lineNo"] = 5;
                            sl.push(cs);

                            recalculatePosition();

                            cs = createState(iBST);

                            cs["vl"][vertexCheckBfClass]["state"] = VERTEX_HIGHLIGHTED;
                            cs["vl"][vertexCheckBfRightClass]["state"] = VERTEX_HIGHLIGHTED;
                            cs["el"][vertexCheckBfClass]["state"] = EDGE_HIGHLIGHTED;
                            if (iBST["root"] != vertexCheckBfRight)
                                cs["el"][vertexCheckBfRightClass]["state"] = EDGE_HIGHLIGHTED;
                            //cs["status"] = "Relayout the tree.";  //status_remove_7
                            cs["status"] = 'Re-layout the tree';
                            cs["lineNo"] = 5;
                            sl.push(cs);
                        }
                    }

                    if (vertexCheckBf != iBST["root"]) {
                        cs = createState(iBST);
                        cs["el"][vertexCheckBfClass]["state"] = EDGE_HIGHLIGHTED;
                        //cs["status"] = "Check the parent vertex...";  //status_remove_17
                        cs["status"] = 'Check the parent vertex...';
                        cs["lineNo"] = 2;
                        sl.push(cs);
                    }

                    vertexCheckBf = iBST[vertexCheckBf]["parent"];
                }

                cs = createState(iBST);
                cs["status"] = 'The tree is now balanced.';
                cs["lineNo"] = 7;
                sl.push(cs);
            }
        }

        gw.startAnimation(sl, callback);
        if (isAVL) populatePseudocode(7);
        else populatePseudocode(5);
        return true;
    };

    function init(initArr) {
        var i;

        clearScreen();

        for (i = 0; i < initArr.length; i++) {
            var parentVertex = iBST["root"];
            var newVertex = parseInt(initArr[i]);

            if (parentVertex == null) {
                iBST["root"] = parseInt(newVertex);
                iBST[newVertex] = {
                    "parent": null,
                    "leftChild": null,
                    "rightChild": null,
                    "vertexClassNumber": amountVertex
                };
            }
            else {
                while (true) {
                    if (parentVertex < newVertex) {
                        if (iBST[parentVertex]["rightChild"] == null) break;
                        parentVertex = iBST[parentVertex]["rightChild"];
                    }
                    else {
                        if (iBST[parentVertex]["leftChild"] == null) break;
                        parentVertex = iBST[parentVertex]["leftChild"];
                    }
                }

                if (parentVertex < newVertex)
                    iBST[parentVertex]["rightChild"] = newVertex;
                else
                    iBST[parentVertex]["leftChild"] = newVertex;

                iBST[newVertex] = {
                    "parent": parentVertex,
                    "leftChild": null,
                    "rightChild": null,
                    "vertexClassNumber": amountVertex
                }
            }

            amountVertex++;
        }

        recalculatePosition();

        for (key in iBST) {
            if (key == "root") continue;
            gw.addVertex(iBST[key]["cx"], iBST[key]["cy"], key, iBST[key]["vertexClassNumber"], true);
        }

        for (key in iBST) {
            if (key == "root") continue;
            if (key == iBST["root"]) continue;
            var parentVertex = iBST[key]["parent"];
            gw.addEdge(iBST[parentVertex]["vertexClassNumber"], iBST[key]["vertexClassNumber"], iBST[key]["vertexClassNumber"], EDGE_TYPE_UDE, 1, true);
        }
    }

    function clearScreen() {
        var key;

        for (key in iBST) {
            if (key == "root") continue;
            gw.removeEdge(iBST[key]["vertexClassNumber"]);
        }

        for (key in iBST) {
            if (key == "root") continue;
            gw.removeVertex(iBST[key]["vertexClassNumber"]);
        }

        iBST = {};
        iBST["root"] = null;
        amountVertex = 0;
    }

    // Pseudocode for rotateLeft:
    /*
     * BSTVertex rotateLeft(BSTVertex T) // pre-req: T.right != null
     * BSTVertex w = T.right
     * w.parent = T.parent
     * T.parent = w
     * T.right = w.left
     * if (w.left != null) w.left.parent = T
     * w.left = T
     * // Update the height of T and then w
     * return w
     */

    function rotateLeft(val) {
        // Refer to pseudocode

        var t = parseInt(val);
        var w = iBST[t]["rightChild"];

        iBST[w]["parent"] = iBST[t]["parent"];
        if (iBST[t]["parent"] != null) {
            if (iBST[t]["parent"] < t) {
                var tParent = iBST[t]["parent"];
                iBST[tParent]["rightChild"] = w;
            }
            else {
                var tParent = iBST[t]["parent"];
                iBST[tParent]["leftChild"] = w;
            }
        }

        iBST[t]["parent"] = w;
        iBST[t]["rightChild"] = iBST[w]["leftChild"];
        if (iBST[w]["leftChild"] != null)
            iBST[iBST[w]["leftChild"]]["parent"] = t;
        iBST[w]["leftChild"] = t;

        if (t == iBST["root"])
            iBST["root"] = w;

        recalculateBalanceFactor();
    }

    function rotateRight(val) {
        // Refer to pseudocode

        var t = parseInt(val);
        var w = iBST[t]["leftChild"];

        iBST[w]["parent"] = iBST[t]["parent"];
        if (iBST[t]["parent"] != null) {
            if (iBST[t]["parent"] < t) {
                var tParent = iBST[t]["parent"];
                iBST[tParent]["rightChild"] = w;
            }
            else {
                var tParent = iBST[t]["parent"];
                iBST[tParent]["leftChild"] = w;
            }
        }

        iBST[t]["parent"] = w;
        iBST[t]["leftChild"] = iBST[w]["rightChild"];
        if (iBST[w]["rightChild"] != null)
            iBST[iBST[w]["rightChild"]]["parent"] = t;
        iBST[w]["rightChild"] = t;

        if (t == iBST["root"])
            iBST["root"] = w;

        recalculateBalanceFactor();
    }

    /*
     * iBSTObject: a JS object with the same structure of iBST. This means the BST doen't have to be the BST stored in this class
     * vertexTraversed: JS object with the vertexes of the BST which are to be marked as traversed as the key
     * edgeTraversed: JS object with the edges of the BST which are to be marked as traversed as the key
     */

    function createState(iBSTObject, vertexTraversed, edgeTraversed) {
        if (vertexTraversed == null || vertexTraversed == undefined || !(vertexTraversed instanceof Object))
            vertexTraversed = {};
        if (edgeTraversed == null || edgeTraversed == undefined || !(edgeTraversed instanceof Object))
            edgeTraversed = {};

        var state = {
            "vl": {},
            "el": {}
        };

        var key;
        var vertexClass;

        // something may be inconsistent during remove (AVL?), generates mini D3 error..., hunt for that bug
        for (key in iBSTObject) {
            if (key == "root") continue;

            vertexClass = iBSTObject[key]["vertexClassNumber"]

            state["vl"][vertexClass] = {};
            state["vl"][vertexClass]["cx"] = iBSTObject[key]["cx"];
            state["vl"][vertexClass]["cy"] = iBSTObject[key]["cy"];
            state["vl"][vertexClass]["text"] = key;
            state["vl"][vertexClass]["state"] = VERTEX_DEFAULT;

            if (iBSTObject[key]["parent"] == null) continue;

            parentChildEdgeId = iBSTObject[key]["vertexClassNumber"];

            state["el"][parentChildEdgeId] = {};
            state["el"][parentChildEdgeId]["vertexA"] = iBSTObject[iBSTObject[key]["parent"]]["vertexClassNumber"];
            state["el"][parentChildEdgeId]["vertexB"] = iBSTObject[key]["vertexClassNumber"];
            state["el"][parentChildEdgeId]["type"] = EDGE_TYPE_UDE;
            state["el"][parentChildEdgeId]["weight"] = 1;
            state["el"][parentChildEdgeId]["state"] = EDGE_DEFAULT;
            state["el"][parentChildEdgeId]["animateHighlighted"] = false;
        }

        for (key in vertexTraversed) {
            vertexClass = iBSTObject[key]["vertexClassNumber"];
            state["vl"][vertexClass]["state"] = VERTEX_TRAVERSED;
        }

        for (key in edgeTraversed) {
            state["el"][key]["state"] = EDGE_TRAVERSED;
        }

        return state;
    }

    function recalculatePosition() {
        calcHeight(iBST["root"], 0);
        updatePosition(iBST["root"]);

        function calcHeight(cur, currentHeight) {
            if (cur == null) return;
            iBST[cur]["height"] = currentHeight;
            calcHeight(iBST[cur]["leftChild"], currentHeight + 1);
            calcHeight(iBST[cur]["rightChild"], currentHeight + 1);
        }

        function updatePosition(cur) {
            if (cur == null) return;

            if (cur == iBST["root"])
                iBST[cur]["cx"] = MAIN_SVG_WIDTH / 2;
            else {
                var i;
                var xAxisOffset = MAIN_SVG_WIDTH / 2 - 16;
                var parentVertex = iBST[cur]["parent"]
                for (i = 0; i < iBST[cur]["height"]; i++) xAxisOffset /= 2;

                if (parseInt(cur) > parseInt(parentVertex))
                    iBST[cur]["cx"] = iBST[parentVertex]["cx"] + xAxisOffset;
                else
                    iBST[cur]["cx"] = iBST[parentVertex]["cx"] - xAxisOffset;
            }

            iBST[cur]["cy"] = 50 + 50 * iBST[cur]["height"];
            updatePosition(iBST[cur]["leftChild"]);
            updatePosition(iBST[cur]["rightChild"]);
        }
    }

    function recalculateBalanceFactor() {
        balanceFactorRecursion(iBST["root"]);

        function balanceFactorRecursion(val) {
            if (val == null) return -1;

            var balanceFactorHeightLeft = balanceFactorRecursion(iBST[val]["leftChild"]);
            var balanceFactorHeightRight = balanceFactorRecursion(iBST[val]["rightChild"]);

            iBST[val]["balanceFactorHeight"] = Math.max(balanceFactorHeightLeft, balanceFactorHeightRight) + 1;
            iBST[val]["balanceFactor"] = balanceFactorHeightLeft - balanceFactorHeightRight;

            return iBST[val]["balanceFactorHeight"];
        }
    }

    // 1: Max
    // 2: Min
    function populatePseudocode(act) {
        switch (act) {
            case 1: // findMinMax
            case 2:
                //$('#code1').html('if this is null return empty'); // code_minmax_1
                $('#code1').html('if this is null return empty');
                if (act == 1) {
                    //$('#code2').html('if right != null'); // code_max_2
                    //$('#code3').html('&nbsp&nbspgo right'); // code_max_3
                    $('#code2').html('if right != null');
                    $('#code3').html('&nbsp&nbspgo right');
                }
                else {
                    //$('#code2').html('if left != null');  // code_min_2
                    //$('#code3').html('&nbsp;&nbsp;go left');  // code_min_3
                    $('#code2').html('if left != null');
                    $('#code3').html('&nbsp;&nbsp;go left');
                }
                //$('#code4').html('else return this key'); // code_minmax_4
                $('#code4').html('else return this key');
                $('#code5').html('');
                $('#code6').html('');
                $('#code7').html('');
                break;
            case 4: // search
                //$('#code1').html('if this == null');  //code_search_1
                $('#code1').html('if this == null');
                //$('#code2').html('&nbsp;&nbsp;return null');  //code_search_2
                $('#code2').html('&nbsp;&nbsp;return null');
                //$('#code3').html('else if this key == search value'); //code_search_3
                $('#code3').html('else if this key == search value');
                //$('#code4').html('&nbsp;&nbsp;return this');  //code_search_4
                $('#code4').html('&nbsp;&nbsp;return this');
                //$('#code5').html('else if this key < search value');  //code_search_5
                $('#code5').html('else if this key < search value');
                //$('#code6').html('&nbsp;&nbsp;search right'); //code_search_6
                $('#code6').html('&nbsp;&nbsp;search right');
                //$('#code7').html('else search left'); //code_search_7
                $('#code7').html('else search left');
                break;
            case 0: // Insert
                //$('#code1').html('if insertion point is found');  //code_insert_1
                $('#code1').html('if insertion point is found');
                //$('#code2').html('&nbsp;&nbsp;create new vertex');  //code_insert_2
                $('#code2').html('&nbsp;&nbsp;create new vertex');
                //$('#code3').html('if value to be inserted < this key'); //code_insert_3
                $('#code3').html('if value to be inserted < this key');
                //$('#code4').html('&nbsp;&nbsp;go left');  //code_insert_4
                $('#code4').html('&nbsp;&nbsp;go left');
                //$('#code5').html('else go right');  //code_insert_5
                $('#code5').html('else go right');
                $('#code6').html('');
                $('#code7').html('');
                break;
            case 5: // remove
                //$('#code1').html('search for v'); //code_remove_1
                $('#code1').html('search for v');
                //$('#code2').html('if v is a leaf'); //code_remove_2
                $('#code2').html('if v is a leaf');
                //$('#code3').html('&nbsp;&nbsp;delete leaf v');  //code_remove_3
                $('#code3').html('&nbsp;&nbsp;delete leaf v');
                //$('#code4').html('else if v has 1 child');  //code_remove_4
                $('#code4').html('else if v has 1 child');
                //$('#code5').html('&nbsp;&nbsp;bypass v'); //code_remove_5
                $('#code5').html('&nbsp;&nbsp;bypass v');
                //$('#code6').html('else replace v with successor');  //code_remove_6
                $('#code6').html('else replace v with successor');
                $('#code7').html('');
                break;
            case 6: // insert with rotations
            case 7: // remove with rotations
                if (act == 6) {
                    //$('#code1').html('insert v'); //code_insert_avl_1
                    $('#code1').html('insert v');
                } else {
                    //$('#code1').html('remove v'); //code_remove_avl_1
                    $('#code1').html('remove v');
                }
                //$('#code2').html('check balance factor of this and its children');  //code_avl_2
                $('#code2').html('check balance factor of this and its children');
                //$('#code3').html('&nbsp;&nbsp;case1: this.rotateRight');  //code_avl_3
                $('#code3').html('&nbsp;&nbsp;case1: this.rotateRight');
                //$('#code4').html('&nbsp;&nbsp;case2: this.left.rotateLeft, this.rotateRight');  //code_avl_4
                $('#code4').html('&nbsp;&nbsp;case2: this.left.rotateLeft, this.rotateRight');
                //$('#code5').html('&nbsp;&nbsp;case3: this.rotateLeft'); //code_avl_5
                $('#code5').html('&nbsp;&nbsp;case3: this.rotateLeft');
                //$('#code6').html('&nbsp;&nbsp;case4: this.right.rotateRight, this.rotateLeft'); //code_avl_6
                $('#code6').html('&nbsp;&nbsp;case4: this.right.rotateRight, this.rotateLeft');
                //$('#code7').html('&nbsp;&nbsp;this is balanced'); //code_avl_7
                $('#code7').html('&nbsp;&nbsp;this is balanced');
                break;
            case 8: // successor
            case 9: // predecessor
                if (act == 8) {
                    //$('#code1').html('if this.right != null return findMin(this.right)'); //code_successor_1
                    //$('#code4').html('&nbsp;&nbsp;while(p != null && T == p.right)'); //code_successor_4
                    $('#code1').html('if this.right != null return findMin(this.right)');
                    $('#code4').html('&nbsp;&nbsp;while(p != null && T == p.right)');
                }
                else {
                    //$('#code1').html('if this.left != null return findMax(this.left)'); //code_predecessor_1
                    //$('#code4').html('&nbsp;&nbsp;while(p != null && T == p.left)');  //code_predecessor_4
                    $('#code1').html('if this.left != null return findMax(this.left)');
                    $('#code4').html('&nbsp;&nbsp;while(p != null && T == p.left)');
                }
                //$('#code2').html('else'); //code_predsucc_2
                $('#code2').html('else');
                //$('#code3').html('&nbsp;&nbsp;p = this.parent, T = this');  //code_predsucc_3
                $('#code3').html('&nbsp;&nbsp;p = this.parent, T = this');
                //$('#code5').html('&nbsp;&nbsp;&nbsp;&nbsp;T = p, p = T.parent');  //code_predsucc_5
                $('#code5').html('&nbsp;&nbsp;&nbsp;&nbsp;T = p, p = T.parent');
                //$('#code6').html('&nbsp;&nbsp;if p is null return -1'); //code_predsucc_6
                $('#code6').html('&nbsp;&nbsp;if p is null return -1');
                //$('#code7').html('&nbsp;&nbsp;else return p');  //code_predsucc_7
                $('#code7').html('&nbsp;&nbsp;else return p');
                break;
            case 3: // inorder traversal
                //$('#code1').html('if this is null');  //code_inorder_1
                $('#code1').html('if this is null');
                //$('#code2').html('&nbsp;&nbsp;return'); //code_inorder_2
                $('#code2').html('&nbsp;&nbsp;return');
                //$('#code3').html('inOrder(left)');  //code_inorder_3
                $('#code3').html('inOrder(left)');
                //$('#code4').html('visit this, then inOrder(right)');  //code_inorder_4
                $('#code4').html('visit this, then inOrder(right)');
                $('#code5').html('');
                $('#code6').html('');
                $('#code7').html('');
                break;
        }
    }
}


// BSTaction.js
var actionsWidth;
var statusCodetraceWidth;

var isCreateOpen = false, isSearchOpen = false, isInsertOpen = false, isRemoveOpen = false, isPredSuccOpen = false,
    isInorderOpen = false;

function openCreate() {
    if (!isCreateOpen) {
        $('.create').fadeIn('fast');
        isCreateOpen = true;
    }
}

function closeCreate() {
    if (isCreateOpen) {
        $('.create').fadeOut('fast');
        $('#create-err').html("");
        isCreateOpen = false;
    }
}

function openSearch() {
    if (!isSearchOpen) {
        $('.search').fadeIn('fast');
        isSearchOpen = true;
    }
}

function closeSearch() {
    if (isSearchOpen) {
        $('.search').fadeOut('fast');
        $('#search-err').html("");
        isSearchOpen = false;
    }
}

function openInsert() {
    if (!isInsertOpen) {
        $('.insert').fadeIn('fast');
        isInsertOpen = true;
    }
}

function closeInsert() {
    if (isInsertOpen) {
        $('.insert').fadeOut('fast');
        $('#insert-err').html("");
        isInsertOpen = false;
    }
}

function openRemove() {
    if (!isRemoveOpen) {
        $('.remove').fadeIn('fast');
        isRemoveOpen = true;
    }
}

function closeRemove() {
    if (isRemoveOpen) {
        $('.remove').fadeOut('fast');
        $('#remove-err').html("");
        isRemoveOpen = false;
    }
}

function openPredSucc() {
    if (!isPredSuccOpen) {
        $('.predsucc').fadeIn('fast');
        isPredSuccOpen = true;
    }
}

function closePredSucc() {
    if (isPredSuccOpen) {
        $('.predsucc').fadeOut('fast');
        $('#predsucc-err').html("");
        isPredSuccOpen = false;
    }
}

function openInorder() {
    if (!isInorderOpen) {
        $('.inorder').fadeIn('fast');
        isInorderOpen = true;
    }
}

function closeInorder() {
    if (isInorderOpen) {
        $('.inorder').fadeOut('fast');
        isInorderOpen = false;
    }
}

function hideEntireActionsPanel() {
    closeCreate();
    closeSearch();
    closeInsert();
    closeRemove();
    closePredSucc();
    closeInorder();
    hideActionsPanel();
}


// local
var bw, gw;

$(function () {
    $('#play').hide();
    bw = new BST();
    gw = bw.getGraphWidget();
    bw.generateRandom();
    var five_modes = ["BST", "AVL"];
    $('#title-' + five_modes[Math.floor(Math.random() * 2)]).click();
    var bstMode = getQueryVariable("mode");
    if (bstMode.length > 0)
        $('#title-' + bstMode).click();
    var createBST = getQueryVariable("create");
    if (createBST.length > 0) {
        var newBST = createBST.split(",");
        bw.generate(newBST);
    }

    $('#create').click(function () {
        openCreate();
        closeSearch();
        closeInsert();
        closeRemove();
        closePredSucc();
        closeInorder();
    });
    $('#search').click(function () {
        closeCreate();
        openSearch();
        closeInsert();
        closeRemove();
        closePredSucc();
        closeInorder();
    });
    $('#insert').click(function () {
        closeCreate();
        closeSearch();
        openInsert();
        closeRemove();
        closePredSucc();
        closeInorder();
    });
    $('#remove').click(function () {
        closeCreate();
        closeSearch();
        closeInsert();
        openRemove();
        closePredSucc();
        closeInorder();
    });
    $('#predsucc').click(function () {
        closeCreate();
        closeSearch();
        closeInsert();
        closeRemove();
        openPredSucc();
        closeInorder();
    });
    $('#inorder').click(function () {
        closeCreate();
        closeSearch();
        closeInsert();
        closeRemove();
        closePredSucc();
        openInorder();
    });
});

// title changing
var note = document.getElementById('noteContent');

$('#title-BST').click(function () {
    if (isPlaying) stop();
    // lw.setActiveStatus("BST");
    title.innerHTML = "BINARY SEARCH TREE";
    note.innerHTML = '<h1>BINARY SEARCH TREE</h1><br/>';
    note.innerHTML += "<div>BST is a collection of nodes arranged in a way where they maintain BST properties. Each node has a key and an associated value. While searching, the desired key is compared to the keys in BST and if found, the associated value is retrieved.</div>"

    bw.isAVL(false);
});

$('#title-AVL').click(function () {
    if (isPlaying) stop();
    // lw.setActiveStatus("AVL");
    title.innerHTML = "AVL TREE";
    note.innerHTML = '<h1>AVL TREE</h1><br/>';
    note.innerHTML += "<div>Named after their inventor Adelson, Velski & Landis, AVL trees are height balancing binary search tree. AVL tree checks the height of the left and the right sub-trees and assures that the difference is not more than 1. This difference is called the Balance Factor.</div>"

    bw.isAVL(true);
});

function empty() {
    if (isPlaying) stop();
    setTimeout(function () {
        if (bw.generateEmpty()) { // (mode == "exploration") &&
            $('#progress-bar').slider("option", "max", 0);
            closeCreate();
            isPlaying = false;
        }
    }, 500);
}

function example(id) {
    if (isPlaying) stop();
    setTimeout(function () {
        if (bw.generateExample(id)) { // (mode == "exploration") &&
            $('#progress-bar').slider("option", "max", 0);
            closeCreate();
            isPlaying = false;
        }
    }, 500);
}

function random() {
    if (isPlaying) stop();
    setTimeout(function () {
        if (bw.generateRandom()) { // (mode == "exploration") &&
            $('#progress-bar').slider("option", "max", 0);
            closeCreate();
            isPlaying = false;
        }
    }, 500);
}

function skewed(side) {
    if (isPlaying) stop();
    setTimeout(function () {
        if (bw.generateSkewed(side)) { // (mode == "exploration") &&
            $('#progress-bar').slider("option", "max", 0);
            closeCreate();
            isPlaying = false;
        }
    }, 500);
}

function findMinMax(isMin, callback) {
    if (isPlaying) stop();
    commonAction(bw.findMinMax(isMin, callback), (isMin ? "Find Minimum" : "Find Maximum"));
}

function searchVertex(callback) {
    if (isPlaying) stop();
    var input = $('#v-search').val();
    commonAction(bw.search(input, callback), "Search " + input);
    setTimeout(function () {
        if (Math.random() >= 0.5) $("#v-search").val(bw.getRandomInBST()); // 50% an existing value
        else $("#v-search").val(bw.getRandomNotInBST()); // 50% a NON existing value
    }, 500);
}

function insertVertex(callback) {
    if (isPlaying) stop();
    var input = $('#v-insert').val();
    commonAction(bw.insertArr(input.split(","), callback), "Insert " + input);
    setTimeout(function () {
        $("#v-insert").val(bw.getRandomNotInBST());
    }, 500); // randomized for next click, a NON existing value in BST
}

function removeVertex(callback) {
    if (isPlaying) stop();
    var input = $('#v-remove').val();
    commonAction(bw.removeArr(input.split(","), callback), "Remove " + input);
    setTimeout(function () {
        $("#v-remove").val(bw.getRandomInBST());
    }, 500); // randomized for next click, an existing value in BST
}

function predsucc(isPred, callback) {
    if (isPlaying) stop();
    var input = $('#v-predsucc').val();
    commonAction(bw.findPredSucc(input.split(","), isPred, callback), (isPred ? "Predecessor(" : "Successor(") + input + ")");
    setTimeout(function () {
        $("#v-predsucc").val(bw.getRandomInBST());
    }, 500);
}

function inorderTraversal(callback) {
    // if (mode != "exploration") return;
    if (isPlaying) stop();
    commonAction(bw.inorderTraversal(callback), "Inorder Traversal");
}

// Implement these functions in each visualisation
var userGraph = {
    'vl': {},
    'el': {},
};

// This function will be called before entering E-Lecture Mode
function ENTER_LECTURE_MODE() {
    //if (bw) userGraph = bw.getGraph();
}

// This function will be called before returning to Explore Mode
function ENTER_EXPLORE_MODE() {
    //loadGraph(userGraph);
}

// Lecture action functions
function CUSTOM_ACTION(action, data, mode) {
    if (action == 'search') {
        hideSlide(function () {
            $('#v-search').val(data); // force
            searchVertex(showSlide);
        });
    }
    else if (action == 'findmin') {
        hideSlide(function () {
            findMinMax(true, showSlide);
        });
    }
    else if (action == 'findmax') {
        hideSlide(function () {
            findMinMax(false, showSlide);
        });
    }
    else if (action == 'successor') {
        hideSlide(function () {
            $('#v-predsucc').val(data); // force
            predsucc(false, showSlide);
        });
    }
    else if (action == 'successor_max') {
        hideSlide(function () {
            $('#v-predsucc').val(bw.findMax()); // force the max
            predsucc(false, showSlide);
        });
    }
    else if (action == 'predecessor') {
        hideSlide(function () {
            $('#v-predsucc').val(data); // force
            predsucc(true, showSlide);
        });
    }
    else if (action == 'inorder') {
        hideSlide(function () {
            inorderTraversal(showSlide);
        });
    }
    else if (action == 'insert') {
        hideSlide(function () {
            $('#v-insert').val(data); // force
            insertVertex(showSlide);
        });
    }
    else if (action == 'insert_max_plus_1') {
        hideSlide(function () {
            $('#v-insert').val(bw.findMax() + 1); // force the max plus 1
            insertVertex(showSlide);
        });
    }
    else if (action == 'remove') {
        hideSlide(function () {
            $('#v-remove').val(data); // force
            removeVertex(showSlide);
        });
    }
    else if (action == 'remove_max') {
        hideSlide(function () {
            $('#v-remove').val(bw.findMax()); // force the max
            removeVertex(showSlide);
        });
    }
}

function responsivefy(svg) {
    var container = d3.select(svg.node().parentNode),
        width = parseInt(svg.style("width")) + 30,
        height = parseInt(svg.style("height")),
        aspect = width / height;

    svg.attr("viewBox", "0 0 " + width + " " + height)
        .attr("preserveAspectRatio", "xMinYMid")
        .call(resize);

    d3.select(window).on("resize." + container.attr("id"), resize);

    function resize() {
        var targetWidth = parseInt(container.style("width"));
        svg.attr("width", targetWidth);
        svg.attr("height", Math.round(targetWidth / aspect));
    }
}
