import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "src/user/user.entity";
import { MatchEntity } from "./match.entity";
import { MatchService } from "./match.service";
import { MatchController } from "./match.controller"
import { UserService } from "src/user/user.service";

@Module({
	imports: [
		TypeOrmModule.forFeature([MatchEntity, UserEntity])
	],

	providers: [MatchService, UserService],

	controllers: [MatchController],
})

export class MatchModule {}