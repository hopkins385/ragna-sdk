import type { AxiosError, AxiosRequestConfig } from "axios";
import { BaseClient } from "./baseClient";
import { configureAuthorizationHeader } from "./utils";
import { AuthRoutePath } from "./v1/routes";
import { AiChatClient } from "./v1/clients/ai-chat";
import { AccountClient, AccountStatsClient } from "./v1/clients/account";
import { AssistantClient } from "./v1/clients/assistant";
import { AuthClient } from "./v1/clients/auth";
import { AuthProviderClient } from "./v1/clients/auth";
import { AssistantTemplateClient } from "./v1/clients/assistant-template";
import { AssistantToolClient } from "./v1/clients/assistant-tool";
import { CollectionClient } from "./v1/clients/collection";
import { CollectionAbleClient } from "./v1/clients/collection-able";
import { EditorClient } from "./v1/clients/editor";
import { GoogleDriveClient } from "./v1/clients/google-drive";
import { LLMClient } from "./v1/clients/llm";
import { MediaClient } from "./v1/clients/media";
import { OnboardingClient } from "./v1/clients/onboarding";
import { PromptWizardClient } from "./v1/clients/prompt-wizard";
import { RecordClient } from "./v1/clients/record";
import { TextToImageClient } from "./v1/clients/text-to-image";
import { UserClient } from "./v1/clients/user";
import { UserFavoriteClient } from "./v1/clients/user-favorite";
import { WorkflowClient } from "./v1/clients/workflow";
import { WorkflowStepClient } from "./v1/clients/workflow-step";

type CallBack = () => any;
type AsyncCallBack = () => Promise<any>;

interface ExtendedAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: number;
}

export class RagnaClient extends BaseClient {
  public readonly auth: AuthClient;
  public readonly authProvider: AuthProviderClient;
  public readonly aiChat: AiChatClient;
  public readonly account: AccountClient;
  public readonly accountStats: AccountStatsClient;
  public readonly assistant: AssistantClient;
  public readonly assistantTemplate: AssistantTemplateClient;
  public readonly assistantTool: AssistantToolClient;
  public readonly collection: CollectionClient;
  public readonly collectionAble: CollectionAbleClient;
  public readonly editor: EditorClient;
  public readonly googleDrive: GoogleDriveClient;
  public readonly llm: LLMClient;
  public readonly media: MediaClient;
  public readonly onboarding: OnboardingClient;
  public readonly promptWizard: PromptWizardClient;
  public readonly record: RecordClient;
  public readonly textToImage: TextToImageClient;
  public readonly user: UserClient;
  public readonly userFavorite: UserFavoriteClient;
  public readonly workflow: WorkflowClient;
  public readonly workflowStep: WorkflowStepClient;

  private getAccessTokenCallback?: CallBack;
  private getRefreshTokenCallback?: CallBack;
  private setTokensCallback?: CallBack;
  private onRefreshFailedCallback?: CallBack;
  private refreshAuthCallback?: AsyncCallBack;

  private failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (error: any) => void;
  }> = [];

  private isRefreshing = false;

  constructor(options?: {
    baseURL?: string;
    timeout?: number;
    getAccessTokenCallback?: CallBack;
    getRefreshTokenCallback?: CallBack;
    refreshAuthCallback?: AsyncCallBack;
    setTokensCallback?: CallBack;
    onRefreshFailedCallback?: CallBack;
  }) {
    super(options);

    this.auth = new AuthClient(this);
    this.authProvider = new AuthProviderClient(this);
    this.aiChat = new AiChatClient(this);
    this.account = new AccountClient(this);
    this.accountStats = new AccountStatsClient(this);
    this.assistant = new AssistantClient(this);
    this.assistantTemplate = new AssistantTemplateClient(this);
    this.assistantTool = new AssistantToolClient(this);
    this.collection = new CollectionClient(this);
    this.collectionAble = new CollectionAbleClient(this);
    this.editor = new EditorClient(this);
    this.googleDrive = new GoogleDriveClient(this);
    this.llm = new LLMClient(this);
    this.media = new MediaClient(this);
    this.onboarding = new OnboardingClient(this);
    this.promptWizard = new PromptWizardClient(this);
    this.record = new RecordClient(this);
    this.textToImage = new TextToImageClient(this);
    this.user = new UserClient(this);
    this.userFavorite = new UserFavoriteClient(this);
    this.workflow = new WorkflowClient(this);
    this.workflowStep = new WorkflowStepClient(this);

    this.getAccessTokenCallback = options?.getAccessTokenCallback;
    this.setTokensCallback = options?.setTokensCallback;
    this.onRefreshFailedCallback = options?.onRefreshFailedCallback;
    this.getRefreshTokenCallback = options?.getRefreshTokenCallback;
    this.refreshAuthCallback = options?.refreshAuthCallback;

    this.setupRequestInterceptor();
    this.setupResponseInterceptor();
  }

  get getAccessToken(): string | null {
    if (!this.accessToken) {
      const accessToken = this.getAccessTokenCallback?.();
      this.accessToken = accessToken || null;
    }
    return this.accessToken || null;
  }
  get getRefreshToken(): string | null {
    if (!this.refreshToken) {
      const refreshToken = this.getRefreshTokenCallback?.();
      this.refreshToken = refreshToken || null;
    }
    return this.refreshToken;
  }

  private setupRequestInterceptor() {
    this.axiosInstance.interceptors.request.use((config) => {
      const token =
        config.url === AuthRoutePath.REFRESH
          ? this.getRefreshToken
          : this.getAccessToken;
      if (token) {
        configureAuthorizationHeader(config, token);
      }
      return config;
    });
  }

  private setupResponseInterceptor() {
    // Auto refresh token
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as ExtendedAxiosRequestConfig;

        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          this.getRefreshToken
        ) {
          // do not auto refresh token for these routes
          if (
            originalRequest.url === AuthRoutePath.REFRESH ||
            originalRequest.url === AuthRoutePath.LOGIN ||
            originalRequest.url === AuthRoutePath.CALLBACK_GOOGLE ||
            originalRequest.url === AuthRoutePath.SOCIAL_AUTH_URL ||
            originalRequest.url === AuthRoutePath.REGISTER
          ) {
            return Promise.reject(error);
          }

          console.log("Refreshing token...");
          console.log("Route", originalRequest.url);

          originalRequest._retry = 1;
          this.isRefreshing = true;

          try {
            await this.refreshAuthCallback?.();
            // improvement proposal:
            // const response = await this.auth.refreshTokens();
            // this.setTokens({ accessToken: response.accessToken, refreshToken: response.refreshToken });
            // this.setTokensCallback?.(response);
            this.processQueue(null, this.getAccessToken);
            return this.axiosInstance.request(originalRequest);
          } catch (err) {
            this.processQueue(err, null);
            return Promise.reject(err);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private processQueue(error: any, token: string | null = null) {
    this.failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });
    this.failedQueue = [];
  }
}

export default RagnaClient;
