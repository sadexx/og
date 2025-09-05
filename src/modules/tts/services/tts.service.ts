import { google } from "@google-cloud/text-to-speech/build/protos/protos";
import ISynthesizeSpeechRequest = google.cloud.texttospeech.v1.ISynthesizeSpeechRequest;
import { HttpException } from "../../../common/exceptions/http.exception";
import { Readable } from "stream";
import { EHttpResponseCode } from "../../../common/enums";
import { TtsInstance } from "../common/instances";

export class TtsService {
  protected tts = TtsInstance.init().tts();

  private text: string;

  public async setText(text: string): Promise<void> {
    this.text = text;
  }

  public async synthesize(): Promise<Readable> {
    try {
      const config: ISynthesizeSpeechRequest = {
        input: { text: this.text || "1" },
        voice: {
          languageCode: "en-US",
          ssmlGender: "FEMALE",
          name: "en-US-Wavenet-F"
        },
        audioConfig: { audioEncoding: "MP3" }
      };

      const [response] = await this.tts.synthesizeSpeech(config);

      return Readable.from([response.audioContent]);
    } catch (e) {
      throw new HttpException(EHttpResponseCode.INTERNAL_SERVER_ERROR, (e as Error).message);
    }
  }
}
