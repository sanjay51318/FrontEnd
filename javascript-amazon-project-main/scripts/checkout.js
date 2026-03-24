import {cart, addToCart, removeFromCart, updateQuantity, updateDeliveryOption} from "../data/cart.js";
import { products } from "../data/products.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";
import {deliveryOptions} from "../data/deliveryOptions.js";


const today = dayjs();
export function orderSummary(){
    let fullHTML = "";
    const orderSummaryHTML = document.querySelector(".js-order-summary");

    cart.forEach((data) => {
        const productId = data.productId;
        let matchingProduct;
        products.forEach((product) => {
            if(productId === product.id){
                matchingProduct = product;

            }
        })
        if (matchingProduct){
            const deliveryOption = deliveryOptions.find(option => option.id === data.deliveryOptionId);
            const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
            const dateString = deliveryDate.format('dddd, MMMM D');
            const totalPrice = ((matchingProduct.priceCents * data.quantity)/100).toFixed(2);
            const allPrice = totalAmount();
            const shippingCost = calculateShipping();
            document.querySelector(".js-shipping-cost").innerHTML = `$${shippingCost}`;
            document.querySelector(".js-total-amount").innerHTML = `$${allPrice}`;
            const subtotal = allPrice + shippingCost;
            document.querySelector(".js-subtotal").innerHTML = `$${subtotal}`;
            document.querySelector(".js-tax").innerHTML = `$${(subtotal*0.1).toFixed(2)}`;
            document.querySelector(".js-total").innerHTML = `$${(subtotal + (subtotal*0.1)).toFixed(2)}`;

        const html = `<div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
                <div class="delivery-date">
                Delivery date: ${dateString}
                </div>

                <div class="cart-item-details-grid">
                <img class="product-image"
                    src="${matchingProduct.image}">

                <div class="cart-item-details">
                    <div class="product-name">
                    ${matchingProduct.name}
                    </div>
                    <div class="product-price">
                    $${totalPrice}
                    </div>
                    <div class="product-quantity">
                    <span>
                        Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${data.quantity}</span>
                    </span>
                    <span class="update-quantity-link link-primary js-update-link update-button" data-product-id="${matchingProduct.id}">
                        Update
                    </span>
                    <input class="quantity-input js-quantity-input-${matchingProduct.id}" type="number" value="${data.quantity}">
                    <span class="save-quantity-link link-primary" data-product-id="${matchingProduct.id}">
                        Save
                    </span>
                    <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
                        Delete
                    </span>
                    </div>
                </div>

                <div class="delivery-options">
                    <div class="delivery-options-title">
                    Choose a delivery option:
                    </div>
                    
                    ${deliveryOptionsHTML(matchingProduct, data)}
                </div>
                </div>
            </div>`
        fullHTML += html;
        }

    });
    console.log(fullHTML);

    if(orderSummaryHTML){
        orderSummaryHTML.innerHTML = fullHTML;
    }

    document.querySelectorAll(".js-delete-link").forEach((link) => {
    link.addEventListener("click", () => {
        const productId = link.dataset.productId;
        removeFromCart(productId)
        const container = document.querySelector(`.js-cart-item-container-${productId}`);
        container.remove();
        orderSummary();
        })
    });

    document.querySelectorAll(".js-update-link").forEach((link) =>{
        link.addEventListener('click', () => {
            const productId = link.dataset.productId;
            const container = document.querySelector(`.js-cart-item-container-${productId}`);
            container.classList.add("is-editing-quantity");
            
        })
    });

    document.querySelectorAll(".save-quantity-link").forEach((link) => {
        link.addEventListener('click', () => {
            const productId = link.dataset.productId;
            const container = document.querySelector(`.js-cart-item-container-${productId}`);
            container.classList.remove("is-editing-quantity");
            const quantityInput = Number(document.querySelector(`.js-quantity-input-${productId}`).value);
            updateQuantity(productId, quantityInput);
            document.querySelector(`.js-quantity-label-${productId}`).innerHTML = `${quantityInput}`;
            orderSummary();
        })
    });

    document.querySelectorAll(".js-delivery-option").forEach((option) =>{
        option.addEventListener('click', () => {
            const {productId, deliveryOptionId} = option.dataset;
            updateDeliveryOption(productId, deliveryOptionId);
            

        })
    });

    document.querySelectorAll(".js-delivery-option").forEach((option) =>{
        option.addEventListener('click', () => {
            const {productId, deliveryOptionId} = option.dataset;
            updateDeliveryOption(productId, deliveryOptionId);
            orderSummary();
        })
    });
    document.querySelectorAll(".js-delivery-option").forEach((option) =>{
        option.addEventListener('click', () => {
            const {productId, deliveryOptionId} = option.dataset;
            updateDeliveryOption(productId, deliveryOptionId);
            orderSummary();
        })
    });

};



