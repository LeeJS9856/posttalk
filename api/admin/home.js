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

  const marketName = typeof request.query.marketName === 'string' ? request.query.marketName : '';
  const searchParams = new URLSearchParams({ marketName });

  const backendResponse = await fetch(`${BACKEND_BASE_URL}/api/admin/home?${searchParams.toString()}`, {
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
