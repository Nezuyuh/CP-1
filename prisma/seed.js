const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const toursData = require('../data-template.json');

const prisma = new PrismaClient();

// Parses "MU5024 CEBPVG 0340 0840" → { flightCode, origin, destination, departTime, arrivalTime }
// Also handles "MH 806 MNLKUL 0650 1050" (space in flight code)
function parseFlight(detail) {
  const parts = detail.trim().split(/\s+/);
  let routeIdx = -1;
  for (let i = 0; i < parts.length; i++) {
    if (/^[A-Z]{6}$/.test(parts[i])) { routeIdx = i; break; }
  }
  if (routeIdx === -1) return null;
  return {
    flightCode: parts.slice(0, routeIdx).join(' '),
    origin: parts[routeIdx].substring(0, 3),
    destination: parts[routeIdx].substring(3, 6),
    departTime: parts[routeIdx + 1] || '',
    arrivalTime: parts[routeIdx + 2] || '',
  };
}

async function main() {
  console.log('Seeding database...');

  await prisma.user.upsert({
    where: { email: 'account@clientone.com' },
    update: { password: await bcrypt.hash('admin', 12) },
    create: {
      email: 'account@clientone.com',
      password: await bcrypt.hash('admin', 12),
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
    },
  });
  console.log('Admin seeded → account@clientone.com / admin');

  for (const t of toursData) {
    const price = t.price_per_person && t.price_per_person !== ''
      ? parseFloat(t.price_per_person)
      : null;

    const tour = await prisma.tour.create({
      data: {
        image: t.image || t.file_name || null,
        tourTitle: t.tour_title,
        destinations: t.destinations,
        duration: t.duration,
        pricePerPerson: price,
        currency: t.currency || 'USD',
        priceNotes: t.price_notes || null,
        airline: t.airline || null,
        travelDates: {
          create: (t.travel_dates || []).map(dateLabel => ({ dateLabel })),
        },
        flights: {
          create: (t.flight_details || [])
            .map((d, i) => {
              const f = parseFlight(d);
              return f ? { ...f, flightOrder: i } : null;
            })
            .filter(Boolean),
        },
        itinerary: {
          create: (t.itinerary || []).map((day, i) => ({
            day: day.day,
            title: day.title,
            accommodation: day.accommodation || null,
            dayOrder: i,
            activities: {
              create: (day.activities || []).map((desc, j) => ({
                description: desc,
                activityOrder: j,
              })),
            },
          })),
        },
      },
    });
    console.log(`  Tour created: ${tour.tourTitle}`);
  }

  console.log('Seeding complete.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
