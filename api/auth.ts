import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(
    request: VercelRequest,
    response: VercelResponse,
) {
    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Method Not Allowed' });
    }

    const { APP_PASSWORD } = process.env;

    if (!APP_PASSWORD) {
        console.error("APP_PASSWORD environment variable not set on the server.");
        // This is a server configuration error, so we shouldn't reveal too much to the client.
        return response.status(500).json({ success: false, message: '서버 설정 오류입니다.' });
    }

    const { password } = request.body;

    if (password === APP_PASSWORD) {
        return response.status(200).json({ success: true });
    } else {
        return response.status(401).json({ success: false, message: '비밀번호가 올바르지 않습니다.' });
    }
}
