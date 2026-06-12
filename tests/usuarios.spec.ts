import { test, expect, Page } from '@playwright/test';
import { login } from './helpers/login';
import { acessarUsuarios } from './helpers/menus';
import { verificarUsuarioCPF } from './helpers/verificacao';
import { gerarCpfValido } from './helpers/cpf';

async function fillCampo(page: Page, label: string, value: string) {
  await page
    .getByText(label, { exact: true })
    .first()
    .locator('xpath=..')
    .locator('input, textarea')
    .first()
    .fill(value);
}

test('Criar um usuário CPF', async ({ page }) => {
  test.setTimeout(60000);

  await login(page);
  await acessarUsuarios(page);

  const cpf = gerarCpfValido();
  const nome = 'Usuário Automação CPF';

  await verificarUsuarioCPF(page, nome);

  await fillCampo(page, '*Nome:', nome);
  await page.getByLabel('*Tipo:').first().selectOption('0');
  await fillCampo(page, '*CPF:', cpf);
  await fillCampo(page, '*Email:', 'usuario.automacao_cpf@gmail.com');
  await fillCampo(page, '*Usuário:', 'usuario_automacao_CPF');
  await fillCampo(page, '*Senha:', 'Senha@123');
  await fillCampo(page, '*Confirmação:', 'Senha@123');
  await page.getByLabel('*Situação:').first().selectOption('A');

  await page.getByRole('button', { name: 'Adicionar' }).click();

  await expect(page.getByText('Cadastrado com sucesso')).toBeVisible();

  const campoPesquisaNome = page.getByText('Nome:', { exact: true }).first().locator('xpath=..').locator('input, textarea').first();
  if (!(await campoPesquisaNome.isVisible())) {
    await page.getByRole('button', { name: 'Pesquisar Usuários' }).click();
    await page.waitForTimeout(500);
  }
  await fillCampo(page, 'Nome:', nome);
  await page.locator('.btnPesquisarFiltroPesquisa').click();

  await expect(page.locator('table:visible').first().getByText(nome).first()).toBeVisible();
});
