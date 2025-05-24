// utils/actionSeedData.ts
// Seed data using real backend/server action functions (not direct db calls)
// This file is for development/testing only. DO NOT use in production!

import { createDriver } from '@/app/dashboard/drivers/actions/createDriver';
import {
  createPromotion,
} from '@/app/dashboard/promotions/actions/createPromotion';
import { createSeoEntry } from '@/app/dashboard/seo/actions/seo';
import { auth } from '@/auth';
import db from '@/lib/prisma';
import { OrderCartItem } from '@/types/commonType';
import {
  Category,
  Product,
  Supplier,
  User,
} from '@/types/databaseTypes';
import { faker } from '@faker-js/faker/locale/ar';
import {
  EntityType,
  UserRole,
} from '@prisma/client';

import { registerUser } from '../app/(e-comm)/auth/register/action/actions';
import { CreateOrderInDb } from '../app/(e-comm)/checkout/actions/creatOrder';
import { submitProductRating } from '../app/(e-comm)/product/actions/rating';
import { addToWishlist } from '../app/(e-comm)/product/actions/wishlist';
import {
  createCategory,
} from '../app/dashboard/categories/new/actions/create-category';
import {
  createProduct,
} from '../app/dashboard/products/actions/create-product';
import {
  createSupplier,
} from '../app/dashboard/suppliers/actions/createSupplier';

// Types for our seeding functions
type SeedingResult<T> = {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
};

type UserWithId = User & { id: string };
type SupplierWithId = Supplier & { id: string };
type CategoryWithId = Category & { id: string };
type ProductWithId = Product & { id: string };

// Helper to create a FormData object from a plain object
function makeFormDataObject(fields: Record<string, any>): FormData {
  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value.toString());
    }
  });
  return formData;
}

// Helper to handle errors in a type-safe way
function handleError(error: unknown): SeedingResult<never> {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
  console.error('Error:', errorMessage);
  return { success: false, message: errorMessage, error: errorMessage };
}

// Helper to get product categories
async function getProductCategories(productId: string): Promise<string[]> {
  const assignments = await db.categoryProduct.findMany({
    where: { productId },
    select: { categoryId: true }
  });
  return assignments.map(a => a.categoryId);
}

// Seed drivers using the real action and Faker (integrated with user table)
export async function seedDrivers(count = 5): Promise<SeedingResult<UserWithId>[]> {
  const drivers = Array.from({ length: count }).map(() => ({
    name: faker.person.fullName(),
    phone: faker.phone.number({ style: 'international' }).replace(/[^0-9+]/g, ''),
    password: 'driver123',
    email: faker.internet.email(),
  }));
  const results: SeedingResult<UserWithId>[] = [];
  for (const driver of drivers) {
    try {
      const formData = makeFormDataObject(driver);
      const result = await createDriver(formData);
      if (!result) {
        results.push({ success: false, message: 'createDriver returned null' });
        continue;
      }
      const nonNullResult = (result as unknown) as { success: boolean; message: string };
      if (nonNullResult.success) {
        if (!driver.phone) {
          results.push({ success: false, message: 'Driver phone missing' });
          continue;
        }
        const createdDriver = await db.user.findUnique({ where: { phone: driver.phone } });
        if (createdDriver) {
          // Update the user's role to DRIVER (integrated with user table)
          const updatedDriver = await db.user.update({ where: { id: createdDriver.id }, data: { role: UserRole.DRIVER } });
          results.push({ success: true, message: nonNullResult.message, data: updatedDriver as UserWithId });
        } else {
          results.push({ success: false, message: 'Driver (user) created but not found in database' });
        }
      } else {
        results.push({ success: false, message: nonNullResult.message });
      }
    } catch (error) {
      results.push(handleError(error));
    }
  }
  return results;
}

