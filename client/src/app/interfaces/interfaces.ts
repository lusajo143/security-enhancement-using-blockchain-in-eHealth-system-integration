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
    plocation: string
    gender: string
    kinName: string
    kinPhone: string
    kinPlace: string
    phone: string
    relationship: string
}

export interface patientFull {
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
    visits: visits[]
}

export interface visits {
    doctor: string
    examination: examination[],
    prescription: prescription
}

export interface examination {
    complain: string
    historyComplain: string
    tests: test[]
    clinicalDetails: string
    labTestComment: string
}

export interface test {
    Key: string
    image: string
    feedback: string
}

export interface prescription {
    medicines: Medicine[]
    comment: string
}

export interface Medicine {
    medicine: string
    amount: string
    timeaday: string
}

