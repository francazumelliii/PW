export interface General {
}

export interface Restaurant{
    restaurant: restaurant_obj
    admin: admin_obj
    company: company_obj
    coords: coords_obj
}


export interface restaurant_obj{
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
    latitude: number | string,
    longitude: number | string,
    village: string, 
    county: string,
    county_code: string,
    region: string
}

export interface APIResponse{
    success: boolean,
    data: any
}

