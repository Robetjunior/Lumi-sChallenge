import { Router } from 'express';
import multer from 'multer';
import { 
  listInvoices, 
  createInvoice, 
  getInvoiceById, 
  updateInvoice, 
  deleteInvoice, 
  calculateEnergyUsage, 
  searchInvoices, 
  uploadInvoicesFromFolder, 
  getDashboardData  
} from '../controllers/invoiceController';

const router = Router();
const upload = multer({ dest: 'uploads/' }); 

router.get('/', listInvoices);
router.post('/', upload.single('fatura_pdf'), createInvoice);
router.get('/calculos/:no_cliente/:mes_referencia', calculateEnergyUsage);
router.get('/search', searchInvoices);
router.post('/importar-pasta', uploadInvoicesFromFolder);
router.get('/dashboard', getDashboardData);

// Rotas dinâmicas devem ser definidas depois:
router.get('/:id', getInvoiceById);
router.put('/:id', updateInvoice);
router.delete('/:id', deleteInvoice);

export default router;
