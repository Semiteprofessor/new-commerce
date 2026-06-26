import { Module } from "@nestjs/common";
import jwtConfig from "./config/jwt.config";
import { ConfigModule } from "@nestjs/config";
import { User } from "../users/entities/user.entity";
import { BusinessProfile } from "src/modules/apps/shop/merchants/entities/business-profile.entity";

@Module({
    imports: [
        JwtModule.registerAsync(jwtConfig.asProvider()),
        ConfigModule.forFeature(jwtConfig),
        TypeOrmModule.forFeature([User, BusinessProfile])
        UserMo
    ]
})