const BACKEND_BASE_URL = process.env.API_BASE_URL ?? 'https://postalk-backend-git-main-cnu-clothing.vercel.app';

export default async function handler(request, response) {
  const adminApiKey = process.env.ADMIN_API_KEY;

  if (!adminApiKey) {
    response.status(500).json({
      success: false,
      message: 'ADMIN_API_KEY is not configured.',
    });
    return;
  }

  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(request.query)) {
    if (typeof value === 'string') searchParams.set(key, value);
  }

  const backendResponse = await fetch(`${BACKEND_BASE_URL}/api/admin/reviews?${searchParams.toString()}`, {
    headers: {
      Accept: 'application/json',
      'x-admin-api-key': adminApiKey,
    },
  });
  const responseBody = await backendResponse.text();

  response.status(backendResponse.status);
  response.setHeader('Content-Type', backendResponse.headers.get('content-type') ?? 'application/json');
  response.send(responseBody);
}
