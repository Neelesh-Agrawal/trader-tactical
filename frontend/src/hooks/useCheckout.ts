import { apiFetch } from '@/lib/api';

interface CheckoutResponse {
  payment_reference: string;
  action: string;
  method: 'POST';
  fields: Record<string, string>;
}

export const startHostedCheckout = async (courseId: number) => {
  const response = await apiFetch<CheckoutResponse>('/api/courses/payments/initiate/', {
    method: 'POST',
    body: JSON.stringify({ course_id: courseId }),
  });

  const form = document.createElement('form');
  form.method = response.method;
  form.action = response.action;
  form.style.display = 'none';

  Object.entries(response.fields).forEach(([key, value]) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = value;
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
};
