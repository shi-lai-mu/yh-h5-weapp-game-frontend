export interface ShopMenu {
    id: number;
    name: string;
    imgName: string;
    sprite: string;
    title: string;
    content: ShopItem[];
}


export interface ShopItem {
    id: number;
    name: string;
    count: number;
    icon: string;
    desc: string;
    items_id: number;
    price: number;
    shop_menu_id: number;
    get_currency_number: number;
    bay_currency_name: string;
    get_currency_name: string;
}