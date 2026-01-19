/**
 * Middleware de validation Zod.
 * Valide body, query et params selon les schémas fournis.
 */

import type { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

interface ValidationSchemas {
    body?: ZodSchema;
    query?: ZodSchema;
    params?: ZodSchema;
}

/**
 * Crée un middleware de validation pour les schémas Zod.
 *
 * @example
 * router.post("/", validate({ body: createUserSchema }), controller.create);
 */
export function validate(schemas: ValidationSchemas) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (schemas.body) {
                req.body = schemas.body.parse(req.body);
            }
            if (schemas.query) {
                req.query = schemas.query.parse(req.query);
            }
            if (schemas.params) {
                req.params = schemas.params.parse(req.params);
            }
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errors = error.errors.map((e) => ({
                    field: e.path.join("."),
                    message: e.message,
                }));

                return res.status(400).json({
                    message: "Données invalides",
                    code: "VALIDATION_ERROR",
                    errors,
                });
            }
            next(error);
        }
    };
}
