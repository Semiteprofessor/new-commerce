import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '../../core/users/entities/user.entity';
import { Product } from '../../apps/shop/products/entities/product.entity';
import axios from 'axios';
import { BusinessProfile } from 'src/modules/apps/shop/merchants/entities/business-profile.entity';
import { ProductService } from 'src/modules/apps/shop/products/services/product.service';
import { ShippingAddress } from 'src/modules/apps/shop/order/entities/shipping-address.entity';
import { OrderItem } from 'src/modules/apps/shop/order/entities/order-item.entity';
import { Order } from 'src/modules/apps/shop/order/entities/order.entity';
import { ReturnRequest } from 'src/modules/apps/shop/order/entities/return-request.entity';

@Injectable()
export class ErpNextService {
  private readonly apiClient;

  constructor(
    private readonly configService: ConfigService,
    private readonly productService: ProductService,
  ) {
    this.apiClient = axios.create({
      baseURL: this.configService.get('ERPNEXT_BASE_URL'),
      headers: {
        'Content-Type': 'application/json',
        Token: `${this.configService.get('ERPNEXT_API_SECRET')}`,
      },
    });
    // this.setupInterceptors();
  }

  async createUser(data: User) {
    try {
      console.log(data);
      const res = await this.apiClient.post(
        'ecommerce.controllers.user_controller.add_user',
        {
          x: data.id,
          user_id: data.id,
          username: data.username,
          email: data.email,
          password_hash: data.password, // not needed
          password_salt: data.password,
        },
      );

      console.log(res.data.message.body);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
  async createMerchant(data: User, business: BusinessProfile) {
    try {
      const res = await this.apiClient.post(
        'ecommerce.controllers.merchant_controller.add_merchant',
        {
          merchant_id: data.id,
          first_name: data.firstName,
          last_name: data.lastName,
          username: data.username,
          email: data.email,
          password: data.password,
          phone: data.phone,
          role: data.role,
          business_name: business.name,
          business_type: business.businessType,
          business_category: business.businessCategory,
          business_address: data.address,
          business_location_lat: business.businessLocationLat,
          business_location_long: business.businessLocationLong,
          street: 'Spencer',
          city: 'Ikeja',
          state: 'Lagos',
          country: 'Nigeria',
        },
      );
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  /**
   * Creates product on erpNext ana
   * updates product with id & sku
   * from response
   * @param data
   */
  async createProduct(data: Product) {
    const subCategories = data.category.children?.map((sub) => sub.name) || [];

    const res = await this.apiClient.post(
      'ecommerce.controllers.product_controller.add_item',
      {
        item_code: data.id,
        product_name: data.productName,
        category: data.category.name,
        sub_category: subCategories.length > 0 ? subCategories[0] : null,
        sub_sub_category: subCategories.length > 1 ? subCategories[1] : null,
        actual_price: data.actual_price,
        discounted_price: data.discounted_price,
        discount: data.discount,
        images: data.images,
        rating: data.rating,
        brand: data.brand,
        description: data.description,
        specifications: data.specification,
        color: data.color,
        quantity: data.quantity,
        model: data.model,
        weight: data.weight,
        warranty: data.warranty,
        merchant_id: data.merchantId,
      },
    );

    if (res.data.message.status_code === 200) {
      const { sku } = res.data.message.body;
      await this.productService.updateProductAfterErpNextSubmission({
        id: data.id,
        sku,
      });

      console.log(`Product successfully updated with SKU: ${sku}`);
    } else {
      throw new Error(res.data?.message?.body);
    }
  }

  async createOrder(order: Order) {
    console.log(order);
    const orderItems = order?.items?.map((item) => ({
      item_code: item.product.erpSKUNumber,
      product_name: item.product.productName,
      price: item.price,
      quantity: item.qty,
      business_name: item.sellerBusinessName,
      image: item.image,
    }));

    const requestBody = {
      order_id: order?.id,
      email: order?.user?.email,
      user_id: order?.user.id,
      subtotal: order?.subtotal,
      shipping_address: order?.shippingAddress.id,
      post_code: order?.shippingAddress.postalCode,
      lga: order?.shippingAddress.lga,
      discount: order?.discount,
      shipping_fee: order?.shippingFee,
      grand_total: order?.grandTotal,
      payment_method: order?.paymentMethod,
      status: order?.orderStatus,
      items: orderItems,
      coupon_code: order?.coupon?.code,
    };

    console.log('Sending Order:', requestBody);

    const res = await this.apiClient.post(
      'ecommerce.controllers.order_controller.create_new_order',
      requestBody,
    );

    console.log(`Order successfully sent to ERPNext`);
    console.log(requestBody);

    console.log(res.data);

    return res.data;
  }

  catch(e) {
    console.log(e);
    throw e;
  }

  async subOrUnSubscribeToNewsletter(data) {
    try {
      const res = await this.apiClient.post(
        'ecommerce.controllers.newsletter_controller.sub_unsub_newsletter',
        {
          email: data.email,
          status: data.status,
        },
      );
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async submitReturnRequest(data: ReturnRequest) {
    try {
      console.log(data);
      //to-do: add the endpoint when available
      const res = await this.apiClient.post(
        'ecommerce.controllers.order_controller.return_request',
        {
          id: data.id,
          orderItem: data.orderItem,
          orderId: data.orderItem.order.id,
          address: data.address,
          quantity: data.quantity,
          media: data.media,
          reason: data.reason,
          code: data.code,
          comment: data.comment,
          receipt: data.receipt,
          status: data.status,
        },
      );

      console.log(res.data.message.body);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
