import { Query } from "@nestjs/graphql";
import { Resolver } from "@nestjs/graphql";


@Resolver()
export class UserResolver{
    @Query()
    users() {
        return [{ id: "id", username: "username" }];
    }
}