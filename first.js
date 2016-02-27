var size=8;
var border_size=5;
var block_size=($( document ).height()-200)/size;
var bourd_size=(block_size+border_size*2)*size;

for (var x = size-1 ; x >= 0; x--) {
	for (var y = size-1 ; y >= 0; y--) {
		var style='style="left:'+((block_size+border_size*2)*x)+'px;top:'+((block_size+border_size*2)*y)+'px;"';
		$(".board").append('<div class="block" id="'+x+'_'+y+'" ' + style+'>'+x+'_'+y+'</div>');
	};
	$(".board").append('<br>');
};

$(".board").css({width:bourd_size,height:bourd_size});
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
				//bad solutionx+figur.blocks[i][0];
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
			            $("#"+(x+figur.blocks[i][0])+"_"+(y+figur.blocks[i][1])).css( "backgroundColor" , color);        
		            };
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

											[ [0,0] , [1,0] , [1,1] , [2,1] ],
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

		var style='style="left:'+(bourd_size+block_size*this.blocks[i][0])+'px;top:'+block_size*this.blocks[i][1]+'px;"';
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