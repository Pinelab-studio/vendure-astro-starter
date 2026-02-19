const nl = {
    itemAddedToCart: "<strong>{variant}</strong> toegevoegd aan winkelwagen",
    orderNow: "Bestellen",
    shoppingCart: "Winkelwagen",
    subtotal: "Subtotaal",
    shipping: "Verzending",
    total: "Totaal",
    continueShopping: "Verder winkelen",
    viewCart: "Bekijk winkelwagen",
    close: "Sluiten"
}

const en: typeof nl = {
    itemAddedToCart: "{variant} added to cart",
    orderNow: "Order now",
    shoppingCart: "Shopping Cart",
    subtotal: "Subtotal",
    shipping: "Shipping",
    total: "Total",
    continueShopping: "Continue Shopping",
    viewCart: "View Cart",
    close: "Close"
}

export const translations = {nl, en};

export type Messages = typeof nl;
