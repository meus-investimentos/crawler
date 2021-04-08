import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('crawl/:tick')
  crawl(@Param() params): string {
    this.appService.crawl(params.tick);
    return '';
  }
}
