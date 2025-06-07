const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  // Create sample products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Wireless Headphones',
        category: 'Electronics',
        price: 199.99
      }
    }),
    prisma.product.create({
      data: {
        name: 'Smart Watch',
        category: 'Electronics',
        price: 299.99
      }
    }),
    prisma.product.create({
      data: {
        name: 'Running Shoes',
        category: 'Sports',
        price: 89.99
      }
    })
  ])

  // Create sample orders
  const orders = await Promise.all([
    prisma.order.create({
      data: {
        productId: products[0].id,
        quantity: 2,
        totalAmount: 399.98,
        orderDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
      }
    }),
    prisma.order.create({
      data: {
        productId: products[1].id,
        quantity: 1,
        totalAmount: 299.99,
        orderDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
      }
    }),
    prisma.order.create({
      data: {
        productId: products[2].id,
        quantity: 3,
        totalAmount: 269.97,
        orderDate: new Date() // today
      }
    })
  ])

  console.log('Database seeded successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 