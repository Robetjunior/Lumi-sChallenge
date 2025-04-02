import { Router } from 'express';
import multer from 'multer';
import { listInvoices, createInvoice, getInvoiceById, updateInvoice, deleteInvoice, calculateEnergyUsage, searchInvoices, uploadInvoicesFromFolder } from '../controllers/invoiceController';

const router = Router();
const upload = multer({ dest: 'uploads/' }); 

router.get('/', listInvoices);
router.post('/', upload.single('fatura_pdf'), createInvoice);
router.get('/calculos/:no_cliente/:mes_referencia', calculateEnergyUsage);
router.get('/search', searchInvoices);
router.get('/:id', getInvoiceById);
router.put('/:id', updateInvoice);
router.delete('/:id', deleteInvoice);
router.post('/importar-pasta', uploadInvoicesFromFolder);


export default router;
