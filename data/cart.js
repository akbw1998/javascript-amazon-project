export const cart = []

export function addToCart(productId){
    let matchingItem;
    const quantityIncrement = Number(document.querySelector(`.js-quantity-selector-${productId}`).value)
  
    cart.forEach((cartItem) => {
      if(productId === cartItem.productId){
        matchingItem = cartItem
      }
    })
  
    if(matchingItem){
      matchingItem.quantity += quantityIncrement
    }else{
      cart.push({
        productId,
        quantity: quantityIncrement
      })
    }
  
    const addedToCartTooltipElement = document.querySelector(`.js-added-to-cart-${productId}`)
    addedToCartTooltipElement.classList.add('show-added-to-cart')
    setTimeout(()=>{
      addedToCartTooltipElement.classList.remove('show-added-to-cart')
    }, 1000)
  
  }