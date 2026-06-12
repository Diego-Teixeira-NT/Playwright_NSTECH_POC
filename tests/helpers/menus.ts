import { Page, expect } from '@playwright/test';

export async function acessarUsuarios(page: Page) {
  await page.getByText('Administrativo', { exact: true }).click();

  const usuariosToggle = page.getByText('Usuários', { exact: true }).nth(1);
  await usuariosToggle.scrollIntoViewIfNeeded();
  await usuariosToggle.click();

  const usuariosLink = page.getByText('Usuários', { exact: true }).nth(2);
  await usuariosLink.scrollIntoViewIfNeeded();
  await usuariosLink.click();

  await expect(page.getByText('Pesquisar Usuários')).toBeVisible();
}
