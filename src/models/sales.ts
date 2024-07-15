import { SaleState } from "src/constant/sales";

type UserProps = {
  name: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  department: string;
  province: string;
  district: string;
  address: string;
};

export type SaleCreateProps = {
  productName: string;
  capacity: string;
  originalBox: boolean;
  serieNumber: string;
  firstImei: string;
  secondImei: string;
  paymentType: string;
  grade: string;
  user: UserProps;
  price: number;
  bankEntity: string;
  numberAccount: string;
  status: SaleState;
  documentType: string
  documentNumber: string
};

export type SaleUpdateProps = {
  productId?: string;
  uuid: string;
  productName: string;
  capacity: string;
  originalBox: boolean;
  serieNumber: string;
  firstImei: string;
  secondImei: string;
  paymentType: string;
  grade: string;
  user: UserProps;
  price: number;
  bankEntity: string;
  numberAccount: string;
  status: SaleState;
  documentType: string
  documentNumber: string
};

export type SaleProps = {
  _id: string;
  productId?: string;
  uuid: string;
  productName: string;
  capacity: string;
  originalBox: boolean;
  serieNumber: string;
  firstImei: string;
  secondImei: string;
  paymentType: string;
  grade: string;
  user: UserProps;
  price: number;
  bankEntity: string;
  numberAccount: string;
  status: SaleState;
  correlative: number;
  createdAt: Date;
  documentType: string
  documentNumber: string
};

export class SalesCreateDto {
  productName: string;
  capacity: string;
  originalBox: boolean;
  serieNumber: string;
  firstImei: string;
  secondImei: string;
  paymentType: string;
  grade: string;
  user: UserProps;
  price: number;
  bankEntity: string;
  numberAccount: string;
  status: SaleState;
  documentType: string;
  documentNumber: string;
  constructor(sale: SaleCreateProps) {
    this.productName = sale.productName || "";
    this.capacity = sale.capacity || "";
    this.originalBox = sale.originalBox || false;
    this.serieNumber = sale.serieNumber || "";
    this.firstImei = sale.firstImei || "";
    this.secondImei = sale.secondImei || "";
    this.paymentType = sale.paymentType || "";
    this.grade = sale.grade || "";
    this.user = sale.user || null;
    this.price = sale.price || 0;
    this.bankEntity = sale.bankEntity || "";
    this.numberAccount = sale.numberAccount || "";
    this.status = sale.status;
    this.documentType = sale.documentType || "";
    this.documentNumber = sale.documentNumber || "";
  }
}

export class SalesUpdateDto extends SalesCreateDto {
  uuid: string;
  constructor(sale: SaleUpdateProps) {
    super(sale);
    this.uuid = sale.uuid || "";
  }
}

export class SalesDto extends SalesCreateDto {
  _id: string;
  uuid: string;
  correlative: number;
  createdAt: Date;
  capacity: any;
  constructor(sale: SaleProps) {
    super(sale);
    this.correlative = sale.correlative || 0;
    this.uuid = sale.uuid || "";
    this.createdAt = sale.createdAt;
    this.capacity = sale.capacity || "";
    this._id = sale._id;
  }
}
