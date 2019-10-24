var board  = {};
var houses = {};
var game;
var size   =  9;  // For now; will change in the future.
var focus  = [4, 4];

$(document) . ready (
    function () {
        init ();
    }
);


//
// Initialize the game
//
function init () {
    game = sudoku_games ["wiki_1"];
    init_model    ();
    init_page     ();
    init_handlers ();
}


function init_handlers () {
    //
    // Bind keypresses 
    //
    $(document) . keypress (function (event) {
        var str = String . fromCharCode (event . charCode);
        if (str == "h") {move_focus ( 0, -1)}
        if (str == "j") {move_focus ( 1,  0)}
        if (str == "k") {move_focus (-1,  0)}
        if (str == "l") {move_focus ( 0,  1)}
        if (str == "H") {move_focus ( 0, -3)}
        if (str == "J") {move_focus ( 3,  0)}
        if (str == "K") {move_focus (-3,  0)}
        if (str == "L") {move_focus ( 0,  3)}
    });
}


//
// Set up the model, that is, the internal datastructure(s)
//
function init_model () {
    setup_board  ();
    setup_houses ();
    setup_clues  ();
}

//
// Given x, y coordinates of a cell, return an id.
// This id can both be used to index a hash, and 
// as an CSS id
//
function id (x, y) {
    return "cell-" + x + "-" + y;
}


//
// Initialize the board datastructure. This method creates empty
// objects representing the cells in the board datastructure.
//
function setup_board () {
    for (x = 0; x < size; x ++) {
        for (y = 0; y < size; y ++) {
            var cell_id = id (x, y);
            var cell = {
                houses: [],
                value: 0,     // 0 means nothing yet
            };
            board [cell_id] = cell;
        }
    }
}


//
// Create the houses. For each cell, calculate the house(s) it
// belongs to; for each house, store which cells belong to it.
//
// For now, we assume standard Sudokus.
//
function set_in_house (house_id, cell_ids) {
    cell_ids . forEach (function (cell_id) {
        board [cell_id] ["houses"] . push (house_id)
    });
    if (!houses [house_id]) {
        houses [house_id] = {};
    }
    houses [house_id] ["cells"] = cell_ids;
}
function setup_houses () {
    // Rows
    for (y = 0; y < size; y ++) {
        var house_id = "row-" + y;
        var my_cells = [];
        for (x = 0; x < size; x ++) {
            my_cells . push (id (x, y));
        }
        set_in_house (house_id, my_cells);
    }

    // Columns
    for (x = 0; x < size; x ++) {
        var house_id = "column-" + x;
        var my_cells = [];
        for (y = 0; y < size; y ++) {
            my_cells . push (id (x, y));
        }
        set_in_house (house_id, my_cells);
    }

    // Boxes
    var sqrt_size = Math . sqrt (size);
    for (x = 0; x < sqrt_size; x ++) {
        for (y = 0; y < sqrt_size; y ++) {
            var house_id = "box-" + x + "-" + y;
            var my_cells = [];
            for (i = 0; i < sqrt_size; i ++) {
                for (j = 0; j < sqrt_size; j ++) {
                    var xx = x * sqrt_size + i;
                    var yy = y * sqrt_size + j;
                    my_cells . push (id (xx, yy));
                }
            }
            set_in_house (house_id, my_cells);
        }
    }
}

//
// Set up the clues
//
function setup_clues () {
    game . board . forEach (function (row, x) {
        row . split ('') . forEach (function (char, y) {
            board [id (x, y)] . value = char;
        })
    })
}

//
// Given (x, y) coordinates, return a set (string) of classes
// indicating which borders should be 'fat'.
//
function border_classes (x, y) {
    var sqrt_size = Math . sqrt (size);
    var classes = '';
    if (x % sqrt_size == 0)             {classes += ' top';}
    if (x % sqrt_size == sqrt_size - 1) {classes += ' bottom';}
    if (y % sqrt_size == 0)             {classes += ' left';}
    if (y % sqrt_size == sqrt_size - 1) {classes += ' right';}

    return classes;
}



//
// Create the HTML for the board
//
function init_page () {
    var table = "<table id = 'sudoku'>";
    for (x = 0; x < size; x ++) {
        table += "<tr>";
        for (y = 0; y < size; y ++) {
            var cell_id = id (x, y);
            var classes = 'cell' + border_classes (x, y);
            table += "<td class = '" + classes + "'>" +
                         "<div id = '" + cell_id + "'></div>" + "</td>";
        }
        table += "</tr>";
    }

    $("#field") . html (table);

    //
    // Set up the clues
    //
    for (var index in board) {
        var cell = board [index] . value;
        if (cell != ' ') {
            $("#" + index) . html (cell);
            $("#" + index) . addClass ("clue");
        }
    }

    set_focus (4, 4);
}

//
// Set the focus
//
function set_focus (x, y) {
    var class_name = "focus";
    var name  = id (x, y);

    $("." + class_name) . removeClass (class_name);
    $("#" + name)       . addClass    (class_name);

    focus = [x, y];
}

        

//
// Move the focus
//
function move_focus (dx, dy) {
    var new_x = focus [0] + dx;
    var new_y = focus [1] + dy;

    if (0 <= new_x && new_x < size &&
        0 <= new_y && new_y < size) {
        set_focus (new_x, new_y);
    }
}
