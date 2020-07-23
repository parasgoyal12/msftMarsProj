
//Board Class to oack various functions related to the board setting
class Board{
    constructor(state=Array(9).fill('')){
        this.state=state;
    }
    isEmpty(){
        return this.state.every(cell=>!cell);
    }
    isFull(){
        return this.state.every(cell=>cell);
    }
    //Function to check if someone wins the game
    isTerminal(){
        //Checking Horizontal Wins
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
    indicateWinner(result,msg){
        if(result.direction==='H'){
            Array.from(document.querySelector(`.ROW${result.row}`).children).forEach(item=>item.classList.add('winCol'));
        }
        else if(result.direction==="V"){
            document.querySelectorAll(`.COL${result.row}`).forEach(item=>item.classList.add('winCol'));
        }
        else{
            document.querySelectorAll(`.DIAG${result.row}`).forEach(item=>item.classList.add('winCol'));
        }
        setTimeout(()=>{
            msg.textContent="Click Start New Game to begin!!"
        },3000);

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

//Class Player to define the AI Player 
class Player{
    constructor(max_depth=-1){
        //set the maximal depth of the algorithm
        this.max_depth=max_depth;
        //nodes_map maintains the score for each available move made by the algorithm in the stating node of the minimax tree
        this.nodes_map=new Map();
        
    }
    //function to find the best possible move using minimax algorithm
    getBestMove(board,maximizing=true,callback=()=>{},depth=0,alpha=-100,beta=100){
        if(board.constructor.name !== "Board") throw('Error.');
        if(depth==0)this.nodes_map.clear();
        if(board.isTerminal()||depth==this.max_depth){
            if(board.isTerminal().winner==='X')return 100-depth;
            else if(board.isTerminal().winner==='O')return -100+depth;
            return 0;
        } 
        let best;
        //if current player is the maximizing
        if(maximizing){
            best=-100;
            board.getAvailableMoves().every(index=>{
                let child=new Board(board.state.slice());
                child.insert('X',index);
                let node_value=this.getBestMove(child,false,callback,depth+1,alpha,beta);
                best=Math.max(best,node_value);
                
                if(depth == 0) {
					var moves = this.nodes_map.has(node_value) ? `${this.nodes_map.get(node_value)},${index}` : index;
					this.nodes_map.set(node_value, moves);
                }
                // alpha=Math.max(alpha,best)
                // if(beta<=alpha)return false;
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
                
				if(depth == 0) {
					var moves = this.nodes_map.has(node_value) ? this.nodes_map.get(node_value) + ',' + index : index;
					this.nodes_map.set(node_value, moves);
                }
                // beta=Math.min(beta,best);
                // if(beta<=alpha)return false;
                return true;
			});
			
        }
        if(depth == 0) {
            //get the best move from the nodes_map of the minimax tree
            if(typeof this.nodes_map.get(best) == 'string') {
                var arr = this.nodes_map.get(best).split(',');
                var rand = Math.floor(Math.random() * arr.length);
                var ret = arr[rand];
            } else {
                ret = this.nodes_map.get(best);
            }
            //Execute the callback to highlight changes in DOM
            callback(ret);
            return ret;
        }
        return best;
    }
}
//Get the required elements from the DOM
let board=document.querySelector('.board');
let mode=document.querySelector('.modes_choices');
let depth=document.querySelector('.dpt-choices');
let starting_player=document.querySelector('.starting_player_choices');
let hint=document.querySelector('.hint');
let message_box=document.querySelector('.message');

//mode 0 =>P/Ai 1=>P/P
let selected_mode=0;
//1=>X 0=>O
let turn=1;
//X is maximizing O is minimizing 
let maximizing=turn;
//-1 =>Inf 
let depth_selected=-1;
//AI Player Instance with the mind being getBestMove and environment is the board
p=new Player(depth_selected);
//Store the evironment for the algorithm in board_state
board_state=new Board();
//Another AI Player for providing the hints
hint_player=new Player(-1);

//Event Listener for the mode button using Event Delegation
mode.addEventListener('click',e=>{
    let temp=selected_mode;
    if(e.target.tagName==="LI"){
        e.target.classList.add('active');
        if(e.target.getAttribute('data-value')==='1'){
            e.target.nextElementSibling.classList.remove('active');
            temp=1;
        }
        else{
            e.target.previousElementSibling.classList.remove('active');
            temp=0;
        }
    }
    if(temp===1){depth.style.display='none';starting_player.innerHTML='<ul><li data-value="1" class="active">Player&nbsp;[X]</li><li data-value="2">Player&nbsp;[O]</li></ul>';}
    else {
        depth.style.display='block';
        starting_player.innerHTML='<ul><li data-value="1" class="active">Player&nbsp;[X]</li><li data-value="2">AI&nbsp;[O]</li></ul>';
    }
    
});

//Event Listener for the Depth botton using Event Delegation
depth.addEventListener('click',e=>{
    if( e.target.tagName==='LI'){
        elements=Array.from(e.target.parentElement.children);
        elements.forEach(item=>{item.classList.remove('active');});
    e.target.classList.add('active');
    }
});

//Event listener for starting player button using Event Delegation 
starting_player.addEventListener('click',e=>{
    if( e.target.tagName==='LI'){
        elements=Array.from(e.target.parentElement.children);
        elements.forEach(item=>{item.classList.remove('active');});
        e.target.classList.add('active');
    }
});



//Map the numeric board numbers to English
let board_positions=[[0,'Top-Left'],[1,'Top Center'],[2,'Top Right'],[3,'Middle Left'],[4,'Middle Center'],[5,'Middle Right'],[6,'Bottom Left'],[7,'Bottom Center'],[8,'Bottom Right']];
board_positions=new Map(board_positions);

//newgame function to be executed when DOM is ready / or the new game button is pressed
const newgame=function(){
    
    //Grab the selected value for parameters from the DOM
    turn=Number(starting_player.querySelector('.active').getAttribute('data-value'));
    if(turn===1)message_box.textContent="X Turn";
    else message_box.textContent="O Turn";
    depth_selected=Number(depth.querySelector('.active').getAttribute('data-value'));
    selected_mode=Number(mode.querySelector('.active').getAttribute('data-value'));
    
    //Clear the Board in DOM
    elements=board.querySelectorAll('.cell');
    elements.forEach(item=>{
        item.innerText='\u2800';
    });

    //Instantiate new Objects
    board_state=new Board();
    if(selected_mode===0)
    p=new Player(depth_selected);
    hint_player=new Player(-1);

    //Clear the Winning player Indication
    document.querySelectorAll(`.cell`).forEach(item=>item.classList.remove('winCol'));
    
    //Set the Default Hint Value
    $('.hint').tooltip().attr('data-original-title','Make a move on center or corners.'); 
    hint.style.display="block";
    
    //If AI is selected to move first then make a random move on center or the corners and set the Hints 
    if(selected_mode===0&&turn!==1){
        let centers_and_corners=[0,2,4,6,8];
        let first_choice=centers_and_corners[Math.floor(Math.random()*centers_and_corners.length)];
        board_state.insert('O',first_choice);
        board.querySelector(`#cell${first_choice}`).innerText='O';
        message_box.textContent="X Turn";
        turn=1;
        hint_player.getBestMove(board_state,maximizing,best=>{
            $('.hint').tooltip().attr('data-original-title',` Go for ${board_positions.get(Number(best))}`); 
        });
    }
}


//Event Listener for the New Game Button
document.querySelector('#newgame').addEventListener('click',newgame);

//Event Listener to the Board Using Event Delegation. Event Delegation allows the complete board to be operated using just one event listener for all the nine cells
board.addEventListener('click',e=>{
    if(e.target.tagName==='TD'){
        //X Turn
        if(turn===1){
            if(!board_state.isTerminal()&&board_state.insert('X',e.target.getAttribute('data-value'))){
                e.target.innerText='X';
                turn=0;
                message_box.textContent="O turn!!";
                if(selected_mode===0){
                    //AI Player plays 
                    p.getBestMove(board_state,!maximizing,best=>{ 
                            board_state.insert('O',best);
                            board.querySelector(`#cell${best}`).textContent='O';
                            turn=1;
                            message_box.textContent="X turn!";
                    });
                }
                //Set Hints 
                hint_player.getBestMove(board_state,maximizing,best=>{
                    //Jquery function to set the ToolTip
                    $('.hint').tooltip().attr('data-original-title',` Go for ${board_positions.get(Number(best))}`); 
                });
            }   
            else{
                //Some Non Empty cell is clicked on by the user.
                message_box.textContent="Error! Invalid Move";
            }
        }
        else{ 
            // This part is similar to the above except is does not conatian AI Players Logic
            if(!board_state.isTerminal()&&board_state.insert('O',e.target.getAttribute('data-value'))){
                if(selected_mode===1)
                    e.target.innerText='O';
            
                turn=1;
                message_box.textContent="X turn!";
                hint_player.getBestMove(board_state,!maximizing,best=>{
                    $('.hint').tooltip().attr('data-original-title',` Go for ${board_positions.get(Number(best))}`); 
                });
            }
            
            else{
                message_box.textContent="Error!Invalid Move";
            }
        }
        //If Someone wins the game , Then Stop .
        if(board_state.isTerminal()){
            let result=board_state.isTerminal()
            $('.hint').tooltip().attr('data-original-title',`Start a New Game!!`); 
            message_box.textContent=(result.winner==='draw')?"Game Drawn":`${result.winner} Wins!!`;
            board_state.indicateWinner(board_state.isTerminal(),message_box);
        }
    }
});

//Whenever the Page is Loaded, Get the Defaults from the DOM and start a New Game
document.addEventListener('DOMContentLoaded',newgame);
