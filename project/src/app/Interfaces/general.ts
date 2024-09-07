import e from "express"

export interface General {
}

export interface Restaurant{
    id: string | number,
    name: string,
    rating: string | number,
    street: string,
    street_number: string,
    max_chairs: string | number,
    description: string,
    banner: string

    admin: admin_obj[]
    company: company_obj
    coords: coords_obj
    img: img_obj
}
export interface Favorites{
  id: string | number,
  name: string,
  rating: string | number,
  street: string,
  street_number: string,
  max_chairs: string | number,
  description: string,
  banner: string

  admin: admin_obj[]
  company: company_obj
  coords: coords_obj
  img: img_obj
}


export interface restaurant_obj{
    
}
export interface admin_obj{
    id: string | number,
    name: string,
    surname: string,
    mail: string
}

export interface company_obj{
    id: number | string,
    name: string,
    vat: string,
    address: string,
    telephone: string
}
export interface coords_obj{
    latitude: number ,
    longitude: number,
    village: string,
    village_id: number,
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
    id: number,
    start_time: string,
    end_time: string
}

export interface List{
    key:string,
    value:string
}

export interface Customer{
    id: number | string,
    name: string,
    surname: string,
    mail: string,
}

export interface Admin{
    id: number | string,
    name: string,
    surname: string,
    mail: string,

}

export interface Reservation{
  id: number,
  date: string, 
  mail: string,
  start_time: string,
  end_time: string, 
  quantity: number, 
  customer: Customer,
  restaurant: Restaurant
  
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


export interface RestaurantReservation{
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
export interface Village{
  id: number | string, 
  name: string, 
  cadastal_code: string, 
  latitude: string, 
  longitude: string
}


/*

*/