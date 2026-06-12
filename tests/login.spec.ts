import { test, expect } from '@playwright/test';

test('login com credenciais válidas redireciona para a área logada', async ({ page }) => {
  await page.goto('/Login');

  await page.getByLabel('Usuário').fill(process.env.LOGIN_USERNAME ?? '');
  await page.getByLabel('Senha').fill(process.env.LOGIN_PASSWORD ?? '');
  await page.getByRole('button', { name: 'Acessar' }).click();

  await expect(page).not.toHaveURL(/\/Login/);
});
