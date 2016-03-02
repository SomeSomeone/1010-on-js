function Board (){
	this.class_name="board";
	this.class_block="block";

	this.figur_count=3;
	this.blocks_count=10;

	
	this.block_size=parseInt(($( document ).height()/5*3)/this.blocks_count);
	this.block_border=parseInt(this.block_size/20);//need rewrite
	this.border_radius=	parseInt(this.block_size/4);



	this.full_block_size=this.block_size+this.block_border*2;
	this.full_size=this.full_block_size*this.blocks_count;
	
	var help =parseInt(($( document ).width()-this.full_size)/2)
	if (help<=250){
		this.offset=0;
	}else{
		this.offset=help
	}


	this.points=0;
	this.control_sum=[[],[]];
	this.must_clean=[[],[]];
}

Board.prototype.restart_board = function(){
	this.control_sum=[[],[]];
	this.must_clean=[[],[]];
	this.points=0;
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
			var style='style="left:'+(this.offset+this.full_block_size*x)+'px;top:'+(this.full_block_size*y)+'px;"';
			$("."+this.class_name).append('<div class="'+this.class_block+'" id="'+x+'_'+y+'" ' + style+'></div>');
		};
		this.control_sum[0][x]=0;//x
		this.control_sum[1][x]=0;//y
	};
	$("."+this.class_block).css({width:this.block_size,height:this.block_size});
	$("."+this.class_block).css("border", "#BDBDBD solid "+this.block_border+"px");
	$("."+this.class_block).css("border-radius", this.border_radius+"px");	
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
						(update_color != 'rgb(255, 255, 255)'&&
						update_color != 'rgb(206, 206, 206)')){
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
		this.points++;
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

						 $("#"+number_in_must_clean+"_"+i).animate({ backgroundColor: "#BDBDBD" }, 400)
						 $("#"+number_in_must_clean+"_"+i).animate({ backgroundColor: "#ffffff" }, 400)
					//	$("#"+number_in_must_clean+"_"+i).css( "backgroundColor" , 'white');
					};
					if(x_or_y==1){
						$("#"+i+"_"+number_in_must_clean).animate({ backgroundColor: "#BDBDBD" }, 400);
						$("#"+i+"_"+number_in_must_clean).animate({ backgroundColor: "#ffffff" }, 400);
					//;	$("#"+i+"_"+number_in_must_clean).css( "backgroundColor" , 'white');
					}

					this.points++;
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
    color = letters[Math.floor(Math.random() * 16)];
    return color;
}

function Figur (board,name){
	this.class_name=name;
	this.board=board;
	this.block_size=parseInt(board.full_block_size/1.5);
	this.border_radius=parseInt(board.border_radius/1.5);
	this.number;
	this.kind=-1;
	this.blocks=[];
};
Figur.prototype.figurs_count=3;

Figur.prototype.figurs=[]; 

Figur.prototype.blocks_colors = [	"#F44336","#E91E63","#D500F9","#2196F3",
									"#5C6BC0","#00BCD4","#009688","#18FFFF",
									"#43A047","#00E676","#8BC34A","#D4E157",
									"#FFEB3B","#FFC107","#FF5722","#FB8C00"]

Figur.prototype.blocks_combimation	= 	[	[ [2,1] , [2,2] ] ,// | 2
											[ [2,1] , [2,2] , [2,3] ] ,// | 3
											[ [2,0] , [2,1] , [2,2] , [2,3] ] ,// | 4
											[ [2,0] , [2,1] , [2,2] , [2,3] , [2,4] ] ,// | 5			 

											[ [1,2] , [2,2] ] ,// - 2
											[ [1,2] , [2,2] , [3,2] ] ,// - 3
											[ [0,2] , [1,2] , [2,2] , [3,2] ] ,// - 4
											[ [0,2] , [1,2] , [2,2] , [3,2] , [4,2]] ,// - 5
											
											[ [2,2] ],//square 1*1

											[ [2,2] , [2,3] ,
											  [3,2] , [3,3] ] ,//square 2*2
										 
											[ [1,1] , [1,2] , [1,3] ,
											  [2,1] , [2,2] , [2,3] ,
											  [3,1] , [3,2] , [3,3] ] ,//square 3*3

											[ [2,1] , [2,2] , [3,2] ],
											[ [2,1] , [3,1] , [3,2] ],
											[ [3,1] , [2,1] , [2,2] ],
											[ [3,1] , [3,2] , [2,2] ],//L 2

											[ [1,1] , [1,2] , [1,3] , [2,3] , [3,3] ],
											[ [1,1] , [2,1] , [3,1] , [3,2] , [3,3] ],
											[ [3,1] , [2,1] , [1,1] , [1,2] , [1,3] ],
											[ [3,1] , [3,2] , [3,3] , [2,3] , [1,3] ],
											
											//L 3
										]

