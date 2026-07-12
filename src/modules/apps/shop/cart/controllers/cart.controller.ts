import {
  Body,
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CartService } from '../services/cart.service';
import { ActiveUser } from '../../../../../modules/core/iam/decorators/active-user.decorator';
import { ActorUser } from '../../../../../modules/common/types/user.types';
import {
  AddToCartDto,
  RemoveFromCartDto,
  CheckoutDto,
  UpdateCartItemDto,
  ApplyCouponDto,
  BuyNowDto,
} from '../dto/cart';

@ApiTags('Cart')
@ApiBearerAuth()
@Controller('v1/cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Get()
  getCart(@ActiveUser() user: ActorUser) {
    return this.cartService.getCart(user);
  }

  @Post('add')
  async addToCart(
    @Body() addToCartDto: AddToCartDto,
    @ActiveUser() actor: ActorUser,
  ) {
    return this.cartService.addCartItem(
      addToCartDto.productId,
      addToCartDto.qty,
      addToCartDto.price,
      addToCartDto.discountedPrice,
      actor,
    );
  }

  @ApiOperation({ summary: 'Remove a product from the cart' })
  @Delete('remove/:productId')
  async removeFromCart(
    @Param() { productId }: RemoveFromCartDto,
    @ActiveUser() actor: ActorUser,
  ) {
    return this.cartService.removeFromCart(productId, actor);
  }

  @Post('checkout')
  async checkout(
    @Body() checkoutDto: CheckoutDto,
    @ActiveUser() actor: ActorUser,
  ) {
    return this.cartService.checkout(
      actor,
      checkoutDto.shippingAddressId,
      checkoutDto.paymentMethod,
    );
  }

  @Post('apply-coupon')
  async applyCoupon(
    @Body() checkoutDto: ApplyCouponDto,
    @ActiveUser() actor: ActorUser,
  ) {
    return this.cartService.applyCouponCode(checkoutDto.couponCode, actor);
  }

  @Put('update-item')
  async updateCartItem(
    @Body() updateCartItemDto: UpdateCartItemDto,
    @ActiveUser() actorUser: ActorUser,
  ) {
    return this.cartService.updateCartItem(
      updateCartItemDto.productId,
      updateCartItemDto.quantity,
      actorUser,
    );
  }
}
