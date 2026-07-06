/**
 * Custom Request Logger Middleware
 * Logs every incoming request with response time.
 */

const logger = (req, res, next) => {
    const start = Date.now();

    res.on("finish", () => {
        const duration = Date.now() - start;

        console.log(
            `${req.method} ${req.originalUrl} | ${res.statusCode} | ${duration}ms`
        );
    });

    next();
};

export { logger };