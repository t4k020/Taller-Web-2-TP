import { Router } from "express";
import { LibroController } from "../../controller/libro.controller.js";

const librosRouter = Router();

const libroController = new LibroController();

librosRouter.get("/", libroController.getLibros.bind(libroController));

librosRouter.get(
  "/carrusel",
  libroController.getLibrosConStock.bind(libroController),
);

librosRouter.get(
  "/isbn/:isbn",
  libroController.getLibroPorIsbn.bind(libroController),
);

librosRouter.get("/:id", libroController.getLibroPorId.bind(libroController));

librosRouter.post("/", libroController.createLibro.bind(libroController));

librosRouter.put("/:id", libroController.editarLibro.bind(libroController));

librosRouter.delete(
  "/:id",
  libroController.eliminarLibro.bind(libroController),
);

export default librosRouter;
