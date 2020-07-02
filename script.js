board=document.querySelector('.board');
mode=document.querySelector('.modes_choices');
depth=document.querySelector('.dpt-choices');
starting_player=document.querySelector('.starting_player_choices');


selected_mode=0;
mode.addEventListener('click',e=>{
    if(e.target.tagName==="LI"){
        e.target.classList.add('active');
        if(e.target.getAttribute('data-value')==='1'){
            
            e.target.nextElementSibling.classList.remove('active');
            selected_mode=1;
        }
        else{
            e.target.previousElementSibling.classList.remove('active');
            selected_mode=0;
        }
    }
    if(selected_mode===1){depth.style.display='none';starting_player.innerHTML='<ul><li data-value="1" class="active">Player&nbsp;[X]</li><li data-value="2">Player&nbsp;[O]</li></ul>';}
    else {
        depth.style.display='block';
        starting_player.innerHTML='<ul><li data-value="1" class="active">Player&nbsp;[X]</li><li data-value="2">AI&nbsp;[O]</li></ul>';
    }
    
});
depth_selected=5;

depth.addEventListener('click',e=>{
    if( e.target.tagName==='LI'){
        elements=Array.from(e.target.parentElement.children);
        elements.forEach(item=>{item.classList.remove('active');
    });
    e.target.classList.add('active');
    depth_selected=Number(e.target.getAttribute('data-value'));
    }
});

turn=1;
starting_player.addEventListener('click',e=>{
    
    if( e.target.tagName==='LI'){
        elements=Array.from(e.target.parentElement.children);
        elements.forEach(item=>{item.classList.remove('active');
    });
    e.target.classList.add('active');
    turn=Number(e.target.getAttribute('data-value'));
    }
    clear_board();
});

const clear_board=()=>{
    elements=board.querySelectorAll('.cell');
    elements.forEach(item=>{
        item.innerText=' ';
    });
};

document.querySelector('#newgame').addEventListener('click',clear_board);

const check_board= state=>{
    //Complete Me
}

board_state=Array(9).fill(" ");
board.addEventListener('click',e=>{
    if(e.target.tagName==='TD'){
        if(e.target.innerText==='X' || e.target.innerText==='O'){
            console.log('error!Invalid Move')
        }
        else{
            if(turn===1){
                e.target.innerText='X';
                board_state[Number(e.target.id)]='X';
                turn=0;
            }
            else{
                e.target.innerText='O';
                board_state[Number(e.target.id)]='O';
                turn=1;
            }
        }

        // console.log(board_state);
    var b1 = board_state[0];
    var b2 = board_state[1];
    var b3 = board_state[2];
    var b4 = board_state[3];
    var b5 = board_state[4];
    var b6 = board_state[5];
    var b7 = board_state[6];
    var b8 = board_state[7];
    var b9 = board_state[8];

    if (((b1=="X") || (b1=="O")) && ((b1 == b2) && (b2 == b3))) {
        console.log(b1 + ' WON');
    }
    else if (((b1=="X") || (b1=="O")) && ((b1 == b4) && (b4 == b7))){
        console.log(b1 + ' WON');
    }
    else if (((b9=="X") || (b9=="O")) && ((b9 == b8) && (b8 == b7))){
        console.log(b9 + ' WON');
    }
    else if (((b9=="X") || (b9=="O")) && ((b9 == b6) && (b6 == b3))){
        console.log(b9 + ' WON');
    }
    else if (((b4=="X") || (b4=="O")) && ((b4 == b5) && (b5 == b6))){
        console.log(b4 + ' WON');
    }
    else if (((b2=="X") || (b2=="O")) && ((b2 == b5) && (b5 == b8))){
        console.log(b2 + ' WON');
    }
    else if (((b1=="X") || (b1=="O")) && ((b1 == b5) && (b5== b9))){
        console.log(b1 + ' WON');
    }
    else if (((b7=="X") || (b7=="O")) && ((b7 == b5) && (b5 == b3))){
        console.log(b7 + ' WON');
    }

    }

});

