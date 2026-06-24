import { Processor, WorkerHost } from "@nestjs/bullmq";
import { EventEmitter2 } from "@nestjs/event-emitter";

@Processor('Rancho Users')
export class UsersSyncProcessor extends WorkerHost {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly erpNextService: ErpNextServie,
  ) {}
}