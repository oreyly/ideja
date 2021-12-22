import {createParamDecorator, ExecutionContext, Logger} from "@nestjs/common";

export const User = createParamDecorator((data, context: ExecutionContext)=>{
    const req = context.switchToHttp().getRequest();
    //Logger.log("Cont -> " + JSON.stringify());
    Logger.log("Typ  -> " + typeof (req));
    Logger.log("DATA -> " + JSON.stringify(data));
    Logger.log("User -> " + JSON.stringify(req.user));
    Logger.log("Daus -> " + JSON.stringify(req.user[data]));
    return data ? req.user[data] : req.user;
})