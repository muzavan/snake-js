// Init Control
function initControl(control){
    document.onkeydown = function checkKey(e){
        e = e || window.event;

        if (e.keyCode == '38') {
            control.up();
        }
        else if (e.keyCode == '40') {
            control.down();
        }
        else if (e.keyCode == '37') {
           control.left();
        }
        else if (e.keyCode == '39') {
           control.right();
        }
        else if (e.keyCode == '80'){
           control.p();
        }
    }
}