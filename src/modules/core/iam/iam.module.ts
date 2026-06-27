import { Module } from "@nestjs/common";
import jwtConfig from "./config/jwt.config";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [
        JwtModule.registerAsync(jwtConfig.asProvider()),
        ConfigModule.forFeature(jwtConfig),
        TypeOrmModule.forFeature([])
    ]
})