/**
 * A generic type for the final data you want to return at the end
 * of the SSE stream. If TOutput is unspecified, defaults to `unknown`.
 */
export async function createSSEAction<TOutput = unknown>(
  /**
   * The core handler that receives 3 utility functions:
   * 1) send - send partial text messages/events, with optional progress
   * 2) done - end the stream with optional final data (JSON-serialized)
   * 3) fail - send an error event and close the stream
   */
  handler: (utils: {
    send: (message: string, progress?: number) => Promise<void> | void;
    done: (data?: TOutput) => Promise<void> | void;
    fail: (errorMessage: string, data?: TOutput) => Promise<void> | void;
  }) => Promise<void> | void,
) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      // Helper functions to standardize sending data
      function send(message: string, progress?: number) {
        const payload = {
          message,
          progress: progress ? progress : 0,
        };
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(payload)}\n\n`),
        );
      }

      function done(data?: TOutput) {
        // We can put JSON data in the final event
        // If there's data, we embed it in the event: end
        const defaultPayload = { success: true, message: "Stream closed" };
        const payload = JSON.stringify(
          data !== undefined ? data : defaultPayload,
        );
        controller.enqueue(encoder.encode(`data: Done: ${payload}\n\n`));
        controller.close();
      }

      function fail(errorMessage: string, data?: TOutput) {
        controller.enqueue(encoder.encode(`data: Error: ${errorMessage}\n\n`));
        if (data !== undefined) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        }
        controller.close();
      }

      try {
        // Call the user's handler
        await handler({ send, done, fail });
      } catch (err: any) {
        // If there's an unhandled error
        fail(err?.message || "Unknown error");
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Transfer-Encoding": "chunked",
      "Content-Encoding": "none",
      Connection: "keep-alive",
    },
  });
}