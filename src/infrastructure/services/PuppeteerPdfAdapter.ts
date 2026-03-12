import puppeteer, { Browser } from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { IGeradorPdfService, DadosCredencialPdf } from '../../application/ports/outbound/IGeradorPdfService';

export class PuppeteerPdfAdapter implements IGeradorPdfService {
  private browser: Browser | null = null;

  async gerarCredencial(dados: DadosCredencialPdf): Promise<Buffer> {
    const browser = await this.getBrowser();
    const page = await browser.newPage();

    try {
      const templatePath = path.resolve(__dirname, '../templates/credencial.html');
      let html = fs.readFileSync(templatePath, 'utf-8');

      html = html
        .replace(/\{\{NOME\}\}/g, this.escape(dados.nome))
        .replace(/\{\{EMPRESA\}\}/g, this.escape(dados.empresa ?? ''))
        .replace(/\{\{CATEGORIA\}\}/g, this.escape(dados.categoria))
        .replace(/\{\{COR_TARJA\}\}/g, dados.corTarja)
        .replace(/\{\{QR_CODE_BASE64\}\}/g, dados.qrCodeBase64)
        .replace(/\{\{CREDENCIAL_ID\}\}/g, dados.credencialId)
        .replace(/\{\{DATA_EVENTO\}\}/g, this.escape(dados.dataEvento))
        .replace(/\{\{DOCUMENTO\}\}/g, this.escape(dados.documentoFormatado));

      await page.setContent(html, { waitUntil: 'networkidle0' });

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '0', right: '0', bottom: '0', left: '0' },
      });

      return Buffer.from(pdfBuffer);
    } finally {
      await page.close();
    }
  }

  private async getBrowser(): Promise<Browser> {
    if (!this.browser) {
      const launchOptions: Parameters<typeof puppeteer.launch>[0] = {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
      };
      if (process.env.PUPPETEER_EXECUTABLE_PATH) {
        launchOptions.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
      }
      this.browser = await puppeteer.launch(launchOptions);
    }
    return this.browser;
  }

  async fechar(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  private escape(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}
