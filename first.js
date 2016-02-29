function Board (){
	this.class_name="board";
	this.class_block="block";
	this.figur_count=3;
	this.blocks_count=10;
	this.block_size=($( document ).height()-200)/this.blocks_count;
	this.block_border=5;//need rewrite
	this.full_block_size=this.block_size+this.block_border*2;
	this.full_size=this.full_block_size*this.blocks_count;
	this.control_sum=[[],[]];
	this.must_clean=[[],[]];
}

Board.prototype.restart_board = function(){
	this.control_sum=[[],[]];
	this.must_clean=[[],[]];
	for (var x = this.blocks_count-1 ; x >= 0; x--) {
		for (var y =this.blocks_count-1 ; y >= 0; y--) {
			$("."+this.class_name+'>#'+x+'_'+y).animate({ backgroundColor: "#ffffff" }, 2000)
		};
	this.control_sum[0][x]=0;//x
	this.control_sum[1][x]=0;//y
	};
}



Board.prototype.draw = function(){
	for (var x = this.blocks_count-1 ; x >= 0; x--) {
		for (var y =this.blocks_count-1 ; y >= 0; y--) {
			var style='style="left:'+(this.full_block_size*x)+'px;top:'+(this.full_block_size*y)+'px;"';
			$("."+this.class_name).append('<div class="'+this.class_block+'" id="'+x+'_'+y+'" ' + style+'></div>');
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

Board.prototype.can_input_any_figurs = function(figurs){

	for(var figur in figurs){
		for (var x = this.blocks_count; x >= 0; x--) {
			for (var y = this.blocks_count; y >= 0; y--) {
				var result=true;
				for (var i = figurs[figur].blocks.length - 1; i >= 0 ; i--) {
					var update_x=x+figurs[figur].blocks[i][0];
					var update_y=y+figurs[figur].blocks[i][1];
					var update_color=$("#"+update_x+"_"+update_y).css("background-color");
					if( update_x<0||update_x>=this.blocks_count||
						update_x<0||update_x>=this.blocks_count||
						update_color != 'rgb(255, 255, 255)'){
						var result=false;
					};
				};
				if (result){
					return true;
				};
			};
		};
	};
	return false;
	
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
	for (var x_or_y in this.must_clean) {
		for (var i = this.blocks_count-1; i >= 0; i--) {
			if(this.control_sum [x_or_y][i]>=this.blocks_count){
				this.must_clean[x_or_y][i]=true;
				result=true;
			};
		};
	};
	return result;
}


Board.prototype.clean = function(){
	for(var x_or_y in this.must_clean){
		for(var number_in_must_clean in this.must_clean[x_or_y]){
			if(this.must_clean[x_or_y][number_in_must_clean]){

	            for (var i = this.blocks_count-1; i >= 0; i--) {
					if(x_or_y==0){

						 $("#"+number_in_must_clean+"_"+i).animate({ backgroundColor: "#000000" }, 400)
						 $("#"+number_in_must_clean+"_"+i).animate({ backgroundColor: "#ffffff" }, 400)
					//	$("#"+number_in_must_clean+"_"+i).css( "backgroundColor" , 'white');
					};
					if(x_or_y==1){
						$("#"+i+"_"+number_in_must_clean).animate({ backgroundColor: "#000000" }, 400);
						$("#"+i+"_"+number_in_must_clean).animate({ backgroundColor: "#ffffff" }, 400);
					//;	$("#"+i+"_"+number_in_must_clean).css( "backgroundColor" , 'white');
					}


					if(this.control_sum[1-x_or_y][i]>0){
						this.control_sum[1-x_or_y][i]--;
					}
		        }

		        this.must_clean[x_or_y][number_in_must_clean]=false;
		        this.control_sum[x_or_y][number_in_must_clean]=0;
			}
		}
	}
	console.log(this.control_sum);
}


Board.prototype.status = function(){
	console.log('must_clean.x='+this.must_clean[0].join(" "));
	console.log('must_clean.y='+this.must_clean[1].join(" "));
	console.log('control_sum.x='+this.control_sum[0].join(" "));
	console.log('control_sum.x='+this.control_sum[1].join(" "));

}


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
Figur.prototype.figurs_count=3;

Figur.prototype.figurs=[]; 

Figur.prototype.blocks_combimation	= 	[	[ [0,0] , [0,1] ] ,// | 2
											[ [0,0] , [0,1] , [0,2] , [0,3] ] ,// | 4
											[ [0,0] , [0,1] , [0,2] , [0,3] , [0,4] ] ,// | 5			 

											[ [0,0] , [1,0] ] ,// - 2
											[ [0,0] , [1,0] , [2,0] , [3,0] ] ,// - 4
											[ [0,0] , [1,0] , [2,0] , [3,0] , [4,0]] ,// - 4
											
											[ [0,0] ],//square 1*1

											[ [0,0] , [0,1] ,
											  [1,0] , [1,1] ] ,//square 2*2
										 
											[ [0,0] , [0,1] , [0,2] ,
											  [1,0] , [1,1] , [1,2] ,
											  [2,0] , [2,1] , [2,2] ] ,//square 3*3

											[ [0,0] , [0,1] , [1,1] ],
											[ [0,0] , [1,0] , [1,1] ],
											[ [1,0] , [0,0] , [0,1] ],
											[ [1,0] , [1,1] , [0,1] ],//L 2

											[ [0,0] , [0,1] , [0,2] , [0,3] , [1,3] , [2,3] , [3,3]],
											[ [0,0] , [1,0] , [2,0] , [3,0] , [3,1] , [3,2] , [3,3]],
											[ [3,0] , [2,0] , [1,0] , [0,0] , [0,1] , [0,2] , [0,3]],
											[ [3,0] , [3,1] , [3,2] , [3,3] , [2,3] , [1,3] , [0,3]],
											
											//L*4
										]

Figur.prototype.draw = function(number){
	this.figurs[number]=this;
	this.number=number;

	this.background_color=getRandomColor();
	
	this.kind = Math.floor((Math.random() * this.blocks_combimation.length) );
	this.blocks=this.blocks_combimation[this.kind];

	$(".figurs").append('<div class='+this.class_name+'></div>');

	for (var i in this.blocks) {
		var style='style="left:'+(this.board.full_size+this.block_size*this.blocks[i][0])+'px;top:'+this.block_size*this.blocks[i][1]+'px;"';
		$("."+this.class_name).append('<div class="block_move" id="'+this.blocks[i][0]+'_'+this.blocks[i][1]+'_'+number+'" '+style+'></div>');
	};

	$("."+this.class_name+" > .block_move").multiDraggable({ group: $("."+this.class_name+" > .block_move"), dragNative : function () {}});
	
	$(".block_move").css({width:this.block_size,height:this.block_size});
	$("."+this.class_name+" > .block_move").css("background-color",this.background_color)
};

Figur.prototype.is_need_generate = function(){
	for(var i in Figur.prototype.figurs){
		if(Figur.prototype.figurs[i]){
			return false
		}
	}
	return true;
}


Figur.prototype.generate = function(board){
	for (var i = Figur.prototype.figurs_count - 1; i >= 0; i--) {
		figur=new Figur (board, "figur"+i)
		figur.draw(i);
	};
}


Figur.prototype.erase = function(){
    $('.'+this.class_name).remove();
	var number=this.number;
	console.log('erase')
	delete Figur.prototype.figurs[number];
};

var board = new Board ();
board.draw();
Figur.prototype.generate(board);

$(function() {
	$('.block').droppable({
        drop: function(event, ui) {
        	var figur=Figur.prototype.figurs[event.target.id.split('_')[2]]

			y=parseInt(this.id.split('_')[1])-parseInt(event.target.id.split('_')[1]);
        	x=parseInt(this.id.split('_')[0])-parseInt(event.target.id.split('_')[0]);

			if(board.can_input_figur(figur,x,y)){
	            board.input_figur(figur,x,y);
	            board.status();
	            if(board.is_need_clean()){
	            	board.clean();
	            	board.status();
	            }
	            figur.erase();
	            if(Figur.prototype.is_need_generate()){
	            	Figur.prototype.generate(board);
	            }
	            //figur.draw(figur.number);
	        };
        	console.log("testing...");
	        if(!board.can_input_any_figurs(Figur.prototype.figurs)){
	        	$("#end_game").append("you can't input any figurs")
	        }
        }
    });
		
});
		

$(".restart").click(function(){
	board.restart_board();
	for(var i in Figur.prototype.figurs){
		var a= Figur.prototype.figurs[i].erase();
	}

    if(Figur.prototype.is_need_generate()){
    	Figur.prototype.generate(board);
    }

    $("#end_game").empty();
})


