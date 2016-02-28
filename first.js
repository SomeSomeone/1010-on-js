function Board (){
	this.class_name="board";
	this.class_block="block"
	this.blocks_count=8;
	this.block_size=($( document ).height()-200)/this.blocks_count;
	this.block_border=5;//need rewrite
	this.full_block_size=this.block_size+this.block_border*2;
	this.full_size=this.full_block_size*this.blocks_count;
	this.control_sum=[[],[]];
	this.must_clean=[[],[]];
}
Board.prototype.draw = function(){

	for (var x = this.blocks_count-1 ; x >= 0; x--) {
		for (var y =this.blocks_count-1 ; y >= 0; y--) {
			var style='style="left:'+(this.full_block_size*x)+'px;top:'+(this.full_block_size*y)+'px;"';
			$("."+this.class_name).append('<div class="'+this.class_block+'" id="'+x+'_'+y+'" ' + style+'>'+x+'_'+y+'</div>');
		};
		this.control_sum[0][x]=0;//x
		this.control_sum[1][x]=0;//y
	};
	$("."+this.class_block).css({width:this.block_size,height:this.block_size});
	$("."+this.class_block).css("border", "gray solid "+this.block_border+"px");

};

Board.prototype.can_input_figur = function(figur, start_x, start_y){
	for (var i = figur.blocks.length - 1; i >= 0 ; i--) {
		var update_x=start_x+figur.blocks[i][0];
		var update_y=start_y+figur.blocks[i][1];
		var update_color=$("#"+update_x+"_"+update_y).css("background-color");
		if( update_x<0||update_x>=this.blocks_count||
			update_x<0||update_x>=this.blocks_count||
			update_color != 'rgb(255, 255, 255)'){
			return false;
		};
	};
	return true;
};

Board.prototype.input_figur = function(figur, start_x, start_y){
	for (var i in figur.blocks ) {
		var update_x=start_x+figur.blocks[i][0];
		var update_y=start_y+figur.blocks[i][1];
		$("#"+update_x+"_"+update_y).css( "backgroundColor" , figur.background_color);
		this.control_sum [0][update_x]++;
		this.control_sum [1][update_y]++;
	};
};

Board.prototype.is_need_clean = function(){
	var result=false;
	for (var u in this.must_clean) {
		for (var i = this.blocks_count-1; i >= 0; i--) {
			if(this.control_sum [u][i]>=this.blocks_count){
				this.must_clean[u][i]=true;
				console.log(u+"--"+i)
				result=true;
			};
		};
	};
	return result;
}

Board.prototype.clean = function(){
					console.log("inside");
	for(var u in this.must_clean){
							console.log("inside1");
		for(var i in this.must_clean[u]){
								console.log("inside2");
			if(this.must_clean[u][i]){
				console.log("inside3")
	            for (var z = this.blocks_count-1; z >= 0 && this.must_clean[u][i]; z--) {

					if(u){
						var id="#"+z+"_"+i;
						
					}else{
						var id="#"+i+"_"+z;
					}
					console.log(id);
					$(id).css( "backgroundColor" , 'white');
					this.control_sum[1-u][z]--;
		        }
		        this.must_clean[u][i]=false;
		        this.control_sum[u][i]=0;
			}
		}
	}
}


var board= new Board ();
board.draw();




$(function() {
	$('.block').droppable({
        drop: function(event, ui) {
        	var figur=Figur.prototype.figurs[event.target.id.split('_')[2]]

			y=parseInt(this.id.split('_')[1])-parseInt(event.target.id.split('_')[1]);
        	x=parseInt(this.id.split('_')[0])-parseInt(event.target.id.split('_')[0]);

			if(board.can_input_figur(figur,x,y)){
	            board.input_figur(figur,x,y);
	            console.log("input done")
	            console.log(board.control_sum)
	            
	            if(board.is_need_clean()){
	            	console.log(board.must_clean)
	            	board.clean();
	            	console.log("clean done")
	            }
	            figur.erase();
	            figur.draw(figur.number);
	        }
        }
    });
		
});

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function Figur (board,name){
	this.class_name=name;
	this.board=board;
	this.block_size=board.block_size;
	this.number;
	this.kind=-1;
	this.blocks=[];

};


Figur.prototype.blocks_combimation	= 	[	[ [0,0] , [0,1] , [0,2] , [0,3] ] ,// |
			 
											[ [0,0] , [1,0] , [2,0] , [3,0] ] ,// -
										 
											[ [0,0] , [0,1] , [0,2] ,
											  [1,0] , [1,1] , [1,2] ,
											  [2,0] , [2,1] , [2,2] ] ,//square 3*3

											[ [0,0] , [0,1] , [1,0] , [1,1] ] ,//square 2*2

											[ [0,1] , [1,0] , [1,1] , [1,2] , [2,1] ],//+

											[ [0,0] , [0,1] , [0,2] , [1,2] ],
											[ [0,0] , [0,1] , [0,2] , [1,0] ],
											[ [0,1] , [0,2] , [0,3] , [1,3] ],
											[ [0,1] , [1,1] , [2,1] , [2,2] ],//L
										];
Figur.prototype.figurs=[]; 

Figur.prototype.draw = function(number){
	this.figurs[number]=this;
	this.number=number;
	this.background_color=getRandomColor();
	this.kind = Math.floor((Math.random() * this.blocks_combimation.length) );
	this.blocks=this.blocks_combimation[this.kind];

	$(".figurs").append('<div class='+this.class_name+'></div>');

	for (var i in this.blocks) {

		var style='style="left:'+(this.board.full_size+this.block_size*this.blocks[i][0])+'px;top:'+this.block_size*this.blocks[i][1]+'px;"';
		$("."+this.class_name).append('<div class="block_move" id="'+this.blocks[i][0]+'_'+this.blocks[i][1]+'_'+number+'" '+style+'>'+this.blocks[i][0]+'_'+this.blocks[i][1]+'</div>');
	};

	$("."+this.class_name+" > .block_move").multiDraggable({ group: $("."+this.class_name+" > .block_move"), dragNative : function () {}});
	
	$(".block_move").css({width:this.block_size,height:this.block_size});
	$("."+this.class_name+" > .block_move").css("background-color",this.background_color)
};

Figur.prototype.erase = function(){
	this.blocks=[];
    $('.'+this.class_name).remove();

};

figur=new Figur (board,'ghjk');
figur.draw(0);
figur=new Figur (board,'tyhjk');
figur.draw(1);
figur=new Figur (board,'yhjk');
figur.draw(2);