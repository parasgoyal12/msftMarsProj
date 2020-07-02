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
    }

});

