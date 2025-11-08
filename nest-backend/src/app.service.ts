import { Injectable } from '@nestjs/common';
import { getPR } from './agent/github-client';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { extractPRs } from './utils/git-extractor';

@Injectable()
export class AppService {

  private readonly baseUrl = 'https://api.github.com';
  private readonly token = process.env.GITHUB_FINEGRAINED_TOKEN;

  constructor(private readonly http: HttpService) {}

  getHello(): string {
    return 'Hello World!';
  }

  getPR(): any {
    return getPR('GHkrishna', 'nullshot-openmaintainer', 1);
  }

  async get<T = any>(endpoint: string, headers: Record<string, string> = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    console.log("This is url", url)
    console.log("This is this.token", this.token)

    const response = await firstValueFrom(
      this.http.get(url, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          Connection: 'keep-alive',
          Accept: 'application/vnd.github.v3+json',
          ...headers,
        },
      }),
    );

    return extractPRs(response?.data) as any;
  }

  // Generic POST
  async post<T = any>(
    endpoint: string,
    body: any,
    headers: Record<string, string> = {},
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await firstValueFrom(
      this.http.post(url, body, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          Connection: 'keep-alive',
          Accept: 'application/vnd.github.v3+json',
          ...headers,
        },
      }),
    );

    return response.data;
  }

  // Fetch PR list for a repo
  async getPullRequests(owner: string, repo: string) {
    return this.get(`/repos/${owner}/${repo}/pulls`);
  }

  // Fetch PR diff/files
  async getPullRequestFiles(owner: string, repo: string, prNumber: number) {
    return this.get(`/repos/${owner}/${repo}/pulls/${prNumber}/files`, {
      Accept: 'application/vnd.github.v3.diff',
    });
  }
}
