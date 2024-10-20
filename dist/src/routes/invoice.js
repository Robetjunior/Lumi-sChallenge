"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const supabase_1 = require("../../config/supabase");
const fs_1 = __importDefault(require("fs"));
const extractInvoiceData_1 = require("../services/extractInvoiceData"); // Função para extração de dados do PDF
const invoice_1 = require("../../models/invoice"); // Seu modelo de banco de dados
const sequelize_1 = require("sequelize");
const multer_1 = __importDefault(require("multer"));
// Configuração do multer para receber arquivos PDF
const upload = (0, multer_1.default)({ dest: 'uploads/' }); // Os arquivos enviados serão armazenados na pasta 'uploads'
const router = (0, express_1.Router)();
// Listar todas as faturas
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const invoices = yield invoice_1.Invoice.findAll();
        res.json(invoices);
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao buscar faturas' });
    }
}));
// Inserir uma nova fatura
router.post('/', upload.single('fatura_pdf'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        res.status(400).json({ error: 'Nenhum arquivo enviado' });
        return;
    }
    const filePath = req.file.path; // Caminho temporário onde o arquivo foi salvo
    const fileName = req.file.filename; // Nome do arquivo
    const bucketName = 'faturas'; // Nome do bucket no Supabase
    try {
        // Verificar se o arquivo realmente existe
        if (!fs_1.default.existsSync(filePath)) {
            throw new Error('Arquivo PDF não encontrado no caminho fornecido.');
        }
        // Extração dos dados da fatura a partir do arquivo PDF
        const invoiceData = yield (0, extractInvoiceData_1.extractInvoiceData)(filePath);
        // Ler o arquivo como um buffer
        const fileBuffer = fs_1.default.readFileSync(filePath);
        // Realizar upload do arquivo PDF no Supabase
        const { data: uploadData, error: uploadError } = yield supabase_1.supabase.storage
            .from(bucketName)
            .upload(`faturas/${fileName}.pdf`, fileBuffer, {
            contentType: 'application/pdf',
        });
        if (uploadError) {
            throw new Error(`Erro ao enviar o arquivo para o Supabase: ${uploadError.message}`);
        }
        const fileUrl = `https://yhivluwnxpbqwntxnmtn.supabase.co/storage/v1/object/public/faturas/${fileName}`; // URL completa do arquivo no bucket
        console.log(`Upload realizado com sucesso: ${uploadData.path}`);
        // Sanitizar dados: Garantir que os campos obrigatórios não tenham valor null
        const sanitizedInvoiceData = {
            no_cliente: invoiceData.no_cliente || '',
            mes_referencia: invoiceData.mes_referencia || '',
            energia_eletrica_kwh: invoiceData.energia_eletrica_kwh || 0,
            energia_eletrica_valor: invoiceData.energia_eletrica_valor || 0,
            energia_sceee_kwh: invoiceData.energia_sceee_kwh || 0,
            energia_sceee_valor: invoiceData.energia_sceee_valor || 0,
            energia_compensada_kwh: invoiceData.energia_compensada_kwh || 0,
            energia_compensada_valor: invoiceData.energia_compensada_valor || 0,
            contrib_ilum_publica: invoiceData.contrib_ilum_publica || 0,
            valor_total: invoiceData.valor_total || 0,
            nome_uc: invoiceData.nome_uc || '',
            distribuidora: invoiceData.distribuidora || '',
            pdf_url: fileUrl,
        };
        // Salvar os dados extraídos no banco de dados
        const newInvoice = yield invoice_1.Invoice.create(sanitizedInvoiceData);
        // Remover o arquivo PDF local após o upload
        fs_1.default.unlink(filePath, (err) => {
            if (err) {
                console.error(`Erro ao remover o arquivo: ${filePath}`, err);
            }
            else {
                console.log(`Arquivo removido: ${filePath}`);
            }
        });
        // Enviar resposta de sucesso
        res.status(201).json(newInvoice);
    }
    catch (error) {
        console.error('Erro ao processar a fatura PDF:', error);
        // Remover o arquivo em caso de erro
        fs_1.default.unlink(filePath, (err) => {
            if (err) {
                console.error(`Erro ao remover o arquivo após falha: ${filePath}`, err);
            }
        });
        res.status(500).json({ error: 'Erro ao processar o arquivo PDF e salvar a fatura' });
    }
}));
// Atualizar uma fatura (opcional)
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const updatedInvoice = yield invoice_1.Invoice.update(req.body, { where: { id: Number(id) } });
        if (updatedInvoice[0] === 0) {
            return res.status(404).json({ error: 'Fatura não encontrada' });
        }
        res.json({ message: 'Fatura atualizada com sucesso' });
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar fatura' });
    }
}));
router.get('/search', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('entrou aqui?');
    const { distributor, consumer, year } = req.query;
    console.log(distributor, consumer, year);
    const whereClause = {};
    // Aplicar filtros se eles existirem
    if (distributor) {
        whereClause.distributor = distributor;
    }
    if (consumer) {
        whereClause.consumer = { [sequelize_1.Op.like]: `%${consumer}%` };
    }
    if (year) {
        whereClause.mes_referencia = { [sequelize_1.Op.like]: `%${year}%` };
    }
    try {
        const invoices = yield invoice_1.Invoice.findAll({ where: whereClause });
        res.json(invoices);
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao buscar faturas' });
    }
}));
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    console.log(id);
    try {
        // Buscar a fatura com base no ID informado
        const invoice = yield invoice_1.Invoice.findOne({ where: { id: Number(id) } });
        // Verifica se encontrou a fatura
        if (invoice) {
            res.json(invoice);
        }
        else {
            res.status(404).json({ error: 'Faturaaa não encontrada' });
        }
    }
    catch (error) {
        // Trata erros de conexão ou consulta ao banco
        res.status(500).json({ error: 'Erro ao buscar fatura' });
    }
}));
router.get('/:no_cliente/:mes_referencia', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { no_cliente, mes_referencia } = req.params;
    try {
        const invoice = yield invoice_1.Invoice.findOne({ where: { no_cliente, mes_referencia } });
        if (invoice) {
            res.json(invoice);
        }
        else {
            res.status(404).json({ error: 'Fatura não encontrada' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao buscar fatura' });
    }
}));
// Excluir uma fatura (opcional)
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('teste');
    const { id } = req.params;
    try {
        const deletedInvoice = yield invoice_1.Invoice.destroy({ where: { id: Number(id) } });
        if (!deletedInvoice) {
            res.status(404).json({ error: 'Fatura não encontrada' });
            return;
        }
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao excluir fatura' });
    }
}));
// Cálculo de Consumo de Energia Elétrica (kWh) e Valor Total sem GD (R$)
router.get('/calculos/:no_cliente/:mes_referencia', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { no_cliente, mes_referencia } = req.params;
    try {
        const invoice = yield invoice_1.Invoice.findOne({ where: { no_cliente, mes_referencia } });
        if (invoice) {
            const consumoTotal = (invoice.energia_eletrica_kwh || 0) + (invoice.energia_sceee_kwh || 0);
            const valorTotalSemGD = (invoice.energia_eletrica_valor || 0) + (invoice.energia_sceee_valor || 0) + (invoice.contrib_ilum_publica || 0);
            res.json({ consumoTotal, valorTotalSemGD });
        }
        else {
            res.status(404).json({ error: 'Fatura não encontrada para cálculo' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao calcular variáveis' });
    }
}));
exports.default = router;
