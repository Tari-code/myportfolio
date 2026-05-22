import fs from 'fs/promises';
import path from 'path';
import mongoose from 'mongoose';
import connectDB from '../lib/mongodb';
import Project from '../lib/models/Project';
import News from '../lib/models/News';
import Ticket from '../lib/models/Ticket';
import dotenv from 'dotenv';

const result = dotenv.config({ path: '.env.local' });
console.log('Dotenv config result:', result.error ? 'ERROR: ' + result.error.message : 'SUCCESS');
console.log('MONGODB_URI present:', !!process.env.MONGODB_URI);
if (process.env.MONGODB_URI) {
  console.log('MONGODB_URI starts with:', process.env.MONGODB_URI.substring(0, 15));
}


async function migrate() {
  try {
    console.log('Connecting to MongoDB...');
    await connectDB();
    console.log('Connected.');

    const dataDir = path.join(process.cwd(), 'data');

    // Migrate Portfolio
    const portfolioPath = path.join(dataDir, 'portfolio.json');
    if (await fs.access(portfolioPath).then(() => true).catch(() => false)) {
      console.log('Migrating Portfolio...');
      const portfolioData = JSON.parse(await fs.readFile(portfolioPath, 'utf-8'));
      for (const item of portfolioData) {
        // Map old structure to new if necessary
        const { id, ...rest } = item;
        await Project.findOneAndUpdate({ slug: rest.slug }, rest, { upsert: true });
      }
      console.log('Portfolio migrated.');
    }

    // Migrate News
    const newsPath = path.join(dataDir, 'news.json');
    if (await fs.access(newsPath).then(() => true).catch(() => false)) {
      console.log('Migrating News...');
      const newsData = JSON.parse(await fs.readFile(newsPath, 'utf-8'));
      for (const item of newsData) {
        const { id, ...rest } = item;
        await News.findOneAndUpdate({ slug: rest.slug }, rest, { upsert: true });
      }
      console.log('News migrated.');
    }

    // Migrate Tickets
    const ticketsPath = path.join(dataDir, 'tickets.json');
    if (await fs.access(ticketsPath).then(() => true).catch(() => false)) {
      console.log('Migrating Tickets...');
      const ticketsData = JSON.parse(await fs.readFile(ticketsPath, 'utf-8'));
      for (const item of ticketsData) {
        const { id, ...rest } = item;
        await Ticket.create(rest);
      }
      console.log('Tickets migrated.');
    }

    console.log('Migration complete!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
