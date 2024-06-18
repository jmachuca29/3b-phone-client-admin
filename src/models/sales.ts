import { SaleState } from "src/constant/sales"

type UserProps = {
    name: string
    lastName: string
    email: string
    phoneNumber: string
    department: string
    province: string
    district: string
    address: string
}

export type SaleCreateProps = {
    productName: string
    capacity: string
    accesories: string[]
    serieNumber: string
    firstImei: string
    secondImei: string
    paymentType: string
    grade: string
    user: UserProps
    price: number
    bankEntity: string
    numberAccount: string
    status: SaleState
}

export type SaleUpdateProps = {
    productId?: string
    uuid: string
    productName: string
    capacity: string
    accesories: string[]
    serieNumber: string
    firstImei: string
    secondImei: string
    paymentType: string
    grade: string
    user: UserProps
    price: number
    bankEntity: string
    numberAccount: string
    status: SaleState
}

export class SalesCreateDto {
    productName: string
    capacity: string
    accesories: string[]
    serieNumber: string
    firstImei: string
    secondImei: string
    paymentType: string
    grade: string
    user: UserProps
    price: number
    bankEntity: string
    numberAccount: string
    status: SaleState
    constructor(sale: SaleCreateProps) {
        this.productName = sale.productName || ''
        this.capacity = sale.capacity || ''
        this.accesories = sale.accesories || []
        this.serieNumber = sale.serieNumber || ''
        this.firstImei = sale.firstImei || ''
        this.secondImei = sale.secondImei || ''
        this.paymentType = sale.paymentType || ''
        this.grade = sale.grade || ''
        this.user = sale.user || null
        this.price = sale.price || 0
        this.bankEntity = sale.bankEntity || ''
        this.numberAccount = sale.numberAccount || ''
        this.status = sale.status
    }
}

export class SalesUpdateDto extends SalesCreateDto {
    uuid: string
    constructor(sale: SaleUpdateProps) {
        super(sale)
        this.uuid = sale.uuid || ''
    }
}