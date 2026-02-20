const nl = {
    itemAddedToCart: "<strong>{variant}</strong> toegevoegd aan winkelwagen",
    orderNow: "Bestellen",
    shoppingCart: "Winkelwagen",
    orderSummary: "Overzicht",
    subtotal: "Subtotaal",
    shipping: "Verzending",
    total: "Totaal",
    continueShopping: "Verder winkelen",
    viewCart: "Bekijk winkelwagen",
    checkout: "Verder naar bestellen",
    remove: "Verwijderen",
    close: "Sluiten",
    couponCode: "Kortingscode",
    apply: "Toepassen",
    invalidCouponCode: "Ongeldige kortingscode",
    more: "Meer",
    cartEmpty: "Je winkelwagen is leeg",
}

const en: typeof nl = {
    itemAddedToCart: "{variant} added to cart",
    orderNow: "Order now",
    shoppingCart: "Shopping Cart",
    orderSummary: "Order summary",
    subtotal: "Subtotal",
    shipping: "Shipping",
    total: "Total",
    continueShopping: "Continue Shopping",
    viewCart: "View Cart",
    checkout: "Checkout",
    remove: "Remove",
    close: "Close",
    couponCode: "Coupon code",
    apply: "Apply",
    invalidCouponCode: "Invalid coupon code",
    more: "More",
    cartEmpty: "Your cart is empty",
}

export const translations = {nl, en};

export type Messages = typeof nl;
