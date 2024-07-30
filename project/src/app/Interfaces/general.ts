import e from "express"

export interface General {
}

export interface Restaurant{
    restaurant: restaurant_obj
    admin: admin_obj
    company: company_obj
    coords: coords_obj
    img: img_obj
}


export interface restaurant_obj{
    id: string | number,
    name: string,
    rating: string | number,
    street: string,
    street_number: string,
    max_chairs: string | number,
    description: string,
    banner: string
}
export interface admin_obj{
    id: string | number,
    name: string,
    surname: string
}

export interface company_obj{
    name: string,
    vat: string,
    address: string,
    telephone: string
}
export interface coords_obj{
    latitude: number ,
    longitude: number,
    village: string,
    county: string,
    county_code: string,
    region: string
}
export interface img_obj{
    path: string
}

export interface APIResponse{
    success: boolean,
    data: any
}

export interface Marker{
    longitude: number,
    latitude: number,
    color: string,
    icon: string,
}

export interface Turn{
    turn_id: number,
    start_time: string,
    end_time: string
}

export interface List{
    key:string,
    value:string
}

export interface Customer{
    customer_id: number | string,
    name: string,
    surname: string,
    mail: string,
    list: string
}

export interface Admin{
    admin_id: number | string,
    name: string,
    surname: string,
    mail: string,
    restaurant_id: number | string,
    list: string
}

export interface Reservation{
  "user": {
    "id": number | string,
    "name": string,
    "surname": string,
    "mail": string
  },
  "reservation": {
    "id": number | string,
    "date": string,
    "quantity": number ,
    "confirmed": number,
    "mail": string,
    "start_time": string,
    "end_time": string
  },
  "restaurant": {
    "id": number | string,
    "name": string,
    "banner": string,
    "img": string,
    "street": string,
    "street_number": string,
    "village": string
  }

}

export interface Images{
    image: string,
    thumbImage: string,
    alt: string,
    title: string
}

export interface Menu{
  id: number | string,
  name: string,
  description: string,
  category: string,
  dishes: Dish[]
}
export interface Dish{
  id: number | string,
  name: string,
  description: string,
  ingredients: string,
  is_vegan: boolean,
  is_lactose_free: boolean,
  category_name: string,
  price: number
}
