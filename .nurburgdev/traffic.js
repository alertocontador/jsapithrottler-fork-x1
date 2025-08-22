import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

export let errorRate = new Rate('errors');

export let options = {
  // Alternative: Use constant VUs for simpler testing
  vus: 1000,
  duration: '15m',
};

const BASE_URL = 'http://jsapithrottler:3000';

export default function () {
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  let response1 = http.post(`${BASE_URL}/api/a/test`, JSON.stringify({}), params);
  check(response1, {
    'POST /api/a/test status is 200 or 429': (r) => [200, 429].includes(r.status),
    'POST /api/a/test response time < 500ms': (r) => r.timings.duration < 500,
  }) || errorRate.add(1);
  
  // Test API /b/test
  let response2 = http.post(`${BASE_URL}/api/b/test`, JSON.stringify({}), params);
  check(response2, {
    'POST /api/b/test status is 200 or 429': (r) => [200, 429].includes(r.status),
    'POST /api/b/test response time < 500ms': (r) => r.timings.duration < 500,
  }) || errorRate.add(1);
  
  sleep(0.05);
}
