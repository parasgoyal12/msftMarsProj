board=document.querySelector('.board');
mode=document.querySelector('.modes_choices');
depth=document.querySelector('.dpt-choices');
starting_player=document.querySelector('.starting_player_choices');
board.addEventListener('click',e=>{
    if(e.target.tagName==='TD'){
        e.target.innerText='X';
    }

});
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
    if(selected_mode===1){depth.style.display='none';starting_player.innerHTML='<em>X begins first</em>';}
    else {
        depth.style.display='block';
        starting_player.innerHTML='<ul><li data-value="1" class="active">Player[X]</li><li data-value="2">AI[O]</li></ul>';
    }
    
});
depth_selected=5;

depth.addEventListener('click',e=>{
    if( e.target.tagName==='LI'){
        elements=Array.from(e.target.parentElement.children);
        elements.forEach(item=>{item.classList.remove('active');
    });
    e.target.classList.add('active');
    depth_selected=e.target.getAttribute('data-value');
    }
});

start=1;
starting_player.addEventListener('click',e=>{
    if( e.target.tagName==='LI'){
        elements=Array.from(e.target.parentElement.children);
        elements.forEach(item=>{item.classList.remove('active');
    });
    e.target.classList.add('active');
    start=e.target.getAttribute('data-value');
    }
});

const clear_board=()=>{
    elements=board.querySelectorAll('.cell');
    elements.forEach(item=>{
        item.innerText=' ';
    });
};

document.querySelector('#newgame').addEventListener('click',clear_board);