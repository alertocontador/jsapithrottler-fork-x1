import { Router, Request, Response } from "express";

const router = Router();

router.all("/:backend/*", async (req: Request, res: Response) => {
  res.status(501).send("not implemented");
});

export default router;
