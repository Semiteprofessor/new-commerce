import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Order } from '../entities/order.entity';
import { ActiveUser } from '../../../../../modules/core/iam/decorators/active-user.decorator';
import { OrdersService } from '../services/order.service';
import { ActorUser } from '../../../../../modules/common/types/user.types';
import { confirmDeliveryDto, UpdateOrderDto } from '../dto/order.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  PaginatedRecordsDto,
  QueryParamsDto,
} from '../../../../../modules/common/dtos/pagination.dto';
import { OrderItem } from '../entities/order-item.entity';
import { ReturnRequestService } from '../services/return-request.service';
import { ReturnRequest } from '../entities/return-request.entity';
import { AuthType } from '../../../../../modules/core/iam/authentication/enums/auth-type.enum';
import { Auth } from '../../../../../modules/core/iam/authentication/decorator/auth.decorator';
import { EscrowService } from '../../escrow/services/escrow.service';
import { SubmitReturnRequestDto } from '../../../../../modules/core/iam/authentication/dtos/return-request.dto';

@Auth(AuthType.Bearer)
// @Roles(UserRole.CUSTOMER)
@ApiTags('Orders')
@ApiBearerAuth()
@Controller('v1/shoppers/orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly escrowService: EscrowService,
    private readonly returnRequestService: ReturnRequestService,
  ) {}

  @Get('')
  async getOrders(
    @ActiveUser() actor: ActorUser,
    @Query() query: QueryParamsDto,
  ): Promise<PaginatedRecordsDto<Order>> {
    return this.ordersService.getAllOrdersByUser(actor.id, query);
  }

  @Auth(AuthType.None)
  @Post('demo')
  async demoOrder(@Body() data: any) {
    return await this.ordersService.sendSlackEvents(data.id);
  }
  @Get(':id')
  async getSingleOrder(
    @ActiveUser() actor: ActorUser,
    @Param('id') orderId: string,
  ): Promise<Order> {
    return this.ordersService.getSingleOrder(actor.id, orderId);
  }

  @Auth(AuthType.None)
  @Post('demo-trigger-escrow')
  async demoOrderToEscrow(@Body() data: any) {
    return await this.escrowService.processEscrowReleases();
  }

  @Patch('update/:orderId')
  async updateOrder(
    @Param('orderId') orderId: string,
    @ActiveUser() actor: ActorUser,
    @Body() updateDto: UpdateOrderDto,
  ): Promise<Order> {
    return this.ordersService.updateOrder(orderId, updateDto, actor.id);
  }

  @Get('item/:imeiNumber')
  async getOrderItemByImeiNumber(
    @ActiveUser() actor: ActorUser,
    @Param('imeiNumber') imeiNumber: string,
  ): Promise<OrderItem> {
    return this.ordersService.getOrderItemByImei(imeiNumber);
  }

  @Patch('confirm-delivery/:orderItemId')
  async confirmDelivery(
    @Param('orderItemId') orderItemId: string,
    @ActiveUser() actor: ActorUser,
    @Body() dto: confirmDeliveryDto,
  ): Promise<OrderItem> {
    return this.ordersService.confirmDelivery(orderItemId, dto, actor.id);
  }

  @Post('return-request/submit')
  async submitReturnRequest(
    @ActiveUser() actor: ActorUser,
    @Body() dto: SubmitReturnRequestDto,
  ): Promise<ReturnRequest> {
    return this.returnRequestService.submitReturnRequest(dto, actor);
  }

  @Get('return-request/:id')
  async getReturnRequest(
    @ActiveUser() actor: ActorUser,
    @Param('id') id: string,
  ) {
    return this.returnRequestService.getReturnRequest(id);
  }

  // @Patch('return-request/:id')
  // async updateReturnRequestStatus(@ActiveUser() actor: ActorUser, @Param('id') id: string, @Body() status: ReturnRequestStatus) {
  //   return this.returnRequestService.updateReturnRequestStatus(id, status);
  //}
}
