const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Helper to handle responses
const handleResponse = async (response) => {
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.detail || 'Something went wrong');
    }
    return data;
};

// Chat endpoints
export const sendChatMessage = async ({
    user_input,
    latitude = null,
    longitude = null,
    language = 'english',
    session_id = null,
}) => {
    const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            latitude,
            longitude,
            user_input,
            language,
            session_id,
        }),
    });
    return handleResponse(response);
};

// PDF upload
export const uploadMedicalPDF = async ({
    file,
    user_prompt = '',
    language = 'english',
    session_id = null,
}) => {
    const formData = new FormData();
    formData.append('file', file);
    if (user_prompt) formData.append('user_prompt', user_prompt);
    if (language) formData.append('language', language);
    if (session_id) formData.append('session_id', session_id);

    const response = await fetch(`${API_BASE_URL}/upload-pdf`, {
        method: 'POST',
        body: formData,
    });
    return handleResponse(response);
};

// Daily check-in
export const submitCheckin = async ({
    session_id,
    sleep_hours,
    mood,
    hydration,
    symptoms = [],
}) => {
    const response = await fetch(`${API_BASE_URL}/checkin`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            session_id,
            sleep_hours,
            mood,
            hydration,
            symptoms,
        }),
    });
    return handleResponse(response);
};

// Health check
export const checkHealth = async () => {
    const response = await fetch(`${API_BASE_URL}/health`);
    return handleResponse(response);
};