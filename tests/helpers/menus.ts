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

export async function excluirUsuarioSeExistir(page: Page, nome: string) {
  while (true) {
    await page.getByRole('button', { name: 'Pesquisar Usuários' }).click();

    const nomeField = page
      .getByText('Nome:', { exact: true })
      .first()
      .locator('xpath=..')
      .locator('input, textarea')
      .first();

    await nomeField.fill(nome);
    await page.locator('.btnPesquisarFiltroPesquisa').click();
    await page.waitForTimeout(1000);

    const linha = page.locator('table').first().locator('tbody tr').first();
    if (await linha.locator('.clasEditar').count() === 0) break;

    await linha.locator('.clasEditar').click();
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: 'Excluir' }).first().click();
    await page.getByRole('button', { name: 'Sim', exact: true }).click();

    await expect(page.getByText('Processando, aguarde')).not.toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Excluído com sucesso')).toBeVisible();
    await page.waitForTimeout(2000);
  }
}
