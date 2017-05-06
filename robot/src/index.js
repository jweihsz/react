
import React from 'react';
import ReactDOM from 'react-dom';
import {Component}  from  "react";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';



const  G_TABLE_ROW=10;
const  G_TABLE_COL=10;

const  G_CAN_N = 0;
const  G_CAN_Y = 1;
const  G_CAN_W = 2;

const  G_UP_WALK=0;
const  G_DOWN_WALK=1;
const  G_LEFT_WALK=2;
const  G_RIGHT_WALK=3;
const  G_WAIT_WALK=4;
const  G_RANDOM_WALK=5;
const  G_COLLECT_CAN=6;


const G_SAMPLE_ARRAYS = 200;  /*每次测试组数目*/
const G_ACTIONS_ARRAY = 244;  /*从1开始计数 243+1*/



function yield_random_action(min=G_UP_WALK,max=G_COLLECT_CAN){

	return(Math.round(Math.random()*(max-min)+min));
}


function count_map_num(up=0,down=0,left=0,right=0,center=0){

	return((up<<0)|(down<<2)|(left<<4)|(right<<6)|(center<<8));
}


function init_env_params(){

	let hash_array = [];
	let action_array = new Array();
	let status_array = new Array();

	let count = 1;
	let map_num = 0;

	for(let up=0;up<3;++up)
		for(let down=0;down<3;++down)
			for(let left=0;left<3;++left)
				for(let right=0;right<3;++right)
					for(let center=0;center<3;++center){

						map_num = count_map_num(up,down,left,right,center);
						hash_array[ map_num + ""] = count ++;
	}


	for(let i=0;i<G_SAMPLE_ARRAYS;++i){

		action_array[i] = new Array();
		
		for(let j=0; j<G_ACTIONS_ARRAY; ++j){

			action_array[i][j] = G_WAIT_WALK;
		}
	}

	for(let i=0;i<G_TABLE_ROW; ++i){

			status_array[i] = new Array();

		for(let j=0;j<G_TABLE_COL;++j){

			status_array[i][j] = G_CAN_N;
		}

	}

	return({

		hash_map: hash_array,
		action_array:action_array,
		status_array:status_array,
		test_value:100,
	});
}




function  new_cell_status(param_obj=null,can_nums=20){

	if(!param_obj){

		return(-1);
	}
	let x_pos = -1;
	let y_pos = -1;
	let count_can = 0;

	while(count_can < can_nums){

		x_pos = Math.round(Math.random()*(G_TABLE_ROW-1)+0);
		y_pos = Math.round(Math.random()*(G_TABLE_COL-1)+0);

		if((x_pos < G_TABLE_ROW) && (y_pos < G_TABLE_COL)){

			if(G_CAN_N == param_obj.status_array[x_pos][y_pos]){

				param_obj.status_array[x_pos][y_pos] = 	G_CAN_Y;
				count_can += 1;	
			}
		} 
	}
}




function  get_cell_status(param_obj=null,x_pos,y_pos){

	if(!param_obj || x_pos>(G_TABLE_ROW-1) || y_pos>(G_TABLE_COL-1)){

		return(G_CAN_N);
	}

	return(param_obj.status_array[x_pos][y_pos]);
}



function new_action_array(param_obj=null){

	if(!param_obj){

		return(-1);
	}

	for(let i=0;i<G_SAMPLE_ARRAYS;++i){

		for(let j=0; j<G_ACTIONS_ARRAY; ++j){

			param_obj.action_array[i][j] = yield_random_action();
		}
	}

	return(0);
}


class  CellNode extends Component{

	render(){
		
		let class_name = this.props.has_can=="yes" ? ("glyphicon glyphicon-flag") : ("glyphicon glyphicon-star-empty");
		let textColor=undefined;
		if(this.props.has_can=="yes"){

			textColor = "#CC0000";
		}
		return(

			<button  type="button" className="btn btn-default btn-lg">
				<span className={class_name}  style={{color:textColor}}></span>
			</button>
		);	
	}
}


class  FloorDraw  extends Component{

		
		render(){
			
			
			let test_obj = null;
			test_obj = init_env_params();
			let node = count_map_num(2,2,2,2,2);
			let value_ret = test_obj.hash_map[node+""];
			
		
			let test_random = new_action_array(test_obj);
			let one_value = test_obj.action_array[2][2];
			let two_value = test_obj.test_value;

			let init_param = init_env_params();
			new_cell_status(init_param,21);


			let items = [];
			for(let i=0; i<G_TABLE_COL; ++i){

				for(let j=0;j <G_TABLE_ROW; ++j){

					if(G_CAN_N == get_cell_status(init_param,i,j)){

						items.push(<td><CellNode  has_can="no" /></td>);
					}else{
						items.push(<td><CellNode  has_can="yes" /></td>);
					}
				}
				items.push(<tr></tr>);
			}

				
			return(

				<div className="panel panel-default">
					<div className="panel-heading">pandel test</div>
					<div className="panel-body"> 
						<p>just a test</p>
					</div>
					
					{items}
					
					<br />
					<br />
					<br />

					<b>the value is {one_value}   {two_value}</b>

				</div>
			);
		}
}



ReactDOM.render(

	<FloorDraw   />,
	document.getElementById("root")
);




