const BACKEND_BASE_URL = process.env.API_BASE_URL ?? 'https://postalk-backend-git-main-cnu-clothing.vercel.app';

export default async function handler(request, response) {
  const adminApiKey = process.env.ADMIN_API_KEY;
  const submissionId = typeof request.query.submissionId === 'string' ? request.query.submissionId : '';

  if (!adminApiKey) {
    response.status(500).json({ success: false, message: 'ADMIN_API_KEY is not configured.' });
    return;
  }

  if (!submissionId) {
    response.status(400).json({ success: false, message: 'submissionId is required.' });
    return;
  }

  if (!['GET', 'POST'].includes(request.method)) {
    response.setHeader('Allow', 'GET, POST');
    response.status(405).json({ success: false, message: 'Method not allowed.' });
    return;
  }

  const backendResponse = await fetch(`${BACKEND_BASE_URL}/api/admin/submissions/${encodeURIComponent(submissionId)}/instagram-publish`, {
    method: request.method,
    headers: {
      Accept: 'application/json',
      ...(request.method === 'POST' ? { 'Content-Type': 'application/json' } : {}),
      'x-admin-key': adminApiKey,
    },
    ...(request.method === 'POST' ? { body: JSON.stringify(request.body) } : {}),
  });
  const responseBody = await backendResponse.text();

  response.status(backendResponse.status);
  response.setHeader('Content-Type', backendResponse.headers.get('content-type') ?? 'application/json');
  response.send(responseBody);
}
