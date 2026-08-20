import { Router } from 'express';
import { OfertaLibroController } from '../../controller/ofertaLibro.controller.js'; // Ajustá la ruta a tu carpeta

const router = Router();
const controller = new OfertaLibroController();

router.get('/', controller.getOfertas);

router.get('/:id', controller.getOfertaPorId);

router.post('/', controller.createOferta);

router.put('/admin/contraofertar/:id', controller.contraofertaAdmin);

router.put('/proveedor/contraofertar/:id', controller.contraofertaProveedor);

router.put('/aceptar/:id', controller.aceptarOferta);

router.put('/rechazar/:id', controller.rechazarOferta);

router.delete('/:id', controller.eliminarOferta);

export default router;
