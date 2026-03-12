import { Router } from 'express';
import { InscricaoController } from '../controllers/InscricaoController';
import { CredencialController } from '../controllers/CredencialController';
import { AcessoController } from '../controllers/AcessoController';
import { AuthController } from '../controllers/AuthController';
import { AdminController } from '../controllers/AdminController';
import { DescarbonizacaoController } from '../controllers/DescarbonizacaoController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

const inscricao      = new InscricaoController();
const credencial     = new CredencialController();
const acesso         = new AcessoController();
const auth           = new AuthController();
const admin          = new AdminController();
const descarbonizacao = new DescarbonizacaoController();

// Inscrição
router.post('/inscricao', inscricao.criar.bind(inscricao));

// PDF da credencial
router.get('/credencial/:id/pdf', credencial.gerarPdf.bind(credencial));

// Validação de QR Code
router.post('/validar-acesso', acesso.validar.bind(acesso));

// Auth
router.post('/auth/login', auth.login.bind(auth));

// Admin (protegido)
router.get('/admin/credenciados', authMiddleware, admin.listarCredenciados.bind(admin));

// Descarbonização
router.post('/descarbonizacao', descarbonizacao.calcular.bind(descarbonizacao));
router.get('/descarbonizacao/cidades', descarbonizacao.listarCidades.bind(descarbonizacao));

export default router;
