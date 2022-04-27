export interface simpleResponse {
    status: number
    message: string
}

export interface dataResponse {
    status: number,
    data: any
}

export interface patient {
    id: string
    dob: string
    fname: string
    mname: string
    lname: string
    gender: string
    kinName: string
    kinPhone: string
    kinPlace: string
    phone: string
    relationship: string
}