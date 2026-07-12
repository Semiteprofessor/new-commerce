import { Module } from '@nestjs/common';
import { ProductModule } from './products/product.module';
import { BannersModule } from './banners/banners.module';
import { OrderModule } from './order/order.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { BrandsModule } from '../brands/brand.module';
import { MerchantsModule } from './merchants/merchants.module';
import { CartModule } from './cart/cart.module';
import { ShoppersModule } from './shoppers/shopper.module';
import { WarrantyModule } from './warranty/warranty.module';
import { WaitlistModule } from './waitlist/waitlist.module';
import { EscrowModule } from './escrow/escrow.module';


@Module({
  imports: [
    MerchantsModule,
    ShoppersModule,
    CartModule,
    ProductModule,
    BannersModule,
    OrderModule,
    WishlistModule,
    BrandsModule,
    WarrantyModule,
    EscrowModule,
    WaitlistModule,
  ],
})
export class ShopModule {}
