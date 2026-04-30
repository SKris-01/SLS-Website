import { PrismaClient } from '../generated/prisma'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const connectionString = process.env.DATABASE_URL!
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool as any)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding database...')

  // Clear existing data
  await prisma.cartItem.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.review.deleteMany()
  await prisma.product.deleteMany()
  await prisma.user.deleteMany()
  await prisma.recipe.deleteMany()

  // Create some products
  const products = [
    {
      name: 'Classic Salted Makhana',
      description: 'The perfect original crunch. Lightly roasted and seasoned with premium Himalayan pink salt.',
      price: 199,
      mrp: 249,
      imageUrl: 'https://images.unsplash.com/photo-1626202340502-990a05bc4465?w=800&auto=format&fit=crop&q=60',
      category: 'Original',
      stock: 120,
      weight: '250g',
      flavour: 'Salted',
      tags: ['Original', 'Salted', 'Best Seller']
    },
    {
      name: 'Peri Peri Zest Makhana',
      description: 'A spicy kick for your taste buds. Infused with a fiery blend of African Bird\'s Eye Chili and spices.',
      price: 249,
      mrp: 299,
      imageUrl: 'https://images.unsplash.com/photo-1615485240388-128a018674c1?w=800&auto=format&fit=crop&q=60',
      category: 'Spicy',
      stock: 85,
      weight: '200g',
      flavour: 'Peri Peri',
      tags: ['Spicy', 'Chili', 'Hot']
    },
    {
      name: 'Creamy Cheese & Herbs',
      description: 'Indulge in the rich, velvety taste of white cheddar combined with Mediterranean herbs.',
      price: 275,
      mrp: 325,
      imageUrl: 'https://images.unsplash.com/photo-1599490659213-e2b9527bb087?w=800&auto=format&fit=crop&q=60',
      category: 'Roasted',
      stock: 60,
      weight: '200g',
      flavour: 'Cheese',
      tags: ['Cheese', 'Creamy', 'Kid Friendly']
    },
    {
      name: 'Sweet Caramel Glaze',
      description: 'Satisfy your sweet tooth with our butter-caramel coated crunchy lotus seeds. A healthy alternative to popcorn.',
      price: 299,
      mrp: 350,
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=60',
      category: 'Sweet',
      stock: 40,
      weight: '150g',
      flavour: 'Caramel',
      tags: ['Sweet', 'Caramel', 'Dessert']
    },
  ]

  for (const p of products) {
    await prisma.product.create({ data: p })
  }

  // Create some recipes
  const recipes = [
    {
      title: 'Makhana Kheer',
      thumbnail: 'https://images.unsplash.com/photo-1589113103503-49ef83d89e70?w=500&auto=format&fit=crop&q=60',
      channel: 'Cooking with Love',
      type: 'Dessert',
      link: 'https://youtube.com',
    },
    {
      title: 'Roasted Makhana Chaat',
      thumbnail: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60',
      channel: 'Healthy Bites',
      type: 'Snack',
      link: 'https://youtube.com',
    },
  ]

  for (const r of recipes) {
    await prisma.recipe.create({ data: r })
  }

  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })

