import express, { Express } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { config, isDevelopment } from '@/config';
import { database } from '@/config/database';
import { logger } from '@/utils/logger';
import routes from '@/routes';
import { errorHandler, notFoundHandler } from '@/middleware/error';
import {
  generalRateLimit,
  corsOptions,
  helmetConfig,
  compressionConfig,
} from '@/middleware/security';

class App {
  public app: Express;

  constructor() {
    this.app = express();
    this.initializeDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private async initializeDatabase(): Promise<void> {
    try {
      await database.connect();
    } catch (error) {
      logger.error('Failed to initialize database', { error });
      process.exit(1);
    }
  }

  private initializeMiddlewares(): void {
    // Security middleware
    this.app.use(helmetConfig);
    this.app.use(cors(corsOptions));
    this.app.use(compressionConfig);

    // Rate limiting
    this.app.use(generalRateLimit);

    // Body parsing middleware
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Logging middleware
    if (isDevelopment) {
      this.app.use(morgan('dev'));
    } else {
      this.app.use(morgan('combined'));
    }

    // Trust proxy (important for rate limiting and getting real IP)
    this.app.set('trust proxy', 1);
  }

  private initializeRoutes(): void {
    // API routes
    this.app.use('/api', routes);

    // Root route
    this.app.get('/', (_req, res) => {
      res.json({
        success: true,
        message: 'TypeScript Express API Server',
        version: '1.0.0',
        docs: '/api',
      });
    });
  }

  private initializeErrorHandling(): void {
    // 404 handler
    this.app.use(notFoundHandler);

    // Global error handler (must be last)
    this.app.use(errorHandler);
  }

  public listen(): void {
    this.app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port}`, {
        port: config.port,
        environment: config.nodeEnv,
        mongoUri: config.database.uri.replace(/\/\/.*@/, '//***:***@'), // Hide credentials in logs
      });
    });
  }

  public getApp(): Express {
    return this.app;
  }
}

export default App;
