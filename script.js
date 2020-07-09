class Board{
    constructor(state=Array(9).fill('')){
        this.state=state;
    }
    // printFormattedBoard() {
    //     let formattedString = '';
    //     this.state.forEach((cell, index) => {
    //         formattedString += cell ? ` ${cell} |` : '   |';
    //         if((index + 1) % 3 == 0)  {
    //             formattedString = formattedString.slice(0,-1);
    //             if(index < 8) formattedString += '\n\u2015\u2015\u2015 \u2015\u2015\u2015 \u2015\u2015\u2015\n';
    //         }
    //     });
    //     console.log('%c' + formattedString, 'color: #6d4e42;font-size:16px');
    // }
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
    indicateWinner(result){
        if(result.direction==='H'){
            Array.from(document.querySelector(`.ROW${result.row}`).children).forEach(item=>item.classList.add('winCol'));
        }
        else if(result.direction==="V"){
            document.querySelectorAll(`.COL${result.row}`).forEach(item=>item.classList.add('winCol'));
        }
        else{
            document.querySelectorAll(`.DIAG${result.row}`).forEach(item=>item.classList.add('winCol'));
        }
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
class Player{
    constructor(max_depth=-1){
        this.max_depth=max_depth;
        this.nodes_map=new Map();
        
    }
    getBestMove(board,maximizing=true,callback=()=>{},depth=0,alpha=-100,beta=100){
        if(board.constructor.name !== "Board") throw('The first argument to the getBestMove method should be an instance of Board class.');
        if(depth==0)this.nodes_map.clear();
        if(board.isTerminal()||depth==this.max_depth){
            if(board.isTerminal().winner==='X')return 100-depth;
            else if(board.isTerminal().winner==='O')return -100+depth;
            return 0;
        } 
        let best;
        if(maximizing){
            best=-100;
            board.getAvailableMoves().every(index=>{
                let child=new Board(board.state.slice());
                child.insert('X',index);
                let node_value=this.getBestMove(child,false,callback,depth+1,alpha,beta);
                best=Math.max(best,node_value);
                // alpha=Math.max(alpha,best)
                // if(beta<=alpha)return false;
                if(depth == 0) {
					var moves = this.nodes_map.has(node_value) ? `${this.nodes_map.get(node_value)},${index}` : index;
					this.nodes_map.set(node_value, moves);
                }
                
                return true;
            });
            
        }
        if(!maximizing){
            best = 100;
			board.getAvailableMoves().every(index => {
				let child = new Board(board.state.slice());
				child.insert('O', index);
				let node_value = this.getBestMove(child, true, callback, depth + 1,alpha,beta);
                best = Math.min(best, node_value);
                // beta=Math.min(beta,best);
                // if(beta<=alpha)return false;
				if(depth == 0) {
					var moves = this.nodes_map.has(node_value) ? this.nodes_map.get(node_value) + ',' + index : index;
					this.nodes_map.set(node_value, moves);
                }
                
                return true;
			});
			
        }
        if(depth == 0) {
            // console.log(this.nodes_map);
            if(typeof this.nodes_map.get(best) == 'string') {
                var arr = this.nodes_map.get(best).split(',');
                var rand = Math.floor(Math.random() * arr.length);
                var ret = arr[rand];
            } else {
                ret = this.nodes_map.get(best);
            }
            callback(ret);
            return ret;
        }
        return best;
    }
}

board=document.querySelector('.board');
mode=document.querySelector('.modes_choices');
depth=document.querySelector('.dpt-choices');
starting_player=document.querySelector('.starting_player_choices');
hint=document.querySelector('.hint');

let selected_mode=0;
let turn=1;
let maximizing=turn;
let depth_selected=-1;
p=new Player(depth_selected);
board_state=new Board();
hint_player=new Player(-1);
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
    if(selected_mode===0)
    p=new Player(depth_selected);
    hint_player=new Player(-1);
    // console.log(p.max_depth);
    document.querySelectorAll(`.cell`).forEach(item=>item.classList.remove('winCol'));
    if(selected_mode===0&&turn!==1){
        // console.log(turn,selected_mode);
        let centers_and_corners=[0,2,4,6,8];
        let first_choice=centers_and_corners[Math.floor(Math.random()*centers_and_corners.length)];
        board_state.insert('O',first_choice);
        board.querySelector(`#cell${first_choice}`).innerText='O';
        message_box.textContent="X Turn";
        // console.log("Hey");
        turn=1;
    }
    if(selected_mode===0){
        $('.hint').tooltip().attr('data-original-title','Make a move on center or corners.'); 
        hint.style.display="block";
    }
    else{
        hint.style.display="None";
    }
    // }
});
let board_positions=[[0,'Top-Left'],[1,'Top Center'],[2,'Top Right'],[3,'Middle Left'],[4,'Middle Center'],[5,'Middle Right'],[6,'Bottom Left'],[7,'Bottom Center'],[8,'Bottom Right']];
board_positions=new Map(board_positions);
message_box=document.querySelector('.message');
board_state=new Board();
board.addEventListener('click',e=>{
    if(e.target.tagName==='TD'){
        if(turn===1){
            if(!board_state.isTerminal()&&board_state.insert('X',e.target.getAttribute('data-value'))){
            e.target.innerText='X';
            turn=0;
            message_box.textContent="O turn!!";
            if(selected_mode===0){
                p.getBestMove(board_state,!maximizing,best=>{ 
                        board_state.insert('O',best);
                        board.querySelector(`#cell${best}`).textContent='O';
                        turn=1;
                        message_box.textContent="X turn!";
                        // console.log(p.next_nodes_map.keys());
                    });
                }
                hint_player.getBestMove(board_state,maximizing,best=>{
                    // hint.setAttribute('title',`${best}`);
                    // $('.hint').tooltip('dispose');
                    // console.log();
                    $('.hint').tooltip().attr('data-original-title',` Go for ${board_positions.get(Number(best))}`); 
                });
            }
            else{
                message_box.textContent="Error! Invalid Move"
                // console.log("Error! Invalid Move")
            }
            
            
            // board_state.printFormattedBoard();
            // console.log(p.max_depth);
            
           }
         else { 
            if(!board_state.isTerminal()&&board_state.insert('O',e.target.getAttribute('data-value'))){
                if(selected_mode===1)
                    e.target.innerText='O';
            
            turn=1;
            message_box.textContent="X turn!";}
            
            else{
                message_box.textContent="Error!Invalid Move";
                // console.log("Error");
            }
        }
        if(board_state.isTerminal()){
            let result=board_state.isTerminal()
            message_box.textContent=(result.winner==='draw')?"Game Drawn":`${result.winner} Wins!!`;
            board_state.indicateWinner(board_state.isTerminal());
            // console.log(board_state.isTerminal().direction);
        }
    }
});

