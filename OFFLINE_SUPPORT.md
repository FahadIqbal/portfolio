# Offline Support Documentation

## Overview

This document describes the offline support functionality implemented in the portfolio application. The application now has the ability to:

1. Detect network connectivity status
2. Provide visual feedback to users when offline
3. Cache data for offline viewing
4. Queue updates when offline and sync when connectivity is restored
5. Automatically retry failed network operations

## Implementation Details

### Network Status Detection

The application uses multiple methods to detect network connectivity:

1. Browser's `navigator.onLine` property
2. Event listeners for `online` and `offline` events
3. A custom `NetworkService` that centralizes network status management

### Firebase Offline Persistence

Firebase Firestore is configured to use offline persistence, allowing the application to:

- Cache previously loaded data for offline viewing
- Queue write operations when offline
- Automatically sync when connectivity is restored

This is implemented in `FirebaseInitializer.ts` using `enableIndexedDbPersistence`.

### Network Status Indicator

A visual indicator appears when the user is offline, providing clear feedback about the current connectivity status. This is implemented in `NetworkStatusIndicator.tsx`.

### Retry Mechanism

The application includes a robust retry mechanism for network operations:

- `waitForOnline`: A utility that returns a promise which resolves when connectivity is restored
- `retryWhenOnline`: A higher-order function that wraps network operations with retry logic

These utilities are implemented in `networkUtils.ts`.

### DataService Integration

The `DataService` class has been updated to:

1. Track network connectivity status
2. Provide appropriate error messages for offline scenarios
3. Use retry mechanisms for critical operations
4. Handle file uploads with proper offline detection

## User Experience

When the user goes offline:

1. A red indicator appears at the bottom of the screen
2. Read operations use cached data when available
3. Write operations are queued for later synchronization
4. Appropriate error messages are shown for operations that cannot be completed offline

When connectivity is restored:

1. The offline indicator disappears
2. Queued write operations are automatically synchronized
3. The application refreshes data to ensure it's up to date

## Testing

The offline functionality can be tested by:

1. Loading the application while online
2. Disconnecting from the network (using browser dev tools or actually going offline)
3. Interacting with the application - viewing cached data and attempting updates
4. Reconnecting to the network and observing synchronization

Unit tests for the network utilities are available in `networkUtils.test.ts`.

## Limitations

- New data that hasn't been previously loaded cannot be accessed offline
- File uploads require network connectivity to complete
- Firebase has a size limit for offline persistence cache (default is 40MB)
- Multiple tabs using offline persistence can cause conflicts