import { Page, expect } from '@playwright/test';
import { fillCampo } from './form';

export async function cadastrarUsuarioCPF(page: Page, nome: string, cpf: string) {
  await fillCampo(page, '*Nome:', nome);
  await page.getByLabel('*Tipo:').first().selectOption('0');
  await fillCampo(page, '*CPF:', cpf);
  await fillCampo(page, '*Email:', 'usuario.automacao_cpf@gmail.com');
  await fillCampo(page, '*Usuário:', 'usuario_automacao_CPF');
  await fillCampo(page, '*Senha:', 'Senha@123');
  await fillCampo(page, '*Confirmação:', 'Senha@123');
  await page.getByLabel('*Situação:').first().selectOption('A');

  const botaoAdicionar = page.getByRole('button', { name: 'Adicionar' });
  await botaoAdicionar.scrollIntoViewIfNeeded();
  await botaoAdicionar.click();

  await expect(page.getByText('Processando, aguarde')).not.toBeVisible({ timeout: 40000 });
  await expect(page.getByText('Cadastrado com sucesso')).toBeVisible({ timeout: 10000 });
}