Figur.prototype.draw = function(number){
	this.figurs[number]=this;
	this.number=number;

	this.background_color=this.blocks_colors[Math.floor(Math.random() * this.blocks_colors.length) ];
	
	this.kind = Math.floor((Math.random() * this.blocks_combimation.length) );
	this.blocks=this.blocks_combimation[this.kind];
	
	var offset_left=this.board.offset+this.board.full_size*((1/3)*this.number);
	var offset_top=this.block_size;
	
	$(".figurs").append('<div class='+this.class_name+'></div>');

	for (var i in this.blocks) {
		var style='style="left:'+parseInt((offset_left+this.block_size*this.blocks[i][0]))+'px;top:'+parseInt((offset_top+this.board.full_size+this.block_size*this.blocks[i][1]))+'px;"';
		$("."+this.class_name).append('<div class="block_move" id="'+this.blocks[i][0]+'_'+this.blocks[i][1]+'_'+this.number+'" '+style+'></div>');
	};

	$("."+this.class_name+" > .block_move").multiDraggable({ group: $("."+this.class_name+" > .block_move"), dragNative : function () {}});
	
	$("."+this.class_name+" > .block_move").css({width:this.block_size,height:this.block_size});
	$("."+this.class_name+" > .block_move").css("background-color",this.background_color)
	$("."+this.class_name+" > .block_move").css("border-radius", this.border_radius+"px");	
};

Figur.prototype.upset=function(){
	var offset_left=this.board.offset+this.board.full_size*((1/3)*this.number);
	var offset_top=this.block_size;
	for (var i in this.blocks) {
		$("#"+this.blocks[i][0]+'_'+this.blocks[i][1]+'_'+this.number).css({	left:		parseInt(offset_left+this.board.block_size*this.blocks[i][0]),
																				top:		parseInt(offset_top+this.board.full_size+this.board.block_size*this.blocks[i][1])});

	};
	$("."+this.class_name+" > .block_move").css({width:this.board.block_size,height:this.board.block_size})
}

Figur.prototype.downset=function(){
	var offset_left=this.board.offset+this.board.full_size*((1/3)*this.number);
	var offset_top=this.block_size;
	for (var i in this.blocks) {
		$("#"+this.blocks[i][0]+'_'+this.blocks[i][1]+'_'+this.number).css({	left:		parseInt(offset_left+this.block_size*this.blocks[i][0]),
																				top:		parseInt(offset_top+this.board.full_size+this.block_size*this.blocks[i][1])});
	};
	$("."+this.class_name+" > .block_move").css({width:this.block_size,height:this.block_size})
}


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

$("#points").css("left",board.full_size+board.offset+board.full_block_size+'px' )

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
	        };
        	$("#points > span").text(board.points);
	        if(!board.can_input_any_figurs(Figur.prototype.figurs)){
	        	$("#end_game").append("you can't input any figurs")
	        }
        }
    });
		
});
		

$(".restart").click(function(){
	$("#points").empty();
	$("#end_game").empty();
	board.restart_board();
	for(var i in Figur.prototype.figurs){
		var a= Figur.prototype.figurs[i].erase();
	}

    if(Figur.prototype.is_need_generate()){
    	Figur.prototype.generate(board);
    }
})


