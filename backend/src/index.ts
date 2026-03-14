import 'reflect-metadata';
import express from 'express';

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(express.json());

// Routes will be mounted here in Prompt 1
// app.use('/api', weatherRoutes);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

export { app };
