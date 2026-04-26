import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        username: 'admin',
        email: 'admin@example.com',
        password: adminPassword
      }
    });
    console.log('✅ Admin user created');

    // Create sample categories
    const electronics = await prisma.category.upsert({
      where: { slug: 'electronics' },
      update: {},
      create: {
        name: 'Electronics',
        slug: 'electronics',
        isActive: true
      }
    });
    
    const clothing = await prisma.category.upsert({
      where: { slug: 'clothing' },
      update: {},
      create: {
        name: 'Clothing',
        slug: 'clothing',
        isActive: true
      }
    });

    const babyToys = await prisma.category.upsert({
      where: { slug: 'baby-toys' },
      update: {},
      create: {
        name: 'Baby Toys',
        slug: 'baby-toys',
        isActive: true
      }
    });
    console.log('✅ Categories created');

    // Create sample products
    await prisma.product.createMany({
      data: [
        {
          name: 'iPhone 15 Pro',
          slug: 'iphone-15-pro',
          description: 'Latest Apple smartphone with A17 chip',
          original_price: 999,
          discount_price: 899,
          category_id: electronics.id,
          isActive: true
        },
        {
          name: 'Samsung Galaxy S24',
          slug: 'samsung-galaxy-s24',
          description: 'Premium Android smartphone',
          original_price: 899,
          discount_price: 799,
          category_id: electronics.id,
          isActive: true
        },
        {
          name: 'Cotton T-Shirt',
          slug: 'cotton-t-shirt',
          description: 'Comfortable 100% cotton t-shirt',
          original_price: 29,
          discount_price: 19,
          category_id: clothing.id,
          isActive: true
        },
        {
          name: 'Baby Rattle',
          slug: 'baby-rattle',
          description: 'Colorful rattling toy for infants',
          original_price: 15,
          discount_price: null,
          category_id: babyToys.id,
          isActive: true
        }
      ]
    });
    console.log('✅ Sample products created');

    // Create contact info
    await prisma.contact.upsert({
      where: { id: '00000000-0000-0000-0000-000000000001' },
      update: {},
      create: {
        facebook: 'https://facebook.com/yourstore',
        telegram: 'https://t.me/yourstore',
        telephone: '+85512345678'
      }
    });
    console.log('✅ Contact info created');

    console.log('\n🎉 Database seeded successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👤 Admin Login:');
    console.log('   Email: admin@example.com');
    console.log('   Password: admin123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📦 Categories: Electronics, Clothing, Baby Toys');
    console.log('📦 Products: 4 sample products created');
    
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });