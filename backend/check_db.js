const prisma = require('./src/prisma').default;
async function main() {
  const reports = await prisma.report.findMany({ orderBy: { uploadedAt: 'desc' }, take: 2 });
  console.log("Reports:", reports);
}
main().finally(() => prisma.$disconnect());
