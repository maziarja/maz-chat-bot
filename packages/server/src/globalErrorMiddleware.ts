import type { NextFunction, Request, Response } from "express";

export const globalErrorMiddleware = (
   err: Error,
   req: Request,
   res: Response,
   next: NextFunction
) => {
   const errorMessage =
      process.env.NODE_ENV === "development"
         ? err.message
         : "Failed to generate a response!";

   res.status(500).json({ message: errorMessage });
};
