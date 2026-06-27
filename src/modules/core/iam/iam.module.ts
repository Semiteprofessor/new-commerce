import { Module } from "@nestjs/common";

@Module({
    imports: [
        JwtModule.registerAsync(jwtConfig)
    ]
})