import RagnaClient from "../../../ragnaClient";
import { HttpStatus } from "../../../utils";
import { BaseApiClient } from "../../base/base-api.client";

const ApiSpeechToTextRoute = {
  TRANSCRIBE: "/speech-to-text/transcribe", // POST
} as const;

interface TranscribeAudioResponse {
  text: string;
}

export class SpeechToTextClient extends BaseApiClient {
  constructor(private readonly client: RagnaClient) {
    super();
  }

  public async transcribeAudio(payload: FormData) {
    const route = ApiSpeechToTextRoute.TRANSCRIBE;
    const response = await this.client
      .POST<TranscribeAudioResponse, FormData>()
      .setHeaders({
        "Content-Type": "multipart/form-data",
      })
      .setRoute(route)
      .setData(payload)
      .setSignal(this.ac.signal)
      .send();

    if (response.status !== HttpStatus.CREATED) {
      throw new Error("Failed to transcribe audio");
    }

    return response.data;
  }
}
