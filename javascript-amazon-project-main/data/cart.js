export let cart = JSON.parse(localStorage.getItem('cart')) || [];
updateCart();

function saveToStorage(){
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(button){
  let productId = button.dataset.productId;
  let matchingItem = cart.find(item => item.productId === productId);
  const quantitySelect = Number(document.querySelector(`.quantity-select-${productId}`).value);
  if (matchingItem){
    matchingItem.quantity +=quantitySelect;
  }else{
    cart.push({
      productId: productId,
      quantity : quantitySelect,
      deliveryOptionId: '1'
    });
  }
 
  saveToStorage();
  updateCart();
}

export function removeFromCart(productId){
 const itemIndex = cart.findIndex(item => item.productId === productId);
  if (itemIndex !== -1) {
    cart.splice(itemIndex, 1);
  }

  saveToStorage();
  updateCart();

}

export function updateCart(){
  let quantity = 0;
  cart.forEach(item => quantity+=item.quantity)
  const cartQuantityElement = document.querySelector(".cart-quantity-new");
  const cartQuantityElement2 = document.querySelector(".js-cart-quantity");
  if (cartQuantityElement2) {
    cartQuantityElement2.innerHTML = `${quantity} items`;
  }
  if (cartQuantityElement) {
    cartQuantityElement.innerHTML = quantity;
  }
}

export function updateQuantity(id, quantity){
  cart.forEach((item) =>{
    if (item.productId === id){
      item.quantity = quantity;
    }
    
  });
  saveToStorage();
  updateCart();
}
/*
export function getMoneyEach(productId, cart, products) {
  const matchingProduct = products.find(product => product.id === productId);
  const cartItem = cart.find(item => item.productId === productId);

  if (!matchingProduct || !cartItem) {
      console.error("Product or Cart Item not found for ID:", productId);
      return;
  }

  const totalPrice = ((matchingProduct.priceCents * cartItem.quantity)/100).toFixed(2);
  const priceElement = document.querySelector(`.js-product-price-${productId}`);
  
  if (priceElement) {
      priceElement.innerHTML = `$${totalPrice}`;
  }
}
  */

export function updateDeliveryOption(productId, deliveryOptionId){
  let matchingItem;
  cart.forEach((item) => {
    if (item.productId === productId){
      matchingItem = item;

    }
  });
  if (matchingItem){
    matchingItem.deliveryOptionId = deliveryOptionId;
    saveToStorage();
  }
}
