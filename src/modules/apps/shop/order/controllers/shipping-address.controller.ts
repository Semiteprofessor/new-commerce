import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
} from '@nestjs/common';
import { ShippingAddressService } from '../services/shipping-address.service';
import {
  CalculateShippingFeeDto,
  CreateShippingAddressDto,
  UpdateShippingAddressDto,
} from '../dto/shipping-address.dto';
import { ShippingAddress } from '../entities/shipping-address.entity';
import { ActiveUser } from '../../../../../modules/core/iam/decorators/active-user.decorator';
import { UserRole } from '../../../../../modules/common/enums/role.enum';
import { Roles } from '../../../../../modules/core/iam/authorization/decorators/role.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ActorUser } from '../../../../../modules/common/types/user.types';

@Roles(UserRole.CUSTOMER)
@ApiTags('Shipping Addresses')
@ApiBearerAuth()
@Controller('v1/shoppers/shipping-addresses')
export class ShippingAddressController {
  constructor(
    private readonly shippingAddressService: ShippingAddressService,
  ) {}

  @Get('')
  async getAllShippingAddresses(
    @ActiveUser() actor: ActorUser,
  ): Promise<ShippingAddress[]> {
    return this.shippingAddressService.getAllShippingAddresses(actor.id);
  }

  @Post('/fee/calculate')
  async calcualateShippingFee(
    @ActiveUser() actor: ActorUser,
    @Body() dto: CalculateShippingFeeDto,
  ) {
    return this.shippingAddressService.calculateShippingFee(actor, dto);
  }

  @Get(':id')
  async getShippingAddress(
    @ActiveUser() actor: ActorUser,
    @Param('id') id: string,
  ): Promise<ShippingAddress> {
    return this.shippingAddressService.getShippingAddress(actor.id, id);
  }

  @Post('')
  async createShippingAddress(
    @ActiveUser() actor: ActorUser,
    @Body() createDto: CreateShippingAddressDto,
  ): Promise<ShippingAddress> {
    return this.shippingAddressService.createShippingAddress(
      actor.id,
      createDto,
    );
  }

  @Patch(':id')
  async updateShippingAddress(
    @ActiveUser() actor: ActorUser,
    @Param('id') id: string,
    @Body() updateDto: UpdateShippingAddressDto,
  ): Promise<ShippingAddress> {
    return this.shippingAddressService.updateShippingAddress(
      actor.id,
      id,
      updateDto,
    );
  }

  @Delete(':id')
  async deleteShippingAddress(
    @ActiveUser() actor: ActorUser,
    @Param('id') id: string,
  ): Promise<void> {
    return this.shippingAddressService.deleteShippingAddress(actor.id, id);
  }
}
