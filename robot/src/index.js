
import React from 'react';
import ReactDOM from 'react-dom';
import {Component}  from  "react";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';



const  G_TABLE_ROW=10;
const  G_TABLE_COL=10;

const  G_CAN_N = 0;
const  G_CAN_Y = 1;
const  G_CAN_W = 2;
const  G_ROBOT_S=3;

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



class  CellNode extends Component{

	render(){
		
		let class_name;
		if("robot" === this.props.class_type){

			class_name = "glyphicon glyphicon-plane"; 

		}else if("has_can" === this.props.class_type){

			class_name = "glyphicon glyphicon-flag"; 	
		}else{

			class_name = "glyphicon glyphicon-star-empty "; 	
		}

		let textColor=undefined;
		if(this.props.class_type=="has_can"){

			textColor = "#CC0000";
		}
		return(

			<button  type="button" className="btn btn-default btn-lg" onClick={()=>{this.props.onClick(this.props.x_pos,this.props.y_pos);}}>
				<span className={class_name}  style={{color:textColor}}></span>
			</button>
		);	
	}
}




class  FloorDraw  extends Component{

		constructor(){
			
			super();
			this.state = {

				pos:{up:0,down:0,left:0,right:0,center:0},
				hash_map: null,
				action_array:null,
				action_score:null,
				status_array:null,
				ui_status:null,
				flag_array:null,
				cur_index:0,
				cur_x:0,
				cur_y:0,
				cur_action:"G_WAIT_WALK",
				test_value:100,
				opacity:0,


			};
		}



		reset_action_score(){

			let action_score = new Array();

			for(let i=0;i<G_SAMPLE_ARRAYS;++i){
				action_score[i] = 0;
			}
			this.state.action_score = action_score;
		}


		set_action_score(index,value){

			if((index>G_SAMPLE_ARRAYS-1)  || index< 0)return(-1);

			this.state.action_score[index] += value;
		}


		init_env_params(){

			let hash_array = new Array();
			let action_array = new Array();
			let status_array = new Array();
			let ui_array = new Array();
			let flag_array = new Array();
			

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
					ui_array[i] = new Array();

				for(let j=0;j<G_TABLE_COL;++j){

					status_array[i][j] = G_CAN_N;
					ui_array[i][j] = G_CAN_N;
				}

			}

			for(let i=0;i<G_TABLE_ROW; ++i){

					flag_array[i] = new Array();

				for(let j=0;j<G_TABLE_COL;++j){

					flag_array[i][j] = 1;
				}

			}


