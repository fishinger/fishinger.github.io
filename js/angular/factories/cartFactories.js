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
				koef = 0,
				summSale = 0;
			products.map(function(e){
				summPrice += +e.price;
			})

			koef = sale / summPrice;
			
			products.map(function(e){
				var localSale = Math.floor(koef*e.price),
					priceSale = e.price - localSale;
				if(priceSale < 0){
					priceSale = 0;
				}
				e.sale = priceSale;
			})
			products.map(function(e){
				summSale += (e.price - e.sale);
			})
			
			if(summSale < sale){
				var maxPrice = products[0].price,
					maxIndex = 0,
					differ = sale - summSale,
					differSale = 0;
				while(differ >= 0){
					products.forEach(function(e, i, mass){
						if(e.sale > 0 && e.price >= maxPrice){
							maxPrice = e.price;
							maxIndex = i;
						}
					})
					differSale = products[maxIndex].sale - differ;
					if(differSale < 0){
						products[maxIndex].sale = 0;
						differ -= Math.abs(differSale);
					} else {
						products[maxIndex].sale = differSale;
						differ = -1;
					}
				}
			}
		}
	}
	return service;
})