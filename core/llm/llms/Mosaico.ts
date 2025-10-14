import { ChatMessage, CompletionOptions, LLMOptions } from "../../index.js";
import { BaseLLM } from "../index.js";

/**
 * Mosaico LLM Provider
 *
 * A custom LLM provider for the Mosaico agent-to-agent communication system.
 */
class Mosaico extends BaseLLM {
  static providerName = "mosaico";

  static defaultOptions: Partial<LLMOptions> | undefined = {
    model: "mosaico-default",
    apiBase: "http://localhost:12000",
  };

  constructor(options: LLMOptions) {
    super(options);
    // Force chat mode by clearing templateMessages
    this.templateMessages = undefined;
    // TODO: Initialize Mosaico-specific configuration
  }

  /**
   * Mosaico only supports chat mode, not raw completions
   */
  supportsCompletions(): boolean {
    return false;
  }

  /**
   * Stream completion for raw text prompts
   * @param prompt - The text prompt to complete
   * @param signal - AbortSignal for cancellation
   * @param options - Completion options
   */
  protected async *_streamComplete(
    prompt: string,
    signal: AbortSignal,
    options: CompletionOptions,
  ): AsyncGenerator<string> {
    // TODO: Implement streaming completion logic
    // For now, echo back the prompt with a prefix for testing
    // const testResponse = `❌ ERROR: _streamComplete was called but supportsCompletions() returns false! This is a bug.\n\nPrompt length: ${prompt.length} chars`;

    // yield testResponse;
    yield "This is a test response from Mosaico LLM from _streamComplete. Implement your completion logic here.";
  }

  /**
   * Stream chat completions
   * @param messages - Array of chat messages
   * @param signal - AbortSignal for cancellation
   * @param options - Completion options
   */
  protected async *_streamChat(
    messages: ChatMessage[],
    signal: AbortSignal,
    options: CompletionOptions,
  ): AsyncGenerator<ChatMessage> {
    // TODO: Implement A2A chat streaming logic
    // For now, echo back the last message for testing

    const lastMessage = messages[messages.length - 1];
    const userContent =
      typeof lastMessage.content === "string"
        ? lastMessage.content
        : JSON.stringify(lastMessage.content);

    // Count user messages (excluding system messages)
    const userMessageCount = messages.filter((m) => m.role === "user").length;

    const responseText =
      `**Mosaico Agent (A2A Mode)**\n\n` +
      `You said: "${userContent}"\n\n` +
      `Session Info:\n` +
      `- Total messages: ${messages.length}\n` +
      `- User messages: ${userMessageCount}\n` +
      `- Model: ${options.model}\n` +
      `- API Base: ${this.apiBase || "default"}\n\n` +
      `_This is a test echo. Implement your A2A protocol integration in the _streamChat method._`;

    // Stream the response character by character
    let accumulatedContent = "";
    for (const char of responseText) {
      if (signal.aborted) {
        break;
      }

      accumulatedContent += char;

      yield {
        role: "assistant",
        // content: accumulatedContent,
        content: char,
      };

      // Small delay to simulate streaming
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
  }

  /**
   * Check if the Mosaico service is available
   */
  async isServiceAvailable(): Promise<boolean> {
    // TODO: Implement health check for Mosaico service
    return true;
  }

  /**
   * Get supported models from Mosaico service
   */
  async listModels(): Promise<string[]> {
    // TODO: Implement model listing
    return ["mosaico-default", "mosaico-advanced"];
  }

  /**
   * Custom method for agent-to-agent communication
   */
  async sendAgentMessage(
    sourceAgent: string,
    targetAgent: string,
    message: string,
  ): Promise<string> {
    // TODO: Implement agent-to-agent communication
    return `Message sent from ${sourceAgent} to ${targetAgent}: ${message}`;
  }
}

export default Mosaico;