// Seed users (customers) using the real action and Faker (integrated with user table)
export async function seedUsers(count = 5): Promise<SeedingResult<UserWithId>[]> {
  const users = Array.from({ length: count }).map(() => ({
    name: faker.person.fullName(),
    phone: faker.phone.number({ style: 'international' }).replace(/[^0-9+]/g, ''),
    password: 'user123',
  }));
  // Add an admin for testing
  users.push({ name: 'مدير اختبار', phone: '+966522223333', password: 'admin123' });
  const results: SeedingResult<UserWithId>[] = [];
  for (const user of users) {
    try {
      const formData = makeFormDataObject(user);
      const result = await registerUser({ success: false, message: '' }, formData);
      if (!result) {
        results.push({ success: false, message: 'registerUser returned null' });
        continue;
      }
      const nonNullResult = (result as unknown) as { success: boolean; message: string };
      if (nonNullResult.success) {
        if (!user.phone) {
          results.push({ success: false, message: 'User phone missing' });
          continue;
        }
        const createdUser = await db.user.findUnique({ where: { phone: user.phone } });
        if (createdUser) {
          results.push({ success: true, message: nonNullResult.message, data: createdUser as UserWithId });
        } else {
          results.push({ success: false, message: 'User created but not found in database' });
        }
      } else {
        results.push({ success: false, message: nonNullResult.message });
      }
    } catch (error) {
      results.push(handleError(error));
    }
  }
  return results;
}

// Seed suppliers using backend action and Faker
export async function seedSuppliers(): Promise<SeedingResult<SupplierWithId>[]> {
  const suppliers = [
    {
      name: 'Fashion Arabia',
      email: 'contact@fashionarabia.com',
      phone: '+966500000000',
      address: 'Riyadh, Saudi Arabia',
      type: 'company',
    },
    {
      name: 'Elegance Boutique',
      email: 'info@eleganceboutique.com',
      phone: '+966511111111',
      address: 'Jeddah, Saudi Arabia',
      type: 'boutique',
    },
    {
      name: 'Urban Style',
      email: 'support@urbanstyle.com',
      phone: '+966522222222',
      address: 'Dammam, Saudi Arabia',
      type: 'company',
    },
    {
      name: 'Luxury Trends',
      email: 'hello@luxurytrends.com',
      phone: '+966533333333',
      address: 'Mecca, Saudi Arabia',
      type: 'premium',
    },
  ];
  const results: SeedingResult<SupplierWithId>[] = [];
  for (const supplier of suppliers) {
    try {
      const formData = makeFormDataObject(supplier);
      const result = await createSupplier({ success: false, message: '' }, formData);
      if (result.success) {
        // Since createSupplier doesn't return the created supplier, we need to fetch it
        const createdSupplier = await db.supplier.findFirst({
          where: { name: supplier.name },
        });
        if (createdSupplier) {
          results.push({ success: true, message: result.message, data: createdSupplier as SupplierWithId });
        } else {
          results.push({ success: false, message: 'Supplier created but not found in database' });
        }
      } else {
        results.push({ success: false, message: result.message });
      }
    } catch (error) {
      results.push(handleError(error));
    }
  }
  return results;
}

// Seed categories using backend action and Faker
export async function seedCategories(): Promise<SeedingResult<CategoryWithId>[]> {
  const categories = [
    {
      categoryName: 'ملابس رجالية',
      categoryDescription: 'تشكيلة واسعة من الملابس الرجالية العصرية بأفضل الماركات والجودة العالية',
    },
    {
      categoryName: 'ملابس نسائية',
      categoryDescription: 'تشكيلة متنوعة من الملابس النسائية بأحدث الصيحات والتصاميم العالمية',
    },
    {
      categoryName: 'إكسسوارات',
      categoryDescription: 'إكسسوارات مميزة تكمل إطلالتك بتصاميم أنيقة وخامات فاخرة',
    },
    {
      categoryName: 'أحذية',
      categoryDescription: 'أحذية مريحة وأنيقة للرجال والنساء من أشهر الماركات العالمية',
    },
  ];
  const results: SeedingResult<CategoryWithId>[] = [];
  for (const category of categories) {
    try {
      const formData = makeFormDataObject(category);
      const result = await createCategory({ success: false, message: '' }, formData);
      if (result.success) {
        // Since createCategory doesn't return the created category, we need to fetch it
        const createdCategory = await db.category.findFirst({
          where: { name: category.categoryName },
        });
        if (createdCategory) {
          results.push({ success: true, message: result.message, data: createdCategory as CategoryWithId });
        } else {
          results.push({ success: false, message: 'Category created but not found in database' });
        }
      } else {
        results.push({ success: false, message: result.message });
      }
    } catch (error) {
      results.push(handleError(error));
    }
  }
  return results;
}

