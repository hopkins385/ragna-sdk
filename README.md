# RAGNA Gen AI SDK for TypeScript and JavaScript

## Overview

The RAGNA GenAI SDK provides a set of tools and classes for interacting with the RAGNA API. It simplifies the process of making HTTP requests, managing authentication, and handling errors.

## Installation

To install the RAGNA SDK, you can use npm or yarn:

```bash
npm install ragna-sdk
```

or

```bash
yarn add ragna-sdk
```

## Usage

To use the RAGNA SDK, import the necessary classes from the package:

```typescript
import { RagnaClient } from "ragna-sdk";
```

### Creating an Instance

You can create an instance of the `RagnaClient` by providing optional configuration options:

```typescript
const client = new RagnaClient({
  getAccessTokenCallback: () => "your-access-token",
  getRefreshTokenCallback: () => "your-refresh-token",
  refreshAuthCallback: async () => {
    // Custom logic to refresh authentication tokens
  },
});
```

### Authentication and Token Management

The SDK provides automatic token management including:

- Attaching authentication tokens to requests
- Automatically refreshing expired tokens using the `refreshAuthCallback`
- Handling token refresh failures

The `refreshAuthCallback` should be an async function that handles the token refresh process. When an API call receives a 401 Unauthorized error, the SDK will automatically call this function to refresh the authentication before retrying the original request.

### Making API Calls

Once you have an instance of the client, you can make API calls using the methods provided by the SDK. For example, to create a chat message:

```typescript
const response = await client.aiChat.createChatMessage({
  chatId: "12345",
  message: "Hello, world!",
});
```

## Error Handling

The SDK includes custom error classes for handling various error scenarios. You can catch and handle these errors as follows:

```typescript
try {
  // API call
} catch (error) {
  if (error instanceof BadRequestError) {
    console.error("Bad Request:", error.message);
  } else if (error instanceof ConnectionError) {
    console.error("Connection Error:", error.message);
  }
}
```

## API Reference

For detailed information about the available methods and classes, please refer to the source code and comments within the SDK.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.
