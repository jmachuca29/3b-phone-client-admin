type ProductPrice = {
    grade: string;
    price: number;
  };
  
  type ProductImage = {
    name: string;
    url: string;
  };
  
  export type ProductWithImageProps = {
    description: string;
    capacity: string;
    image: ProductImage;
    prices: ProductPrice[];
  };
  
  export type ProductCreateProps = {
    description: string;
    capacity: string;
    prices: ProductPrice[];
  };
  
  export type ProductUpdateProps = {
    _id: string;
    description: string;
    capacity: string;
    image?: ProductImage;
    prices: ProductPrice[];
  };
  
  export class ProductCreateDto {
    description: string;
    capacity: string;
    prices: ProductPrice[];
  
    constructor(product: ProductCreateProps) {
      this.description = product.description || '';
      this.capacity = product.capacity || '';
      this.prices = product.prices.map((p) => ({
        ...p,
        price: Number(p.price),
      })) || [];
    }
  }
  
  export class ProductWithImageDto extends ProductCreateDto {
    image: ProductImage;
  
    constructor(product: ProductWithImageProps) {
      super(product);
      this.image = product.image;
    }
  }
  
  export class ProductUpdateDto extends ProductCreateDto {
    _id: string;
    constructor(product: ProductUpdateProps) {
      super(product);
      this._id = product._id || '';
    }
  }

  export class ProductWithImageUpdateDto extends ProductUpdateDto {
    image?: ProductImage 
    constructor(product: ProductUpdateProps) {
      super(product);
      this.image = product.image
    }
  }
  