// Seed products using backend action, Faker, and actual supplier/category IDs
export async function seedProducts(
  suppliers: SupplierWithId[],
  categories: CategoryWithId[],
  count = 20
): Promise<SeedingResult<ProductWithId>[]> {
  const products = Array.from({ length: count }).map(() => {
    const supplier = faker.helpers.arrayElement(suppliers);
    const category = faker.helpers.arrayElement(categories);
    return {
      name: faker.commerce.productName(),
      price: faker.commerce.price({ min: 50, max: 500 }),
      size: faker.helpers.arrayElement(['S', 'M', 'L', 'XL']),
      details: faker.commerce.productDescription(),
      supplierId: supplier.id,
      categoryIds: [category.id],
      published: 'on',
    };
  });
  const results: SeedingResult<ProductWithId>[] = [];
  for (const product of products) {
    try {
      const formData = makeFormDataObject(product);
      const result = await createProduct({ success: false, message: '' }, formData);
      if (result.success) {
        // Since createProduct doesn't return the created product, we need to fetch it
        const createdProduct = await db.product.findFirst({
          where: { name: product.name },
        });
        if (createdProduct) {
          results.push({ success: true, message: result.message, data: createdProduct as ProductWithId });
        } else {
          results.push({ success: false, message: 'Product created but not found in database' });
        }
      } else {
        results.push({ success: false, message: result.message });
      }
    } catch (error) {
      results.push(handleError(error));
    }
  }
  return results;
}

// Seed orders using backend action
export async function seedOrders(
  users: UserWithId[],
  products: ProductWithId[],
  shiftId: string,
  count = 10
): Promise<SeedingResult<string>[]> {
  const results: SeedingResult<string>[] = [];
  for (let i = 0; i < count; i++) {
    try {
      const orderProducts = faker.helpers.arrayElements(products, faker.number.int({ min: 1, max: 5 }));
      const user = faker.helpers.arrayElement(users);
      const orderData = {
        userId: user.id,
        phone: user.phone as string,
        name: user.name as string,
        address: faker.location.streetAddress(),
        lat: faker.location.latitude().toString(),
        lng: faker.location.longitude().toString(),
        cart: orderProducts.map(p => ({
          productId: p.id,
          name: p.name,
          quantity: faker.number.int({ min: 1, max: 3 }),
          price: p.price,
        })) as OrderCartItem[],
        totalAmount: orderProducts.reduce((sum, p) => sum + p.price, 0),
        totalItems: orderProducts.length,
        shiftId,
      };
      const result = await CreateOrderInDb(orderData);
      results.push({ success: true, message: 'Order created', data: result });
    } catch (error) {
      results.push(handleError(error));
    }
  }
  return results;
}

// Seed reviews using backend action
export async function seedReviews(
  products: ProductWithId[],
  count = 30
): Promise<SeedingResult<unknown>[]> {
  const results: SeedingResult<unknown>[] = [];
  for (let i = 0; i < count; i++) {
    try {
      const product = faker.helpers.arrayElement(products);

      const reviewData = {
        productId: product.id,
        rating: faker.number.int({ min: 1, max: 5 }),
        comment: faker.lorem.paragraph(),
      };

      // Simulate user session for the review action
      const session = await auth();
      if (!session?.user) {
        throw new Error('No authenticated user for review');
      }

      const result = await submitProductRating(reviewData);
      results.push({ success: true, message: 'Review created', data: result });
    } catch (error) {
      results.push(handleError(error));
    }
  }
  return results;
}

