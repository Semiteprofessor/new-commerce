import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ProductService } from '../../products/services/product.service';
import { Roles } from '../../../../core/iam/authorization/decorators/role.decorator';
import { UserRole } from '../../../../common/enums/role.enum';
import { ActiveUser } from '../../../../core/iam/decorators/active-user.decorator';
import { CreateProductDto } from '../../products/dto/product.dto';
import { Product } from '../../products/entities/product.entity';
import {
  PaginatedRecordsDto,
  QueryParamsDto,
} from '../../../../common/dtos/pagination.dto';
import { ActorUser } from '../../../../common/types/user.types';
import { Order } from '../../order/entities/order.entity';
import id from 'date-fns/locale/id';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OrderItem } from '../../order/entities/order-item.entity';
import { UpdateImeiDto } from '../../order/dto/order.dto';
import { OrdersService } from '../../order/services/order.service';

@ApiTags('Merchant Orders')
@Roles(UserRole.MERCHANT)
@ApiBearerAuth()
@Controller('v1/merchants/orders')
export class MerchantOrdersController {
  constructor(private readonly orderService: OrdersService) {}

  @Get('')
  async getAllOrders(
    @ActiveUser() actor: ActorUser,
    @Query() query: QueryParamsDto,
  ): Promise<PaginatedRecordsDto<OrderItem>> {
    return await this.orderService.getAllOrdersForMerchant(actor.id, query);
  }

  @Patch('/items/:orderItemId/add-imei')
  async addImeiNumber(
    @Param('orderItemId') orderItemId: string,
    @ActiveUser() actor: ActorUser,
    @Body() dto: UpdateImeiDto,
  ): Promise<OrderItem> {
    return this.orderService.addImeiNumber(orderItemId, dto, actor.id);
  }

  @Get(':id')
  async getOrderDetails(
    @ActiveUser() actor: ActorUser,
    @Param('id') id: string,
  ): Promise<Order | undefined> {
    return await this.orderService.getSingleOrderForMerchant(actor.id, id);
  }
}
