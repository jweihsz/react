import React, {Component} from     "react";
import List from "components/list";
import items from "./items";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import  "./Cart.css";


export default   class Cart extends  Component{

	constructor(props){

		super(props);
		this.state = {

			items:items,
			qtyTotal:0,
			priceTotal:0,
			subTotal:0,
			tax:0.10,
			grandTotal:0
		};
	}

	handleSubTotal = (itemTotal=0) =>{

		_.each(this.state.items,function(item){

			itemTotal +=  item.price * item.quantity;
		});
	}

	componentDidMount(){

		this.handleSubTotal();

	}

	changeQty(itemId,qty){

		let item = _.find(this.state.items,item=>item.id===itemId);
		item.quantity = qty;
		this.setState({qtyTotal:this.state.qtyTotal + item.quantity});
		this.setState({priceTotal:this.state.priceTotal + item.price});
		this.handleSubTotal();

	}

	removeItem(itemID){

		let items = _.without(this.state.items,_.findWhere(this.state.items,{id:itemId}));
		this.setState({items:items});
		this.handleSubTotal();
	}

	handleGrandTotal(subTotal){

		


	}





}

