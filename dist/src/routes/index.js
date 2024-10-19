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
const express_1 = __importDefault(require("express"));
const invoice_1 = require("../../models/invoice");
const router = express_1.default.Router();
// Rota para salvar os dados extraídos
router.post('/invoices', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const invoiceData = req.body;
        const newInvoice = yield invoice_1.Invoice.create(invoiceData);
        res.status(201).json(newInvoice);
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao salvar a fatura' });
    }
}));
// Rota para listar as faturas
router.get('/invoices', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const invoices = yield invoice_1.Invoice.findAll();
        res.status(200).json(invoices);
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao buscar faturas' });
    }
}));
exports.default = router;
//# sourceMappingURL=index.js.map