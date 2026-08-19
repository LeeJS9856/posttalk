const BACKEND_BASE_URL = process.env.API_BASE_URL ?? 'https://postalk-backend-git-main-cnu-clothing.vercel.app';

export default async function handler(request, response) {
  const adminApiKey = process.env.ADMIN_API_KEY;

  if (!adminApiKey) {
    response.status(500).json({ success: false, message: 'ADMIN_API_KEY is not configured.' });
    return;
  }

  if (request.method !== 'PATCH') {
    response.setHeader('Allow', 'PATCH');
    response.status(405).json({ success: false, message: 'Method not allowed.' });
    return;
  }

  const { submissionId } = request.query;
  const backendResponse = await fetch(`${BACKEND_BASE_URL}/api/admin/submissions/${encodeURIComponent(submissionId)}`, {
    method: 'PATCH',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'x-admin-api-key': adminApiKey,
    },
    body: JSON.stringify(request.body),
  });
  const responseBody = await backendResponse.text();

  response.status(backendResponse.status);
  response.setHeader('Content-Type', backendResponse.headers.get('content-type') ?? 'application/json');
  response.send(responseBody);
}
