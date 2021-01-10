interface LoginRequest{
    email: string;
    password: string;
}

interface SignUpRequest{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    gender: string;
    birthdate: Date;
}
interface Adress{
    streetName: string;
    houseNumber: string;
    postCode: string;
    city: string;
}

interface Bankcard{
    iban: string;
    owner: string;
    bank: string;
}

interface Creditcard{
    creditcardOwner: string;
    creditcardnumber: string;
    dateOfExpiry: Date;
}

interface UserOrderRequest{
    adress: Adress;
    bankCard: Bankcard;
    creditCard: Creditcard;
    token: JwtToken;
}