import { Router } from 'express';
import { LibroDigitalController } from '../../controller/libro-digital.controller.js';

const libroDigitalRouter = Router();

const libroDigitalController = new LibroDigitalController();

libroDigitalRouter.get('/comprador/:compradorId', libroDigitalController.getLibrosAdquiridos.bind(libroDigitalController));

libroDigitalRouter.post('/adquirir', libroDigitalController.adquirirLibro.bind(libroDigitalController));

libroDigitalRouter.get('/pdf/:libroId', libroDigitalController.getPdf.bind(libroDigitalController));

export default libroDigitalRouter;
