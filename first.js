var size=8;
var border_size=5;
var block_size=($( document ).height()-200)/size;
var board_size=(block_size+border_size*2)*size;
var board=[[],[]];
var must_clean=[[],[]];
for (var x = size-1 ; x >= 0; x--) {
	for (var y = size-1 ; y >= 0; y--) {
		var style='style="left:'+((block_size+border_size*2)*x)+'px;top:'+((block_size+border_size*2)*y)+'px;"';
		$(".board").append('<div class="block" id="'+x+'_'+y+'" ' + style+'>'+x+'_'+y+'</div>');
	};
	$(".board").append('<br>');
	board[0][x]=0;//x
	board[1][x]=0;//y
};

$(".board").css({width:board_size,height:board_size});
$(".board").css("background-color","gray");

$(".block").css({width:block_size,height:block_size});
$(".block").css("border", "gray solid "+border_size+"px"); 


$(function() {
	
	$('.block').droppable({
        drop: function(event, ui) {
  
            	var color=$("#"+event.target.id).css("background-color");          	
            	var figur=Figur.prototype.figurs[event.target.id.split('_')[2]]

				y=parseInt(this.id.split('_')[1])-parseInt(event.target.id.split('_')[1]);
            	x=parseInt(this.id.split('_')[0])-parseInt(event.target.id.split('_')[0]);
				//bad solution
				var error=false;
				for (var i = figur.blocks.length - 1; i >= 0 && !error ; i--) {
					var update_x=x+figur.blocks[i][0];
					var update_y=y+figur.blocks[i][1];
					var update_color=$("#"+update_x+"_"+update_y).css("background-color");
					if( update_x<0||update_x>=size||
						update_x<0||update_x>=size||
						update_color != 'rgb(255, 255, 255)'){
						error=true;
					};
				};

				if(!error){
		            for (var i in figur.blocks ) {
						var update_x=x+figur.blocks[i][0];
						var update_y=y+figur.blocks[i][1];		            	
			            $("#"+update_x+"_"+update_y).css( "backgroundColor" , color);
			            board [0][update_x]++;
			            board [1][update_y]++;
		            };
		            console.log("x="+board[0]+" y="+board[1]);

		            for (var u in must_clean) {
			            for (var i = size-1; i >= 0; i--) {
			            	if(board [u][i]>=size){
			            		must_clean[u][i]=true;
			            	};
			            };
		            };

		            console.log("x="+must_clean[0]+" y="+must_clean[1]);

			        for(var x in must_clean[0]){
			            if(must_clean[0][x]){
				            for (var y = size-1; y >= 0 && must_clean[0][x]; y--) {			        
								$("#"+x+"_"+y).css( "backgroundColor" , 'white');
								console.log("#"+x+"_"+y);
								board[1][y]--;
					        }
					        must_clean[0][x]=false;
					        board[0][x]=0;
					    }
			        };
			        for(var y in must_clean[1]){
				        if(must_clean[1][y]){
				            for (var x = size-1; x >= 0 ; x--) {			        
					        	$("#"+x+"_"+y).css( "backgroundColor" , 'white');
					        	console.log("#"+x+"_"+y);
					        	board[0][x]--;
					        };
					        must_clean[1][y]=false;
					        board[1][y]=0;
					    };
			        };

					console.log("x="+must_clean[0]+" y="+must_clean[1]);


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

function Figur (class_name){
	this.class_name=class_name;
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
Figur.prototype.figurs	=[]; 

Figur.prototype.draw = function(number){
	this.figurs[number]=this;
	this.number=number;
	this.kind = Math.floor((Math.random() * this.blocks_combimation.length) );
	this.blocks=this.blocks_combimation[this.kind];
	var background_color=getRandomColor();

	$(".figurs").append('<div class='+this.class_name+'></div>');

	for (var i in this.blocks) {

		var style='style="left:'+(board_size+block_size*this.blocks[i][0])+'px;top:'+block_size*this.blocks[i][1]+'px;"';
		$("."+this.class_name).append('<div class="block_move" id="'+this.blocks[i][0]+'_'+this.blocks[i][1]+'_'+number+'" '+style+'>'+this.blocks[i][0]+'_'+this.blocks[i][1]+'</div>');
	};
	$(".block_move").multiDraggable({ group: $(".block_move"), dragNative : function () {}});
	$(".block_move").css({width:block_size,height:block_size});
	$(".block_move").css("border",border_size+" px solid white");
	$(".block_move").css("background-color",background_color)
};

Figur.prototype.erase = function(){
	this.blocks=[];
    $('.'+this.class_name).remove();

};

figur=new Figur ("first")
figur.draw(0);


console.log(Figur.prototype.blocks_combimation[0])