import express from 'express';
import cors from 'cors';
import connectDB from './config/database';
import transactionRoutes from './routes/transactionRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/api', transactionRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
