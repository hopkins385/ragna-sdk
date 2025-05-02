import type { AxiosError, AxiosRequestConfig } from "axios";
import { BaseClient } from "./baseClient";
import { configureAuthorizationHeader } from "./utils";
import { AccountClient, AccountStatsClient } from "./v1/clients/account";
import { AdminClient } from "./v1/clients/admin/admin.client";
import { AiChatClient } from "./v1/clients/ai-chat";
import { AssistantClient } from "./v1/clients/assistant";
import { AssistantTemplateClient } from "./v1/clients/assistant-template";
import { AssistantToolClient } from "./v1/clients/assistant-tool";
import { AuthClient, AuthProviderClient } from "./v1/clients/auth";
import { CollectionClient } from "./v1/clients/collection";
import { CollectionAbleClient } from "./v1/clients/collection-able";
import { EditorClient } from "./v1/clients/editor";
import { GoogleDriveClient } from "./v1/clients/google-drive";
import { LLMClient } from "./v1/clients/llm";
import { MediaClient } from "./v1/clients/media";
import NerClient from "./v1/clients/ner/ner.client";
import { OnboardingClient } from "./v1/clients/onboarding";
import { PromptWizardClient } from "./v1/clients/prompt-wizard";
import { RecordClient } from "./v1/clients/record";
import { SpeechToTextClient } from "./v1/clients/speech-to-text";
import { TextToImageClient } from "./v1/clients/text-to-image";
import { UserFavoriteClient } from "./v1/clients/user-favorite";
import { WorkflowClient } from "./v1/clients/workflow";
import { WorkflowStepClient } from "./v1/clients/workflow-step";
import { AuthRoutePath } from "./v1/routes";
import { StreamUtils } from "./v1/utils/stream.utils";

type CallBack = () => unknown;
type GetTokenCallBack = () => string | null;
type AsyncCallBack = () => Promise<unknown>;

interface ExtendedAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: number;
}

export class RagnaClient extends BaseClient {
  public readonly utils: StreamUtils;
  public readonly admin: AdminClient;
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
  public readonly ner: NerClient;
  public readonly media: MediaClient;
  public readonly onboarding: OnboardingClient;
  public readonly promptWizard: PromptWizardClient;
  public readonly record: RecordClient;
  public readonly textToImage: TextToImageClient;
  public readonly userFavorite: UserFavoriteClient;
  public readonly workflow: WorkflowClient;
  public readonly workflowStep: WorkflowStepClient;
  public readonly speechToText: SpeechToTextClient;

  private getAccessTokenCallback?: GetTokenCallBack;
  private getRefreshTokenCallback?: GetTokenCallBack;
  private setTokensCallback?: CallBack;
  private onRefreshFailedCallback?: CallBack;
  private refreshAuthCallback?: AsyncCallBack;

  private failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (error: unknown) => void;
  }> = [];

  constructor(options?: {
    baseURL?: string;
    timeout?: number;
    getAccessTokenCallback?: GetTokenCallBack;
    getRefreshTokenCallback?: GetTokenCallBack;
    refreshAuthCallback?: AsyncCallBack;
    setTokensCallback?: CallBack;
    onRefreshFailedCallback?: CallBack;
  }) {
    super(options);

    this.utils = new StreamUtils();
    this.auth = new AuthClient(this);
    this.admin = new AdminClient(this);
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
    this.ner = new NerClient(this);
    this.media = new MediaClient(this);
    this.onboarding = new OnboardingClient(this);
    this.promptWizard = new PromptWizardClient(this);
    this.record = new RecordClient(this);
    this.textToImage = new TextToImageClient(this);
    this.userFavorite = new UserFavoriteClient(this);
    this.workflow = new WorkflowClient(this);
    this.workflowStep = new WorkflowStepClient(this);
    this.speechToText = new SpeechToTextClient(this);

    this.getAccessTokenCallback = options?.getAccessTokenCallback;
    this.setTokensCallback = options?.setTokensCallback;
    this.onRefreshFailedCallback = options?.onRefreshFailedCallback;
    this.getRefreshTokenCallback = options?.getRefreshTokenCallback;
    this.refreshAuthCallback = options?.refreshAuthCallback;

    this.setupRequestInterceptor();
    this.setupResponseInterceptor();
  }

  get getAccessToken(): string | null {
    if (!this.getAccessTokenCallback) {
      return null;
    }
    return this.getAccessTokenCallback();
    // return this.accessToken ?? null;
  }
  get getRefreshToken(): string | null {
    if (!this.getRefreshTokenCallback) {
      return null;
    }
    return this.getRefreshTokenCallback();
    // return localStorage.getItem("refreshToken");
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
    // Auto refresh access token
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as ExtendedAxiosRequestConfig;
        const status = error.response?.status;
        const errorData = error.response?.data as {
          message?: string;
          error_code?: string;
        };

        if (!originalRequest._retry && status === 401 && this.getRefreshToken) {
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

          console.log("Auto refreshing access token...");
          console.log("Route", originalRequest.url);

          originalRequest._retry = 1;

          try {
            await this.refreshAuthCallback?.();
            // improvement proposal:
            // const response = await this.auth.refreshTokens();
            // if (!response || !response.accessToken || !response.refreshToken) {
            //   throw new Error("Failed to refresh tokens");
            // }
            // this.setTokens({
            //   accessToken: response.accessToken,
            //   refreshToken: response.refreshToken,
            // });
            // this.setTokensCallback?.();
            this.processQueue(null, this.getAccessToken);
            return this.axiosInstance.request(originalRequest);
          } catch (err) {
            this.processQueue(err, null);
            return Promise.reject(err);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private processQueue(error: unknown, token: string | null = null) {
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
