import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod';



export const validateRequest = (schema: ZodObject) => {

  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {



      await schema.parseAsync(req.body);


      next();
    } catch (error) {
      if (error instanceof ZodError) {


        const formattedErrors = error.issues.map((err: { path: any[]; message: any; }) => ({
          field: err.path[0],
          message: err.message,
        }));

        res.status(400).json({
          success: false,
          message: 'Validation Error',
          errors: formattedErrors,
        });

        return;
      }

      next(error);
    }
  };
};