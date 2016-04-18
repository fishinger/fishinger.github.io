'use strict';
var app = angular.module('app', []);
app.controller('mainCtrl', ['cartFactories', function(cartFactories){
	this.getItems = function(){
		return cartFactories.getProducts();
	}
	this.addProduct = function(){
		cartFactories.addProduct(this.product);
		this.product.name = '';
		this.product.price = '';
		cartFactories.sale(this.sizeSale);
	}

	this.sizeSale = 7;
	cartFactories.sale(this.sizeSale);

	this.sale = function(){
		cartFactories.sale(this.sizeSale);
	}
}]);