// Seed wishlist items using backend action
export async function seedWishlistItems(
  products: ProductWithId[],
  count = 20
): Promise<SeedingResult<unknown>[]> {
  const results: SeedingResult<unknown>[] = [];
  for (let i = 0; i < count; i++) {
    try {
      const product = faker.helpers.arrayElement(products);

      // Simulate user session for the wishlist action
      const session = await auth();
      if (!session?.user) {
        throw new Error('No authenticated user for wishlist');
      }

      const result = await addToWishlist(product.id);
      results.push({ success: true, message: 'Wishlist item created', data: result });
    } catch (error) {
      results.push(handleError(error));
    }
  }
  return results;
}

// Clean up existing data before seeding
async function cleanupExistingData(shouldCleanup: boolean) {
  if (!shouldCleanup) {
    console.log('Skipping data cleanup as requested');
    return;
  }

  console.log('Cleaning up existing data before seeding...');

  try {
    // Delete in the correct order to respect foreign key constraints
    console.log('Deleting existing reviews...');
    await db.review.deleteMany({});

    console.log('Deleting existing wishlist items...');
    await db.wishlistItem.deleteMany({});

    console.log('Deleting existing category-product assignments...');
    await db.categoryProduct.deleteMany({});

    console.log('Deleting existing orders and order items...');
    await db.orderInWay.deleteMany({});
    await db.orderItem.deleteMany({});
    await db.order.deleteMany({});

    console.log('Deleting existing product translations...');
    await db.productTranslation.deleteMany({});

    console.log('Deleting existing products...');
    await db.product.deleteMany({});

    console.log('Deleting existing category translations...');
    await db.categoryTranslation.deleteMany({});

    console.log('Deleting existing categories...');
    await db.category.deleteMany({});

    console.log('Deleting existing supplier translations...');
    await db.supplierTranslation.deleteMany({});

    console.log('Deleting existing suppliers...');
    await db.supplier.deleteMany({});

    console.log('Deleting existing users with DRIVER role...');
    await db.user.deleteMany({
      where: {
        role: UserRole.DRIVER
      }
    });

    console.log('Deleting existing users with CUSTOMER role...');
    await db.user.deleteMany({
      where: {
        role: UserRole.CUSTOMER
      }
    });

    console.log('Data cleanup completed successfully');
  } catch (error) {
    console.error('Error during data cleanup:', error);
    throw error;
  }
}

// Generate slider images for homepage
async function generateSliderImages() {
  console.log('Generating slider images...');

  const sliderImages = [
    {
      title: 'عروض الصيف',
      titleEn: 'Summer Collection',
      description: 'خصومات تصل إلى 50% على تشكيلة الصيف',
      descriptionEn: 'Up to 50% off on summer collection',
      imageUrl: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&q=80',
      link: '/categories/summer',
      active: true,
      order: 1,
      type: 'SLIDER' as const,
      discountType: 'PERCENTAGE' as const,
      discountValue: '50',
    },
    {
      title: 'أزياء رجالية',
      titleEn: 'Men\'s Fashion',
      description: 'أحدث صيحات الموضة الرجالية',
      descriptionEn: 'Latest trends in men\'s fashion',
      imageUrl: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=1200&q=80',
      link: '/categories/men',
      active: true,
      order: 2,
      type: 'SLIDER' as const,
      discountType: 'PERCENTAGE' as const,
      discountValue: '30',
    },
    {
      title: 'أزياء نسائية',
      titleEn: 'Women\'s Fashion',
      description: 'تشكيلة مميزة من الأزياء النسائية',
      descriptionEn: 'Exclusive collection of women\'s fashion',
      imageUrl: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=1200&q=80',
      link: '/categories/women',
      active: true,
      order: 3,
      type: 'SLIDER' as const,
      discountType: 'PERCENTAGE' as const,
      discountValue: '40',
    },
  ];

  const results = [];
  for (const image of sliderImages) {
    try {
      const formData = makeFormDataObject(image);
      const result = await createPromotion({ success: false, message: '' }, formData);
      if (result.success) {
        results.push({ success: true, message: 'Slider image created', data: result });
      } else {
        results.push({ success: false, message: result.message });
      }
    } catch (error) {
      results.push(handleError(error));
    }
  }

  console.log(`Created ${results.filter(r => r.success).length} slider images`);
  return results;
}

