export class StreamUtils {
  /**
   * Converts a ReadableStream to a JSON stream.
   *
   * @param stream - The ReadableStream to convert.
   * @returns An async generator that yields parsed JSON objects.
   *
   * @example
   * const stream = await client.aiChat.createChatStream(payload);
   * const jsonStream = client.utils.streamToJson(stream);
   * for await (const chunk of jsonStream) {
   *  if (chunk?.message) {
   *    console.log(chunk.message);
   *  }
   * }
   */
  streamToJson(stream: ReadableStream<Uint8Array>) {
    return {
      [Symbol.asyncIterator]: async function* () {
        const reader = stream.pipeThrough(new TextDecoderStream()).getReader();

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }

          const lines = value.split("\n");

          for (const line of lines) {
            try {
              if (line.trim().startsWith("data: ")) {
                const parsedData = JSON.parse(line.slice(6).trim());
                if (parsedData) {
                  yield parsedData;
                }
              }
            } catch (e) {
              console.error("Error parsing JSON:", e, "line:", line);
            }
          }
        }
      },
    };
  }
}
