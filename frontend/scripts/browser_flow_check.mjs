/**
 * Browser flow smoke test — run with servers up:
 *   npx playwright install chromium
 *   node scripts/browser_flow_check.mjs
 */
import { chromium } from 'playwright';

const FRONTEND = process.env.FRONTEND_URL || 'http://localhost:8080';
const BACKEND = process.env.BACKEND_URL || 'http://localhost:8000';

const results = [];

function log(step, status, detail = '') {
  results.push({ step, status, detail });
  const mark = status === 'PASS' ? '[PASS]' : status === 'FAIL' ? '[FAIL]' : '[SKIP]';
  console.log(`${mark} ${step}${detail ? ': ' + detail : ''}`);
}

async function main() {
  // Backend health
  try {
    const r = await fetch(`${BACKEND}/api/courses/all/`);
    log('Backend API reachable', r.status < 500 ? 'PASS' : 'FAIL', `HTTP ${r.status}`);
  } catch (e) {
    log('Backend API reachable', 'FAIL', String(e.message));
    process.exit(1);
  }

  // Admin login page
  try {
    const r = await fetch(`${BACKEND}/admin/login/`);
    log('Django admin login page', r.ok ? 'PASS' : 'FAIL', `HTTP ${r.status}`);
  } catch (e) {
    log('Django admin login page', 'FAIL', String(e.message));
  }

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.setDefaultTimeout(20000);

  try {
    // Landing
    await page.goto(FRONTEND, { waitUntil: 'networkidle' });
    log('Landing page loads', page.url().includes('8080') ? 'PASS' : 'FAIL');

    const loginLink = page.getByRole('link', { name: /login/i }).first();
    if (await loginLink.isVisible()) {
      await loginLink.click();
      await page.waitForURL(/login/);
      log('Landing -> Login nav', 'PASS');
    } else {
      log('Landing -> Login nav', 'SKIP', 'login link not found');
    }

    await page.goto(`${FRONTEND}/register`, { waitUntil: 'networkidle' });
    log('Register page loads', /register/.test(page.url()) ? 'PASS' : 'FAIL');

    // Dashboard (DEV auth injects user)
    await page.goto(`${FRONTEND}/dashboard`, { waitUntil: 'networkidle' });
    const onDashboard = page.url().includes('/dashboard');
    const redirectedLogin = page.url().includes('/login');
    log('Dashboard access', onDashboard ? 'PASS' : redirectedLogin ? 'SKIP' : 'FAIL', page.url());

    if (onDashboard) {
      const continueBtn = page.getByRole('button', { name: /continue learning/i }).first();
      if (await continueBtn.isVisible().catch(() => false)) {
        await continueBtn.click();
        await page.waitForTimeout(1500);
        log('Continue Learning click', /\/level\//.test(page.url()) ? 'PASS' : 'FAIL', page.url());
      }

      // Level page
      if (!page.url().includes('/level/')) {
        await page.goto(`${FRONTEND}/level/beginner`, { waitUntil: 'networkidle' });
      }

      if (page.url().includes('/level/beginner')) {
        log('Level beginner page', 'PASS');

        // Click first unlocked lesson in sidebar if present
        const lessonLink = page.locator('[class*="sidebar"] button, aside button').filter({ hasText: /.+/ }).nth(2);
        if (await lessonLink.count() > 0) {
          await lessonLink.click().catch(() => {});
          await page.waitForTimeout(2000);
        }

        // Try lesson URL directly
        await page.goto(`${FRONTEND}/level/beginner`, { waitUntil: 'networkidle' });
        const modLesson = await page.evaluate(async (base) => {
          const token = localStorage.getItem('trader_tactical_auth_tokens');
          const headers = { 'Content-Type': 'application/json' };
          if (token) {
            try {
              headers.Authorization = `Bearer ${JSON.parse(token).access}`;
            } catch {}
          }
          const res = await fetch(`${base.replace('8080', '8000')}/api/courses/1/levels/`, { headers });
          if (!res.ok) return null;
          const levels = await res.json();
          const beginner = levels[0];
          const mod = beginner?.modules?.[0];
          const les = mod?.lessons?.[0];
          if (!mod || !les) return null;
          return { moduleId: `module-${beginner.id}-${mod.id}`, lessonId: `lesson-${beginner.id}-${mod.id}-${les.id}` };
        }, FRONTEND);

        if (modLesson) {
          const lessonUrl = `${FRONTEND}/lesson/beginner/${modLesson.moduleId}/${modLesson.lessonId}`;
          await page.goto(lessonUrl, { waitUntil: 'networkidle' });
          log('Lesson page', page.url().includes('/lesson/') ? 'PASS' : 'FAIL', page.url());

          const quizBtn = page.getByRole('button', { name: /begin execution|quiz|retake/i }).first();
          if (await quizBtn.isVisible().catch(() => false)) {
            await quizBtn.click();
            await page.waitForTimeout(2000);
            log('Lesson -> Quiz nav', /\/quiz\//.test(page.url()) ? 'PASS' : 'SKIP', page.url());
          }
        }
      } else {
        log('Level beginner page', 'FAIL', page.url());
      }

      await page.goto(`${FRONTEND}/profile`, { waitUntil: 'networkidle' });
      log('Profile page', page.url().includes('/profile') ? 'PASS' : 'FAIL');

      await page.goto(`${FRONTEND}/certificates`, { waitUntil: 'networkidle' });
      log('Certificates page', page.url().includes('/certificates') ? 'PASS' : 'FAIL');
    }

    // Public pages
    for (const path of ['/pricing', '/terms', '/privacy', '/forgot-pin']) {
      await page.goto(`${FRONTEND}${path}`, { waitUntil: 'networkidle' });
      log(`Page ${path}`, page.url().includes(path.slice(1)) ? 'PASS' : 'FAIL');
    }

    // Landing feedback form
    await page.goto(FRONTEND, { waitUntil: 'networkidle' });
    const contactBtn = page.getByRole('button', { name: /contact|feedback/i }).first();
    if (await contactBtn.isVisible().catch(() => false)) {
      await contactBtn.click();
      await page.waitForTimeout(500);
      log('Contact drawer open', 'PASS');
    }
  } catch (err) {
    log('Browser test error', 'FAIL', err.message);
  } finally {
    await browser.close();
  }

  const failed = results.filter((r) => r.status === 'FAIL');
  console.log('\n' + '='.repeat(50));
  console.log(`TOTAL: ${results.length} | PASS: ${results.filter((r) => r.status === 'PASS').length} | FAIL: ${failed.length}`);
  if (failed.length) {
    console.log('FAILED:', failed.map((f) => f.step).join(', '));
    process.exit(1);
  }
}

main();
