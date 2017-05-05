

import React from 'react';
import ReactDOM from 'react-dom';
import {Component}  from  "react";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';



const  TABLE_ROW=10;
const  TABLE_COL=10;


class  FloorNode extends Component{



	render(){
		let textColor = "#CC0000";
		let items = [];
		for(let i=0;i<10; ++i){

			items.push(

				<td>
					<button  type="button" className="btn btn-default btn-lg">
						<span className="glyphicon glyphicon-star-empty" style={{color: textColor}}></span>
					</button>
				</td>

			);

		}
		return(<tr>{items}</tr>);	
	}
}


class  FloorDraw  extends Component{

		
		render(){
			
			let items = [];

			for(let i=0;i<10;++i){
				items.push(<FloorNode />);
			}
				
			return(

				<div className="panel panel-default">
					<div className="panel-heading">pandel test</div>
					<div className="panel-body"> 
						<p>just a test</p>
					</div>

					{items}

				</div>
			);
		}
}



ReactDOM.render(

	<FloorDraw   />,
	document.getElementById("root")
);




