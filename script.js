class Board{
    constructor(state=Array(9).fill('')){
        this.state=state;
    }
    printFormattedBoard() {
        let formattedString = '';
        this.state.forEach((cell, index) => {
            formattedString += cell ? ` ${cell} |` : '   |';
            if((index + 1) % 3 == 0)  {
                formattedString = formattedString.slice(0,-1);
                if(index < 8) formattedString += '\n\u2015\u2015\u2015 \u2015\u2015\u2015 \u2015\u2015\u2015\n';
            }
        });
        console.log('%c' + formattedString, 'color: #6d4e42;font-size:16px');
    }
    isEmpty(){
        return this.state.every(cell=>!cell);
    }
    isFull(){
        return this.state.every(cell=>cell);
    }
    isTerminal(){
        if(this.isEmpty())return false;
        if(this.state[0] == this.state[1] && this.state[0] == this.state[2] && this.state[0]) {
            return {'winner': this.state[0], 'direction': 'H', 'row': 1};
        }
        if(this.state[3] == this.state[4] && this.state[3] == this.state[5] && this.state[3]) {
            return {'winner': this.state[3], 'direction': 'H', 'row': 2};
        }
        if(this.state[6] == this.state[7] && this.state[6] == this.state[8] && this.state[6]) {
            return {'winner': this.state[6], 'direction': 'H', 'row': 3};
        }
        //Checking Vertical Wins
        if(this.state[0] == this.state[3] && this.state[0] == this.state[6] && this.state[0]) {
            return {'winner': this.state[0], 'direction': 'V', 'row': 1};
        }
        if(this.state[1] == this.state[4] && this.state[1] == this.state[7] && this.state[1]) {
            return {'winner': this.state[1], 'direction': 'V', 'row': 2};
        }
        if(this.state[2] == this.state[5] && this.state[2] == this.state[8] && this.state[2]) {
            return {'winner': this.state[2], 'direction': 'V', 'row': 3};
        }
        //Checking Diagonal Wins
        if(this.state[0] == this.state[4] && this.state[0] == this.state[8] && this.state[0]) {
            return {'winner': this.state[0], 'direction': 'D', 'row': 1};
        }
        if(this.state[2] == this.state[4] && this.state[2] == this.state[6] && this.state[2]) {
            return {'winner': this.state[2], 'direction': 'D', 'row': 2};
        }
        //If no winner but the board is full, then it's a draw
        if(this.isFull()) {
            return {'winner': 'draw'};
        }
        
        //return false otherwise
        return false;
    }
    insert(symbol, position) {
        if(position > 8 || this.state[position]) return false; //Cell is either occupied or does not exist
        this.state[position] = symbol;
        return true;
    }
    getAvailableMoves() {
        const moves = [];
        this.state.forEach((cell, index) => {
            if(!cell) moves.push(index); 
        });
        return moves;
    }
}

board=document.querySelector('.board');
mode=document.querySelector('.modes_choices');
depth=document.querySelector('.dpt-choices');
starting_player=document.querySelector('.starting_player_choices');


let selected_mode=0;
let turn=1;
let depth_selected=5;

mode.addEventListener('click',e=>{
    let temp=selected_mode;
    if(e.target.tagName==="LI"){
        e.target.classList.add('active');
        if(e.target.getAttribute('data-value')==='1'){
            e.target.nextElementSibling.classList.remove('active');
            temp=1;
        }
            // selected_mode=1;
        else{
            e.target.previousElementSibling.classList.remove('active');
            temp=0;
        }
            // selected_mode=0;
    }
    if(temp===1){depth.style.display='none';starting_player.innerHTML='<ul><li data-value="1" class="active">Player&nbsp;[X]</li><li data-value="2">Player&nbsp;[O]</li></ul>';}
    else {
        depth.style.display='block';
        starting_player.innerHTML='<ul><li data-value="1" class="active">Player&nbsp;[X]</li><li data-value="2">AI&nbsp;[O]</li></ul>';
    }
    
});


depth.addEventListener('click',e=>{
    if( e.target.tagName==='LI'){
        elements=Array.from(e.target.parentElement.children);
        elements.forEach(item=>{item.classList.remove('active');
    });
    e.target.classList.add('active');
    // depth_selected=Number(e.target.getAttribute('data-value'));
    }
});


starting_player.addEventListener('click',e=>{
    
    if( e.target.tagName==='LI'){
        elements=Array.from(e.target.parentElement.children);
        elements.forEach(item=>{item.classList.remove('active');
    });
    e.target.classList.add('active');
    // turn=Number(e.target.getAttribute('data-value'));
    }
    // clear_board();
    
});



document.querySelector('#newgame').addEventListener('click',()=>{
    turn=Number(starting_player.querySelector('.active').getAttribute('data-value'));
    if(turn===1)message_box.textContent="X Turn";
    else message_box.textContent="O Turn";
    depth_selected=Number(depth.querySelector('.active').getAttribute('data-value'));
    selected_mode=Number(mode.querySelector('.active').getAttribute('data-value'));
    elements=board.querySelectorAll('.cell');
    elements.forEach(item=>{
        item.innerText='\u2800';
    });
    board_state=new Board();
});

message_box=document.querySelector('.message');
board_state=new Board();
board.addEventListener('click',e=>{
    if(e.target.tagName==='TD'){
        if(turn===1){
            if(!board_state.isTerminal()&&board_state.insert('X',e.target.id)){
            e.target.innerText='X';
            e.target.style.color = "blue";
            if(board_state.isTerminal()){
                message_box.textContent=`X Wins!!`;
                // console.log(board_state.isTerminal().direction);
            }else{
            turn=0;
            message_box.textContent="O turn!!"}
            }
            else{
                message_box.textContent="Error! Invalid Move"
                // console.log("Error! Invalid Move")
            }
            //Add AI Agent Here!!
        }
        else{
            if(!board_state.isTerminal()&&board_state.insert('O',e.target.id)){
            e.target.innerText='O';
            if(board_state.isTerminal())message_box.textContent=`O Wins!!`;
            else{
            turn=1;
            message_box.textContent="X turn!";}
            }
            else{
                message_box.textContent="Error!Invalid Move";
                // console.log("Error");
            }
        }
    }
});