function deliveryOptionsHTML(matchingProduct, cart){
    let html = ``;
    deliveryOptions.forEach((deliveryOption) => {
        const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
        const dateString = deliveryDate.format('dddd, MMMM D');
        const priceString = deliveryOption.priceCents === 0 ? 'FREE': `$${((deliveryOption.priceCents)/100).toFixed(2)} -`;
        const isChecked = deliveryOption.id === cart.deliveryOptionId;
           html += `<div class="delivery-option js-delivery-option"
           data-product-id="${matchingProduct.id}"
           data-delivery-option-id="${deliveryOption.id}">
                        <input type="radio" ${isChecked ? 'checked': ''}
                        class="delivery-option-input"
                        name="delivery-option-${matchingProduct.id}">
                        <div>
                            <div class="delivery-option-date">
                            ${dateString}
                            </div>
                            <div class="delivery-option-price">
                            ${priceString} Shipping
                            </div>
                        </div>
                    </div>`;
        
    });
    return html;
}


function totalAmount(){
    let FinalTotal = 0;
    cart.forEach((item) => {
        let matchingitem;
        products.forEach((product)=> {
            if(item.productId === product.id){
                matchingitem = product
            FinalTotal += item.quantity* matchingitem.priceCents;
            }
        });
        
    });
    FinalTotal = Number((FinalTotal/100).toFixed(2));
    return FinalTotal;
}

function calculateShipping() {
  let shippingCents = 0;

  cart.forEach((cartItem) => {
    const deliveryOption = deliveryOptions.find(option => option.id === cartItem.deliveryOptionId);

    if (deliveryOption) {
      shippingCents += deliveryOption.priceCents;
    }
  });

  shippingCents = Number((shippingCents / 100).toFixed(2));
  return shippingCents;
}

orderSummary();


/*
`<div class="delivery-options">
                    <div class="delivery-options-title">
                    Choose a delivery option:
                    </div>
                    <div class="delivery-option">
                    <input type="radio" checked
                        class="delivery-option-input"
                        name="delivery-option-${matchingProduct.id}">
                    <div>
                        <div class="delivery-option-date">
                        Tuesday, June 21
                        </div>
                        <div class="delivery-option-price">
                        FREE Shipping
                        </div>
                    </div>
                    </div>
                    <div class="delivery-option">
                    <input type="radio"
                        class="delivery-option-input"
                        name="delivery-option-${matchingProduct.id}">
                    <div>
                        <div class="delivery-option-date">
                        Wednesday, June 15
                        </div>
                        <div class="delivery-option-price">
                        $4.99 - Shipping
                        </div>
                    </div>
                    </div>
                    <div class="delivery-option">
                    <input type="radio"
                        class="delivery-option-input"
                        name="delivery-option-${matchingProduct.id}">
                    <div>
                        <div class="delivery-option-date">
                        Monday, June 13
                        </div>
                        <div class="delivery-option-price">
                        $9.99 - Shipping
                        </div>
                    </div>
                    </div>
                </div>`

*/