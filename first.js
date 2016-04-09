var OPTIONS = {
	"BoardClassName"	: "board",
	"BlockClassName"	: "block",
	"BoardSize"			: 10,
	"BlockSize"			: parseInt(($( document ).height()/15)),
	"FullBlockSize"		: parseInt(($( document ).height()/15)+4)
}

function Board (){
	this.full_block_size=OPTIONS["BlockSize"]+4;
	this.full_size=this.full_block_size*OPTIONS["BoardSize"];
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
	for (var x = OPTIONS["BoardSize"]-1 ; x >= 0; x--) {
		for (var y =OPTIONS["BoardSize"]-1 ; y >= 0; y--) {
			$("."+OPTIONS["BoardClassName"]+'>#'+x+'_'+y).animate({ backgroundColor: "#ffffff" }, 600)
		};
	this.control_sum[0][x]=0;//x
	this.control_sum[1][x]=0;//y
	};
}



Board.prototype.draw = function(){
	console.log($("."+OPTIONS["BlockClassName"]).outerHeight())
	for (var x = OPTIONS["BoardSize"]-1 ; x >= 0; x--) {
		for (var y =OPTIONS["BoardSize"]-1 ; y >= 0; y--) {
			var style='style="left:'+(this.offset+OPTIONS["FullBlockSize"]*x)+'px;top:'+(OPTIONS["FullBlockSize"]*y)+'px;"';
			$("."+OPTIONS["BoardClassName"]).append('<div class="'+OPTIONS["BlockClassName"]+'" id="'+x+'_'+y+'" ' + style+'></div>');
		};
		this.control_sum[0][x]=0;//x
		this.control_sum[1][x]=0;//y
	};
	$("."+OPTIONS["BlockClassName"]).css({width:OPTIONS["BlockSize"],height:OPTIONS["BlockSize"]});

};

Board.prototype.can_input_figur = function(figur, start_x, start_y){
	for (var i in figur.blocks) {
		var update_x=start_x+figur.blocks[i][0];
		var update_y=start_y+figur.blocks[i][1];
		var element=$("#"+update_x+"_"+update_y)
		var update_color=element.css("background-color");

		if( update_x<0||update_x>=OPTIONS["BoardSize"]||
			update_x<0||update_x>=OPTIONS["BoardSize"]||
			update_color != 'rgb(255, 255, 255)'||element==undefined){
			return false;
		};
	};
	return true;
};

Board.prototype.can_input_any_figurs = function(figurs){

	for(var figur in figurs){
		for (var x =OPTIONS["BoardSize"]; x >= -2; x--) {
			for (var y = OPTIONS["BoardSize"]; y >= -2; y--) {
				if (this.can_input_figur(figurs[figur],x,y)){
					return true;
				}
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
		for (var i = OPTIONS["BoardSize"]-1; i >= 0; i--) {
			if(this.control_sum [x_or_y][i]>=OPTIONS["BoardSize"]){
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

	            for (var i = OPTIONS["BoardSize"]-1; i >= 0; i--) {
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
	this.block_size=parseInt(OPTIONS["FullBlockSize"]/1.5);
	this.border_radius=parseInt(OPTIONS["FullBlockSize"]/6);
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




	$(document).ready(function() { 


	var board = new Board ();
	board.draw();
	Figur.prototype.generate(board);

	$("#points").css({	left:		board.full_size+board.offset+OPTIONS["FullBlockSize"],
						top:		OPTIONS["FullBlockSize"]
					});
	$("#restart").css({	left:		board.full_size+board.offset+OPTIONS["FullBlockSize"],
						top:		OPTIONS["FullBlockSize"]*3
					});


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
	        	$("#points > span , #result_points").text(board.points);
	        	
	        	setTimeout(function(){
		        	if(!board.can_input_any_figurs(Figur.prototype.figurs)){
			        	end_game();
			        }
	        	},2000);

	        }
	    });
			
	});


	function end_game(){ 
		$('#overlay').fadeIn(400,
		 	function(){
		 		var record;
		 		try{
		 			record=localStorage.getItem("1010-record");
		 		}
		 		catch(e){
		 			record=0;
		 		}
		 		$('#best_result_points').text(record)
				$('#result_in_game').css('display', 'block').animate({opacity: 1, top: '50%'}, 200);
				console.log(record);
				console.log(1);
				if(record < parseInt($('#result_points').text())){
					localStorage.setItem("1010-record", parseInt($('#result_points').text()));
					console.log(1);
				};

		});
	};


	$('#overlay , .button_block').click( function(){
			$('#result_in_game').animate({opacity: 0, top: '45%'},
				200, 
				function(){
					$(this).css('display', 'none');
					$('#overlay').fadeOut(400);
				}		
			);
			restart();
	})
			
	function restart(){
		$("#points>span , #result_points").text("0");
		board.restart_board();
		for(var i in Figur.prototype.figurs){
			var a= Figur.prototype.figurs[i].erase();
		}

	    if(Figur.prototype.is_need_generate()){
	    	Figur.prototype.generate(board);
	    }
	}


		$('#restart').click(function(){
			end_game();
		});
});

