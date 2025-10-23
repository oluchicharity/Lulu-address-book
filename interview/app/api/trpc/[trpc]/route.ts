import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { prisma } from '@/lib/prisma';
import { router, publicProcedure } from '@/lib/trpc';

interface DummyJsonUser {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  domain?: string;
  company?: {
    name: string;
    title: string;
  };
  address?: {
    address: string;
    city: string;
    postalCode: string;
  };
}

interface DummyJsonResponse {
  users: DummyJsonUser[];
}

interface PrismaUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  website: string;
  companyName: string;
  companyCatchPhrase: string;
  addressStreet: string;
  addressCity: string;
  addressZipcode: string;
  createdAt: Date;
}

const appRouter = router({
  users: router({
    getAll: publicProcedure.query(async () => {
      try {
        const users = await prisma.user.findMany({
          orderBy: { name: 'asc' },
        });

        if (users.length === 0) {
          const response = await fetch('https://dummyjson.com/users');
          
          if (!response.ok) {
            throw new Error('Failed to fetch users from API');
          }

          const data: DummyJsonResponse = await response.json();
          
          // Insert users one by one to handle duplicates gracefully
          for (const user of data.users) {
            try {
              await prisma.user.create({
                data: {
                  name: `${user.firstName} ${user.lastName}`,
                  email: user.email,
                  phone: user.phone,
                  website: user.domain || `${user.firstName.toLowerCase()}.com`,
                  companyName: user.company?.name || 'Self-employed',
                  companyCatchPhrase: user.company?.title || 'Building the future',
                  addressStreet: user.address?.address || 'Unknown',
                  addressCity: user.address?.city || 'Unknown',
                  addressZipcode: user.address?.postalCode || '00000',
                },
              });
            } catch (e) {
              // Skip duplicates silently
              console.log(`Skipping duplicate user: ${user.email}`);
            }
          }

          const newUsers = await prisma.user.findMany({
            orderBy: { name: 'asc' },
          });

          return newUsers.map((user: PrismaUser) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            website: user.website,
            company: {
              name: user.companyName,
              catchPhrase: user.companyCatchPhrase,
            },
            address: {
              street: user.addressStreet,
              city: user.addressCity,
              zipcode: user.addressZipcode,
            },
          }));
        }

        return users.map((user: PrismaUser) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          website: user.website,
          company: {
            name: user.companyName,
            catchPhrase: user.companyCatchPhrase,
          },
          address: {
            street: user.addressStreet,
            city: user.addressCity,
            zipcode: user.addressZipcode,
          },
        }));
      } catch (error) {
        console.error('Error fetching users:', error);
        throw new Error('Failed to load users. Please try again.');
      }
    }),
  }),
});

export type AppRouter = typeof appRouter;

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => ({}),
  });

export { handler as GET, handler as POST };