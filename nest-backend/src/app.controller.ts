import { Controller, Get, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('test')
@Controller('open-maintainer')
export class AppController {
  private readonly owner = process.env.GITHUB_REPO_OWNER_NAME!;
  private readonly repo = process.env.GITHUB_REPO_NAME!;
  constructor(private readonly appService: AppService) {}

  @Get('/')
  @ApiOperation({ summary: 'Get hello world' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/prs')
  @ApiOperation({ summary: 'Get PRs' })
  getPRs(): object {
    return this.appService.getPullRequests(this.owner, this.repo);
  }

  @Get('/pr-diff')
  @ApiOperation({ summary: 'Get PR diff' })
  getPRDiff(@Query('prNumber') prNumber: number): object {
    return this.appService.getPullRequestFiles(this.owner, this.repo, prNumber);
  }


  @Post('/pr-reward')
  @ApiOperation({ summary: 'Post PR reward' })
  rewardPR(@Query('prNumber') prNumber: number): object {
    return this.appService.rewardPR(this.owner, this.repo, prNumber);
  }


  @Post('/pr-rewarded-label')
  @ApiOperation({ summary: 'Post PR reward label' })
  addRewardedLabelToPR(@Query('prNumber') prNumber: number): object {
    return this.appService.addRewardedLabelToPR(this.owner, this.repo, prNumber);
  }
}
