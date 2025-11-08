import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('test')
@Controller('open-maintainer')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  @ApiOperation({ summary: 'Get hello world' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/prs')
  @ApiOperation({ summary: 'Get PRs' })
  getPRs(): object {
    return this.appService.getPullRequests(process.env.GITHUB_REPO_OWNER_NAME!, process.env.GITHUB_REPO_NAME!);
  }
}
