import { Controller, Get, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ChatMessage } from './utils/interface';

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
  @ApiQuery({
    name: 'pr',
    required: false
  })
  getPRs(@Query('pr') pr?: number): object {
    return this.appService.getPullRequests(this.owner, this.repo, pr);
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

  @Post('/chat-example')
  @ApiOperation({ summary: 'AI chat example' })
  chatExample(): object {
    return this.appService.chatExample();
  }

  @Get('/on-chain/contract-details')
  @ApiOperation({ summary: 'Contract details' })
  onChainTest(): object {
    return this.appService.onChainTest();
  }

  @Get('/on-chain/owner-account')
  @ApiOperation({ summary: 'Owner account details' })
  @ApiQuery({
    name: 'address',
    required: false
  })
  accountDetails(@Query('address') address?: string): object {
    return this.appService.accountDetails(address);
  }


  @Post('/on-chain/rewardContributor')
  @ApiOperation({ summary: 'Reward contributor' })
  @ApiQuery({
    name: 'address',
    required: false
  })
  rewardContributor(@Query('address') address: string, @Query('amount') amount: string): object {
    return this.appService.rewardContributor(address, amount);
  }



  @Post('/chat')
  @ApiOperation({ summary: 'Send a chat message to the agent' })
  @ApiQuery({
    name: 'message',
    required: true,
    description: 'Message content to send to the AI agent',
  })
  async chat(@Query('message') message: string): Promise<object> {
    const messages: ChatMessage[] = [
      {
        role: 'user',
        content: message,
      },
    ];

    return this.appService.sendMessageToAgent(messages);
  }
}
