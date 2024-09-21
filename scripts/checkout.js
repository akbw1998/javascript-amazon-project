import { cart, removeFromCart ,getTotalCartQuantity, updateCartQuantity, updateDeliveryOption} from "../data/cart.js";
import { products } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js'
import { deliveryOptions } from "../data/deliveryOptions.js"; 


function deliveryOptionsHTML(matchingItem, cartItem){
  let html = ''
  deliveryOptions.forEach((deliveryOption)=>{
    const today = dayjs()
    const deliveryDate = today.add(
      deliveryOption.deliveryDays,
      'days'
    )
    const dateString = deliveryDate.format(
      'dddd, MMMM D'
    )

    const priceString = deliveryOption.priceCents 
    === 0 
      ? 'FREE' 
      : `$${formatCurrency(deliveryOption.priceCents)} -`
    
    const isChecked = cartItem.deliveryOptionId === deliveryOption.id
    console.log(isChecked)
    html += `
    <div class="delivery-option js-delivery-option"
      data-product-id="${matchingItem.id}" data-delivery-option-id="${deliveryOption.id}">
      <input type="radio" 
        ${isChecked ? 'checked' : ''}
        class="delivery-option-input"
        name="delivery-option-${matchingItem.id}">
      <div>
        <div class="delivery-option-date">
            ${dateString}
        </div>
        <div class="delivery-option-price">
            ${priceString} Shipping
        </div>
      </div>
    </div>`
  })
  return html
}

function updateCheckoutQuantity(){
  document.querySelector('.js-checkout-header-middle-section .js-return-to-home-link')
      .innerText = `${getTotalCartQuantity()}`
}

function isValidUpdateQuantity(updateQty){
  return updateQty >= 0 && updateQty < 1000
}

function renderOrderSummary(){
    updateCheckoutQuantity()
    let cartSummaryHTML = ''
    cart.forEach((cartItem) => {
        const {productId} = cartItem
        let matchingItem;
        products.forEach((product) =>{
            if(product.id === productId){
                matchingItem = product
            }
        })

        const deliveryOptionId = cartItem.deliveryOptionId

        let deliveryOption;

        deliveryOptions.forEach((option) => {
          if(option.id === deliveryOptionId){
            deliveryOption = option
          }
        })

        const today = dayjs()
        const deliveryDate = today.add(
          deliveryOption.deliveryDays,
          'days'
        )
        const dateString = deliveryDate.format(
          'dddd, MMMM D'
        )
        
        cartSummaryHTML += `<div class="cart-item-container js-cart-item-container-${matchingItem.id}">
                <div class="delivery-date">
                  Delivery date: ${dateString}
                </div>
    
                <div class="cart-item-details-grid">
                  <img class="product-image"
                    src=${matchingItem.image}>
    
                  <div class="cart-item-details">
                    <div class="product-name">
                      ${matchingItem.name}
                    </div>
                    <div class="product-price">
                      $${formatCurrency(matchingItem.priceCents)}
                    </div>
                    <div class="product-quantity">
                      <span>
                        Quantity: <span class="quantity-label js-quantity-label-${matchingItem.id}">${cartItem.quantity}</span>
                      </span>
                      <span class="update-quantity-link js-update-quantity-link link-primary"
                      data-product-id="${matchingItem.id}">
                        Update
                      </span>
                      <input type='number' class='quantity-input js-quantity-input-${matchingItem.id}'>
                      <span class='save-quantity-link js-save-quantity-link link-primary'
                      data-product-id="${matchingItem.id}">
                        Save
                      </span>
                      <span class="delete-quantity-link js-delete-quantity-link link-primary"
                      data-product-id="${matchingItem.id}">
                        Delete
                      </span>
                    </div>
                  </div>
    
                  <div class="delivery-options">
                    <div class="delivery-options-title">
                      Choose a delivery option:
                    </div>
                    ${deliveryOptionsHTML(matchingItem, cartItem)}
                  </div>
                </div>
              </div>`
    })
    document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML

    document.querySelectorAll('.js-delete-quantity-link')
    .forEach((deleteLink)=>{
        deleteLink.addEventListener('click', ()=>{
            const {productId} = deleteLink.dataset
            removeFromCart(productId)
            document.querySelector(`.js-cart-item-container-${productId}`).remove()
            updateCheckoutQuantity()
        })
    })

    document.querySelectorAll('.js-update-quantity-link')
        .forEach(updateLink => {
            updateLink.addEventListener('click', () => {
                const {productId} = updateLink.dataset
                const cartItemContainerElement = document.querySelector(`.js-cart-item-container-${productId}`)
                cartItemContainerElement.classList.add('is-editing-quantity')
            })
        })


    document.querySelectorAll('.js-save-quantity-link')
        .forEach(saveLink => {
            saveLink.addEventListener('click', () => {
                const {productId} = saveLink.dataset
                const updateQuantityInputElement = document.querySelector(`.js-quantity-input-${productId}`)
                const updatedQuantity = Number(updateQuantityInputElement.value)
                if(!isValidUpdateQuantity(updatedQuantity))
                    return
                if(updatedQuantity === 0){ // same as deleting item
                    removeFromCart(productId)
                    document.querySelector(`.js-cart-item-container-${productId}`).remove()
                    updateCheckoutQuantity()
                    return
                }
                document.querySelector(`.js-quantity-label-${productId}`).innerText = updatedQuantity

                updateCartQuantity(productId, updatedQuantity)
                updateCheckoutQuantity()

                const cartItemContainerElement = document.querySelector(`.js-cart-item-container-${productId}`)
                cartItemContainerElement.classList.remove('is-editing-quantity')
            })
      })

      document.querySelectorAll('.js-delivery-option')
          .forEach((deliveryOption) => {
            deliveryOption.addEventListener('click', () =>{
              const {productId, deliveryOptionId} = deliveryOption.dataset
              updateDeliveryOption(productId, deliveryOptionId)
              renderOrderSummary()
            })
          })
}

renderOrderSummary()
