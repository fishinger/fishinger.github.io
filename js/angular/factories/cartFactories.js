angular.module('app')
.factory('cartFactories', function(){
	var service = {},
		products = [
			{
				id: 1,
				name: 'Телефон',
				price: 100,
				sale: 100
			},
			{
				id: 2,
				name: 'Магнитофон',
				price: 200,
				sale: 200
			},
			{
				id: 3,
				name: 'Миелофон',
				price: 400,
				sale: 400
			}
		]
	service.getProducts = function(){
		return products;
	}
	service.addProduct = function(product){
		products.push({
			id: _.uniqueId(),
			name: product.name,
			price: product.price,
			sale: product.price
		})
	}
	service.productDelete = function(product){
		_.pull(products, product)
	}
	service.sale = function(sale){
		if(products.length){
			var summPrice = 0,
				saleMas = [],
				koef = 0,
				summSale = 0;
			products.map(function(e){
				summPrice += +e.price;
			})
			koef = sale / summPrice;
			products.map(function(e){
				var localSale = Math.round(koef*e.price);
				saleMas.push(localSale);
				e.sale = e.price - localSale;
			})
			saleMas.map(function(e){
				summSale += e;
			})
			if(summSale > sale){
				var maxSale = Math.max.apply(0,saleMas);
				var index = saleMas.indexOf(maxSale);
				saleMas.splice(index, 1, maxSale-1);
				for(var i = 0; i < products.length; i++){
					products[i].sale = products[i].price - saleMas[i];
				}
			} else if(summSale < sale){
				var maxPrice = 0,
					maxIndex = 0;
				for(var i = 0; i < products.length; i++){
					if(products[i].price > maxPrice){
						maxIndex = i;
					}
				}
				products[maxIndex].sale -= 1;
			}
		}
	}
	return service;
})