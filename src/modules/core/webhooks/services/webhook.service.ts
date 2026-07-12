import { Injectable } from '@nestjs/common';
import { ProductService } from 'src/modules/apps/shop/products/services/product.service';
import { CouponService } from 'src/modules/apps/shop/products/services/coupon.service';
import { ReturnRequestService } from 'src/modules/apps/shop/order/services/return-request.service';
import { ErpEventsEnum } from 'src/modules/erpnext/enums/events.enum';
import { PaystackService } from 'src/modules/common/payments/paystack.service';
import { WalletService } from 'src/modules/apps/wallet/services/wallet.service';
import { UserService } from '../../users/services/user.service';
import { PaystackEventsEnum } from 'src/modules/apps/wallet/enums/payments.enum';

@Injectable()
export class WebhookService {
  constructor(
    private readonly paystackService: PaystackService,
    private readonly walletService: WalletService,
    private readonly productService: ProductService,
    private readonly userService: UserService,
    private readonly couponService: CouponService,
    private readonly returnRequestService: ReturnRequestService,
  ) {}

  async processErpNextWebhook(eventData) {
    const { event, data } = eventData;

    switch (event) {
      case ErpEventsEnum.PRODUCT_STATUS_UPDATED:
        await this.productService.updateProductStatus(data);
        break;
      case ErpEventsEnum.MERCHANT_DEACTIVATED:
        await this.userService.ActivateOrDeactivateMerchant(data);
        break;
      case ErpEventsEnum.COUPON_CREATED:
        await this.couponService.createCoupon(data);
        break;
      case ErpEventsEnum.COUPON_UPDATED:
        await this.couponService.updateCoupon(data);
        break;
      case ErpEventsEnum.RETURN_REQUEST_UPDATED:
        await this.returnRequestService.updateReturnRequestStatus(data);
        break;
      default:
        console.log('Event processor not available at the moment');
        break;
    }
  }

  async procesPaystackWebhook(data) {
    const {
      event,
      data: { reference },
    } = data;

    switch (event) {
      case PaystackEventsEnum.CHARGE_SUCCESS:
        // const txnStatus: Boolean = await this.paystackService.verifyTxn(
        //   'wallet-fund-f00b8e9e-d027-41f8-96c8-89fc0452cad2',
        // );
        const txnStatus: Boolean =
          await this.paystackService.verifyTxn(reference);

        if (txnStatus) {
          await this.walletService.fundWalletOrPayForOrder(reference, data);
        }
        break;
      default:
        console.log('Event processor not available at the moment');
        break;
    }
  }
}
