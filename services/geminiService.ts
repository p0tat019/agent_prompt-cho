import { Persona } from './types';

/**
 * Verifies the password against the backend.
 *
 * @param password The password to verify.
 * @returns An object indicating success and a message.
 */
export const verifyPassword = async (password: string): Promise<{ success: boolean; message?: string }> => {
    try {
        const response = await fetch('/api/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password }),
        });

        const data = await response.json();

        if (!response.ok) {
            // Use the error message from the backend if available
            throw new Error(data.message || 'Verification failed.');
        }

        return { success: true };
    } catch (error) {
        console.error("Error verifying password:", error);
        const message = error instanceof Error ? error.message : "An unknown error occurred during verification.";
        return { success: false, message };
    }
};


/**
 * Generates an optimized prompt by calling our backend API.
 *
 * @param persona The AI persona to use for optimization.
 * @param userTask The user's rough task description.
 * @returns The optimized prompt as a string.
 */
export const generateOptimizedPrompt = async (persona: Persona, userTask: string): Promise<string> => {
    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ persona, userTask }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'An unknown server error occurred.' }));
            const errorMessage = errorData.error || `Request failed with status ${response.status}`;
            throw new Error(errorMessage);
        }

        const data = await response.json();
        if (!data.prompt) {
            throw new Error("Received an empty prompt from the server.");
        }
        return data.prompt;

    } catch (error) {
        console.error("Error calling backend API:", error);
        if (error instanceof Error) {
            // Re-throw the specific error message from the backend or fetch failure.
            throw new Error(error.message);
        }
        // Fallback for non-Error objects thrown
        throw new Error("Failed to communicate with the server.");
    }
};