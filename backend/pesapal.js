export const PESAPAL_CONSUMER_KEY = '0U2yI7HoJqRvGYqBMMnPkh5wwEyfS8op';
export const PESAPAL_CONSUMER_SECRET = '4zxUiBydLIqC44mytBZE+b9wZ4E=';

const BASE_URL = 'https://pay.pesapal.com/v3';

let accessToken = null;
let tokenExpiry = null;
let ipnId = null;

export async function getAccessToken() {
  if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
    return accessToken;
  }
  const res = await fetch(`${BASE_URL}/api/Auth/RequestToken`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({
      consumer_key: PESAPAL_CONSUMER_KEY,
      consumer_secret: PESAPAL_CONSUMER_SECRET,
    })
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Pesapal auth failed: ${err}`);
  }
  const data = await res.json();
  accessToken = data.token;
  tokenExpiry = data.expiryDate ? new Date(data.expiryDate).getTime() : Date.now() + 3600000;
  return accessToken;
}

export async function registerIPN(ipnUrl) {
  try {
    const token = await getAccessToken();
    const res = await fetch(`${BASE_URL}/api/URLSetup/RegisterIPN`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        url: ipnUrl,
        ipn_notification_type: 'GET'
      })
    });
    if (!res.ok) {
      const err = await res.text();
      console.warn('IPN registration failed:', err);
      return null;
    }
    const data = await res.json();
    ipnId = data.ipn_id;
    console.log('Pesapal IPN registered:', ipnId);
    return ipnId;
  } catch (e) {
    console.warn('IPN registration error:', e.message);
    return null;
  }
}

export async function submitOrder({ amount, description, callbackUrl, phone, email, firstName, lastName }) {
  const token = await getAccessToken();
  if (!ipnId) console.warn('No IPN registered, notifications may not arrive');

  const merchantReference = `MNG${Date.now()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  const body = {
    id: merchantReference,
    currency: 'KES',
    amount,
    description: description || 'Mingle Premium Membership',
    callback_url: callbackUrl,
    notification_id: ipnId || '',
    billing_address: {
      email_address: email || 'customer@mingle.app',
      phone_number: phone || '',
      first_name: firstName || 'Mingle',
      last_name: lastName || 'User',
      country_code: 'KE',
    }
  };

  const res = await fetch(`${BASE_URL}/api/Transactions/SubmitOrderRequest`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Pesapal order failed: ${err}`);
  }

  const data = await res.json();
  return {
    redirectUrl: data.redirect_url,
    orderTrackingId: data.order_tracking_id,
    merchantReference
  };
}

export async function getTransactionStatus(orderTrackingId) {
  const token = await getAccessToken();
  const res = await fetch(`${BASE_URL}/api/Transactions/GetTransactionStatus`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ order_tracking_id: orderTrackingId })
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Status check failed: ${err}`);
  }
  return await res.json();
}
