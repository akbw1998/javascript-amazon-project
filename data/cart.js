export let cart = [
    {
        productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
        quantity: 1
    },
    {
        productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
        quantity: 2
    },
]

export function removeFromCart(productId){
    cart = cart.filter((cartItem) => {
        return cartItem.productId !== productId
    })
}

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