// Generate SEO data for products
async function generateProductSEO(productId: string, name: string, category: string) {
  const seoData = {
    entityId: productId,
    entityType: EntityType.PRODUCT,
    locale: 'ar-SA',
    metaTitle: `${name} | متجر الأزياء`,
    metaDescription: `تسوق ${name} من فئة ${category} بأفضل الأسعار والجودة العالية`,
    canonicalUrl: `/product/${productId}`,
    robots: 'index, follow',
    openGraphTitle: `${name} | متجر الأزياء`,
    openGraphDescription: `تسوق ${name} من فئة ${category} بأفضل الأسعار والجودة العالية`,
    openGraphImage: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&q=80',
    twitterCardType: 'summary_large_image',
    twitterImage: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&q=80',
  };

  try {
    const result = await createSeoEntry(seoData);
    return result;
  } catch (error) {
    console.error('Error creating SEO data:', error);
    return { success: false, message: 'Failed to create SEO data' };
  }
}

// Main seed function (call this from a server action or CLI for dev only)
export async function seedAll(shouldCleanup = true) {
  try {
    // Clean up existing data first
    if (shouldCleanup) {
      await cleanupExistingData(shouldCleanup);
    }

    // Create base entities
    const driverResults = await seedDrivers();
    const userResults = await seedUsers();
    const supplierResults = await seedSuppliers();
    const categoryResults = await seedCategories();

    // Extract IDs for relations
    const suppliers = supplierResults
      .filter((r): r is SeedingResult<SupplierWithId> & { data: SupplierWithId } => r.success && !!r.data)
      .map(r => r.data);
    const categories = categoryResults
      .filter((r): r is SeedingResult<CategoryWithId> & { data: CategoryWithId } => r.success && !!r.data)
      .map(r => r.data);
    const users = userResults
      .filter((r): r is SeedingResult<UserWithId> & { data: UserWithId } => r.success && !!r.data)
      .map(r => r.data);

    // Create products
    const productResults = await seedProducts(suppliers, categories);
    const products = productResults
      .filter((r): r is SeedingResult<ProductWithId> & { data: ProductWithId } => r.success && !!r.data)
      .map(r => r.data);

    // Generate SEO data for products
    console.log('Generating SEO data for products...');
    for (const product of products) {
      // Get the first category for SEO data
      const categoryIds = await getProductCategories(product.id);
      const category = categories.find(c => categoryIds.includes(c.id)) || categories[0];
      await generateProductSEO(product.id, product.name, category?.name || 'عام');
    }

    // Get or create a shift for orders
    const shift = await db.shift.findFirst() || await db.shift.create({
      data: {
        name: 'Morning Shift',
        startTime: '08:00',
        endTime: '16:00',
      },
    });

    // Create orders, reviews, and wishlist items
    const orderResults = await seedOrders(users, products, shift.id);
    const reviewResults = await seedReviews(products);
    const wishlistResults = await seedWishlistItems(products);

    // Generate slider images
    const sliderResults = await generateSliderImages();

    console.log('✅ Seed data generation completed successfully!');
    console.log('✅ Drivers created');
    console.log('✅ Users created');
    console.log('✅ Suppliers created');
    console.log('✅ Categories created');
    console.log('✅ Products created with SEO data');
    console.log('✅ Orders created');
    console.log('✅ Reviews created');
    console.log('✅ Wishlist items created');
    console.log('✅ Slider images created');

    return {
      drivers: driverResults,
      users: userResults,
      suppliers: supplierResults,
      categories: categoryResults,
      products: productResults,
      orders: orderResults,
      reviews: reviewResults,
      wishlist: wishlistResults,
      slider: sliderResults,
    };
  } catch (error) {
    console.error('Error in seedAll:', error);
    throw error;
  }
}