			this.state.hash_map=hash_array;
			this.state.action_array=action_array;
			this.state.status_array=status_array;
			this.state.ui_array=ui_array;
			this.state.flag_array=flag_array;
			this.state.cur_index = 0;
			this.reset_action_score();

		}



		flag_array_config(xpos,ypos,flag){


			this.state.flag_array[xpos][ypos] = flag;

		}


		flag_array_get(xpos,ypos){


			return(this.state.flag_array[xpos][ypos]);
		}



		new_cell_status(can_nums=20){


			let x_pos = -1;
			let y_pos = -1;
			let count_can = 0;
			let new_array = new Array();
			for(let i=0;i<G_TABLE_COL; ++i){

				new_array.push(this.state.status_array[i]);
			}


			for(let i=0;i<G_TABLE_ROW; ++i){

				for(let j=0;j<G_TABLE_COL;++j){

					new_array[i][j] = G_CAN_N;
				}

			}

			while(count_can < can_nums){

				x_pos = Math.round(Math.random()*(G_TABLE_ROW-1)+0);
				y_pos = Math.round(Math.random()*(G_TABLE_COL-1)+0);

				if((x_pos < G_TABLE_ROW) && (y_pos < G_TABLE_COL)){

					if(G_CAN_N == new_array[x_pos][y_pos]){

						new_array[x_pos][y_pos] = 	G_CAN_Y;
						count_can += 1;	
					}
				} 
			}
			this.state.status_array=new_array;

			for(let i=0;i<G_TABLE_ROW; ++i){

				for(let j=0;j<G_TABLE_COL;++j){

					this.state.ui_array[i][j] = new_array[i][j];
				}

			}


		}


		get_cell_around(x_pos,y_pos){

			
			let up_value = G_CAN_N;
			let down_value = G_CAN_N;
			let left_value = G_CAN_N;
			let right_value = G_CAN_N;
			let center_value = G_CAN_N;


			if(x_pos>(G_TABLE_ROW-1) || y_pos>(G_TABLE_COL-1)){

				return(

					{
						up:up_value,
						down:down_value,
						left:left_value,
						right:right_value,
						center:center_value,
					}
				);
			}

			if(y_pos == G_TABLE_COL-1){

				right_value = G_CAN_W;

			}else{

				right_value = this.state.status_array[x_pos][y_pos+1];
			}

			if(y_pos == 0){

				left_value = G_CAN_W;
			}else{

				left_value = this.state.status_array[x_pos][y_pos-1];
			}

			if(x_pos == 0){

				up_value = G_CAN_W;
			}else{

				up_value = this.state.status_array[x_pos-1][y_pos];
			}	

			if(x_pos == G_TABLE_ROW-1){

				down_value = G_CAN_W;
			}else{

				down_value = this.state.status_array[x_pos+1][y_pos];
			}

			center_value = this.state.status_array[x_pos][y_pos];

			return(

				{
					up:up_value,
					down:down_value,
					left:left_value,
					right:right_value,
					center:center_value,
				}
			);

		}


		get_cell_status(x_pos,y_pos){

			if(x_pos>(G_TABLE_ROW-1) || y_pos>(G_TABLE_COL-1)){

				return(G_CAN_N);
			}

			return(this.state.status_array[x_pos][y_pos]);
		}

		set_cell_status(x_pos,y_pos,value){

			this.state.status_array[x_pos][y_pos] = value;

		}


		set_ui_status(x_pos,y_pos,value){

			this.state.ui_array[x_pos][y_pos] = value;

		}

		get_ui_status(x_pos,y_pos){

			if(x_pos>(G_TABLE_ROW-1) || y_pos>(G_TABLE_COL-1)){

				return(G_CAN_N);
			}

			return(this.state.ui_array[x_pos][y_pos]);
		}



		new_action_array(){


			for(let i=0;i<G_SAMPLE_ARRAYS;++i){

				for(let j=0; j<G_ACTIONS_ARRAY; ++j){

					this.state.action_array[i][j] = yield_random_action();
				}
			}

			return(0);
		}

		handle_click(xpos,ypos){

			let obj = this.get_cell_around(xpos,ypos);
			this.setState({pos:obj});
		}


		robot_run(){


			let obj = this.get_cell_around(this.state.cur_x,this.state.cur_y);
			let map_value = count_map_num(obj.up,obj.down,obj.left,obj.right,obj.center);
			let real_value = this.state.hash_map[ map_value + ""];
			let action = this.state.action_array[0][real_value];
			let new_x = this.state.cur_x;
			let new_y = this.state.cur_y;

			if(G_RANDOM_WALK == action){

				let new_action = G_RANDOM_WALK;
				do{

					new_action = yield_random_action();
				}while(G_RANDOM_WALK == new_action);

				action = new_action;
			}


			if(G_UP_WALK == action){

				this.state.cur_action = "G_UP_WALK";

				if(0 == new_x){


				}else{

					new_x -=1;	
				}
				

			}else if(G_DOWN_WALK == action){

				this.state.cur_action = "G_DOWN_WALK";
				if(G_TABLE_ROW-1 == new_x){


				}else{

					new_x +=1;

				}
				
			}else if(G_LEFT_WALK == action){

				this.state.cur_action = "G_LEFT_WALK";

				if(0 == new_y){


				}else{

					new_y -= 1;	
				}
				

			}else if(G_RIGHT_WALK == action){

				this.state.cur_action = "G_RIGHT_WALK";
				if(G_TABLE_COL-1 == new_y){


				}else{

					new_y += 1;	
				}

			}else if(G_WAIT_WALK == action){

				this.state.cur_action = "G_WAIT_WALK";

			}else if(G_COLLECT_CAN == action){

				this.state.cur_action = "G_COLLECT_CAN";

			}

			//this.flag_array_config(new_x,new_y,1);
			//this.set_cell_status(new_x,new_y,G_ROBOT_S);
			this.setState({cur_x:new_x,cur_y:new_y});



		}


		componentWillMount(){


			this.init_env_params();
			this.new_cell_status(21);
			this.new_action_array();

		}

		
		
		componentDidMount(){

		
			    setInterval(function () {
					
					let new_x=this.state.cur_x;
					let new_y = this.state.cur_y;
					let obj = this.get_cell_around(this.state.cur_x,this.state.cur_y);
					let map_value = count_map_num(obj.up,obj.down,obj.left,obj.right,obj.center);
					let real_value = this.state.hash_map[ map_value + ""];
					let	action = this.state.action_array[this.state.cur_index][real_value];


					let new_action_dec = null;
					if(G_RANDOM_WALK == action){

						let new_action = G_RANDOM_WALK;
						do{

							new_action = yield_random_action();
						}while(G_RANDOM_WALK == new_action);

						action = new_action;
					}

					

					if(G_UP_WALK == action){

						new_action_dec = "G_UP_WALK";

						if(0 == new_x){

							this.state.action_score[this.state.cur_index] -= 5;

						}else{

							new_x -= 1;	
						}
						

					}else if(G_DOWN_WALK == action){

						new_action_dec = "G_DOWN_WALK";
						if(G_TABLE_ROW-1 == new_x){

							this.state.action_score[this.state.cur_index] -= 5;

						}else{

							new_x +=1;

						}
						
					}else if(G_LEFT_WALK == action){

						new_action_dec = "G_LEFT_WALK";

						if(0 == new_y){

							this.state.action_score[this.state.cur_index] -= 5;

						}else{

							new_y -= 1;	
						}
						

					}else if(G_RIGHT_WALK == action){

						new_action_dec = "G_RIGHT_WALK";
						if(G_TABLE_COL-1 == new_y){

							this.state.action_score[this.state.cur_index] -= 5;

						}else{

							new_y += 1;	
						}

					}else if(G_WAIT_WALK == action){

						new_action_dec = "G_WAIT_WALK";

					}else if(G_COLLECT_CAN == action){

						new_action_dec = "G_COLLECT_CAN";
						if(G_CAN_Y == obj.center){

							this.state.action_score[this.state.cur_index] += 10;
							this.set_cell_status(new_x,new_y,G_CAN_N);


						}else{

							this.state.action_score[this.state.cur_index] -= 1;
						}

					}
					
					this.set_ui_status(new_x,new_y,G_ROBOT_S);
					this.state.cur_x = new_x;
					this.state.cur_y = new_y;
					this.setState({cur_action:real_value, test_value:yield_random_action()});
					
			    }.bind(this), 300);
		}



		render(){
			
			
			//let test_obj = null;
			//test_obj = init_env_params();
			//let node = count_map_num(2,2,2,2,2);
			//let value_ret = test_obj.hash_map[node+""];
			
		
			//let test_random = new_action_array(test_obj);
			//let one_value = test_obj.action_array[2][2];
			//let two_value = test_obj.test_value;

			//this.state.init_param = init_env_params();
			//new_cell_status(this.state.init_param,21);


			let items = [];
			for(let i=0; i<G_TABLE_COL; ++i){

				for(let j=0;j <G_TABLE_ROW; ++j){

				//	if(!this.flag_array_get(i,j))continue;

				//	this.flag_array_config(i,j,0);

					let status = this.get_ui_status(i,j);

					if(G_CAN_N == status){

						items.push(<td><CellNode  
										class_type="no_can"  
										x_pos={i} 
										y_pos={j}  
										onClick={(xpos,ypos) =>this.handle_click(xpos,ypos)} />
									</td>);
					
					}else if(G_ROBOT_S == status){

						items.push(<td><CellNode  
										class_type="robot"  
										x_pos={i} 
										y_pos={j}  
										onClick={(xpos,ypos) =>this.handle_click(xpos,ypos)} />
									</td>);	
					}
					else{

						items.push(<td><CellNode  
										class_type="has_can" 
										x_pos={i} 
										y_pos={j}  
										onClick={(xpos,ypos) =>this.handle_click(xpos,ypos)} />
									</td>);
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

					<b>the value is </b>

					<div>
						up:{this.state.pos.up} <br/>
						down:{this.state.pos.down} <br/>
						left:{this.state.pos.left} <br/>
						right:{this.state.pos.right} <br/>
						center:{this.state.pos.center} <br/>
					 </div>

					 <div >
						cur_x:{this.state.cur_x}<br/>
						cur_y:{this.state.cur_y}<br/>
						cur_action:{this.state.cur_action}<br/>
					 </div>

					 <div>
						test_value:{this.state.test_value}<br/>
					 </div>

				</div>
			);
		}
}



ReactDOM.render(

	<FloorDraw   />,
	document.getElementById("root")
);




