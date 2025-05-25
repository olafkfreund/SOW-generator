import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import sowRouter from './sow';
import engineersRouter from './engineers';
import calendarRouter from './calendar';
import pricingRouter from './pricing';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/sow', sowRouter);
app.use('/api/engineers', engineersRouter);
app.use('/api/calendar', calendarRouter);
app.use('/api/pricing', pricingRouter);

const PORT = process.env.PORT || 4000;

// Only start server if this file is run directly (not imported for testing)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Backend API running on port ${PORT}`);
  });
}

export { app };
