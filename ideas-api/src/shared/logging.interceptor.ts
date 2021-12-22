import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { Observable, tap } from "rxjs";

@Injectable()
export class LoggingInterceptor implements NestInterceptor{
    intercept(
        context: ExecutionContext,
        call$: CallHandler<any>
    ):Observable<any>{
        const req = context.switchToHttp().getRequest();
        const method = req.method;
        const url = req.url;
        const now = Date.now();

        return call$.handle().pipe(
            tap(()=>Logger.log(
                `${method} ${url} ${Date.now()-now}ns`,
                context.getClass().name
                )
            )
        );
    }
}