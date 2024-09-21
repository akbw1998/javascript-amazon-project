export let cart = JSON.parse(localStorage.getItem('cart')) || [
    {
        productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
        quantity: 2,
        deliveryOptionId: '1'
    },{
        productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
        quantity: 1,
        deliveryOptionId: '2'
    }
]


export function saveCartToLocalStorage(){
    localStorage.setItem('cart', JSON.stringify(cart))
}
export function removeFromCart(productId){
    cart = cart.filter((cartItem) => {
        return cartItem.productId !== productId
    })
    saveCartToLocalStorage()
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
        quantity: quantityIncrement,
        deliveryOptionId: '1'
      })
    }
  
    const addedToCartTooltipElement = document.querySelector(`.js-added-to-cart-${productId}`)
    addedToCartTooltipElement.classList.add('show-added-to-cart')
    setTimeout(()=>{
      addedToCartTooltipElement.classList.remove('show-added-to-cart')
    }, 1000)
    
    saveCartToLocalStorage()
  }


export function getTotalCartQuantity(){
    let cartQuantity = 0;
  
    cart.forEach((item)=>{
      cartQuantity += item.quantity
    })
  
    return cartQuantity
  }

export function updateCartQuantity(productId, updatedQuantity){
    for(let i = 0; i < cart.length; i++){
        if(cart[i].productId === productId){
            cart[i].quantity = updatedQuantity
            saveCartToLocalStorage()
            break;
        }
    }
}