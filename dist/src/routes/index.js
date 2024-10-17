"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/invoices', (req, res) => {
    res.send('Listar faturas de energia');
});
router.post('/invoices', (req, res) => {
    res.send('Adicionar nova fatura');
});
exports.default = router;
