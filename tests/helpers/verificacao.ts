import { Page, expect } from '@playwright/test';
import { pesquisarUsuarioPorNome } from './pesquisa';

export async function verificarUsuarioCPF(page: Page, nome: string) {
  while (true) {
    const tabela = await pesquisarUsuarioPorNome(page, nome);

    const linha = tabela.locator('tbody tr').first();
    if (await linha.locator('.clasEditar').count() === 0) break;

    await linha.locator('.clasEditar').click();
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: 'Excluir' }).first().click();
    await page.getByRole('button', { name: 'Sim', exact: true }).click();

    await expect(page.getByText('Processando, aguarde')).not.toBeVisible({ timeout: 40000 });
    await expect(page.getByText('Excluído com sucesso')).toBeVisible();
    await page.waitForTimeout(2000);
  }
}
